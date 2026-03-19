import type { LiveFetchResult } from "@/lib/market-data/shared";
import { toNumber } from "@/lib/market-data/shared";

const ALPHA_VANTAGE_API_URL = "https://www.alphavantage.co/query";

async function fetchAlphaVantage(
  params: Record<string, string>,
  apiKey: string,
) {
  const url = new URL(ALPHA_VANTAGE_API_URL);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Alpha Vantage request failed (${response.status})`);
  }

  const payload = (await response.json()) as Record<string, unknown>;

  if (typeof payload.Note === "string") {
    throw new Error(payload.Note);
  }

  if (typeof payload["Error Message"] === "string") {
    throw new Error(payload["Error Message"]);
  }

  return payload;
}

export async function fetchAlphaExchangeRateSnapshot(
  instrumentId: string,
  fromCurrency: string,
  toCurrency: string,
  apiKey: string,
  sourceLabel: string,
) {
  const payload = await fetchAlphaVantage(
    {
      function: "CURRENCY_EXCHANGE_RATE",
      from_currency: fromCurrency,
      to_currency: toCurrency,
    },
    apiKey,
  );

  const exchangeRateRoot = payload["Realtime Currency Exchange Rate"] as
    | Record<string, string>
    | undefined;

  if (!exchangeRateRoot) {
    throw new Error("Missing realtime exchange rate payload");
  }

  const price = toNumber(exchangeRateRoot["5. Exchange Rate"]);

  if (price === null) {
    throw new Error("Missing exchange rate");
  }

  return {
    instrumentId,
    price,
    change: 0,
    changePct: 0,
    updatedAt: new Date(exchangeRateRoot["6. Last Refreshed"] ?? Date.now()).toISOString(),
    source: "alpha-vantage" as const,
    sourceLabel,
  };
}

export async function fetchAlphaFxDailySeries(
  instrumentId: string,
  fromSymbol: string,
  toSymbol: string,
  apiKey: string,
) {
  const payload = await fetchAlphaVantage(
    {
      function: "FX_DAILY",
      from_symbol: fromSymbol,
      to_symbol: toSymbol,
      outputsize: "compact",
    },
    apiKey,
  );

  const seriesRoot = payload["Time Series FX (Daily)"] as
    | Record<string, Record<string, string>>
    | undefined;

  if (!seriesRoot) {
    throw new Error("Missing FX daily series payload");
  }

  const series = Object.entries(seriesRoot)
    .map(([date, point]) => ({
      date,
      value: toNumber(point["4. close"]),
    }))
    .filter((entry): entry is { date: string; value: number } => entry.value !== null)
    .sort((left, right) => left.date.localeCompare(right.date));

  if (series.length < 2) {
    throw new Error("Insufficient FX history");
  }

  return series;
}

export async function fetchAlphaDigitalCurrencyDailySeries(
  symbol: string,
  market: string,
  apiKey: string,
) {
  const payload = await fetchAlphaVantage(
    {
      function: "DIGITAL_CURRENCY_DAILY",
      symbol,
      market,
    },
    apiKey,
  );

  const seriesRoot = payload["Time Series (Digital Currency Daily)"] as
    | Record<string, Record<string, string>>
    | undefined;

  if (!seriesRoot) {
    throw new Error("Missing digital currency daily payload");
  }

  const series = Object.entries(seriesRoot)
    .map(([date, point]) => ({
      date,
      value:
        toNumber(point["4a. close (USD)"]) ??
        toNumber(point["4b. close (USD)"]) ??
        toNumber(point["4a. close (USD)"]),
    }))
    .filter((entry): entry is { date: string; value: number } => entry.value !== null)
    .sort((left, right) => left.date.localeCompare(right.date));

  if (series.length < 2) {
    throw new Error("Insufficient digital currency history");
  }

  return series;
}

export async function fetchAlphaGoldSpotSnapshot(
  instrumentId: string,
  apiKey: string,
  sourceLabel: string,
) {
  const payload = await fetchAlphaVantage(
    {
      function: "GOLD_SILVER_SPOT",
      symbol: "GOLD",
    },
    apiKey,
  );

  const candidates = [
    payload["data"],
    payload["Data"],
    payload["Realtime Metal Prices"],
    payload["Realtime Commodity Prices"],
  ];

  const firstObject = candidates.find((value) => Array.isArray(value)) as
    | Array<Record<string, unknown>>
    | undefined;
  const row = firstObject?.[0] ?? (payload as Record<string, unknown>);

  const price =
    toNumber(row["price"]) ??
    toNumber(row["price_oz"]) ??
    toNumber(row["value"]) ??
    toNumber(row["close"]);

  if (price === null) {
    throw new Error("Missing gold spot price");
  }

  const updatedAtCandidate =
    String(row["date"] ?? row["timestamp"] ?? row["updated_at"] ?? new Date().toISOString());

  return {
    instrumentId,
    price,
    change: 0,
    changePct: 0,
    updatedAt: new Date(updatedAtCandidate).toISOString(),
    source: "alpha-vantage" as const,
    sourceLabel,
  };
}

export async function safeFetchAlphaExchangeRateSnapshot(
  instrumentId: string,
  fromCurrency: string,
  toCurrency: string,
  apiKey: string | undefined,
  sourceLabel: string,
): Promise<LiveFetchResult> {
  if (!apiKey) {
    return {
      error: "Missing ALPHA_VANTAGE_API_KEY",
    };
  }

  try {
    return {
      patch: await fetchAlphaExchangeRateSnapshot(
        instrumentId,
        fromCurrency,
        toCurrency,
        apiKey,
        sourceLabel,
      ),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Alpha Vantage exchange rate failed",
    };
  }
}

export async function safeFetchAlphaGoldSpotSnapshot(
  instrumentId: string,
  apiKey: string | undefined,
  sourceLabel: string,
): Promise<LiveFetchResult> {
  if (!apiKey) {
    return {
      error: "Missing ALPHA_VANTAGE_API_KEY",
    };
  }

  try {
    return {
      patch: await fetchAlphaGoldSpotSnapshot(instrumentId, apiKey, sourceLabel),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Alpha Vantage gold spot failed",
    };
  }
}
