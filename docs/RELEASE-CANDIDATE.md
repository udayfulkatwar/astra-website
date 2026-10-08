# Release candidate — 8 October 2026

Branch `astra-v2` at the commit that adds this file. Draft pull request #2. Not merged. `main` is still `d4fac282886e153d1614d229775c98ed0991c95b`. Production was not deployed.

## What changed

The hero row is Trade Gate, Meet ASTRA, and Watch the video. “Click for demo” is gone.

`SITE.demoUrl` is still `https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr`. `SITE.demoPublic` is `true`, so the film shows “Explore the Demo” and the line “Explore the ASTRA dashboard and available product workflows.” The label does not say “Live”. The coordinator opened that URL in a normal Chrome Incognito window, signed out, and saw the ASTRA Command Center dashboard (DEMO/SIMULATED banner, PAPER mode, three $50,000 paper accounts, and the sidebar). The share setting is “Anyone with the link”. Automated headless checks still receive Claude’s “Page not found”.

Also on this branch, from the accepted earlier passes: the film section, product overview, about, and engineering sections; the chapter indicator hides as soon as the hero is left; the 320px header gap, 44px targets, and the overflow fixes.

## Files changed against `main`

`git diff --name-only origin/main` plus this document:

- `.github/workflows/ci.yml` — uploads `dist/` as the `astra-preview` artifact. Does not deploy.
- `docs/BASELINE-2026-10-08.md`
- `docs/CAPABILITY-AUDIT.md`
- `docs/CHANGELOG.md`
- `docs/DESIGN-INVENTORY.md`
- `docs/PR1-QUALITY-AUDIT.md`
- `docs/RELEASE-CANDIDATE.md`
- `docs/RESOURCE-CHECKS.md`
- `package.json` — the test glob is quoted so every test file runs
- `public/media/film/astra-launch-film-1080p.mp4`
- `public/media/film/astra-launch-film-720p.mp4`
- `public/media/film/astra-launch-film-poster.webp`
- `public/media/product/approvals.webp`
- `public/media/product/audit.webp`
- `public/media/product/overview.webp`
- `public/media/product/risk.webp`
- `src/App.tsx`
- `src/components/ChapterHud/ChapterHud.module.css`
- `src/components/MenuOverlay/MenuOverlay.module.css`
- `src/components/MenuOverlay/MenuOverlay.tsx`
- `src/components/Navigation/Navigation.module.css`
- `src/lib/capabilities.test.ts`
- `src/lib/capabilities.ts`
- `src/lib/content.ts`
- `src/lib/demo.test.ts`
- `src/sections/Agents/Agents.module.css`
- `src/sections/Company/Company.module.css`
- `src/sections/Company/Company.tsx`
- `src/sections/Company/copy.test.ts`
- `src/sections/Company/copy.ts`
- `src/sections/Contact/Contact.module.css`
- `src/sections/Engineering/Engineering.module.css`
- `src/sections/Engineering/Engineering.tsx`
- `src/sections/Film/Film.module.css`
- `src/sections/Film/Film.tsx`
- `src/sections/Film/filmSource.test.ts`
- `src/sections/Film/filmSource.ts`
- `src/sections/Gate/Gate.module.css`
- `src/sections/Hero/Hero.module.css`
- `src/sections/Hero/Hero.tsx`
- `src/sections/Product/Product.module.css`
- `src/sections/Product/Product.tsx`
- `src/styles/global.css`

Unchanged against `main` (`git diff --exit-code` returned 0): `public/CNAME`, `public/robots.txt`, `public/sitemap.xml`, `.github/workflows/deploy.yml`.

## Bundle and media

Gzip of the built JS and CSS, `gzip -9` of the files in `dist/assets`:

| | `main` (`d4fac28`) | candidate | delta |
| --- | ---: | ---: | ---: |
| JS | 446,827 bytes | 451,126 bytes | +4,299 bytes |
| CSS | 14,495 bytes | 15,418 bytes | +923 bytes |

The three.js, motion, and hero-canvas chunks are the same size. The increase is the index chunk and the stylesheet.

New files under `public/media`, which `main` does not have:

| File | Bytes |
| --- | ---: |
| `astra-launch-film-1080p.mp4` | 22,187,489 |
| `astra-launch-film-720p.mp4` | 8,696,215 |
| `astra-launch-film-poster.webp` | 61,808 |
| `overview.webp` | 70,056 |
| `risk.webp` | 55,746 |
| `approvals.webp` | 51,780 |
| `audit.webp` | 36,998 |
| **Total** | **31,160,092** |

A wide visit fetches the poster and the 1080p film when the visitor plays it. A viewport at or below 900px, or save-data, fetches the 720p film instead. The four product images load when that section is on screen.

## Lab performance

Headless Chrome, production build served by `vite preview` on this machine. No throttling. Desktop is 1440×900. Mobile is 390×844, device scale 2, a mobile user agent. Two loads each. LCP and CLS come from PerformanceObserver. TBT is the sum of long-task time above 50ms from first contentful paint until 5 seconds after LCP. It is a lab proxy, not field INP.

| Load | LCP | CLS | TBT proxy |
| --- | ---: | ---: | ---: |
| Candidate desktop, run 1 | 276 ms | 0.0111 | 223 ms |
| Candidate desktop, run 2 | 228 ms | 0.0111 | 226 ms |
| `main` desktop, run 1 | 340 ms | 0.0111 | 625 ms |
| `main` desktop, run 2 | 280 ms | 0.0111 | 301 ms |
| Candidate mobile, run 1 | 208 ms | 0 | 203 ms |
| Candidate mobile, run 2 | 204 ms | 0 | 204 ms |
| `main` mobile, run 1 | 244 ms | 0 | 350 ms |
| `main` mobile, run 2 | 244 ms | 0 | 290 ms |

CLS matches `main` on desktop and is 0 on the mobile emulation. LCP is lower on the candidate in these samples. The first `main` desktop TBT sample recorded 72 long tasks and should not be treated as a stable number. These are lab numbers from one machine.

## Security

Searched `dist/` for `AKIA…`, `ghp_…`, `sk-ant-`, `sk-proj-`, private-key blocks, `ASTRA_*KEY`, and `process.env`. None. No `.env` files in `dist/`. No `config/` directory and no strategy files from the Astra product repo.

Strings that are present on purpose: `https://astragrp.net` in the page metadata, and the `claude.ai` artifact URL because `SITE.demoUrl` is the film link. “Click for demo” is not in the bundle. Library files also contain public URLs for React, three.js, and GSAP (`react.dev`, `github.com`, `gsap.com`, `docs.pmnd.rs`, `jcgt.org`, `opencollective.com`). No `localhost` and no private host.

## Link check

Every `href` in the rendered page, including the open menu:

| href | Result |
| --- | --- |
| `#pipeline`, `#top`, `#agents`, `#gate`, `#command`, `#contact`, `#product`, `#principles`, `#company`, `#astra-film` | PASS. Each id exists. |
| `mailto:udayfulkatwar@astragrp.net` and the same address with the early-access subject | PASS |
| `/media/film/astra-launch-film-1080p.mp4` | PASS. HTTP 200 from the local build. This is the film’s fallback download, not a new page. |
| `https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr` | PASS. Rendered as “Explore the Demo”. The dashboard itself was verified manually; see the test table. |

## Preview artifact

CI run [37787318275](https://github.com/udayfulkatwar/astra-website/actions/runs/37787318275) for `168e10b` uploaded `astra-preview` (31,760,844 bytes, not expired). It is a zip of `dist/` on the Actions run. It is not a GitHub Pages deployment. `deploy.yml` and the Pages settings were not changed. Later doc-only commits upload another zip of the same site. Download `astra-preview` from the latest successful CI run on `astra-v2`.

## Tests

| Check | Result |
| --- | --- |
| `npm test` | PASS. 19/19. The hero has no “Click for demo”. `demoPublic` is `true`, and the film line is the dashboard sentence. |
| `npm run lint` | PASS. Exit 0. Existing warnings only. |
| `npm run build` | PASS |
| Hero is Trade Gate, Meet ASTRA, Watch the video, at 7 widths | PASS. Headless Chrome. “Click for demo” is absent. Those shots were taken before the film CTA was turned back on. |
| Demo destination | PASS. Verified manually in a Chrome Incognito window by the coordinator, not signed in. The URL loads the ASTRA Command Center dashboard, with the DEMO/SIMULATED banner, PAPER mode, three $50,000 paper accounts, and the sidebar. Share setting: “Anyone with the link”. Automated headless checks get “Page not found”. |
| Full-page screenshots at 7 widths | PASS. Saved under the review shots for this pass. |
| Hero and footer before/after against https://astragrp.net/ | PASS. Pairs at all 7 widths. |
| Chrome console at 7 widths | PASS. No console or page errors. |
| Firefox 157 console at 7 widths | PASS. No console or page errors. Hero labels match. |
| Edge | UNVERIFIED. Not installed. |
| Safari | UNVERIFIED. Not installed. |
| 320 `scrollWidth === clientWidth` | PASS. 320 and 320. Also true at the other six widths. |
| Lab LCP, CLS, TBT vs `main` | PASS as lab data only. See the table above. Not a field score. |
| Bundle gzip delta | PASS. JS +4,299 bytes. CSS +923 bytes. |
| New media weight | PASS. 31,160,092 bytes, itemised above. |
| Secret scan of `dist/` | PASS. No keys, tokens, env files, or Astra config/strategy files. |
| `CNAME`, deploy workflow, robots, sitemap vs `main` | PASS. No diff. |
| Rendered hrefs | PASS. Table above. |
| Pages preview deployment | NOT APPLICABLE. Not requested, and Pages settings were not changed. |
| Widths under 500px | Device emulation. This environment cannot open a real window that small. |

## Known limits

- Automated headless loads of the demo URL still show Claude’s “Page not found”. A normal browser does not.
- Edge and Safari were not run.
- Performance numbers are one headless machine, two samples, with no network throttling. The first `main` desktop TBT sample is noisy.
- “Meet ASTRA” still scrolls to `#pipeline`. That wording was accepted earlier.
- The film element’s fallback “Download the film” link is in the tab order at zero size. It is not visible.

## Rollback

`backup/live-2026-10-08` and `main` both point at `d4fac282886e153d1614d229775c98ed0991c95b`. To restore production, re-run the existing “Deploy to GitHub Pages” workflow (`workflow_dispatch`) on `backup/live-2026-10-08`. Do not do that as part of this draft.
