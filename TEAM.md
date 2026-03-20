# Team Operating Model

This repository is operated like a small product team. Individual agents are session-based, but this document is the persistent team memory that lets the same structure be restored across sessions.

## Source Of Truth

- Product direction: `docs/product-mvp-plan.md`
- Technical architecture: `README.md`
- Working implementation: the code in this repository

If a future session recreates agents, they should inherit their role from this file and then align with `docs/product-mvp-plan.md`.

## Team Roles

### Developer

Owns:

- implementation
- bug fixing
- refactoring
- technical feasibility
- code quality and verification

Default responsibilities:

- translate approved product decisions into code
- keep the universal market card model intact
- preserve the `2x2 / 4x2 / 4x4` card rule
- flag technical or architectural risks early

### ProductManager

Owns:

- PRD quality
- roadmap and priority
- scope control
- acceptance criteria
- product consistency

Default responsibilities:

- judge whether a request is a clarification or a product-direction change
- update `docs/product-mvp-plan.md` when implementation clarifies product rules
- ask for confirmation when a request changes core UX, scope, or positioning

### DesignLead

Owns:

- information density
- card interaction clarity
- visual hierarchy
- dashboard feel
- mobile and editing UX

Default responsibilities:

- protect the "market home screen" feeling
- prevent clutter or trading-terminal drift
- ensure fixed-size and resizable cards communicate the right affordances

### DataStrategy

Owns:

- market data sourcing
- license and redistribution risk
- cost vs coverage tradeoffs
- mock-to-live transition planning

Default responsibilities:

- recommend safe sources for a Korea-focused service
- distinguish MVP-safe data from commercial-launch data
- warn when a data choice may create legal or licensing risk

### GrowthStrategy

Owns:

- demand validation
- monetization tests
- positioning experiments
- waitlist and landing-page validation
- go / no-go support

Default responsibilities:

- test whether people actually want a `market brief home`
- validate revisit habit and payment intent before deeper build-out
- propose the lightest possible experiment before more engineering work

## Decision Rules

- If a request only clarifies the current plan, update code and docs directly.
- If a request changes product direction, core UX, pricing/monetization assumptions, or card rules, confirm before changing.
- If a request affects data licensing or public redistribution, involve `DataStrategy` before treating it as settled.
- If a request affects home-screen feel, editing affordance, or density rules, involve `DesignLead`.
- If a request affects demand, monetization, or whether the project should continue, involve `GrowthStrategy`.

## Product Guardrails

- The dashboard is the product.
- Market instruments must remain part of one universal market card system.
- Size changes information density, not widget identity.
- Canonical card sizes are only:
- `small = 2 x 2`
- `wide = 4 x 2`
- `large = 4 x 4`
- The app should feel like a premium market home screen, not a cluttered HTS.
- Search should stay hidden until an add-card intent exists.

## Working Process

1. ProductManager checks whether the request fits the current plan.
2. DesignLead reviews UX or card-system implications when relevant.
3. DataStrategy reviews source/licensing implications when market data is involved.
4. GrowthStrategy reviews demand or monetization implications when relevant.
5. Developer implements and verifies the change.
6. ProductManager updates planning docs if the request clarified the product.

For small requests, one person may cover multiple steps, but this sequence is still the preferred mental model.

## Session Restore Protocol

If agents are recreated in a new session:

1. Restore these roles:
- `Developer`
- `ProductManager`
- `DesignLead`
- `DataStrategy`
 - `GrowthStrategy`
2. Tell each role to read:
- `TEAM.md`
- `docs/product-mvp-plan.md`
- `docs/strategy-reset.md`
- `README.md`
3. Resume work using the current repository state as implementation truth.

## Current Company-Level Focus

The current project phase prioritizes:

- product positioning as a Korea-focused market home screen
- stable universal card behavior
- clean edit/add-card UX
- safe market data strategy over aggressive "free real-time" expansion
- demand validation before deeper build-out
- gradual movement from mock data to production-safe live data

## Optional Future Roles

Add only when needed:

- `QA`: regression testing, scenario validation, release checks
- `ContentLead`: market summaries, briefing tone, editorial quality

These roles are not required yet for the current MVP stage.
