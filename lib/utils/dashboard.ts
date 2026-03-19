import { adCards, newsFeeds, summaryCards, supportingWidgetTemplates } from "@/lib/mock/supporting-data";
import { marketSnapshots } from "@/lib/mock/market-data";
import {
  cardSizePresets,
  dashboardCols,
  widgetRegistry,
} from "@/lib/widget-registry/widget-registry";
import type {
  AdDashboardWidget,
  BreakpointKey,
  DashboardLayouts,
  DashboardWidget,
  MarketDashboardWidget,
  MarketWidgetDensity,
  NewsDashboardWidget,
  SummaryDashboardWidget,
  WidgetLayoutItem,
} from "@/types/dashboard";

export const dashboardRowHeight = 108;
export const dashboardMargin: [number, number] = [18, 18];
export const dashboardPadding: [number, number] = [0, 0];

const marketSizeSequence: MarketWidgetDensity[] = ["small", "wide", "large"];

export function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function resolveMarketViewMode(layout?: WidgetLayoutItem): MarketWidgetDensity {
  if (!layout) {
    return "wide";
  }

  if (
    layout.w >= cardSizePresets.large.w &&
    layout.h >= cardSizePresets.large.h
  ) {
    return "large";
  }

  if (
    layout.w >= cardSizePresets.wide.w &&
    layout.h >= cardSizePresets.wide.h
  ) {
    return "wide";
  }

  return "small";
}

function getClosestAllowedTileSize(
  item: Pick<WidgetLayoutItem, "w" | "h">,
  widgetType: DashboardWidget["widgetType"],
  breakpoint: BreakpointKey,
) {
  const allowedSizes = widgetRegistry[widgetType].allowedSizePresets
    .map((sizeKey) => cardSizePresets[sizeKey])
    .filter((size) => size.w <= dashboardCols[breakpoint]);

  return allowedSizes.reduce((closest, candidate) => {
    const closestDistance =
      Math.abs(item.w - closest.w) * 2 + Math.abs(item.h - closest.h);
    const candidateDistance =
      Math.abs(item.w - candidate.w) * 2 + Math.abs(item.h - candidate.h);

    return candidateDistance < closestDistance ? candidate : closest;
  });
}

export function normalizeWidgetLayoutItem(
  item: WidgetLayoutItem,
  widgetType: DashboardWidget["widgetType"],
  breakpoint: BreakpointKey,
): WidgetLayoutItem {
  const snappedSize = getClosestAllowedTileSize(item, widgetType, breakpoint);
  const allowedSizes = widgetRegistry[widgetType].allowedSizePresets
    .map((sizeKey) => cardSizePresets[sizeKey])
    .filter((size) => size.w <= dashboardCols[breakpoint]);
  const minWidth = Math.min(...allowedSizes.map((size) => size.w));
  const minHeight = Math.min(...allowedSizes.map((size) => size.h));
  const maxWidth = Math.min(
    Math.max(...allowedSizes.map((size) => size.w)),
    dashboardCols[breakpoint],
  );
  const maxHeight = Math.max(...allowedSizes.map((size) => size.h));

  return {
    ...item,
    w: snappedSize.w,
    h: snappedSize.h,
    x: Math.max(0, Math.min(item.x, dashboardCols[breakpoint] - snappedSize.w)),
    minW: minWidth,
    minH: minHeight,
    maxW: maxWidth,
    maxH: maxHeight,
  };
}

export function normalizeDashboardLayouts(
  layouts: DashboardLayouts,
  widgets: DashboardWidget[],
): DashboardLayouts {
  const widgetTypeById = new Map(widgets.map((widget) => [widget.id, widget.widgetType]));

  const normalizeBreakpointLayouts = (
    items: WidgetLayoutItem[],
    breakpoint: BreakpointKey,
  ) =>
    items.map((item) => {
      const widgetType = widgetTypeById.get(item.i);

      if (widgetType) {
        return normalizeWidgetLayoutItem(item, widgetType, breakpoint);
      }

      return item;
    });

  return {
    lg: normalizeBreakpointLayouts(layouts.lg, "lg"),
    md: normalizeBreakpointLayouts(layouts.md, "md"),
    sm: normalizeBreakpointLayouts(layouts.sm, "sm"),
  };
}

export function findNextY(layouts: WidgetLayoutItem[]) {
  if (layouts.length === 0) {
    return 0;
  }

  return layouts.reduce((maxY, item) => Math.max(maxY, item.y + item.h), 0);
}

export function getLayoutForWidget(
  layouts: DashboardLayouts,
  widgetId: string,
  breakpoint: BreakpointKey,
) {
  return layouts[breakpoint].find((item) => item.i === widgetId);
}

function clampWidth(width: number, breakpoint: BreakpointKey) {
  return Math.min(width, dashboardCols[breakpoint]);
}

export function appendWidgetLayouts(
  layouts: DashboardLayouts,
  widgetType: DashboardWidget["widgetType"],
  widgetId: string,
) {
  const nextLayouts: DashboardLayouts = {
    lg: [...layouts.lg],
    md: [...layouts.md],
    sm: [...layouts.sm],
  };

  for (const breakpoint of ["lg", "md", "sm"] as BreakpointKey[]) {
    const template = widgetRegistry[widgetType].defaultLayouts[breakpoint];

    nextLayouts[breakpoint].push({
      i: widgetId,
      x: 0,
      y: findNextY(nextLayouts[breakpoint]),
      w: clampWidth(template.w, breakpoint),
      h: template.h,
      minW: template.minW,
      minH: template.minH,
      maxW: template.maxW,
      maxH: template.maxH,
    });
  }

  return nextLayouts;
}

export function removeWidgetLayouts(layouts: DashboardLayouts, widgetId: string): DashboardLayouts {
  return {
    lg: layouts.lg.filter((item) => item.i !== widgetId),
    md: layouts.md.filter((item) => item.i !== widgetId),
    sm: layouts.sm.filter((item) => item.i !== widgetId),
  };
}

export function createMarketWidget(instrumentId: string): MarketDashboardWidget {
  return {
    id: createId(`market-${instrumentId}`),
    widgetType: "market",
    instrumentId,
    viewMode: "auto",
    settings: {
      preferredRange: "1D",
      accentMode: "auto",
      showUpdatedAt: true,
      showSummary: true,
    },
    createdAt: new Date().toISOString(),
  };
}

export function createSummaryWidget(summaryId = Object.keys(summaryCards)[0]): SummaryDashboardWidget {
  return {
    id: createId("summary"),
    widgetType: "summary",
    summaryId,
    viewMode: "auto",
    createdAt: new Date().toISOString(),
  };
}

export function createNewsWidget(feedId = Object.keys(newsFeeds)[0]): NewsDashboardWidget {
  return {
    id: createId("news"),
    widgetType: "news",
    feedId,
    viewMode: "auto",
    createdAt: new Date().toISOString(),
  };
}

export function createAdWidget(slotId = Object.keys(adCards)[0]): AdDashboardWidget {
  return {
    id: createId("ad"),
    widgetType: "ad",
    slotId,
    viewMode: "auto",
    createdAt: new Date().toISOString(),
  };
}

export function createSupportingWidgetFromTemplate(templateId: string) {
  if (templateId === supportingWidgetTemplates[0]?.id) {
    return createSummaryWidget();
  }

  if (templateId === supportingWidgetTemplates[1]?.id) {
    return createNewsWidget();
  }

  return createAdWidget();
}

export function createDefaultDashboardSeed(): {
  widgets: DashboardWidget[];
  layouts: DashboardLayouts;
} {
  const widgets: DashboardWidget[] = [
    createSummaryWidget(),
    createMarketWidget("kospi"),
    createMarketWidget("kosdaq"),
    createMarketWidget("sp500"),
    createMarketWidget("nasdaq"),
    createMarketWidget("usd-krw"),
    createMarketWidget("gold"),
    createMarketWidget("wti"),
    createMarketWidget("us10y"),
    createMarketWidget("btc"),
    createNewsWidget(),
    createAdWidget(),
  ];

  const [summary, kospi, kosdaq, sp500, nasdaq, usdKrw, gold, wti, us10y, btc, news, ad] = widgets;

  const layouts: DashboardLayouts = {
    lg: [
      { i: summary.id, x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: news.id, x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: btc.id, x: 8, y: 0, w: 4, h: 4, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kospi.id, x: 12, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: ad.id, x: 12, y: 2, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 2 },
      { i: sp500.id, x: 0, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: nasdaq.id, x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kosdaq.id, x: 8, y: 4, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 10, y: 4, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: gold.id, x: 12, y: 4, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 14, y: 4, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 0, y: 6, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
    ],
    md: [
      { i: summary.id, x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: news.id, x: 4, y: 0, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: btc.id, x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kospi.id, x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: ad.id, x: 4, y: 6, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 2 },
      { i: sp500.id, x: 0, y: 8, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: nasdaq.id, x: 4, y: 8, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kosdaq.id, x: 0, y: 10, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 2, y: 10, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: gold.id, x: 4, y: 10, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 6, y: 10, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 0, y: 12, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
    ],
    sm: [
      { i: summary.id, x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: news.id, x: 0, y: 4, w: 4, h: 4, minW: 4, minH: 4, maxW: 4, maxH: 4 },
      { i: btc.id, x: 0, y: 8, w: 4, h: 4, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kospi.id, x: 0, y: 12, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: ad.id, x: 0, y: 14, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 2 },
      { i: sp500.id, x: 0, y: 16, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: nasdaq.id, x: 0, y: 18, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: kosdaq.id, x: 0, y: 20, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 2, y: 20, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: gold.id, x: 0, y: 22, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 2, y: 22, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 0, y: 24, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
    ],
  };

  return { widgets, layouts: normalizeDashboardLayouts(layouts, widgets) };
}

export function buildInstrumentSearchText(name: string, symbol: string, tags: string[]) {
  return `${name} ${symbol} ${tags.join(" ")}`.toLowerCase();
}

export function getInstrumentSnapshotCount() {
  return Object.keys(marketSnapshots).length;
}
