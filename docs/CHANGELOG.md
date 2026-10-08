# Change log

## 2026-10-08 — Phase 2 public-site sections

- **Branch:** `cursor/upgrade-plan-5880`. Not merged. Not deployed. `main` is still `d4fac282886e153d1614d229775c98ed0991c95b`.
- **Files added:** `src/lib/productFacts.ts`, `src/lib/productFacts.test.ts`, `src/components/StatusMark/StatusMark.tsx`, `src/components/StatusMark/StatusMark.module.css`, `src/sections/Product/Product.tsx`, `src/sections/Product/Product.module.css`, `src/sections/Engineering/Engineering.tsx`, `src/sections/Engineering/Engineering.module.css`, `src/sections/Company/Company.tsx`, `src/sections/Company/Company.module.css`, `public/media/product/overview.webp`, `public/media/product/approvals.webp`, `public/media/product/risk.webp`, `public/media/product/audit.webp`, `public/media/product/ai.webp`.
- **Files modified:** `src/App.tsx`, `src/components/MenuOverlay/MenuOverlay.tsx`, `src/components/MenuOverlay/MenuOverlay.module.css`, `src/components/Navigation/Navigation.module.css`, `src/sections/Contact/Contact.module.css`, `src/sections/Hero/Hero.module.css`, `src/sections/Gate/Gate.module.css`, `package.json` (the test script now names both test files; no dependency was added), `docs/UPGRADE-PLAN.md` (status line only), `docs/CHANGELOG.md`.
- **Purpose:** Add Product, Engineering, and Company using only the founder-approved facts. Put those links in the menu, not the desktop bar. Show five real frames from the product demo, each marked Simulated. Fix the 320px contact intro, the session row, the header gap, and the smallest touch targets without changing the desktop pill. Do not claim a live Claude connection, a trading result, or a link to the product repository.
- **Tests performed:** `npm test` (13/13), `npm run lint` (exit 0, the same existing warnings, no new errors), `npm run build`. Chrome production preview at 320, 375, 390, 768, 1024, 1440, and 1920. Firefox 157.0.1, installed from Mozilla’s archive because apt has no Firefox package, at 320 and 1440. Gate kill switch, copy button, demo link, and menu anchors in both browsers. Secret scan of the branch diff. Paired performance loads of this preview and of https://astragrp.net/.
- **Outcomes:** 13/13 tests passed. No console errors and no failed requests on the checked loads. `scrollWidth` matched the viewport at all seven widths. At 320 the contact intro and the four session rows end inside the viewport, and the wordmark sits about 11px from Request access. Request access, the menu button, Copy address, Reset, and Back to top are 44px tall. The desktop pill stays about 35px. The loading curtain and the three.js chunk are unchanged. The five demo images are 1440×900 and are not part of the first load.
- **Performance, same method as the plan, 8 October 2026, cold cache, 1440×900.** No Lighthouse score. One lab click is not field INP. Local preview time is not GitHub Pages time.

  | | Written baseline (live) | Live, remeasured today | This branch, local preview |
  | --- | --- | --- | --- |
  | Main JS raw | 400,206 | 400,206 (`index-5Ehd9tgT.js`) | 408,305 (`index-BeqyyOxM.js`) |
  | Main JS encoded body | 127,260 | 127,260 | 128,397 |
  | CSS raw | 55,774 | 55,774 | 59,643 |
  | CSS encoded body | 14,863 | 14,863 | 15,293 |
  | three.js raw | 1,006,324 | 1,006,324, same hash `three-CvOQ4Xx0.js` | 1,006,324, same hash |
  | three.js encoded body | 267,955 | 267,955 | 266,102 (same bytes, different gzip) |
  | Hero canvas raw | 23,021 | 23,021 | 23,021 |
  | Curtain gone | about 3.7s | 3.78s | 3.57s |
  | LCP | 324ms, “Trade second.” | 424ms, “Trade second.” | 264ms, “Trade second.” |
  | CLS | 0.011 | about 0 | about 0 |
  | Header click to the gate | 88ms | 80ms, scrolled | 72ms, scrolled |

  The first-load set (HTML, CSS, JS, Latin fonts) is about 598KB of encoded bodies on both today’s live load and the local preview. The new sections add about 1.1KB of JavaScript and 0.4KB of CSS on the wire. The five screenshots are about 282KB together and load when the product section is reached. TTFB was 5ms locally and 100ms to GitHub Pages today (the written baseline was 48ms). That gap is the network, not the page.
- **Not shipped, because it would change the look or the first download:** Splitting the bloom code out of the three.js chunk. A trial build put React inside that chunk and made the entry point import about 1.4MB before the page could start. Shortening the curtain’s 1.5s minimum would show the hero sooner and would change the intro. Skipping layout of off-screen sections can break the scroll scenes.
- **Known issues:** The product repository’s own test suite was not run. The in-browser demo was built and the five frames were captured from it. Desktop nav links stay under 44px so the pill does not grow. The code sample in the gate still scrolls inside its own box; it does not widen the page. No performance or trading-result number was added, including LSFVG.
- **Deployment approval:** Not requested. Production was not modified. `public/CNAME` and `.github/workflows/deploy.yml` were not edited. Recommendation: do not deploy until the founder reviews this pull request.

## 2026-10-08 — Isolated checkpoint and test runner

- **Release / commit:** production source remains `5e1059cdb111a4eb7e58f8d87c92d7306c925c23` on `udayfulkatwar/astra-website`. The restorable import in this workspace is `376a6c03c172e77bdb5b3c4caddb6b01f0bf99aa`.
- **Files modified after the snapshot:** `package.json` (test script), `.github/workflows/ci.yml` (run tests on pull requests), `docs/AUDIT-2026-10-08.md`, `docs/CHANGELOG.md`.
- **Purpose:** Record a byte-identical copy of the live site, prove it restores, and make the documented `npm test` command actually run. No page, style, route, or asset was changed.
- **Tests performed:** `npm test` (10 gate tests), `npm run lint`, `npm run build`, byte comparison of the production build with https://astragrp.net/, Chrome checks of the local preview.
- **Outcomes:** 10/10 tests passed. Lint reported existing warnings and no errors. The production build’s HTML, CSS, and JavaScript matched the live site. Homepage, in-page navigation, menu, demo link, contact address, and the gate kill switch behaved as designed. No console exceptions on the checked loads.
- **Known issues:** The enhancement specification referenced for this upgrade was not in the website repository, the product repository, or this session, so no new product sections were added. `npm test` previously failed because `tsx` is not a direct dependency. Pull-request CI previously did not run the tests. Headless Chrome would not open a real window below 500px, so 320/375/390 were checked with device emulation; those passes showed no console errors. Largest Contentful Paint was not emitted on the reduced-motion headless load, so no Lighthouse score is claimed.
- **Deployment approval:** Not requested. Production was not modified. Recommendation: do not deploy.

## 2026-10-08 — Production baseline (unchanged)

- **Commit:** `5e1059cdb111a4eb7e58f8d87c92d7306c925c23` (`Add demo button to hero`)
- **Purpose:** This is the version GitHub Pages is serving at https://astragrp.net/.
- **Deployment approval:** Already live. This workspace does not replace it.
