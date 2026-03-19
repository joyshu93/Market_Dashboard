import type {
  BreakpointKey,
  DashboardLayouts,
  WidgetLayoutItem,
  WidgetType,
} from "@/types/dashboard";

export interface WidgetRegistryEntry {
  type: WidgetType;
  label: string;
  description: string;
  defaultLayouts: Record<BreakpointKey, Omit<WidgetLayoutItem, "i" | "x" | "y">>;
}

const createDefaultLayout = (
  w: number,
  h: number,
  constraints?: Pick<WidgetLayoutItem, "minW" | "minH" | "maxW" | "maxH">,
) => ({
  w,
  h,
  ...constraints,
});

export const widgetRegistry: Record<WidgetType, WidgetRegistryEntry> = {
  market: {
    type: "market",
    label: "Market card",
    description:
      "Universal market instrument card that scales information density based on its size.",
    defaultLayouts: {
      lg: createDefaultLayout(3, 2, { minW: 2, minH: 2, maxW: 6, maxH: 5 }),
      md: createDefaultLayout(4, 2, { minW: 2, minH: 2, maxW: 6, maxH: 5 }),
      sm: createDefaultLayout(4, 2, { minW: 2, minH: 2, maxW: 4, maxH: 4 }),
    },
  },
  summary: {
    type: "summary",
    label: "Summary card",
    description: "A premium market overview card for quick orientation.",
    defaultLayouts: {
      lg: createDefaultLayout(4, 3, { minW: 3, minH: 3, maxW: 6, maxH: 4 }),
      md: createDefaultLayout(4, 3, { minW: 3, minH: 3, maxW: 6, maxH: 4 }),
      sm: createDefaultLayout(4, 3, { minW: 4, minH: 3, maxW: 4, maxH: 4 }),
    },
  },
  news: {
    type: "news",
    label: "News card",
    description: "Top headlines card that sits alongside market cards.",
    defaultLayouts: {
      lg: createDefaultLayout(4, 3, { minW: 3, minH: 3, maxW: 6, maxH: 5 }),
      md: createDefaultLayout(4, 3, { minW: 3, minH: 3, maxW: 6, maxH: 5 }),
      sm: createDefaultLayout(4, 3, { minW: 4, minH: 3, maxW: 4, maxH: 5 }),
    },
  },
  ad: {
    type: "ad",
    label: "Sponsor card",
    description: "Native sponsor or promotional placeholder card.",
    defaultLayouts: {
      lg: createDefaultLayout(4, 2, { minW: 3, minH: 2, maxW: 6, maxH: 3 }),
      md: createDefaultLayout(4, 2, { minW: 3, minH: 2, maxW: 6, maxH: 3 }),
      sm: createDefaultLayout(4, 2, { minW: 4, minH: 2, maxW: 4, maxH: 3 }),
    },
  },
};

export const dashboardBreakpoints: Record<BreakpointKey, number> = {
  lg: 1200,
  md: 768,
  sm: 0,
};

export const dashboardCols: Record<BreakpointKey, number> = {
  lg: 12,
  md: 8,
  sm: 4,
};

export const emptyLayouts = (): DashboardLayouts => ({
  lg: [],
  md: [],
  sm: [],
});
