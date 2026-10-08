# Change log

## 2026-10-08 — Hero demo link removed, private demo hidden

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Hero:** “Click for demo” is removed. The row is Trade Gate, Meet ASTRA, Watch the video.
- **Demo:** `SITE.demoUrl` is unchanged. `SITE.demoPublic` is `false`, so the film does not render “Explore the Demo” or its supporting line. The private artifact still answers HTTP 200 with Claude’s “Page not found” when logged out.
- **Preview:** CI uploads the `dist/` build as the `astra-preview` artifact. The Pages deploy workflow, `public/CNAME`, `robots.txt`, and `sitemap.xml` were not changed.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Product, about, engineering, and the demo link

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Fixes:** The hero chapter indicator hides as soon as the hero is left (`visibility: hidden`, no fade over the next section). The film poster is the 48s wordmark file already in the repo. Small-screen header gap, 44px targets, contact clipping, the gate reset target, and menu scrolling are the retained pieces from PR #1. The agents code sample wraps instead of widening the page.
- **Sections:** `#product` after command, `#engineering` after principles, `#company` after rollout and before the film. “Explore the Demo” under the film uses `SITE.demoUrl`. The artifact URL returned HTTP 200 and Claude’s “Page not found”, so the line under the film is the simulated-demo sentence.
- **Evidence:** `docs/CAPABILITY-AUDIT.md`. Statuses are tested in `src/lib/capabilities.test.ts`.
- **Tests performed:** `npm run lint` (exit 0, existing warnings only), `npm test` (17/17 after quoting the test glob so every file runs), `npm run build`. Headless Chrome at 1920, 1440, 1024, 768, 390, 375, and 320, plus headless Firefox 157 at 1440. At 320, `scrollWidth` equals `clientWidth` (320). The chapter indicator is hidden once the hero is left and still shows inside the hero. The film poster request is only `astra-launch-film-poster.webp` before play. The demo URL returned HTTP 200 and Claude’s “Page not found”. Lab layout shift while scrolling the new sections was 0.0069. Details are in the pull request.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Hero labels and the ASTRA film section

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Tasks:** 004 and 005 only. The demo button (task 006) was not added, and the hero “Click for demo” link was left as it is.
- **Hero:** “Try the gate” is now “Trade Gate” (still `#gate`, still the pill). “See the pipeline” is now “Meet ASTRA” (still `#pipeline`, still the text link). A “Watch the video” text link points at `#astra-film`. The Gate section heading is unchanged.
- **Film:** `#astra-film` sits after `#rollout` and before `#contact`. Native video, no autoplay. Poster `/media/film/astra-launch-film-poster.webp`. Master `/media/film/astra-launch-film-1080p.mp4` is byte-identical to the file already on this branch (sha256 `00570b56f8f3151bb281508d207ba97be04577870250b89b18c4db3b772889cd`, 22,187,489 bytes). New derivative `public/media/film/astra-launch-film-720p.mp4` (sha256 `32291db5e0275715ab184eec1049c708a877a071ba683b244cd7bbed8603513c`, 8,696,215 bytes, H.264/AAC, faststart, CRF 23) plays at viewports up to 900px and when save-data is on.
- **Tests performed:** `npm run lint` (exit 0, existing warnings only), `npm test` (13/13), `npm run build`. Headless Chrome checks of the hero and `#astra-film` at seven viewports, keyboard activation, reduced motion, Back-to-top, poster-versus-MP4 loading, and a lab layout-shift reading. The whole page at 320px still has the pre-existing 59px horizontal overflow in the contact headline and an agents code line. The new hero links and the film section do not add to it.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Baseline, design inventory, launch film

- **Branch:** `astra-v2`, from `main` at `d4fac282886e153d1614d229775c98ed0991c95b`. Not merged. `main` was not pushed.
- **Files added:** `docs/BASELINE-2026-10-08.md`, `docs/PR1-QUALITY-AUDIT.md`, `docs/DESIGN-INVENTORY.md`, `docs/RESOURCE-CHECKS.md`, `public/media/film/astra-launch-film-1080p.mp4`, `public/media/film/astra-launch-film-poster.webp`, `docs/CHANGELOG.md` (this entry).
- **Purpose:** Reconfirm the live revision and the backup, audit PR #1 without building on it, extract the design inventory, and store the founder’s film unchanged. No new section was added to the page.
- **Tests performed:** `npm ci`, `npm run build` of `d4fac28`, byte comparison with https://astragrp.net/, film sha256 and `ffprobe`, Chrome viewport captures of the production build and of PR #1. Details and PASS / FAIL / UNVERIFIED marks are in the four docs above.
- **Deployment approval:** Not requested. Production was not modified.

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
