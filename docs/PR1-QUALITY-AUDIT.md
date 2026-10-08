# PR #1 quality audit

Branch `cursor/upgrade-plan-5880` at `182cfa576b0bb8f34dbb1b52fddc8ba53f32b615`. Open pull request: https://github.com/udayfulkatwar/astra-website/pull/1. Merge base with `main` is `d4fac28`. The diff is 25 files, +1,007 / −12, plus five WebP frames. Nothing on that branch was edited here, and nothing from it was copied into the page.

Screenshots are viewport captures after the page was scrolled, with `prefers-reduced-motion` and `?reduced=1`, in headless Chrome. They are not a stitched full-page image. Side-by-side files are in the run artifacts under `screenshots/compare/`.

## What the measurements showed

Document `scrollWidth` minus layout width:

| Viewport | Live `d4fac28` | PR #1 |
| --- | --- | --- |
| 1440×900 | 0 | 0 |
| 390×844 | 0 | 0 |
| 375×812 | 4 | not captured |
| 320×720 | 59 | 0 |

At 320 the live contact block extends to x=379 (the “Let’s protect your next account.” title and the footer). PR #1 brings `scrollWidth` back to 320 and those contact boxes are no longer past the viewport.

Header gap between the wordmark and “Request access”:

| Viewport | Live | PR #1 |
| --- | --- | --- |
| 320 | 0.8px | 10.8px |
| 340 | 20.8px | 30.8px |

Touch boxes (element height, and hit height where a `::after` pad exists):

| Control | Live 320 | PR #1 at 320 | Live 1440 | PR #1 at 1440 |
| --- | --- | --- | --- | --- |
| Request access (header) | 38px | 44px | 40px | 44px |
| Menu button | 42px | 44px | 42px | 44px |
| Copy address | 34.1px | 44px | 34.1px | 44px |
| Back to top | 20.1px | 44px | 20.1px | 44px |
| Reset conditions | 20.1px | 44px | 20.1px | 44px |
| See the pipeline | 25.3px box | 25.3px box, 49.3px hit | 25.3px | 25.3px (no pad above 767) |
| Desktop pill links | hidden below 860px | hidden below 860px | 35.1px | 35.1px |
| Try the gate (hero pill) | 46×118 | 46×118 | 52×130 | 52×130 |

“Click for demo” uses the same `.secondary` rule as “See the pipeline”. Its own box was not measured, because the accessible name includes “(opens in a new tab)”. The company email’s extra hit pad was not measured separately.

All five `/media/product/*.webp` files loaded at 1440×900 (`naturalWidth` 1440). The agent-card code sample still draws past x=320 on both builds (`"risk 1.4% exceeds 1.0% limit"` reaches about x=361). `overflow-x: clip` keeps it from widening `scrollWidth` on the PR build. That clip exists on both.

## Classification

| Change | Files | Class | Reason |
| --- | --- | --- | --- |
| 320px header gap and 44px header targets | `Navigation.module.css` | Retain | Wordmark gap goes from 0.8px to 10.8px at 320. Request access and the menu button reach 44px. The desktop pill stays 35.1px. |
| Contact clipping, copy button, back-to-top | `Contact.module.css` | Retain | At 320, page overflow drops from 59px to 0. Copy address and Back to top reach 44px. The type scale is unchanged. |
| Hero text-link hit area under 767px | `Hero.module.css` | Retain | “See the pipeline” stays a text link. The invisible pad makes the hit height 49.3px only below 767px. |
| Gate reset hit area | `Gate.module.css` | Retain | “Reset conditions” grows from 20.1px to 44px. It is still a text button. |
| Menu list can scroll | `MenuOverlay.module.css` | Retain | `overflow-y: auto` on the list. The big-type style is unchanged. Useful if more links are added. |
| `productFacts` model and its test | `src/lib/productFacts.ts`, `src/lib/productFacts.test.ts`, `package.json` test script | Retain | A typed status model (`Implemented`, `Simulated`, `Planned`) with no new dependency. “22 checks” matches `STANDARD_CHECKS` (22 functions) and “11 layers” matches `GATE_LAYERS` (11 names) on the Astra default branch cloned for this run. The test script names the new file explicitly. |
| Company biography inside that model | the `COMPANY` and `COMPANY_INTRO` strings | Founder decision | “Uday Fulkatwar”, “September 2026”, and “India” are not in the Astra repo that was searched. Do not publish them on the strength of this audit. |
| Five demo frames | `public/media/product/*.webp` | Retain | Each file is 1440×900 and about 37–70 KB. They show the dashboard routes and the demo banner from `apps/dashboard/src/demo/DemoBanner.tsx` (“DEMO”, simulated prices, no broker, no real money). They are labelled Simulated. A fresh `build:demo` was not run, so byte-identity with a new demo build is unverified. |
| Product section body | `Product.tsx`, `Product.module.css` | Replace | The section head uses `.section`, `.tag`, `.display`, and `.section-title`, which matches Command and Principles. The body does not. It is a hairline table with a new status chip on every row, not a `.panel`, not brackets, and not the principles list. |
| `StatusMark` | `StatusMark.tsx`, `StatusMark.module.css` | Replace | A 22px filled chip, `letter-spacing: 0.04em`, `color-mix` background. The existing label is `.tag`: a 6px dot, `--fs-micro` (0.6875rem), `letter-spacing: 0.02em`, no fill. |
| Engineering section body | `Engineering.tsx`, `Engineering.module.css` | Replace | The head matches. The steps are flat boxes with a 2px left border. They are not `.panel` (no blur, no inset highlight, no brackets, no panel shadow). The two articles have no existing card. |
| Company section body | `Company.tsx`, `Company.module.css` | Correct | The head matches Principles. The fact list is the closest of the three to an existing pattern (mono micro label, hairline, quiet values). The values use `--fs-lead` in a two-column grid other sections do not use. Rebuild that list on the principles rhythm rather than keeping this grid. |
| Mounting the three sections and their menu labels | `App.tsx`, `MenuOverlay.tsx` | Drop | These only exist to show the sections above. The desktop bar was correctly left unchanged. Do not bring the labels back until the sections are redesigned. |
| Upgrade plan and that branch’s changelog | `docs/UPGRADE-PLAN.md`, `docs/CHANGELOG.md` on the PR branch | Founder decision | Notes from the rejected pass. They are not a page. Do not treat the plan’s “built” line as approval to merge. |

## Why the new sections read as foreign

At 1440 the neighbouring originals are a glass command window (`.panel.brackets`) and a large principles statement with an X-marked list. Product replaces that with status chips and rules. Engineering replaces it with plain columns and left-border rows. Company is quieter and closer, and still introduces its own fact grid. Shared tokens (void background, bone type, the section head, Archivo display, mono labels) are not enough to make the bodies feel like the same instrument.

## Checks

| Check | Result |
| --- | --- |
| Diff of PR #1 against `main` read (25 files) | PASS |
| Side-by-side viewport shots of the new sections next to neighbouring originals | PASS, at 1440 and 390 for Command/Product, and at 1440 for Principles/Engineering and Rollout/Company |
| 320px overflow fix measured | PASS. Live overflow 59px, PR overflow 0 |
| 44px targets measured for header, menu, copy, back-to-top, reset, and the pipeline text link | PASS |
| Desktop pill left at about 35px | PASS, measured 35.1px |
| Five images are real files that paint | PASS, 1440×900, HTTP from the PR preview, `naturalWidth` 1440 |
| Five images byte-match a fresh `build:demo` | UNVERIFIED. Source UI and banner copy match. The demo was not rebuilt. |
| `productFacts` check/layer counts against Astra source | PASS for 22 and 11 |
| Company biography found in the Astra repo | FAIL. Those strings are not in the cloned tree. |
| “Click for demo” hit box measured on its own | UNVERIFIED. It shares `.secondary` with the link that was measured. |
| Company email hit pad measured | UNVERIFIED. The CSS is in the diff. |
