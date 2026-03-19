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

- `small`: name, price, change, compact status
- `wide`: name, price, change, percent, sparkline, update time
- `large`: price block, detail chart, extra metrics, contextual summary

Sizing is resolved automatically from grid dimensions in `lib/utils/dashboard.ts` via `resolveMarketViewMode`.

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
