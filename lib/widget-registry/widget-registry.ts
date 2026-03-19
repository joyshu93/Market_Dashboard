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
  allowedSizePresets: Array<keyof typeof cardSizePresets>;
  defaultLayouts: Record<BreakpointKey, Omit<WidgetLayoutItem, "i" | "x" | "y">>;
}

export const cardSizePresets = {
  small: { w: 2, h: 2 },
  wide: { w: 4, h: 2 },
  large: { w: 4, h: 4 },
} as const;

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
    allowedSizePresets: ["small", "wide", "large"],
    defaultLayouts: {
      lg: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.small.w,
        minH: cardSizePresets.small.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      md: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.small.w,
        minH: cardSizePresets.small.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      sm: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.small.w,
        minH: cardSizePresets.small.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
    },
  },
  summary: {
    type: "summary",
    label: "Summary card",
    description: "A premium market overview card for quick orientation.",
    allowedSizePresets: ["large"],
    defaultLayouts: {
      lg: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      md: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      sm: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
    },
  },
  news: {
    type: "news",
    label: "News card",
    description: "Top headlines card that sits alongside market cards.",
    allowedSizePresets: ["large"],
    defaultLayouts: {
      lg: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      md: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
      sm: createDefaultLayout(cardSizePresets.large.w, cardSizePresets.large.h, {
        minW: cardSizePresets.large.w,
        minH: cardSizePresets.large.h,
        maxW: cardSizePresets.large.w,
        maxH: cardSizePresets.large.h,
      }),
    },
  },
  ad: {
    type: "ad",
    label: "Sponsor card",
    description: "Native sponsor or promotional placeholder card.",
    allowedSizePresets: ["wide"],
    defaultLayouts: {
      lg: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.wide.w,
        minH: cardSizePresets.wide.h,
        maxW: cardSizePresets.wide.w,
        maxH: cardSizePresets.wide.h,
      }),
      md: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.wide.w,
        minH: cardSizePresets.wide.h,
        maxW: cardSizePresets.wide.w,
        maxH: cardSizePresets.wide.h,
      }),
      sm: createDefaultLayout(cardSizePresets.wide.w, cardSizePresets.wide.h, {
        minW: cardSizePresets.wide.w,
        minH: cardSizePresets.wide.h,
        maxW: cardSizePresets.wide.w,
        maxH: cardSizePresets.wide.h,
      }),
    },
  },
};

export const dashboardBreakpoints: Record<BreakpointKey, number> = {
  lg: 1200,
  md: 768,
  sm: 0,
};

export const dashboardCols: Record<BreakpointKey, number> = {
  lg: 16,
  md: 8,
  sm: 4,
};

export const emptyLayouts = (): DashboardLayouts => ({
  lg: [],
  md: [],
  sm: [],
});
