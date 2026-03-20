# Strategy Reset

## Final Product Definition

This product is not a real-time trading board. It is a Korea-focused `market home screen` where users assemble the market signals they want to check every day and read the overall market mood within 30 seconds.

One-line Korean definition:

- `내가 매일 여는 시장 브리핑 홈`

## Why We Are Narrowing The Product

- Korea-focused real-time market data is constrained by licensing and redistribution risk.
- The current product is strongest when it behaves like a `market brief home`, not a trading terminal.
- The existing dashboard engine, card system, and interaction model are already valuable even without full real-time data.

## What We Keep

- universal market card system
- `2x2 / 4x2 / 4x4` card rule
- drag, resize, and personalized layout editing
- summary, news, and sponsor card system
- market dashboard as the main product surface
- Korea + US + macro + FX + commodity + crypto overview concept

## What We Drop From The MVP Promise

- full real-time market data as the core selling point
- trading-terminal positioning
- high-frequency quote accuracy as a required MVP feature
- large backend or account-sync scope

## Revised MVP Promise

The MVP helps a Korea-based individual investor open one screen and quickly understand:

- today's market posture
- how Korean and US risk assets are behaving
- what rates, FX, commodities, and crypto are doing
- what matters right now, in plain language

## Revised MVP Scope

### In Scope

- personalized market home dashboard
- reusable market cards
- today market brief
- curated market news card
- layout save and edit mode
- delayed, official, mock, or partial live data as needed
- add-card flow and mobile-safe reading experience

### Out Of Scope

- brokerage/trading integration
- full real-time Korea market quote service
- advanced technical analysis platform
- user accounts and sync-heavy product surface

## Development Direction

### Phase 1: Finish The Home Screen Core

- tighten summary card into a real `today market brief`
- improve top-level date / market session / updated-at language
- make fixed vs resizable card affordances clearer
- polish add-card and mobile reading flow

### Phase 2: Make The Product Worth Reopening

- improve briefing quality by session: morning / intraday / close
- make card summaries more contextual and more useful than raw prices
- strengthen saved layouts, favorites, and repeat-visit behavior

### Phase 3: Add Paid Or Licensed Value Selectively

- premium cards
- ad-free mode
- deeper brief or alert layers
- selectively licensed real-time cards only if justified

## Solo Builder Reality Check

### Possible With Little Or No Capital

- build and ship the dashboard product itself
- use mock + delayed + public data for validation
- run user interviews and waitlist tests
- monetize lightly through sponsorship or premium features later

### Not Realistic Early Without Capital

- public real-time Korea quote service at scale
- full legal comfort for broad quote redistribution without formal licensing
- enterprise-grade market data coverage across all assets

## Revenue Outlook

Small revenue is possible if the product is positioned as a `briefing and workflow tool`, not as a raw quote utility.

Most realistic early models:

- premium subscription
- sponsor card
- ad-free tier
- premium brief / alert layer

Least attractive early model:

- pure display-ad dependence without a strong repeat-use habit

## Validation Plan

### Immediate Validation Goals

- confirm that users actually want a `market home screen`
- confirm that users return for the brief, not only for raw quotes
- confirm that a subset would pay for cleaner workflow or deeper summaries

### Immediate Tests

1. Problem interviews with 10 Korea-based investors
2. Landing page with two positioning variants
- `시장 브리핑 홈`
- `내 손으로 조립하는 시장 홈화면`
3. Waitlist or fake-door test for premium value

### Go / No-Go Signals

Continue if:

- users say they already patch together multiple market sources manually
- users respond positively to the personalized dashboard concept
- users show repeat-interest in a one-screen market briefing workflow

Reconsider if:

- users only want faster raw quotes
- users see no value beyond existing finance portals
- no one is willing to revisit or pay for a better market workflow

## Final Decision

- Do not scrap the project.
- Do not chase full real-time market data as the MVP core.
- Continue development as a `market brief home screen`.
- Put validation ahead of deeper infrastructure.
