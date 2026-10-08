# Change log

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
