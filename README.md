# Market Home Dashboard

A production-minded MVP for a web-based market dashboard where users arrange cards the way they would arrange phone home-screen widgets. The product centers on a single universal market card model: one instrument, multiple densities, responsive layouts, and future-ready card creation flows.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- react-grid-layout
- Zustand
- Custom SVG trend chart primitives for low-overhead sparkline/detail rendering

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
Landing page: [http://localhost:3000](http://localhost:3000)
Dashboard preview: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

Planning baseline: [`docs/product-mvp-plan.md`](./docs/product-mvp-plan.md)
Strategy reset: [`docs/strategy-reset.md`](./docs/strategy-reset.md)
Team operating model: [`TEAM.md`](./TEAM.md)
Next sprint backlog: [`docs/next-sprint-backlog.md`](./docs/next-sprint-backlog.md)
Validation playbook: [`docs/validation-playbook.md`](./docs/validation-playbook.md)
Landing copy draft: [`docs/landing-copy.md`](./docs/landing-copy.md)

### Environment

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

Required for live market integration:

- `FRED_API_KEY`
- `DATA_GO_KR_SERVICE_KEY`
- `ALPHA_VANTAGE_API_KEY`
- `NEXT_PUBLIC_MARKET_REFRESH_MS` optional, defaults to `300000` ms

### Verification

```bash
npm run typecheck
npm run build
```

## Product behavior

- The dashboard is the product surface.
- Market instruments all use the same `market` widget type.
- Widget size changes presentation density, not widget identity.
- Edit mode unlocks drag, resize, and removal.
- Layout and dashboard preferences persist in `localStorage`.
- Search stays hidden until the add-card flow is invoked.
- Desktop supports right-click on empty space for a future-ready context-menu path.
- Mobile has a compact floating add action to prepare for future long-press / plus-button patterns.

## Widget sizing model

The same market data instance can render in three modes:

- Desktop uses a `16`-column tile grid as the design baseline.
- All cards use only three canonical form factors:
- `small` = `2 x 2`
- `wide` = `4 x 2`
- `large` = `4 x 4`
- `large` is exactly four times the area of `small`
- `wide` is the top or bottom half of `large`
- `small`: name, price, change, compact status
- `wide`: name, price, change, percent, sparkline, update time
- `large`: price block, detail chart, extra metrics, contextual summary

Sizing is resolved automatically from grid dimensions in `lib/utils/dashboard.ts` via `resolveMarketViewMode`, and all widget layouts are normalized back to those canonical sizes whenever the layout changes or persisted state is loaded.

## Architecture

```text
app/
  dashboard/page.tsx
  globals.css
  layout.tsx
components/
  charts/
    trend-chart.tsx
  dashboard/
    add-card-modal.tsx
    context-menu.tsx
    dashboard-grid.tsx
    dashboard-header.tsx
    dashboard-shell.tsx
  ui/
    button.tsx
    modal.tsx
    pill.tsx
  widgets/
    widget-renderer.tsx
    widget-shell.tsx
    market/
      market-widget.tsx
      market-widget-small.tsx
      market-widget-wide.tsx
      market-widget-large.tsx
      market-widget-types.ts
    supporting/
      ad-widget.tsx
      news-widget.tsx
      summary-widget.tsx
lib/
  mock/
    market-data.ts
    supporting-data.ts
  utils/
    cn.ts
    dashboard.ts
    format.ts
  widget-registry/
    widget-registry.ts
store/
  dashboard-store.ts
types/
  dashboard.ts
```

## Key design decisions

### 1. Universal market widget model

All market instruments are represented as `widgetType: "market"` plus an `instrumentId`.

That means:

- KOSPI is not a custom component.
- BTC is not a custom component.
- USD/KRW is not a custom component.

They all share:

- the same widget shell
- the same view-model formatting layer
- the same resize-to-density behavior

### 2. Dashboard layout is separate from widget content

- `components/dashboard/*` handles canvas behavior, edit mode, grid layout, context menus, and add-card flow.
- `components/widgets/*` handles what each card shows.
- `store/dashboard-store.ts` keeps layout state and product UI state together.

This keeps the layout system portable for future mobile or native shells.

### 3. Registry-driven defaults

`lib/widget-registry/widget-registry.ts` defines default size constraints per widget category. New widgets use this registry when inserted into the dashboard, so layout defaults stay centralized.

### 4. Future-ready add-card architecture

The main dashboard does not expose a permanent search bar.

Instead the current flow is:

1. User clicks `Add card` or right-clicks empty dashboard space.
2. `AddCardModal` opens.
3. Search appears only inside that modal.
4. The selected instrument creates a new universal market card with responsive defaults.

This keeps the intended product interaction model intact while making the current MVP easy to use.

## Data model overview

Core types live in `types/dashboard.ts`.

- `Instrument`
- `MarketSnapshot`
- `DashboardWidget`
- `DashboardLayouts`
- `SummaryCardData`
- `NewsFeedData`
- `AdCardData`

The important product split is:

- `Instrument` describes what the market subject is.
- `MarketSnapshot` describes current market state.
- `DashboardWidget` describes how that subject appears on the dashboard.

That separation keeps future API integration straightforward.

## How layout persistence works

`store/dashboard-store.ts` uses Zustand persistence middleware with `localStorage`.

Persisted items:

- widgets
- layouts
- edit mode
- theme

Transient UI state such as selected widget, context menu coordinates, and modal state is intentionally not persisted.

## Live data integration

The dashboard now uses a server-side aggregation route at `/api/market-snapshots`.

Source mapping:

- `KOSPI`, `KOSDAQ`: `data.go.kr` KRX index OpenAPI
- `S&P 500`, `NASDAQ`, `WTI`, `US 10Y`, `BTC`, and fallback `USD/KRW`: FRED API
- `Gold Spot` and live-priority `USD/KRW` / `BTC`: Alpha Vantage

Behavior:

- The client refreshes snapshots on load and then on a configurable interval.
- If one provider fails, the dashboard falls back to the seeded mock snapshot for that instrument.
- The universal widget system stays unchanged, so live data only replaces the snapshot layer.

Current tradeoff:

- This implementation prefers exact underlying instruments and official/public data sources.
- Because of that, freshness is mixed by asset class: some feeds are closer to live, while some official feeds are daily cadence.
- If you want intraday US index moves at the expense of exact index-source purity, the next step would be to add a proxy or commercial market-data provider.

## Mock content included

Market instruments:

- KOSPI
- KOSDAQ
- S&P 500
- NASDAQ
- USD/KRW
- Gold
- WTI
- US 10Y Yield
- Bitcoin

Supporting cards:

- summary widget
- news widget
- sponsor placeholder widget

## How to add a new instrument

1. Add a new `Instrument` entry in `lib/mock/market-data.ts`.
2. Add a matching `MarketSnapshot` entry keyed by the same `instrumentId`.
3. Optionally add a seeded widget in `createDefaultDashboardSeed()` inside `lib/utils/dashboard.ts`.
4. The new instrument will automatically appear in the add-card modal because that modal reads from the instrument list.

No new React component is required for additional market instruments.

## How to add a new supporting widget

1. Add the widget content data to `lib/mock/supporting-data.ts`.
2. Extend `types/dashboard.ts` if the widget needs a new data shape.
3. Add registry defaults in `lib/widget-registry/widget-registry.ts`.
4. Create the widget component under `components/widgets/supporting`.
5. Extend `components/widgets/widget-renderer.tsx`.
6. Add a creation path in `lib/utils/dashboard.ts` and the corresponding template entry in `lib/mock/supporting-data.ts`.

## Future context-menu / card search expansion

The current MVP already has the main state flow needed for the intended UX:

- `contextMenu` state in the store
- `addCardModal` state in the store
- empty-dashboard right-click handling in `DashboardShell`
- searchable instrument list in `AddCardModal`
- registry-backed default card insertion

To expand this later, likely next steps are:

1. Add smarter empty-slot insertion near the click position instead of appending to the bottom.
2. Add long-press handling for mobile.
3. Add server-backed saved layouts and user profiles.
4. Add real API adapters that populate `MarketSnapshot`.

## Notes

- The chart layer is intentionally lightweight and uses SVG primitives so the dashboard stays easy to render, resize, and hydrate with mock data in the MVP stage.
- The app currently builds successfully on `next@15.5.13`.
- `npm audit --omit=dev` still reports one moderate Next.js advisory that is only fully cleared by a breaking upgrade to Next 16.2.0. This MVP does not use `next/image`, which limits practical exposure, but the dependency should be revisited during a future framework-major upgrade.
