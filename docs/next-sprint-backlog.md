# Next Sprint Backlog

## Goal

Turn the current prototype into a clearer `market brief home` MVP and stop spending core effort on full real-time market-data ambitions.

## P0

### 1. Today Market Brief Upgrade

Goal:

- make the summary card feel like the real reason to open the product

Work:

- rewrite summary card structure around `today's posture`
- add clearer top-level labels for session, date, and updated-at time
- define morning / intraday / close copy states in mock data

Success:

- a first-time user can explain the market mood in under 30 seconds

### 2. Home-Screen Messaging Cleanup

Goal:

- align the UI copy with `market brief home`, not `real-time quote board`

Work:

- replace copy that over-promises real-time behavior
- rewrite empty states and helper text around `brief`, `watch`, `overview`, and `context`
- make add-card language more about `building my market home`

Success:

- the product reads like a daily workflow tool, not a trading terminal

### 3. Card Affordance Cleanup

Goal:

- make fixed-size and resizable cards feel unambiguous

Work:

- keep resizable handles only on market cards
- keep edit affordances visually consistent
- reduce visual noise in edit mode on small cards

Success:

- no card looks resizable unless it actually is

## P1

### 4. Briefing-Oriented Data Layer

Goal:

- shift data usage from `quote-first` to `context-first`

Work:

- add mock/session metadata for `morning`, `intraday`, `close`
- support status/source labels without implying guaranteed real-time
- keep live-data adapters optional and safe to fail back

Success:

- cards remain useful even when data is delayed or partial

### 5. Reopen Habit Features

Goal:

- make the dashboard worth revisiting every day

Work:

- add favorite/default layout behavior
- improve saved-state reliability
- prepare one small `daily reset` or `fresh brief` touchpoint

Success:

- the dashboard feels like a home screen, not a one-time demo

## P2

### 6. Market Validation Surface

Goal:

- make the product testable with real users before deeper build-out

Work:

- create a simple landing page or waitlist page
- define premium fake-door entry points
- track which positioning gets better interest

Success:

- the product can be shown, tested, and explained outside the codebase

### 7. Premium-Ready Card Layer

Goal:

- preserve future monetization without clutter

Work:

- keep sponsor card tasteful
- define premium-card placeholders
- avoid hard-coding assumptions that block ad-free or premium tiers later

Success:

- monetization fits the product instead of feeling bolted on

## Explicitly Deferred

- full real-time Korea market quote coverage
- trading or brokerage integration
- heavy charting / HTS-style analysis
- account sync / cloud layouts
- advanced alerting

## Recommended Build Order

1. summary card and top-level brief messaging
2. edit affordance cleanup
3. session-aware mock data and content polish
4. landing / validation surface
5. premium-ready hooks

## Definition Of Done For This Sprint

- the product clearly positions itself as a `market brief home`
- the summary card becomes the strongest surface on the screen
- the UI no longer implies unnecessary real-time guarantees
- the app is ready to test with real target users
