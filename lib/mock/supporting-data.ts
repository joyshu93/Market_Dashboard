import type {
  AdCardData,
  NewsFeedData,
  SummaryCardData,
  SupportingWidgetTemplate,
} from "@/types/dashboard";

export const summaryCards: Record<string, SummaryCardData> = {
  "market-overview": {
    id: "market-overview",
    title: "Today Market Brief",
    subtitle: "Morning setup",
    sessionLabel: "Asia open handoff",
    updatedAtLabel: "Updated 08:40 KST",
    posture: {
      label: "Risk tone",
      message: "Constructive, but still led by quality and lower yields.",
      tone: "positive",
    },
    summary:
      "Korean risk assets have room to open steady as softer US yields and calmer crude keep the macro backdrop supportive. The tape still favors quality growth over broad risk chasing.",
    stats: [
      { label: "Korea setup", value: "Firm open", tone: "positive" },
      { label: "US lead", value: "Tech-led", tone: "positive" },
      { label: "Macro watch", value: "Yields softer", tone: "positive" },
    ],
    highlights: [
      "KOSPI and KOSDAQ both have breathing room if FX stays orderly into the morning session.",
      "US growth remains the cleanest leadership pocket, but breadth is not yet broad enough to call a full risk breakout.",
      "WTI easing while 10Y yields soften is the key relief signal to watch on the macro side.",
    ],
    sessionVariants: {
      morning: {
        title: "Today Market Brief",
        subtitle: "Morning setup",
        sessionLabel: "Asia open handoff",
        updatedAtLabel: "Updated 08:40 KST",
        posture: {
          label: "Risk tone",
          message: "Constructive, but still led by quality and lower yields.",
          tone: "positive",
        },
        summary:
          "Korean risk assets have room to open steady as softer US yields and calmer crude keep the macro backdrop supportive. The tape still favors quality growth over broad risk chasing.",
        stats: [
          { label: "Korea setup", value: "Firm open", tone: "positive" },
          { label: "US lead", value: "Tech-led", tone: "positive" },
          { label: "Macro watch", value: "Yields softer", tone: "positive" },
        ],
        highlights: [
          "KOSPI and KOSDAQ both have breathing room if FX stays orderly into the morning session.",
          "US growth remains the cleanest leadership pocket, but breadth is not yet broad enough to call a full risk breakout.",
          "WTI easing while 10Y yields soften is the key relief signal to watch on the macro side.",
        ],
      },
      intraday: {
        title: "Today Market Brief",
        subtitle: "Intraday check",
        sessionLabel: "Korea cash session",
        updatedAtLabel: "Updated 11:55 KST",
        posture: {
          label: "Tape read",
          message: "Steady risk-on, but leadership is still narrow.",
          tone: "positive",
        },
        summary:
          "Local equities are holding a constructive tone into midday, but the move still depends on semis, large-cap exporters, and a calm FX backdrop rather than broad participation.",
        stats: [
          { label: "KOSPI", value: "Holding highs", tone: "positive" },
          { label: "Won", value: "Stable", tone: "positive" },
          { label: "Breadth", value: "Mixed", tone: "neutral" },
        ],
        highlights: [
          "The market is trading well enough, but this is still a quality-led session rather than a full risk chase.",
          "Keep watching USD/KRW and 10Y yields. If both stay quiet, Korea can continue to digest gains cleanly.",
          "Energy remains the soft pocket, which is helping inflation-sensitive assets at the margin.",
        ],
      },
      close: {
        title: "Today Market Brief",
        subtitle: "Close recap",
        sessionLabel: "Post-close wrap",
        updatedAtLabel: "Updated 15:50 KST",
        posture: {
          label: "Closing read",
          message: "Risk held up through the close with macro support intact.",
          tone: "positive",
        },
        summary:
          "Korean equities closed with a constructive tone as softer yields and calmer oil kept the macro backdrop supportive. Leadership stayed concentrated, but the session still favored risk over defense.",
        stats: [
          { label: "KOSPI close", value: "Stronger", tone: "positive" },
          { label: "Rates impulse", value: "Supportive", tone: "positive" },
          { label: "Oil", value: "Softer", tone: "positive" },
        ],
        highlights: [
          "Semis and exporters did the heavy lifting again, which keeps the market positive but not fully broad-based.",
          "The softer-yield backdrop remains the key support signal heading into the next session.",
          "The best follow-through tomorrow likely depends on whether FX stays orderly and US growth leadership remains intact overnight.",
        ],
      },
    },
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
