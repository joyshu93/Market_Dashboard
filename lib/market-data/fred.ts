import { marketSnapshots } from "@/lib/mock/market-data";
import type { LiveFetchResult } from "@/lib/market-data/shared";
import {
  buildCompactSeries,
  buildSeriesDelta,
  toNumber,
} from "@/lib/market-data/shared";

const FRED_API_URL = "https://api.stlouisfed.org/fred/series/observations";

export async function fetchFredSeriesSnapshot(
  instrumentId: string,
  seriesId: string,
  apiKey: string,
  sourceLabel: string,
) {
  const url = new URL(FRED_API_URL);
  url.searchParams.set("series_id", seriesId);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("sort_order", "desc");
  url.searchParams.set("limit", "20");

  const response = await fetch(url, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`FRED request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    observations?: Array<{ date?: string; value?: string }>;
    error_message?: string;
  };

  if (payload.error_message) {
    throw new Error(payload.error_message);
  }

  const values =
    payload.observations
      ?.map((entry) => ({
        date: entry.date ?? "",
        value: toNumber(entry.value),
      }))
      .filter((entry): entry is { date: string; value: number } => entry.value !== null) ?? [];

  if (values.length < 2) {
    throw new Error("FRED returned insufficient observations");
  }

  const chronological = [...values].reverse();
  const numericSeries = chronological.map((entry) => entry.value);
  const delta = buildSeriesDelta(numericSeries);
  const fallback = marketSnapshots[instrumentId];

  return {
    instrumentId,
    price: delta.latest,
    change: delta.change,
    changePct: delta.changePct,
    updatedAt: new Date(`${chronological.at(-1)?.date}T21:00:00Z`).toISOString(),
    sparkline: buildCompactSeries(numericSeries.slice(-13), fallback.sparkline),
    detailSeries: buildCompactSeries(numericSeries.slice(-14), fallback.detailSeries),
    source: "fred" as const,
    sourceLabel,
  };
}

export async function safeFetchFredSeriesSnapshot(
  instrumentId: string,
  seriesId: string,
  apiKey: string | undefined,
  sourceLabel: string,
): Promise<LiveFetchResult> {
  if (!apiKey) {
    return {
      error: "Missing FRED_API_KEY",
    };
  }

  try {
    return {
      patch: await fetchFredSeriesSnapshot(instrumentId, seriesId, apiKey, sourceLabel),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "FRED fetch failed",
    };
  }
}
