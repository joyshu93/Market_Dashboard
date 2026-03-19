import type {
  AdCardData,
  NewsFeedData,
  SummaryCardData,
  SupportingWidgetTemplate,
} from "@/types/dashboard";

export const summaryCards: Record<string, SummaryCardData> = {
  "market-overview": {
    id: "market-overview",
    title: "Market Pulse",
    subtitle: "30-second read",
    summary:
      "Risk sentiment is constructive. Korean equities are firmer, US growth is still leading, and lower Treasury yields are acting as the session's main support.",
    stats: [
      { label: "Advancing", value: "6 / 9", tone: "positive" },
      { label: "Falling", value: "2 / 9", tone: "negative" },
      { label: "Rates Impulse", value: "Supportive", tone: "positive" },
    ],
    highlights: [
      "KOSPI and KOSDAQ both closed stronger with semis in leadership.",
      "US tech remains the cleanest expression of risk appetite.",
      "WTI is the main laggard, easing inflation pressure at the margin.",
    ],
  },
};

export const newsFeeds: Record<string, NewsFeedData> = {
  "market-brief": {
    id: "market-brief",
    title: "Market Brief",
    subtitle: "Top headlines shaping the next session",
    items: [
      {
        id: "news-1",
        source: "Asia Desk",
        publishedAt: "2026-03-19T14:15:00+09:00",
        title: "Korean exporters lead late-session rebound as won stabilizes",
        summary:
          "A steadier FX backdrop helped large-cap exporters outperform into the close, reinforcing an orderly risk-on tone.",
        sentiment: "positive",
      },
      {
        id: "news-2",
        source: "Macro Wire",
        publishedAt: "2026-03-19T08:10:00-04:00",
        title: "Treasury yields soften after cooler labor follow-through",
        summary:
          "Rates edged lower across the curve, supporting equity multiples and easing pressure on duration-sensitive sectors.",
        sentiment: "positive",
      },
      {
        id: "news-3",
        source: "Commodities Note",
        publishedAt: "2026-03-19T08:02:00-04:00",
        title: "Crude pauses as supply headlines offset demand optimism",
        summary:
          "WTI slipped back below recent highs, trimming some of the reflation impulse embedded earlier in the week.",
        sentiment: "neutral",
      },
    ],
  },
};

export const adCards: Record<string, AdCardData> = {
  "sponsor-placeholder": {
    id: "sponsor-placeholder",
    eyebrow: "Sponsor Preview",
    sponsor: "Atlas Prime",
    title: "Native sponsor cards can live inside the same premium card system.",
    message:
      "This placeholder shows how a future sponsor slot can stay tasteful, contextual, and layout-consistent without degrading the dashboard experience.",
    ctaLabel: "Reserved placement",
    note: "Future monetization: sponsored research, premium insights, or ad-free upsell.",
  },
};

export const supportingWidgetTemplates: SupportingWidgetTemplate[] = [
  {
    id: "summary-template",
    widgetType: "summary",
    label: "Summary card",
    description: "A concise dashboard overview with breadth, posture, and key takeaways.",
  },
  {
    id: "news-template",
    widgetType: "news",
    label: "News card",
    description: "A compact market brief card with three curated headlines.",
  },
  {
    id: "ad-template",
    widgetType: "ad",
    label: "Sponsor placeholder",
    description: "A native-looking card slot for future sponsors or premium upsells.",
  },
];
