import { adCards, newsFeeds, summaryCards, supportingWidgetTemplates } from "@/lib/mock/supporting-data";
import { marketSnapshots } from "@/lib/mock/market-data";
import { dashboardCols, widgetRegistry } from "@/lib/widget-registry/widget-registry";
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

  if (layout.h >= 3 || (layout.w >= 4 && layout.h >= 3)) {
    return "large";
  }

  if (layout.w >= 4 || (layout.w >= 3 && layout.h >= 2)) {
    return "wide";
  }

  return "small";
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
      { i: summary.id, x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 3, maxW: 6, maxH: 4 },
      { i: kospi.id, x: 4, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 6, maxH: 5 },
      { i: kosdaq.id, x: 8, y: 0, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 10, y: 0, w: 2, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: sp500.id, x: 4, y: 2, w: 4, h: 2, minW: 3, minH: 2, maxW: 6, maxH: 5 },
      { i: nasdaq.id, x: 8, y: 2, w: 4, h: 2, minW: 3, minH: 2, maxW: 6, maxH: 5 },
      { i: gold.id, x: 0, y: 3, w: 3, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 3, y: 3, w: 3, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 6, y: 4, w: 3, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: btc.id, x: 9, y: 4, w: 3, h: 3, minW: 3, minH: 2, maxW: 6, maxH: 5 },
      { i: news.id, x: 0, y: 5, w: 6, h: 3, minW: 4, minH: 3, maxW: 8, maxH: 5 },
      { i: ad.id, x: 6, y: 6, w: 3, h: 2, minW: 3, minH: 2, maxW: 6, maxH: 3 },
    ],
    md: [
      { i: summary.id, x: 0, y: 0, w: 4, h: 3, minW: 4, minH: 3, maxW: 6, maxH: 4 },
      { i: kospi.id, x: 4, y: 0, w: 4, h: 2, minW: 4, minH: 2, maxW: 6, maxH: 4 },
      { i: sp500.id, x: 0, y: 3, w: 4, h: 2, minW: 4, minH: 2, maxW: 6, maxH: 4 },
      { i: nasdaq.id, x: 4, y: 2, w: 4, h: 2, minW: 4, minH: 2, maxW: 6, maxH: 4 },
      { i: kosdaq.id, x: 0, y: 5, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 4, y: 4, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: gold.id, x: 0, y: 7, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 4, y: 6, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 0, y: 9, w: 4, h: 2, minW: 2, minH: 2, maxW: 4, maxH: 4 },
      { i: btc.id, x: 4, y: 8, w: 4, h: 3, minW: 4, minH: 3, maxW: 6, maxH: 5 },
      { i: news.id, x: 0, y: 11, w: 8, h: 3, minW: 4, minH: 3, maxW: 8, maxH: 5 },
      { i: ad.id, x: 0, y: 14, w: 8, h: 2, minW: 4, minH: 2, maxW: 8, maxH: 3 },
    ],
    sm: [
      { i: summary.id, x: 0, y: 0, w: 4, h: 3, minW: 4, minH: 3, maxW: 4, maxH: 4 },
      { i: kospi.id, x: 0, y: 3, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: kosdaq.id, x: 0, y: 5, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: sp500.id, x: 0, y: 7, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: nasdaq.id, x: 0, y: 9, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: usdKrw.id, x: 0, y: 11, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: gold.id, x: 0, y: 13, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: wti.id, x: 0, y: 15, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: us10y.id, x: 0, y: 17, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 4 },
      { i: btc.id, x: 0, y: 19, w: 4, h: 3, minW: 4, minH: 3, maxW: 4, maxH: 5 },
      { i: news.id, x: 0, y: 22, w: 4, h: 3, minW: 4, minH: 3, maxW: 4, maxH: 5 },
      { i: ad.id, x: 0, y: 25, w: 4, h: 2, minW: 4, minH: 2, maxW: 4, maxH: 3 },
    ],
  };

  return { widgets, layouts };
}

export function buildInstrumentSearchText(name: string, symbol: string, tags: string[]) {
  return `${name} ${symbol} ${tags.join(" ")}`.toLowerCase();
}

export function getInstrumentSnapshotCount() {
  return Object.keys(marketSnapshots).length;
}
