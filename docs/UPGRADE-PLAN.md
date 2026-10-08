# ASTRA website upgrade plan — phase 1

Phase 2 has implemented the approved answers on this branch. This file is still the inspection and the plan. [CHANGELOG.md](CHANGELOG.md) records what shipped, what was measured after the change, and what was not deployed.

Do not merge this pull request until the founder says so. Do not push it to `main`. A push to `main` deploys https://astragrp.net/ immediately.

This plan builds on [AUDIT-2026-10-08.md](AUDIT-2026-10-08.md) and [CHANGELOG.md](CHANGELOG.md). It does not repeat that audit. It records what the separate product repository actually contains, where new sections would go, the responsive problems measured on this pass, and the performance baseline measured on this pass.

## Status labels

These words are used the same way throughout this plan.

| Label | Meaning in this document |
| --- | --- |
| Implemented | The source exists in `udayfulkatwar/Astra` at the commit inspected below, with tests or a documented runtime path. This is not a claim that the trading system is deployed as a public service. |
| Simulated | The path that runs in the demo and in `ASTRA_SIMULATION=true` uses simulated prices, a paper broker, or a fixed-rule stand-in. The product labels that stand-in as not an AI model. |
| Planned | Not built, or built as a mode the repository says is not in use. Live trading is in this group. |
| Verified | Observed in this phase by running it. Product capabilities are not marked Verified. The product test suite was not run here. |

## What was inspected

| Source | Commit | What this phase did with it |
| --- | --- | --- |
| This website, `udayfulkatwar/astra-website` | `d4fac282886e153d1614d229775c98ed0991c95b` on `main` | Read the page. Production build. Byte comparison with https://astragrp.net/. Layout pass. Performance pass. Gate click. |
| Live site | Same HTML, CSS, and JavaScript as that build | `curl` byte comparison and a Chrome load. |
| Product repo, `udayfulkatwar/Astra` | `c54df2df661ed205ad8b4a4600d1506eea78ffa5` (2026-10-03, “Allow routine fire URL from secret or Actions variable”) | Read only. Not modified, not installed, not tested. |
| Backup branch `backup/live-2026-10-08` | Points at `d4fac28`, the same commit as `main` | Confirmed with `git ls-remote`. Not moved. |

`docs/PROJECT_STATE.md` and `docs/PROJECT_OVERVIEW.md` inside the product repo are dated 2026-09-29. They are older than the commit that was read. Counts they give (659 tests, 53 HTTP endpoints, 21 dashboard pages) are quoted from those files and were not re-run. The 22 gate checks and 11 layers were counted from the source in this pass.

The local production build of `d4fac28` matched the live site file for file:

| File | Bytes | Equal to https://astragrp.net/ |
| --- | --- | --- |
| `index.html` | 3,047 | yes |
| `assets/index-5Ehd9tgT.js` | 400,206 | yes |
| `assets/index-BZaj8QSK.css` | 55,774 | yes |
| `assets/motion-COIl6417.js` | 131,466 | yes |
| `assets/three-CvOQ4Xx0.js` | 1,006,324 | yes |
| `assets/rolldown-runtime-hePW80VL.js` | 716 | yes |
| `assets/HeroCanvas-DdTUbvim.js` | 23,021 | yes (loaded by the main bundle, not linked from `index.html`) |

`npm test`: 10 passed, 0 failed. `npm run lint`: exit 0, existing warnings, no errors. `npm run build`: succeeded. `npm ci` reported 0 vulnerabilities. No new package was installed in this repository.

## A. What the product repository contains

The public page and the trading system are different codebases. The page’s `src/lib/gate/canTrade.ts` is a small teaching model: the visitor supplies every input, and the file’s own comment says nothing in it is market data or a performance claim. The product engine is `packages/prop-firm` and `packages/decision` in `udayfulkatwar/Astra`. New copy must not treat those as the same function.

The product’s governing rule, from its `README.md`, is: account survival has priority over trade opportunity, and the default state is NO TRADE. AI may analyse, propose, and veto. Deterministic code owns risk, sizing, prop-firm rules, kill switches, and execution permission. Live trading is not enabled (`docs/adr/0008-live-trading-authorization.md` requires six separate conditions, including an owner flag).

### Capability table

| Capability | Where it lives | What the code shows | Label |
| --- | --- | --- | --- |
| Operator dashboard | `apps/dashboard`. Routes in `apps/dashboard/src/App.tsx`. Navigation in `apps/dashboard/src/components/Layout.tsx`. | React command centre: Overview, Trade Approval Center, Accounts, Position Monitor, Risk Controls, Live Activity, Economic Calendar, News Intelligence, Market Scanner, Charts, Strategy Manager, Prop-Firm Rules, Trade Journal, Learning Metrics, Paper Trading, Backtesting, System Health, Automation Monitor, AI Model Monitor, Audit Log, Configuration. `PROJECT_OVERVIEW.md` calls this 21 pages. | Implemented |
| In-browser demo of that dashboard | `apps/dashboard` script `build:demo`. Banner in `apps/dashboard/src/demo/DemoBanner.tsx`. Runtime in `apps/dashboard/src/demo/runtime.ts`. | One self-contained HTML file. The banner text is: runs entirely in the browser, real safety engines, simulated prices, simulated clock, no broker, no real money. | Simulated |
| Risk engine | `packages/risk` (`position-sizing.ts`, `policy-checks.ts`, `protection.ts`, `monitor.ts`). | Position sizing where the smallest limit wins, policy checks, account health, position monitor, automatic protective closing. `PROJECT_STATE.md` lists tests for this package. Those tests were not run here. | Implemented |
| Prop-firm `canTrade` | `packages/prop-firm/src/rules.ts`. | Worst-case rule engine. A trade is approved only when every rule passes. Fail or unknown means not approved. | Implemented |
| Decision gate | `packages/decision/src/checks/`. | 22 checks in 11 layers, counted from the check ids: system (3), data (3), market (3), calendar (1), news (1), AI (1), strategy (4), risk (1), prop-firm (2), position (1), execution (2). Checks include `ai.analysis`, `risk.capital-preservation`, `prop-firm.rules`, `execution.live-authorization`. | Implemented |
| Kill switches | `packages/safety/src/kill-switch.ts`. Seven scopes, matching the names already on the public page: global, account, strategy, instrument, execution, AI, news. | Fail-closed until loaded. Manual clear is human-only. | Implemented |
| Paper / simulated trading | `packages/execution/src/paper/paper-broker.ts`, `packages/execution/src/gateway.ts`. `README.md` quick start: `ASTRA_SIMULATION=true pnpm dev`. | Paper broker supports MARKET and LIMIT. Gateway re-validates, locks per account, and treats an unknown order state as a halt. `PROJECT_OVERVIEW.md` says the mode in use is PAPER. SHADOW and LIVE exist as modes and are not in use. | Simulated for the running path. Live execution is Planned. |
| Market data for trading | `packages/market-data`. Simulation adapter is implemented. A real platform adapter is not. | `PROJECT_STATE.md`: the trading-platform quote adapter still needs the owner’s platform. Yahoo prices (`ADR-0026`) are charts only and are not tradable quotes. The gate stays NO TRADE until platform quotes exist. | Charts: Implemented as a price display. Tradable live quotes: Planned. |
| News and calendar engines | `packages/news`, `packages/calendar`. | Ports, validation, blackout, a rules classifier. Real RSS and calendar sources are owner inputs. Simulation mode uses a simulated schedule. | Engines Implemented. Live sources Planned. Demo schedule Simulated. |
| Journal | `packages/journal`. Dashboard page `apps/dashboard/src/pages/Journal.tsx`. | Append-only plan-versus-actual record: slippage, costs, R, MFE/MAE. | Implemented |
| Audit log | `packages/db/src/repositories/audit.ts`. Table in `packages/db/migrations/0001_initial.sql`. API `apps/api/src/routes/records.ts`. Dashboard `apps/dashboard/src/pages/Operations.tsx` (`Audit`). Demo copy in `apps/dashboard/src/demo/runtime.ts`. | Hash-chained append-only log. Verify endpoint `GET /api/v1/audit/verify`. The demo rebuilds the chain in the browser with Web Crypto. | Implemented in the product. The public website does not run this database. |
| Backtests and research | `packages/backtest`, `packages/research`. | Replay through the real gate. `docs/PROJECT_STATE.md` records that the owner’s LSFVG v1.0 study on HistData 2010–2019 found no edge, and that no strategy is selected for trading. | Implemented as tools. Not a performance claim for the public site. See open questions. |
| Claude / Anthropic adapter | `packages/ai/src/anthropic.ts`. Config in `config/astra.yaml` under `ai`. Wired in `apps/api/src/main.ts`. | `AnthropicProvider` uses `@anthropic-ai/sdk`. Default route model in config is `claude-opus-5`. The key is read from the environment variable named in config (`ANTHROPIC_API_KEY`). `.env.example` leaves that variable empty. The adapter’s own comment says tests inject `fetch`. `PROJECT_STATE.md` known issue 25 says no real model call had been made from the environment that wrote that note. | Adapter Implemented. A production API call is not Verified. |
| Simulated AI stand-in | `packages/ai` and `config/astra.yaml` (`standInWhenSimulating: true`). | Fixed rules over the same brief. Every answer is labelled “SIMULATED stand-in (fixed rules, not an AI model)”. SHADOW and LIVE refuse that output. | Simulated |
| AI authority | `docs/adr/0020-ai-analysis-layer.md`. Gate check `ai.analysis` in `packages/decision/src/checks/context.ts`. | AI can veto. It cannot approve, size, or change risk. Suggested review changes are stored as PROPOSED for a human. | Implemented |

Two lines in `docs/PROJECT_STATE.md` disagree with later code and should not be copied onto the site as facts:

- Known issue 7 says only MARKET entries are supported. `packages/execution/src/paper/paper-broker.ts` and `packages/decision/src/checks/market.ts` implement LIMIT entries with an expiry.
- Known issue 6 says cross-currency instruments are rejected. The completed-work section describes ADR-0022 FX valuation for a USDJPY quote. Templates are still marked UNVERIFIED.

### Screenshots and demos that can be produced

This phase did not install the product monorepo and did not take product screenshots. The way to produce them is already in the product repo:

```sh
corepack enable && pnpm install
pnpm --filter @astra/dashboard build:demo
```

`apps/dashboard/scripts/inline-demo.mjs` writes `apps/dashboard/dist-demo/astra-demo.html`. Serve that file and photograph it. The DEMO banner has to stay in the frame. Every image from that build is Simulated: simulated prices, simulated clock, paper only.

Useful frames, each captioned with the page name and the word Simulated:

- Overview
- Trade Approval Center
- Risk Controls, including a kill switch
- Audit Log, including the verify-chain control
- AI Model Monitor, which states that the key is not in the dashboard
- Paper Trading or Position Monitor
- Trade Journal

Do not photograph the Yahoo Charts page as evidence of trading. The product docs say those prices are not tradable quotes.

Do not use the public site’s command-centre accounts (`Evaluation A`, `$100k`, and the rest in `src/sections/Command/Command.tsx`). That file labels them as illustrative. They are not product output.

The existing hero link stays: `SITE.demoUrl` in `src/lib/content.ts` is `https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr`.

Embedding `astra-demo.html` inside the marketing bundle is a poor fit. It is a second application with its own router and engines. Static images keep the marketing JavaScript unchanged. Hosting the demo as its own GitHub Pages path is possible later because `dist/404.html` is already a copy of `index.html`, but that is a separate decision and would still be a Simulated demo.

## C. Claude, and the separation from the gate

Two different things are easy to blur. The public section has to keep them apart.

**Engineering workflow.** `CLAUDE.md` in the product repo says the owner’s instructions delegate implementation to Claude, and that the agent should ask only for facts only the owner has. `docs/PROJECT_OVERVIEW.md` says Claude wrote the code, tests, and documents under those instructions, and it gives an oversight split (“about 10%”). That is a statement in the repository. It is not an Anthropic partnership, and this phase did not independently audit authorship of all 507 files. The oversight sentence is a strong public claim. It is quoted in the draft below and marked for the founder to accept or delete.

**Runtime AI.** The adapter described above is a real server-side client. This review did not find a completed live call, a filled-in key, or a partnership. In simulation, and in the dashboard demo, the stand-in is deterministic rules. The decision gate still runs if the model is missing: a strategy that requires AI analysis gets no trade when the key, the budget, or the answer is missing or bad (`docs/adr/0020-ai-analysis-layer.md`).

**The public `canTrade()`.** Nine teaching checks, visitor-supplied inputs, used by the Gate and Command sections. It is not the 22-check product gate.

A system diagram for the new section, using only those facts:

```text
Market, news, calendar  →  strategy signal
        ↓
AI analysis (advisory; may veto; cannot approve or size)
        ↓
Deterministic gate (risk, prop-firm rules, kill switches, execution permission)
        ↓
Paper broker today. Live broker is not enabled.
        ↓
Journal and hash-chained audit log
```

Colour stays as the site already defines it in `src/styles/global.css`: ember for deterministic rules, lilac for AI, mint for approved.

## Where the new sections go

The page stays one URL. Navigation stays in-page anchors. No router. No new dependency.

Order in `src/App.tsx`:

1. Hero (`#top`) — unchanged, including “Click for demo”.
2. Pipeline (`#pipeline`)
3. Agents (`#agents`)
4. Gate (`#gate`)
5. Command (`#command`) — stays labelled as an interface preview.
6. **Product** (`#product`) — upgrade A. What the product repo contains, with status labels, and later the Simulated screenshots.
7. **Engineering** (`#engineering`) — upgrade C. Claude in the engineering workflow, the runtime adapter, and the diagram above.
8. Principles (`#principles`)
9. Rollout (`#rollout`)
10. **Company** (`#company`) — upgrade B.
11. Contact (`#contact`)

The desktop pill stays Pipeline, Agents, The gate, Command. At 1024×768 that pill is 330px wide, the logo ends near x=251, and the pill starts near x=347. Two more labels would land on the logo or the Request access button. New anchors go in the menu overlay only (`MenuOverlay.tsx`), not in `NAV_LINKS`, because `NAV_LINKS` feeds both the pill and the menu.

The chapter HUD is the hero sequence only (`CHAPTERS` in `src/lib/animations.ts`). It does not list page sections and does not need to change.

At 320×568 the menu’s link list already fills its grid row (`scrollHeight` equalled `clientHeight`). Adding three links without `overflow-y: auto` will clip the menu on a short phone. That one CSS rule is part of the implementation, not a redesign.

### Files to add

| File | Role |
| --- | --- |
| `src/lib/productFacts.ts` | Status labels and the sourced facts. Keeps illustrative copy in `src/lib/content.ts` untouched. |
| `src/components/StatusMark/StatusMark.tsx` | Small label: Implemented, Simulated, Planned. |
| `src/components/StatusMark/StatusMark.module.css` | Uses existing ember / lilac / mint tokens. |
| `src/sections/Product/Product.tsx` | Upgrade A. |
| `src/sections/Product/Product.module.css` | Layout only. |
| `src/sections/Engineering/Engineering.tsx` | Upgrade C. |
| `src/sections/Engineering/Engineering.module.css` | Layout only. The diagram is CSS and inline SVG, same approach as Pipeline. |
| `src/sections/Company/Company.tsx` | Upgrade B. |
| `src/sections/Company/Company.module.css` | Layout only. |
| `public/media/product/*.webp` | Only if the founder accepts Simulated screenshots. Not part of this plan commit. |

### Existing files to touch

| File | Change |
| --- | --- |
| `src/App.tsx` | Render the three sections in the order above. |
| `src/components/MenuOverlay/MenuOverlay.tsx` | Add Product, Engineering, and Company to the menu list only. |
| `src/components/MenuOverlay/MenuOverlay.module.css` | Let the menu scroll if the links exceed the viewport. |
| `src/sections/Contact/Contact.module.css` | Stop the contact intro and the session grid from drawing past the viewport. Details below. |
| `src/components/Navigation/Navigation.module.css` | Put a gap between the wordmark and Request access at 320px, and keep the access control at least 44px tall. |

### Do not change

`public/CNAME`, `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, DNS, Pages settings, environment variables, `package.json` dependencies, `src/lib/content.ts` (illustrative numbers and the demo URL), the hero scene, the gate engine, section deletions, or framework versions.

## Draft copy for founder review

Everything in this section is a proposal. It is not on the site. Sentences that go beyond the founder’s supplied facts are marked.

### Company (`#company`)

Supplied facts, and nothing else:

- Founder: Uday Fulkatwar
- Company / project: ASTRA (Autonomous Strategic Trading & Risk Agent)
- Founded: September 2026
- Location: India
- Industry: AI-powered trading technology and risk-management infrastructure
- For: proprietary trading firm participants and independent traders
- Contact: udayfulkatwar@astragrp.net

Proposed text:

> **Founder**
> Uday Fulkatwar
>
> **Company**
> ASTRA — Autonomous Strategic Trading & Risk Agent. Founded September 2026. India.
>
> **What ASTRA is**
> AI-powered trading technology and risk-management infrastructure for proprietary trading firm participants and independent traders.
>
> **Contact**
> udayfulkatwar@astragrp.net

No photo, biography, registration number, customer, or funding line is included, because none was supplied.

### Product (`#product`)

> ASTRA’s trading system is a separate codebase from this page. The sections above explain the idea. This section says what that codebase contains, and what it does not do yet.
>
> The operator dashboard, the risk engine, the prop-firm rule check, the decision gate, kill switches, the trade journal, and a hash-chained audit log are implemented. Paper trading runs on simulated prices. Live trading is not enabled. It needs the founder’s explicit authorisation, a verified broker profile, and a live broker adapter. Those are not in place.
>
> The interactive gate on this page is a simplified model. The product gate is a separate deterministic check: 22 checks across 11 layers. An AI note can veto a trade. It cannot approve one, and it cannot set the size.

Each row on the page gets one status label from the table above. Screenshot captions, if approved, say Simulated and keep the product’s DEMO banner.

### Engineering (`#engineering`)

> **How the software is written**
> The product repository’s working notes say implementation is delegated to Claude (Anthropic’s coding assistant) under the founder’s instructions. That is a way of building the software. It is not an Anthropic partnership.
>
> **Needs a yes or a deletion before this sentence is public:** the same overview says the founder’s oversight is about 10 percent.
>
> **How a trade is allowed**
> Claude, when a key is configured, is asked for an analysis or a post-trade review. The adapter is in the product source. This site does not claim that a live model call has been verified, and it does not claim a production integration beyond that adapter.
>
> In the simulated demo, a fixed set of rules stands in for the model. The product labels that stand-in as not an AI model.
>
> Risk, position size, prop-firm limits, kill switches, and the permission to send an order are ordinary deterministic code. If the model is silent, late, or malformed, the gate does not trade.

## Responsive findings

Measured with Chrome headless (Puppeteer) against the local production preview of `d4fac28`, `http://127.0.0.1:4173/?reduced&tier=low`. That build is byte-identical to the live site. Reduced motion was used so the hero text is on screen and scroll is native. Viewports: 320×568, 375×667, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080.

`body` sets `overflow-x: clip` (`src/styles/global.css`). Overflow does not become a sideways scrollbar. It is cut off.

No JavaScript exceptions, console errors, or failed asset requests on these loads. The gate kill switch, on the same preview at 1280×800, went from Approved / Armed to No trade / Halted and back to Approved / Armed on Reset.

### Page overflow

| Width | `documentElement.scrollWidth` | What sticks out |
| --- | --- | --- |
| 320 | 379 | Contact intro and the Tokyo / New York session row. |
| 375 | 379 | Session row box still ends at x=379. The intro lines end at x=373, inside this width. |
| 390, 768, 1024, 1440, 1920 | Equal to the viewport | No page-level overflow. |

**Contact intro at 320.** `Contact.module.css` removes `.main`’s max-width below 1024px (`max-width: none`). `.lead` is `max-width: 44ch`, which computed to about 361px. Two line boxes of the intro ended at x=368 and x=373. The right side of those lines is clipped. The headline glyphs themselves fit (the long screen-reader string is the `sr-only` span and is clipped by design).

**Session grid at 320 and 375.** `.sessions` is `grid-template-columns: repeat(2, auto)` at every width. The second column holds Tokyo and New York. At 320 the word “closed” on those two rows starts near x=311 and the text ends near x=361, so the status is cut off. Sydney and London, in the first column, fit. At 375 the row box still ends at x=379. At 390 the same row ends at x=379 and fits.

**Header at 320.** The logo box ends at x=126 and the Request access group starts at x=126. There is no gap. At 375 the gap is about 55px. The primary pill is already hidden from 860px down, which is what the CSS specifies, and the menu button remains.

### Controls and type

Heights measured on the 320×568 load unless noted:

| Control | Size | Note |
| --- | --- | --- |
| Request access | 124×38 at ≤420px; 132×40 from the 768 load upward | The 420px breakpoint in `Navigation.module.css` sets the 38px height. |
| Menu button | 42×42 | |
| Desktop nav links | about 35px tall | Seen at 1024 and above. |
| Hero “Try the gate” | 46px tall on the 320 load | Fits. “See the pipeline” sits on the same row and ends at x=264. “Click for demo” wraps to the next line. |
| “Reset conditions” | 20px tall | |
| “Copy address” | 34px tall | |
| “Back to top” | 20px tall | |

`--fs-micro` is 11px. It is the status pill, section tags, and the session state. The “in development” badge is 10px and is hidden below 1024px. Body copy uses `--fs-body` (about 15px and up) and was not the overflow.

### What is tight but not overflowing

- Pipeline switches to a vertical list at 860px. At 1024 the diagram nodes were inside their canvas. None were clipped by the parent.
- Command at 768 uses three account columns of about 222px. They stay inside the viewport. The stack-to-one-column rule starts at 760px, so 768 is still the three-column layout.
- The agent journal sample and the gate’s code sample scroll inside their own boxes (`overflow-x: auto`). They do not widen the page.
- The menu’s six current links fit at 320×568, 390×844, and 768×1024. There is no spare vertical room at 320×568 for three more links.

Screenshots of these viewports were captured from the local preview. Representative frames are attached to the draft pull request. They are not committed, so the site assets do not change.

## Performance baseline

No Lighthouse run was made, so this plan states no Lighthouse score. Field INP (the 98th percentile of real visits) was not available. Numbers below are a lab load from this environment on 8 October 2026.

### Transfer, cold, from https://astragrp.net/

`content-length` with `Accept-Encoding: gzip`. Fonts are already woff2 and were not gzip-encoded again. Chrome at 1440×900 requested the two Latin subsets only, not the Cyrillic, Greek, Vietnamese, or Latin-ext files.

| Response | Wire bytes |
| --- | --- |
| `index.html` | 918 |
| `index-BZaj8QSK.css` | 14,863 |
| `rolldown-runtime-hePW80VL.js` | 430 |
| `index-5Ehd9tgT.js` | 127,260 |
| `motion-COIl6417.js` | 49,122 |
| `three-CvOQ4Xx0.js` | 267,955 |
| `HeroCanvas-DdTUbvim.js` | 8,158 |
| Archivo Latin woff2 | 90,104 |
| JetBrains Mono Latin woff2 | 40,404 |
| **Total of those bodies** | **599,214** |

The three.js chunk is not deferred in practice. On the 1440 lab load its request started about 53ms after navigation, and `HeroCanvas` about 167ms, because the canvas mounts on first render. Raw sizes match the audit: main JS 400.20 kB, motion 131.46 kB, three.js 1,006.32 kB, HeroCanvas 23.02 kB, CSS 55.77 kB.

### Paint and motion, Chrome headless, live site, 1440×900, cold cache

| Measure | Result |
| --- | --- |
| Document TTFB | 48ms from this machine to GitHub Pages. This is not a phone network. |
| DOMContentLoaded | 150ms |
| Largest Contentful Paint entry | 324ms. Element was a span reading “Trade second.” (the second line of the hero headline). Size reported by the API: 54,180. |
| Time until the loading curtain was gone | about 3.7s of wall clock from the start of navigation. The curtain’s minimum time in source is 1.5s, then an exit animation. The 324ms LCP entry is when that text was first painted, which can be while the curtain is still up. It is not the moment a person sees the hero. |
| Cumulative Layout Shift | 0.011 during that load. One shift accounted for essentially all of it. |
| Interaction | One trusted click on the header link to `#gate` produced Event Timing entries of 88ms (pointerdown, pointerup, click) and scrolled the page. That is a single lab sample, not field INP. |

A second live load at 390×844 reused the browser cache (`transferSize` 0) and is not a network baseline. Its LCP entry was 244ms on an empty paragraph, and CLS on load was 0. No console errors and no page errors on either live load.

A local reduced-motion load at 1440 had LCP 228ms on the same “Trade second.” span and CLS about 0.007. Local transfer time is not comparable to GitHub Pages.

## Dependencies

None. New UI uses the tokens, type, and panel styles already in `src/styles/global.css`. The diagram is CSS and SVG. Screenshots, if approved, are static files written before the commit. No chart library, no router, no animation library beyond GSAP and Motion, which are already dependencies.

## Test plan for the implementation phase

Run these against the feature branch before any request to merge. Do not merge without an explicit founder approval, and do not merge by pushing to `main` from a branch that has not been reviewed.

| Check | What to look for |
| --- | --- |
| `npm test` | 10 gate tests pass. |
| `npm run lint` | Exit 0. Existing warnings may remain. No new errors. |
| `npm run build` | `tsc`, Vite, and the SPA `404.html` copy succeed. |
| `git diff` against `public/CNAME` and `.github/workflows/deploy.yml` | Empty. |
| Browser, local preview, `?reduced` and a normal load | No console errors, no failed requests. Hero “Click for demo” still points at the existing artifact URL. |
| Gate | Default Approved. Kill switch shows No trade / Halted. Reset returns to Approved. |
| Viewports 320, 375, 390, 768, 1024, 1440, 1920 | `scrollWidth` equals the viewport. Contact intro and session names are fully visible. Header has a gap at 320. Menu scrolls if the new links exceed the screen. |
| Keyboard | Menu opens, Escape closes, links move focus and scroll to the new sections. |
| Copy review | Every status label matches the table in this plan. No performance number, customer, partnership, or registration appears. |

## Rollback

This pull request does not deploy. Production stays the current site.

If a later, approved deploy has to be reversed: run the existing “Deploy to GitHub Pages” workflow on commit `5e1059cdb111a4eb7e58f8d87c92d7306c925c23` or on `d4fac282886e153d1614d229775c98ed0991c95b`. This phase built `d4fac28` and its HTML, CSS, and JavaScript matched the live files. `backup/live-2026-10-08` currently points at `d4fac28`. Do not change DNS, `public/CNAME`, or the workflow to roll back.

## Open questions

1. May the company section use the draft above as written? In particular: “Founded September 2026” and no legal entity name beyond ASTRA.
2. Is there a founder photo, a short biography, or a registration the page should show? None will be added unless you supply it.
3. May the engineering section say that Claude is used to write the software, as `CLAUDE.md` and `PROJECT_OVERVIEW.md` state? Should the “about 10% oversight” sentence be published, rewritten, or deleted?
4. Have you run ASTRA against a real Anthropic API key in any environment you want described? This review can say the adapter exists. It cannot say a live call has been verified.
5. May the product section show screenshots of `build:demo`, with the DEMO banner and a Simulated label? If not, the section will use the diagram only.
6. Should the public page link to https://github.com/udayfulkatwar/Astra, or only describe it?
7. The product docs record that LSFVG v1.0 showed no edge on 2010–2019 history, and that no strategy is selected for trading. The current site shows no performance numbers. Confirm that the new sections also show none.
8. Confirm the new anchors stay in the menu, not in the desktop pill.
9. The command-centre preview keeps its illustrative accounts. Confirm those numbers are never presented as product output.
