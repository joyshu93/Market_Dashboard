import { resolveMarketViewMode } from "@/lib/utils/dashboard";
import {
  formatInstrumentValue,
  formatRelativeUpdatedAt,
  formatSignedPercent,
  formatSignedValue,
  formatUpdatedAt,
  getTrend,
} from "@/lib/utils/format";
import type {
  Instrument,
  MarketSnapshot,
  WidgetLayoutItem,
  WidgetViewMode,
} from "@/types/dashboard";
import type { MarketWidgetViewModel } from "@/components/widgets/market/market-widget-types";
import { MarketWidgetLarge } from "@/components/widgets/market/market-widget-large";
import { MarketWidgetSmall } from "@/components/widgets/market/market-widget-small";
import { MarketWidgetWide } from "@/components/widgets/market/market-widget-wide";

interface MarketWidgetProps {
  instrument: Instrument;
  snapshot: MarketSnapshot;
  layout?: WidgetLayoutItem;
  viewMode?: WidgetViewMode;
}

function buildViewModel(
  instrument: Instrument,
  snapshot: MarketSnapshot,
): MarketWidgetViewModel {
  const trend = getTrend(snapshot.change);

  return {
    instrument,
    trend,
    formattedPrice: formatInstrumentValue(snapshot.price, instrument),
    formattedChange: formatSignedValue(snapshot.change, instrument),
    formattedChangePct: formatSignedPercent(snapshot.changePct),
    updatedAtLabel: formatRelativeUpdatedAt(snapshot.updatedAt),
    updatedAtTime: formatUpdatedAt(snapshot.updatedAt),
    sparkline: snapshot.sparkline,
    detailSeries: snapshot.detailSeries,
    statusText: snapshot.statusText ?? "Market snapshot available.",
    summary: snapshot.summary ?? "Market context will appear here as the card grows.",
    extraMetrics: snapshot.extraMetrics,
  };
}

export function MarketWidget({
  instrument,
  snapshot,
  layout,
  viewMode = "auto",
}: MarketWidgetProps) {
  const resolvedMode = viewMode === "auto" ? resolveMarketViewMode(layout) : viewMode;
  const model = buildViewModel(instrument, snapshot);

  if (resolvedMode === "small") {
    return <MarketWidgetSmall model={model} />;
  }

  if (resolvedMode === "large") {
    return <MarketWidgetLarge model={model} />;
  }

  return <MarketWidgetWide model={model} />;
}
