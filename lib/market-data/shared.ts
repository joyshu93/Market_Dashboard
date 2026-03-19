import { marketSnapshots } from "@/lib/mock/market-data";
import type {
  MarketDataMeta,
  MarketExtraMetric,
  MarketSnapshot,
  SnapshotSource,
} from "@/types/dashboard";

export interface LiveSnapshotPatch {
  instrumentId: string;
  price: number;
  change: number;
  changePct: number;
  updatedAt: string;
  sparkline?: number[];
  detailSeries?: number[];
  extraMetrics?: MarketExtraMetric[];
  statusText?: string;
  summary?: string;
  source: SnapshotSource;
  sourceLabel: string;
}

export interface LiveFetchResult {
  patch?: LiveSnapshotPatch;
  error?: string;
}

export function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();

    if (!normalized || normalized === ".") {
      return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function parseKrxDate(value: string) {
  if (!/^\d{8}$/.test(value)) {
    return new Date().toISOString();
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));

  return new Date(Date.UTC(year, month, day, 6, 0, 0)).toISOString();
}

export function buildSeriesDelta(series: number[]) {
  const latest = series.at(-1) ?? 0;
  const previous = series.at(-2) ?? latest;
  const change = latest - previous;
  const base = previous === 0 ? 0 : (change / previous) * 100;

  return {
    latest,
    change,
    changePct: base,
  };
}

export function buildCompactSeries(values: number[], fallback: number[]) {
  const sanitized = values.filter((value) => Number.isFinite(value));

  if (sanitized.length >= 2) {
    return sanitized;
  }

  return fallback;
}

export function mergeSnapshotPatch(
  instrumentId: string,
  patch?: LiveSnapshotPatch,
  fallbackError?: string,
) {
  const baseSnapshot = marketSnapshots[instrumentId];

  if (!patch) {
    return {
      ...baseSnapshot,
      source: "mock" as const,
      sourceLabel: "Mock seed",
      isFallback: true,
      summary:
        fallbackError && baseSnapshot.summary
          ? `${baseSnapshot.summary} Live feed fallback: ${fallbackError}.`
          : baseSnapshot.summary,
    };
  }

  return {
    ...baseSnapshot,
    ...patch,
    sparkline: patch.sparkline ?? baseSnapshot.sparkline,
    detailSeries: patch.detailSeries ?? baseSnapshot.detailSeries,
    extraMetrics: patch.extraMetrics ?? baseSnapshot.extraMetrics,
    isFallback: false,
  } satisfies MarketSnapshot;
}

export function buildMeta(
  patches: Array<LiveSnapshotPatch | undefined>,
  errors: Record<string, string>,
): MarketDataMeta {
  const activeSources = [...new Set(patches.flatMap((patch) => (patch ? [patch.source] : [])))];
  const liveCount = patches.filter(Boolean).length;
  const status =
    liveCount === 0 ? "mock" : Object.keys(errors).length > 0 ? "partial" : "live";

  return {
    fetchedAt: new Date().toISOString(),
    status,
    activeSources,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}
