"use client";

import { MarketWidget } from "@/components/widgets/market/market-widget";
import { AdWidget } from "@/components/widgets/supporting/ad-widget";
import { NewsWidget } from "@/components/widgets/supporting/news-widget";
import { SummaryWidget } from "@/components/widgets/supporting/summary-widget";
import { WidgetShell } from "@/components/widgets/widget-shell";
import { useDashboardStore } from "@/store/dashboard-store";
import type { DashboardWidget, WidgetLayoutItem } from "@/types/dashboard";

interface WidgetRendererProps {
  widget: DashboardWidget;
  layout?: WidgetLayoutItem;
}

export function WidgetRenderer({ widget, layout }: WidgetRendererProps) {
  const {
    adCards,
    editMode,
    instrumentsById,
    newsFeeds,
    removeWidget,
    selectWidget,
    selectedWidgetId,
    snapshotsByInstrumentId,
    summaryCards,
  } = useDashboardStore((state) => ({
    adCards: state.adCards,
    editMode: state.editMode,
    instrumentsById: state.instrumentsById,
    newsFeeds: state.newsFeeds,
    removeWidget: state.removeWidget,
    selectWidget: state.selectWidget,
    selectedWidgetId: state.selectedWidgetId,
    snapshotsByInstrumentId: state.snapshotsByInstrumentId,
    summaryCards: state.summaryCards,
  }));

  let content: React.ReactNode = null;

  if (widget.widgetType === "market") {
    const instrument = instrumentsById[widget.instrumentId];
    const snapshot = snapshotsByInstrumentId[widget.instrumentId];

    content =
      instrument && snapshot ? (
        <MarketWidget
          instrument={instrument}
          snapshot={snapshot}
          layout={layout}
          viewMode={widget.viewMode}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          Market data unavailable.
        </div>
      );
  }

  if (widget.widgetType === "summary") {
    const data = summaryCards[widget.summaryId];
    content = data ? (
      <SummaryWidget data={data} />
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Summary card unavailable.
      </div>
    );
  }

  if (widget.widgetType === "news") {
    const data = newsFeeds[widget.feedId];
    content = data ? (
      <NewsWidget data={data} />
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        News feed unavailable.
      </div>
    );
  }

  if (widget.widgetType === "ad") {
    const data = adCards[widget.slotId];
    content = data ? (
      <AdWidget data={data} />
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Sponsor slot unavailable.
      </div>
    );
  }

  return (
    <WidgetShell
      widgetId={widget.id}
      editMode={editMode}
      selected={selectedWidgetId === widget.id}
      onSelect={() => selectWidget(widget.id)}
      onRemove={() => removeWidget(widget.id)}
    >
      {content}
    </WidgetShell>
  );
}
