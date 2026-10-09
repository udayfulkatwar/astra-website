# Credibility audit — 9 October 2026

> Implementation note (2026-10-09): the public contact address on branch `credibility-upgrade` is `founder@astragrp.net`. The inventory below records the live site at audit time, which still showed `udayfulkatwar@astragrp.net`.

Read-only audit of production `main` at `41e21e4`. This file is on the `credibility-upgrade` branch and is not on `main`.

Authorized public facts used below: Founder Uday Fulkatwar and Co-Founder Vivek Chaudhary are project leadership titles only. Founded September 2026, India. Industry: AI-assisted trading and risk-management infrastructure. Status: independent, bootstrapped, self-funded startup project, not incorporated, under active development. No Pvt Ltd, LLP, registration number, office address, regulatory licence, or VC funding is claimed or proposed.

## 1. Live site inventory

Checked on https://astragrp.net/ in Chrome at 1440×900 and 390×844, and against `index.html`, `dist/index.html` (the `41e21e4` build: `index-CMD665hI.js`, `index-nrVLNTP3.css`), and the section source. Desktop and mobile show the same About and contact copy. The desktop pill nav is hidden from 860px down (`Navigation.module.css`). The header phrase “in development” is hidden from 1023px down.

### About and founder info

| | |
|---|---|
| What exists | Section `#company`. Tag “about astra”. Title “Building a More Disciplined Trading Infrastructure.” Body: independent trading-technology project, founded in India in September 2026. Block “Founded by Uday Fulkatwar” plus “Our Mission”. Same text at 1440 and 390. |
| Missing or weak | Vivek Chaudhary is absent. The copy says Uday founded ASTRA and does not say Co-Founder. It does not say bootstrapped, self-funded, or not incorporated. No biography, and none should be invented. The film end card does name both people. |
| Where | `src/sections/Company/copy.ts`, rendered by `src/sections/Company/Company.tsx`. The verbatim-copy test is `src/sections/Company/copy.test.ts`. That test rejects the substrings `incorporat`, `investor`, and `funding` in the body, so a later “not incorporated” or “self-funded” sentence has to update the test on purpose. |

The film poster `public/media/film/astra-launch-film-poster.webp` is the end card. It reads “ASTRA”, “A product vision film”, “Uday & Vivek”, “Illustrative interfaces and simulated data”, “This is not a record of live trading performance.”, and “In development”. Those names are pixels in the image, not HTML text. `src/` has no “Vivek”.

### Contact

| | |
|---|---|
| What exists | `#contact`. Tag “early access · paper mode first”. Mailto `udayfulkatwar@astragrp.net` with subject “ASTRA early access”, a copy-address button, and the same “Request access” pill as the header. Footer line “© 2026 ASTRA” and “Back to top”. Same blocks at 1440 and 390. |
| Missing or weak | No contact form, phone, or postal address. Leave the address out. The only person named is the mailbox owner. |
| Where | `src/sections/Contact/Contact.tsx`, `src/lib/content.ts` (`SITE.email`), `src/sections/Contact/Contact.module.css`. |

### Privacy, Terms, and Risk disclosure

| | |
|---|---|
| What exists | One risk paragraph in the contact footer: “ASTRA is in development. Trading involves substantial risk of loss and nothing on this page is financial advice. Live execution only ever runs with explicit human authorisation.” The film figcaption is a conceptual-presentation disclosure (`FILM.disclosure` in `src/sections/Film/filmSource.ts`). |
| Missing or weak | No Privacy Policy, no Terms or usage page, and no standalone risk disclosure. They are not separate URLs. Live link text at both widths has no Privacy or Terms control. |
| Where | Disclaimer constant: `DISCLAIMER` in `src/lib/content.ts`, printed in `Contact.tsx`. No route table exists. `App.tsx` is one page. |

### SEO

| Item | Live `index.html` | Gap |
|---|---|---|
| Title | “ASTRA — Autonomous Strategic Trading & Risk Agent” | Fine as a product name. It does not say the project is in development. |
| Description | “AI-powered trading and risk-management platform built for prop-firm traders and serious independent traders…” | Reads as a finished product for customers. The authorized wording is AI-assisted infrastructure, under active development. |
| Canonical | `https://astragrp.net/` | Present. |
| Open Graph | `og:type`, `og:url`, `og:title`, `og:description`, `og:site_name`, `og:image` `https://astragrp.net/og.png`, type png, 1200×630, alt set | Image is real: live `content-length` 66271 matches `public/og.png`, 1200×630. |
| Twitter | `summary`, title, description | No `twitter:image`. Card is `summary`, so the 1200×630 image is not the large card. |
| JSON-LD | None | No Organization or Person. |
| Sitemap | `public/sitemap.xml` lists only `https://astragrp.net/` | Legal URLs would need new `<url>` entries. |
| Robots | `public/robots.txt` allows `/` and points at the sitemap | Fine for a public marketing site. |

Source of the tags: `index.html`. Vite copies `public/` through. `scripts/copy-spa-fallback.mjs` copies `dist/index.html` to `dist/404.html` so GitHub Pages serves the app shell for unknown paths.

### Crawler-readable text

`dist/index.html` and the live homepage source contain the title, description, canonical, and Open Graph tags, then an empty boot div, `#root`, and a `<noscript>` paragraph that repeats the meta description. They do not contain “Uday”, “Vivek”, “India”, “September 2026”, “not incorporated”, or the contact email. Those strings are rendered by JavaScript from `src/sections/Company/copy.ts` and `src/lib/content.ts`, which are inside `index-CMD665hI.js`. A crawler that does not run JS sees the meta description and the noscript paragraph only.

### Accessibility

| Check | Finding | Where |
|---|---|---|
| Landmarks | `<header>` banner, `<nav aria-label="Primary">` (desktop), menu dialog `aria-label="Site menu"`, `<main>`, sections labelled by their headings. | `Navigation.tsx`, `MenuOverlay.tsx`, `App.tsx` |
| Skip link | “Skip to content” points at `#pipeline`. Visible on keyboard focus. | `App.tsx`, `.skip-link` in `src/styles/global.css` |
| Footer landmark | The `<footer>` is inside `<section id="contact">`, so it is that section’s footer, not a page `contentinfo` landmark. | `Contact.tsx` |
| Focus | `:focus-visible` outline is ember, 2px, offset 3px. Menu moves focus to the first link. | `global.css`, `MenuOverlay.tsx` |
| Headings | Split headlines keep one screen-reader string in `.sr-only` and hide the animated lines. | `src/components/SplitLines/SplitLines.tsx` |
| Alt text | Product frames have alts that say “Demo build” and “simulated prices”. Logo SVG is `aria-hidden` beside the word “ASTRA”. Hero canvas and chapter HUD are `aria-hidden`. | `src/lib/capabilities.ts`, `Navigation.tsx`, `HeroCanvas.tsx`, `ChapterHud.tsx` |
| Contrast | Bone on `#0b0c0f` is about 15.2:1. `--mute` at 62% opacity is about 6.2:1 and passes AA for normal text. `--faint` at 40% opacity is about 3.2:1. That fails AA 4.5:1 for the 11px mono labels that use it (the contact “email” label, agent-log keys). | `global.css` `--faint`, `--fs-micro` |
| Reduced motion | `prefers-reduced-motion` skips Lenis, shortens the loader, and flattens several scrubs. Grain animation is disabled. | `src/main.tsx`, `SmoothScroll.tsx`, `Preloader.tsx`, `Hero.tsx`, `global.css` |
| Hit size | Header “Request access” and the menu button are 44px tall, including at 390. | `Navigation.module.css` |

### Status labelling

| Surface | What it says | Width |
|---|---|---|
| Header wordmark | “in development” | Visible at 1440. `display: none` from 1023px down, so a 390px visit does not show it. |
| Contact footer | “ASTRA is in development… not financial advice… human authorisation.” | Both widths. |
| Command panel | “paper mode” and “example data” | Both. `Command.tsx` |
| Product frames | Status chips Implemented or Simulated, caption “Demo build · simulated data” | `capabilities.ts`, `Product.tsx` |
| Engineering | “AI-Assisted Development. Deterministic Risk Controls.” and a sentence that Claude Code assists implementation. | `capabilities.ts` |
| Film | Poster and figcaption: illustrative, simulated, not live performance. | Poster image, `filmSource.ts` |
| Link preview | Meta description does not say in development or not incorporated. | `index.html` |

Nothing on the page says Pvt Ltd, LLP, a registration number, an office, a licence, or venture funding. The gap is the opposite: the preview text sounds launched, and the About block names one person while the film names two.

## 2. Product evidence

Read-only source: https://github.com/udayfulkatwar/Astra at `c54df2d` on `claude/astra-master-instructions-kdahkc`. The checkout at `/tmp/Astra` is a shallow clone of that one commit. It was not modified. `node_modules` is not installed. Tests were not run: installing dependencies would write into that tree and use the network. The test files below exist and are the ones a later safe run would execute.

`packages/decision/src/checks/index.ts` exports `STANDARD_CHECKS` with 22 checks. `packages/decision/src/types.ts` exports `GATE_LAYERS` with 11 names: SYSTEM, DATA, MARKET, STRATEGY, NEWS, CALENDAR, AI, RISK, PROP_FIRM, POSITION, EXECUTION. The only `BrokerAdapter` implementation found is `packages/execution/src/paper/paper-broker.ts`.

The public demo URL was fetched from this environment and returned the Claude artifact shell, not a rendered dashboard. A normal-browser check recorded in `docs/RELEASE-CANDIDATE.md` on 8 October 2026 saw the ASTRA Command Center with a DEMO/SIMULATED banner and paper accounts. This table’s “demo” column is therefore the demo *source* (`apps/dashboard/src/demo/`, sidebar in `apps/dashboard/src/components/Layout.tsx`), plus that earlier overview sighting. Individual screens were not re-opened in a normal browser for this note.

| Capability | Status | Evidence | Public demo artifact |
|---|---|---|---|
| Trading dashboard | Implemented | `apps/dashboard/src/pages/Overview.tsx`, `Trading.tsx`, `Accounts.tsx`, `Charts.tsx`. Sidebar entries Overview, Accounts, Charts, Paper Trading. | Demo source includes the routes. 8 October normal-browser check saw the overview and paper accounts. Not re-rendered here. |
| Risk engine | Implemented | `packages/risk/src/position-sizing.ts`. `packages/safety/src/kill-switch.ts` (seven scopes). Tests present: `packages/safety/test/kill-switch.test.ts`. Not executed this session. Dashboard page `RiskControls.tsx`. | Demo source includes `/risk` and the real safety engines on simulated prices (`DemoBanner.tsx`: “No broker, no real money.”). |
| Strategy research / backtesting | Implemented | `packages/backtest/src/engine.ts` replays M1 bars through the same decision gate, sizing, prop-firm rules, and journal. Tests present, not run: `packages/backtest/test/engine.test.ts`, `broker.test.ts`. UI: `apps/dashboard/src/pages/Backtesting.tsx`. Its own comment says a simulated result is an engine test, not performance evidence. | Demo route `POST /api/v1/backtests` calls `runDemoBacktest` in `apps/dashboard/src/demo/backtests.ts`, on in-memory simulated bars. Sidebar label “Backtesting”. |
| Simulated execution | Simulated | `packages/execution/src/paper/paper-broker.ts`. Gateway `packages/execution/src/gateway.ts`. Tests present, not run: `packages/execution/test/paper-broker.test.ts`. No live broker class found. | Demo runtime constructs `PaperBrokerAdapter` (`apps/dashboard/src/demo/runtime.ts`). |
| Human approval | Implemented | `apps/dashboard/src/pages/Approvals.tsx`. `apps/api/src/runtime/mode-service.ts`: effective mode stays HALTED until loaded, and LIVE is rejected unless `ASTRA_LIVE_TRADING_AUTHORIZED` is set. `docs/adr/0008-live-trading-authorization.md`. | Demo source includes `/approvals` and `/api/v1/decisions`. |
| Account monitoring | Implemented | `apps/dashboard/src/pages/Accounts.tsx`, `Positions.tsx`. Demo route `/api/v1/monitor/positions`. | Sidebar “Accounts” and “Position Monitor”. Data in the demo is simulated. |
| Audit trail | Implemented | `packages/db/src/repositories/audit.ts` hashes each entry with the previous hash. Dashboard audit screen is routed at `/audit`. | Demo `GET /api/v1/audit/verify` calls `rt.verifyAudit()` in `apps/dashboard/src/demo/router.ts`. |
| Market-research workflows | Partial | Screens exist: `MarketScanner.tsx`, `News.tsx`, `Intelligence.tsx` (calendar), `Journal.tsx`. Demo serves `/api/v1/market/scanner`, `/api/v1/news`, `/api/v1/calendar/upcoming` from simulated adapters (`SimulatedNewsAdapter` in `runtime.ts`). `/api/v1/market/feeds` returns an empty list. A real `packages/market-data` package exists and is not what the demo plays. | Those routes are in the demo source. Feeds are simulated. Do not describe this as live market research. |
| Claude / Anthropic API | Partial | One call site: `this.client.beta.messages.create` in `packages/ai/src/anthropic.ts` (`AnthropicProvider`, kind `LIVE`). `apps/api/src/main.ts` `aiProviders()` constructs it only when `process.env[anthropic.apiKeyEnv]` is set; otherwise it logs that AI analysis is unavailable. Tests that inject a fetch exist in `packages/ai/test/ai.test.ts` and were not run. | The demo does not call it. `runtime.ts` line 323 sets `providers: new Map([['simulated', new SimulatedAiProvider()]])`. The AI monitor page would show that simulated provider. |

Search of the product tree, excluding `node_modules` and the lockfile: `messages.create` appears in `packages/ai/src/anthropic.ts` only. `new Anthropic` appears there and in `apps/api/src/main.ts` and the AI test. No other running path calls the API.

Claude Code evidence in that repo:

- `CLAUDE.md` is present and tells the implementation agent to read `docs/PROJECT_STATE.md` and `docs/ARCHITECTURE.md`. That supports “Claude Code is used to help build the software.”
- No `.claude/` directory is in this checkout.
- The clone has a single commit, `c54df2d` (“Allow routine fire URL from secret or Actions variable”). Its message has no `Co-authored-by` trailer. A full history was not available, so a trailer search of older commits is unverified.

The marketing page currently folds both facts into one Engineering block marked Implemented (`ENGINEERING_P1` and the “Analysis and signals” layer in `src/lib/capabilities.ts`). The development assistant and the in-product API are different claims. The API code exists and is not what the public demo runs.

## 3. Video and demo placement

Today, “Watch the video” is a hero text link in `src/sections/Hero/Hero.tsx` that calls `scrollToTarget(lenis, '#astra-film')`. “Explore the Demo” is the underlined link under the film in `src/sections/Film/Film.tsx`, `href={SITE.demoUrl}`, new tab.

Proposed, one of each:

1. **Watch Product Video**, once, at the bottom of `#command`. Command is the last section of the pipeline → agents → gate → command run, so the control sits inside that area and is not repeated four times. A `<button type="button">` calls the existing `scrollToTarget(lenis, '#astra-film')`. Style it as the header pill: `Navigation.module.css` `.access` is 44px tall, bone fill, void text, 0.8125rem, weight 600, radius 999px, ember hover. That is already the page’s prominent action, and 44px holds at 390. Place it in the section padding under the command panel, left aligned with the section head. `#astra-film` already has the 80px / 96px scroll-margin, so the film title clears the header. Do not add a second scroll-margin.

2. **Launch ASTRA Demo**, the existing control under the video. Change the visible words in `Film.tsx` from “Explore the Demo” to “Launch ASTRA Demo”. Keep `href={SITE.demoUrl}` (`https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr`), `target="_blank"`, `rel="noopener noreferrer"`, and the `.sr-only` “ (opens in a new tab)”. Keep the `.demo` underline in `Film.module.css` so it stays a text action under the disclosure, not a second pill.

## 4. Phase 2 task list

Small, in this order. Each one can ship alone. None of them should add a registration number, address, licence, shareholder claim, or performance number.

### 1. About and leadership

- Files: `src/sections/Company/copy.ts`, `src/sections/Company/copy.test.ts`.
- Change: keep the India / September 2026 sentences. Add Co-Founder Vivek Chaudhary as a project leadership title beside Founder Uday Fulkatwar. Say the titles are roles on the project. Update the test that currently requires the single heading “Founded by Uday Fulkatwar”. If the body says “not incorporated” or “self-funded”, change the `incorporat|investor|funding` assertion so it still rejects a positive claim and allows the denial.
- Risk: medium. Wording can accidentally imply a company or an office.
- Acceptance: desktop and mobile About shows both names and the titles Founder and Co-Founder. The page source of the section contains neither “Pvt”, “LLP”, “director”, nor “shareholder”. `npm test` passes the updated copy test.

### 2. Legal pages

- Files: new static documents `public/privacy/index.html`, `public/terms/index.html`, `public/risk/index.html`; footer links in `src/sections/Contact/Contact.tsx`; `public/sitemap.xml`.
- Change: three short pages. Privacy: what the marketing site stores (no account system; mail is the visitor’s own client). Terms: usage of an in-development site. Risk: the existing disclaimer, kept, plus “not financial advice” and “not a live trading record”. GitHub Pages will serve a real file at `/privacy/` and will not fall through to `404.html`. Do not add a client router for these. Hash-only sections would stay on `/` and would not be separate pages.
- Risk: medium. Legal text must stay inside the authorized facts.
- Acceptance: each URL returns its own `<h1>` in the raw HTML, with JavaScript disabled. Homepage still loads. Sitemap lists the three URLs. No page names a regulator or a company number.

### 3. SEO, JSON-LD, and the share image

- Files: `index.html`, `public/sitemap.xml` if the legal URLs are in.
- Change: soften the description to AI-assisted trading and risk-management infrastructure, in development, September 2026, India. Add `twitter:image` and set `twitter:card` to `summary_large_image`. Add JSON-LD `Organization` for the project name ASTRA with `foundingDate` `2026-09`, `founder` two `Person` nodes, and `url` `https://astragrp.net/`. Omit `address`, `vatID`, `taxID`, `leiCode`, and `legalName`.
- Risk: medium. Schema.org types can be read as a registered entity if the wrong fields are filled.
- Acceptance: the built `dist/index.html` contains the new description, one `application/ld+json` block, and `twitter:image` pointing at `https://astragrp.net/og.png`. The JSON has no address and no identifier number.

### 4. Static company blurb

- Files: `index.html` `<noscript>`, which Vite keeps in `dist/index.html`.
- Change: one paragraph a non-JS client can read: ASTRA, independent bootstrapped project, not incorporated, founded September 2026 in India, Founder Uday Fulkatwar, Co-Founder Vivek Chaudhary, contact email, under active development.
- Risk: low, if it repeats task 1’s sentences and does not add facts.
- Acceptance: `curl` of `/` shows both names and “not incorporated” inside `<noscript>`, and `#root` is otherwise empty.

### 5. Split the Claude section

- Files: `src/lib/capabilities.ts`, `src/sections/Engineering/Engineering.tsx`, `src/lib/capabilities.test.ts`.
- Change: “Currently used” is Claude Code as a development assistant, matched to `CLAUDE.md` in the product repo. “Planned” or “Not running in the demo” is the in-product Anthropic adapter: the code exists, the demo uses `SimulatedAiProvider`, and no key is required for the public site. Keep the affiliation sentence.
- Risk: medium. Calling the API “in use” would overclaim.
- Acceptance: the engineering section shows the two labels. The test still refuses status `Verified` and `Production Validated`. The rendered “Currently used” sentence does not say the public demo calls `messages.create`.

### 6. Product walkthrough from real frames

- Files: `src/sections/Product/Product.tsx` and `src/lib/capabilities.ts` only if captions move. Images stay `public/media/product/overview.webp`, `risk.webp`, `approvals.webp`, `audit.webp`.
- Change: order those four existing frames as a walkthrough (overview, risk, approval, audit) with the current “Demo build · simulated data” caption. Do not generate new pictures and do not crop in a way that hides the DEMO banner.
- Risk: low.
- Acceptance: the four `src` paths are unchanged files. Each `<img>` alt still says simulated. No new asset is added.

### 7. Video control and demo label

- Files: `src/sections/Command/Command.tsx`, `src/sections/Film/Film.tsx`, `src/lib/demo.test.ts`.
- Change: the command button and the “Launch ASTRA Demo” label from section 3.
- Risk: low. Uses the current scroll helper and the current demo URL.
- Acceptance: at 1440 and 390, activating “Watch Product Video” leaves `#astra-film` with its top between the header bottom and 24px below it. The film link’s `href` is still `https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr` and its visible name is “Launch ASTRA Demo”. `npm test` passes.

### 8. Accessibility fixes

- Files: `src/styles/global.css` (`--faint` or the mono labels that use it), `src/components/Navigation/Navigation.module.css` (the `.version` rule that hides “in development” under 1024px), `src/sections/Contact/Contact.tsx` if the footer should be a page landmark.
- Change: bring 11px mono text to at least 4.5:1 on `#0b0c0f`. Show “in development” at 390, or repeat that status in the About tag so it is not desktop-only. Move the footer out of `#contact` if a `contentinfo` landmark is required, without moving the visible copyright line off the contact block’s layout.
- Risk: low.
- Acceptance: computed contrast of the contact “email” label is at least 4.5:1 at 1440 and 390. The words “in development” are present in the accessibility tree at 390. Keyboard focus still reaches the skip link, the menu, and the new video button.

## What this note does not authorize

No biography, qualification, customer, revenue, or performance figure. No statement that ASTRA is a company, a fund, or a licensed service. The product statuses above are source findings, not a claim that a broker, a prop firm, or a live account is connected.
