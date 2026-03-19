import { safeFetchAlphaExchangeRateSnapshot, safeFetchAlphaGoldSpotSnapshot } from "@/lib/market-data/alpha-vantage";
import { safeFetchKrxIndexSnapshot } from "@/lib/market-data/data-go-kr";
import { safeFetchFredSeriesSnapshot } from "@/lib/market-data/fred";
import {
  buildCompactSeries,
  buildMeta,
  buildSeriesDelta,
  mergeSnapshotPatch,
} from "@/lib/market-data/shared";
import { marketSnapshots } from "@/lib/mock/market-data";
import type { MarketDataResponse, MarketSnapshot } from "@/types/dashboard";

async function fetchUsdKrwSnapshot() {
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
  const fredKey = process.env.FRED_API_KEY;

  const [alphaResult, fredResult] = await Promise.all([
    safeFetchAlphaExchangeRateSnapshot(
      "usd-krw",
      "USD",
      "KRW",
      alphaKey,
      "Alpha Vantage FX",
    ),
    safeFetchFredSeriesSnapshot("usd-krw", "DEXKOUS", fredKey, "FRED FX"),
  ]);

  if (alphaResult.patch && fredResult.patch?.detailSeries) {
    const liveSeries = [...fredResult.patch.detailSeries.slice(0, -1), alphaResult.patch.price];
    const delta = buildSeriesDelta(liveSeries);

    return {
      patch: {
        ...alphaResult.patch,
        change: delta.change,
        changePct: delta.changePct,
        sparkline: buildCompactSeries(liveSeries.slice(-13), fredResult.patch.sparkline ?? []),
        detailSeries: buildCompactSeries(liveSeries.slice(-14), fredResult.patch.detailSeries),
      },
      error: fredResult.error,
    };
  }

  return {
    patch: alphaResult.patch ?? fredResult.patch,
    error: alphaResult.error ?? fredResult.error,
  };
}

async function fetchBitcoinSnapshot() {
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
  const fredKey = process.env.FRED_API_KEY;

  const [alphaResult, fredResult] = await Promise.all([
    safeFetchAlphaExchangeRateSnapshot(
      "btc",
      "BTC",
      "USD",
      alphaKey,
      "Alpha Vantage Crypto",
    ),
    safeFetchFredSeriesSnapshot("btc", "CBBTCUSD", fredKey, "FRED Coinbase BTC/USD"),
  ]);

  if (alphaResult.patch && fredResult.patch?.detailSeries) {
    const liveSeries = [...fredResult.patch.detailSeries.slice(0, -1), alphaResult.patch.price];
    const delta = buildSeriesDelta(liveSeries);

    return {
      patch: {
        ...alphaResult.patch,
        change: delta.change,
        changePct: delta.changePct,
        sparkline: buildCompactSeries(liveSeries.slice(-13), fredResult.patch.sparkline ?? []),
        detailSeries: buildCompactSeries(liveSeries.slice(-14), fredResult.patch.detailSeries),
      },
      error: fredResult.error,
    };
  }

  return {
    patch: alphaResult.patch ?? fredResult.patch,
    error: alphaResult.error ?? fredResult.error,
  };
}

export async function fetchLiveMarketSnapshots(): Promise<MarketDataResponse> {
  const fredKey = process.env.FRED_API_KEY;
  const dataGoKrKey = process.env.DATA_GO_KR_SERVICE_KEY;
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;

  const liveResults = await Promise.all([
    safeFetchKrxIndexSnapshot("kospi", "KOSPI", dataGoKrKey, "data.go.kr KRX indices"),
    safeFetchKrxIndexSnapshot("kosdaq", "KOSDAQ", dataGoKrKey, "data.go.kr KRX indices"),
    safeFetchFredSeriesSnapshot("sp500", "SP500", fredKey, "FRED S&P 500"),
    safeFetchFredSeriesSnapshot("nasdaq", "NASDAQCOM", fredKey, "FRED NASDAQ Composite"),
    fetchUsdKrwSnapshot(),
    safeFetchAlphaGoldSpotSnapshot("gold", alphaKey, "Alpha Vantage Gold Spot"),
    safeFetchFredSeriesSnapshot("wti", "DCOILWTICO", fredKey, "FRED WTI"),
    safeFetchFredSeriesSnapshot("us10y", "DGS10", fredKey, "FRED US 10Y"),
    fetchBitcoinSnapshot(),
  ]);

  const instrumentIds = [
    "kospi",
    "kosdaq",
    "sp500",
    "nasdaq",
    "usd-krw",
    "gold",
    "wti",
    "us10y",
    "btc",
  ] as const;

  const errors = Object.fromEntries(
    instrumentIds
      .map((instrumentId, index) => [instrumentId, liveResults[index]?.error])
      .filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );

  const snapshots = instrumentIds.reduce<Record<string, MarketSnapshot>>((accumulator, instrumentId, index) => {
    accumulator[instrumentId] = mergeSnapshotPatch(
      instrumentId,
      liveResults[index]?.patch,
      liveResults[index]?.error,
    );

    return accumulator;
  }, {});

  return {
    snapshots: {
      ...marketSnapshots,
      ...snapshots,
    },
    meta: buildMeta(liveResults.map((result) => result.patch), errors),
  };
}
