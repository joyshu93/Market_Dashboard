import type { Instrument, MarketExtraMetric, MarketTrend } from "@/types/dashboard";

export interface MarketWidgetViewModel {
  instrument: Instrument;
  trend: MarketTrend;
  formattedPrice: string;
  formattedChange: string;
  formattedChangePct: string;
  updatedAtLabel: string;
  updatedAtTime: string;
  sparkline: number[];
  detailSeries: number[];
  statusText: string;
  summary: string;
  extraMetrics: MarketExtraMetric[];
}
