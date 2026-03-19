import { marketSnapshots } from "@/lib/mock/market-data";
import type { LiveFetchResult } from "@/lib/market-data/shared";
import {
  buildCompactSeries,
  buildSeriesDelta,
  parseKrxDate,
  toNumber,
} from "@/lib/market-data/shared";
import type { MarketExtraMetric } from "@/types/dashboard";

const DATA_GO_KR_API_URL =
  "https://apis.data.go.kr/1160100/service/GetMarketIndexInfoService/getStockMarketIndex";

function normalizeServiceKey(serviceKey: string) {
  try {
    return decodeURIComponent(serviceKey);
  } catch {
    return serviceKey;
  }
}

type KrxRow = Record<string, string | number | undefined>;

function getKrxItems(payload: unknown): KrxRow[] {
  const root = payload as {
    response?: { body?: { items?: { item?: KrxRow | KrxRow[] } } };
  };

  const items = root.response?.body?.items?.item;

  if (!items) {
    return [];
  }

  return Array.isArray(items) ? items : [items];
}

function buildExtraMetrics(item: KrxRow): MarketExtraMetric[] {
  return [
    { label: "Open", value: String(item.mkp ?? "-") },
    { label: "High", value: String(item.hipr ?? "-") },
    { label: "Low", value: String(item.lopr ?? "-") },
    { label: "Volume", value: String(item.trqu ?? "-") },
  ];
}

export async function fetchKrxIndexSnapshot(
  instrumentId: string,
  indexQuery: string,
  serviceKey: string,
  sourceLabel: string,
) {
  const url = new URL(DATA_GO_KR_API_URL);
  url.searchParams.set("serviceKey", normalizeServiceKey(serviceKey));
  url.searchParams.set("resultType", "json");
  url.searchParams.set("numOfRows", "30");
  url.searchParams.set("likeIdxNm", indexQuery);

  const response = await fetch(url, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`data.go.kr request failed (${response.status})`);
  }

  const payload = await response.json();
  const rows = getKrxItems(payload).filter((row) => {
    const idxName = String(row.idxNm ?? "").toLowerCase();
    return idxName.includes(indexQuery.toLowerCase());
  });

  if (rows.length === 0) {
    throw new Error(`No KRX rows found for ${indexQuery}`);
  }

  const sortedRows = rows.sort((left, right) =>
    String(left.basDt ?? "").localeCompare(String(right.basDt ?? "")),
  );

  const closingSeries = sortedRows
    .map((row) => toNumber(row.clpr))
    .filter((value): value is number => value !== null);

  if (closingSeries.length < 2) {
    throw new Error(`Insufficient KRX history for ${indexQuery}`);
  }

  const latest = sortedRows.at(-1) ?? {};
  const latestPrice = toNumber(latest.clpr);

  if (latestPrice === null) {
    throw new Error(`Missing closing price for ${indexQuery}`);
  }

  const fallback = marketSnapshots[instrumentId];
  const delta = {
    latest: latestPrice,
    change:
      toNumber(latest.vs) ??
      buildSeriesDelta(closingSeries).change,
    changePct:
      toNumber(latest.fltRt) ??
      buildSeriesDelta(closingSeries).changePct,
  };

  return {
    instrumentId,
    price: delta.latest,
    change: delta.change,
    changePct: delta.changePct,
    updatedAt: parseKrxDate(String(latest.basDt ?? "")),
    sparkline: buildCompactSeries(closingSeries.slice(-13), fallback.sparkline),
    detailSeries: buildCompactSeries(closingSeries.slice(-14), fallback.detailSeries),
    extraMetrics: buildExtraMetrics(latest),
    source: "data-go-kr" as const,
    sourceLabel,
  };
}

export async function safeFetchKrxIndexSnapshot(
  instrumentId: string,
  indexQuery: string,
  serviceKey: string | undefined,
  sourceLabel: string,
): Promise<LiveFetchResult> {
  if (!serviceKey) {
    return {
      error: "Missing DATA_GO_KR_SERVICE_KEY",
    };
  }

  try {
    return {
      patch: await fetchKrxIndexSnapshot(instrumentId, indexQuery, serviceKey, sourceLabel),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "data.go.kr fetch failed",
    };
  }
}
