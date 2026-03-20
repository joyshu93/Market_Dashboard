export type InstrumentCategory =
  | "index"
  | "stock"
  | "etf"
  | "currency"
  | "commodity"
  | "rate"
  | "crypto"
  | "macro";

export type WidgetType = "market" | "summary" | "news" | "ad";
export type ThemeMode = "dark" | "light";
export type MarketTrend = "up" | "down" | "flat";
export type MarketWidgetDensity = "small" | "wide" | "large";
export type WidgetViewMode = "auto" | MarketWidgetDensity;
export type BreakpointKey = "lg" | "md" | "sm";
export type AddCardSource = "header" | "context-menu" | "mobile-fab";
export type ContextMenuSource = "dashboard-empty-space";
export type MetricTone = "positive" | "negative" | "neutral";
export type ValueStyle = "number" | "currency" | "percent";
export type SnapshotSource = "mock" | "fred" | "data-go-kr" | "alpha-vantage";
export type MarketDataStatus = "idle" | "loading" | "live" | "partial" | "mock" | "error";
export type SummarySessionKey = "morning" | "intraday" | "close";

export interface InstrumentMetadata {
  precision?: number;
  valueStyle?: ValueStyle;
  unitLabel?: string;
  venue?: string;
  country?: string;
  region?: string;
  baseAsset?: string;
  quoteAsset?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: InstrumentCategory;
  market: string;
  currency: string;
  description: string;
  tags: string[];
  metadata?: InstrumentMetadata;
}

export interface MarketExtraMetric {
  label: string;
  value: string;
  tone?: MetricTone;
}

export interface MarketSnapshot {
  instrumentId: string;
  price: number;
  change: number;
  changePct: number;
  updatedAt: string;
  sparkline: number[];
  detailSeries: number[];
  statusText?: string;
  summary?: string;
  extraMetrics: MarketExtraMetric[];
  source?: SnapshotSource;
  sourceLabel?: string;
  isFallback?: boolean;
}

export interface MarketDataMeta {
  fetchedAt: string;
  status: Exclude<MarketDataStatus, "idle" | "loading">;
  activeSources: SnapshotSource[];
  errors?: Record<string, string>;
}

export interface MarketDataResponse {
  snapshots: Record<string, MarketSnapshot>;
  meta: MarketDataMeta;
}

export interface WidgetLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean;
}

export type DashboardLayouts = Record<BreakpointKey, WidgetLayoutItem[]>;

export interface WidgetSettings {
  preferredRange?: "1D" | "1W" | "1M";
  accentMode?: "auto" | "neutral";
  showUpdatedAt?: boolean;
  showSummary?: boolean;
}

export interface DashboardWidgetBase {
  id: string;
  widgetType: WidgetType;
  viewMode: WidgetViewMode;
  title?: string;
  settings?: WidgetSettings;
  createdAt: string;
}

export interface MarketDashboardWidget extends DashboardWidgetBase {
  widgetType: "market";
  instrumentId: string;
}

export interface SummaryDashboardWidget extends DashboardWidgetBase {
  widgetType: "summary";
  summaryId: string;
}

export interface NewsDashboardWidget extends DashboardWidgetBase {
  widgetType: "news";
  feedId: string;
}

export interface AdDashboardWidget extends DashboardWidgetBase {
  widgetType: "ad";
  slotId: string;
}

export type DashboardWidget =
  | MarketDashboardWidget
  | SummaryDashboardWidget
  | NewsDashboardWidget
  | AdDashboardWidget;

export interface AddCardModalState {
  open: boolean;
  source?: AddCardSource;
  anchor?: {
    x: number;
    y: number;
  };
}

export interface ContextMenuState {
  open: boolean;
  source?: ContextMenuSource;
  x: number;
  y: number;
}

export interface SummaryCardContent {
  title: string;
  subtitle: string;
  sessionLabel?: string;
  updatedAtLabel?: string;
  posture?: {
    label: string;
    message: string;
    tone?: MetricTone;
  };
  summary: string;
  stats: Array<{
    label: string;
    value: string;
    tone?: MetricTone;
  }>;
  highlights: string[];
}

export interface SummaryCardData extends SummaryCardContent {
  id: string;
  sessionVariants?: Partial<Record<SummarySessionKey, SummaryCardContent>>;
}

export interface NewsFeedItem {
  id: string;
  source: string;
  publishedAt: string;
  title: string;
  summary: string;
  sentiment: MetricTone;
}

export interface NewsFeedData {
  id: string;
  title: string;
  subtitle: string;
  items: NewsFeedItem[];
}

export interface AdCardData {
  id: string;
  eyebrow: string;
  sponsor: string;
  title: string;
  message: string;
  ctaLabel: string;
  note: string;
}

export interface SupportingWidgetTemplate {
  id: string;
  widgetType: Exclude<WidgetType, "market">;
  label: string;
  description: string;
}
