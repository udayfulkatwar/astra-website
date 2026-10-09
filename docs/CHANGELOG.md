# Change log

## 2026-10-09 — Vivek portrait and menu pointer

- **Branch:** `vivek-photo`, from `main` at `40556e5`. Not merged. Production was not modified. The Deploy workflow was not run.
- **Leadership:** Vivek Chaudhary’s card uses a cropped portrait in the same 424×392 frame as Uday (head and upper torso, the corner sparkle excluded). WebP and AVIF at 212 and 424, plus a JPEG fallback. Alt text is “Vivek Chaudhary, Co-Founder of ASTRA”. The JSON-LD Person node has `image`, the same way Uday’s does.
- **Menu:** While the menu is open the custom disc stays hidden and the native cursor returns: auto on the page, pointer on links and buttons.
- **Deployment approval:** Not requested.

## 2026-10-09 — Menu demo and policy links

- **Branch:** `menu-demo-link`, from `main` at `e883979`. Not merged. Production was not modified. The Deploy workflow was not run.
- **Menu:** “Launch ASTRA Demo” sits at the bottom of the list. It opens `SITE.demoUrl` in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) and does not scroll the page. The menu closes. Privacy, Terms, and Risk sit under the forex list and open in this tab at `/privacy/`, `/terms/`, and `/risk/`. The menu panel does not include Request access. That action stays on the header pill and in the contact section.
- **Deployment approval:** Not requested.

## 2026-10-09 — Navigation, menu scroll, workflow, sessions

- **Branch:** `nav-scroll-redesign`, from `main` at `323d10d`. Not merged. Production was not modified. The Deploy workflow was not run.
- **Menu scroll:** Opening the menu stops Lenis, and a stopped Lenis calls `preventDefault` on wheel and touch unless the event path has `data-lenis-prevent`. The menu list did not have that attribute, so the wheel could not move it. The list now carries `data-lenis-prevent` and scrolls itself only when it is taller than the panel. Closing the menu starts Lenis again and puts the page back where it was. A menu choice writes the section into the address. Back follows that section, or the position saved before the choice. Leaving the film with no previous section still returns to the top.
- **Menu:** The full-screen giant type is a right-hand panel, about 400px wide on desktop and full width below 720px. The list is Overview, Pipeline, AI Agents, Risk Gate, Command Center, Product Demo, and Leadership, with Request access pinned at the bottom. Film, Engineering, Principles, and Rollout stay on the page. Items are 18px with a mono index and one line of description. The cursor disc is hidden while the menu is open.
- **Hero:** The corner log is not rendered. The introduction layout is the one from `323d10d` without that panel.
- **Sessions:** Forex status uses each city's local window (Sydney 07:00–16:00, Tokyo/London/New York 08:00–17:00) and the forex week Sunday 17:00 to Friday 17:00 America/New_York. The visible heading is “forex sessions · approx. · local time”, one line per city. The note that these are not exchange hours, not a live feed, and do not include holidays is the title tooltip. The compact list is in the menu footer and the contact footer.
- **Leadership:** Cards keep `opacity: 1` when reduced motion cancels the entrance, so a reveal cannot leave them invisible.
- **Deployment approval:** Not requested.

## 2026-10-09 — Leadership section

- **Branch:** `leadership-section`, from `main` at `e572b0d`. Not merged. `main` was not pushed. Production was not modified. The Deploy workflow was not run.
- **About:** `#company` keeps its anchor and scroll margin. The section uses the founder-approved leadership copy: eyebrow “THE PEOPLE BEHIND ASTRA”, heading “Building Intelligence. Engineering Trust.”, two cards, and the commitment footer. Uday Fulkatwar’s card uses a cropped portrait (face and upper torso only; resized and compressed to WebP and AVIF at 212 and 424, plus a JPEG fallback). The frame is 212px wide from 1024px and 168px below that, and Vivek Chaudhary’s VC initials use the same frame until a photo is supplied. Leadership principles are labelled and not attributed as personal quotes. The mission sentence stays in copy and is not rendered. Bios are not copied into the noscript blurb or the meta description. JSON-LD Person nodes gain `sameAs` LinkedIn URLs and, for Uday, `image`.
- **Deployment approval:** Not requested.

## 2026-10-09 — First click and menu anchors

- **Branch:** `fix/first-click-scroll`, from `main` at `e572b0d`. Not merged. `main` was not pushed. Production was not modified. The Deploy workflow was not run.
- **First click:** During the loader curtain the nav is already clickable while Lenis is stopped (`html` is `overflow: clip`). `scrollTo` then returns without moving. Those clicks are kept and run after the intro unlocks, measured on a later frame.
- **Menu:** Opening the site menu stops Lenis. A link now unlocks it before scrolling, instead of calling `scrollTo` on a timer while the lock may still be held. Focus return does not scroll the page. The links sit in their final position when the dialog opens, so a click during the short fade hits the row. The fade is 140ms and the close is 80ms, and the closing layer ignores pointer events. The menu button and the dialog sit above the loader, so the menu can open while the intro is still playing. A destination chosen then is kept until the intro unlocks. Closing the menu does not start Lenis before that unlock.
- **Anchor timing:** Lenis anchor jumps scale with distance and stop at 1.15s. The easing and the destination are unchanged. A menu choice starts that jump on the next frame, so the page is already moving when the dialog fades.
- **Unchanged:** Scroll margins are unchanged. Deep links and reduced motion are unchanged.
- **Deployment approval:** Not requested.

## 2026-10-09 — Credibility upgrade

- **Branch:** `credibility-upgrade`, from `main` at `41e21e4`. Not merged. `main` was not pushed. Production was not modified. The Deploy workflow was not run.
- **About:** Founder Uday Fulkatwar and Co-Founder Vivek Chaudhary, stated as project leadership titles, not proof of incorporation, directorship, or share ownership. Independent startup project, not yet formally incorporated. Founded in India in September 2026. Bootstrapped and self-funded. Under active development. Industry line: AI-assisted trading infrastructure and risk-management software.
- **Contact:** The public address is `founder@astragrp.net` (`SITE.email`). The mailto link, the copy button, the menu, the noscript blurb, JSON-LD, and the legal pages use that address.
- **Legal:** Static pages `/privacy/`, `/terms/`, and `/risk/` in `public/`, with footer links and sitemap entries. No client router.
- **SEO:** Softened description. `twitter:card` is `summary_large_image` with `twitter:image`. JSON-LD Organization names ASTRA, the site URL, foundingDate `2026-09`, two founder Person nodes, and the email. No legalName, address, or identifier.
- **Engineering:** “Currently used: Claude Code as a development assistant” is separate from “Planned / not running in the public demo: in-product Claude API adapter (code exists, demo uses a simulated provider)”. The Anthropic non-affiliation sentence stays. The paragraph under the two status cards has the same top gap as the space above the cards (`clamp(22px, 3vw, 36px)`), including at 320, 390, 768, and 1440.
- **Product:** The four existing frames stay in order (overview, risk, approvals, audit) with step marks 01–04. Captions are unchanged. No new images.
- **Film:** “Watch Product Video” at the bottom of `#command` scrolls to `#astra-film`. The film link reads “Launch ASTRA Demo”. The href, target, and rel are unchanged.
- **Accessibility:** `--faint` is `rgba(232, 226, 216, 0.52)` so 11px mono text clears 4.5:1 on `#0b0c0f`. “in development” shows below 860px and is in the logo link’s accessible name. The footer is a contentinfo landmark.
- **Deployment approval:** Not requested.

## 2026-10-08 — Deep links land below the header

- **Branch:** `fix/scroll-anchors`, from `main` at `7d2fde5`. Not merged. `main` was not pushed.
- **Deep links:** A fresh visit to a hash that names a section scrolls there when the loader opens, through Lenis, after fonts have settled. Reduced motion jumps immediately. A visit with no hash still starts at the top.
- **Header offset:** `#product`, `#engineering`, `#company`, `#astra-film` and `#contact` use an 80px scroll-margin below 1024px and 96px from 1024px, so the section top sits just below the fixed header (about 72px on a narrow screen, about 89px at 1440).
- **Nav landings:** `#pipeline`, `#agents`, `#gate`, `#command`, `#principles` and `#rollout` keep no scroll-margin. An offset showed the tail of the previous section under the header. Nav clicks and deep links for those sections land where the nav landed on `main`, with the section top at the viewport top.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Film error line only after a real failure

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Film:** A skipped 720p `<source>` was firing `error` before any MP4 request. The “could not be loaded” line now waits for the video element’s own error, or `NETWORK_NO_SOURCE`. Chrome 148 can play H.264. Before play, only the wordmark poster is fetched. The in-player download link is not in the tab order when the browser can play the film.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Film demo link shown

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Demo:** `SITE.demoPublic` is `true`. Under the film, “Explore the Demo” points at `SITE.demoUrl`, with the line “Explore the ASTRA dashboard and available product workflows.” The label does not say “Live”. The hero still has no “Click for demo”.
- **Destination:** The coordinator opened the URL in a normal Chrome Incognito window, signed out, and saw the ASTRA Command Center dashboard. Headless checks still receive “Page not found”.
- **Deployment approval:** Not requested. Production was not modified.

## 2026-10-08 — Hero demo link removed, private demo hidden

- **Branch:** `astra-v2`. Not merged. `main` was not pushed.
- **Hero:** “Click for demo” is removed. The row is Trade Gate, Meet ASTRA, Watch the video.
- **Demo:** `SITE.demoUrl` is unchanged. `SITE.demoPublic` is `false`, so the film does not render “Explore the Demo” or its supporting line. The private artifact still answers HTTP 200 with Claude’s “Page not found” when logged out.
- **Preview:** CI uploads the `dist/` build as the `astra-preview` artifact. The Pages deploy workflow, `public/CNAME`, `robots.txt`, and `sitemap.xml` were not changed.
- **Tests performed:** `npm test` (19/19), `npm run lint` (exit 0, existing warnings), `npm run build`. Headless Chrome and Firefox 157 at seven widths, full-page shots, hero and footer pairs against https://astragrp.net/, a lab LCP/CLS/TBT comparison with `main`, a `dist/` secret scan, and a rendered-link check. The write-up is `docs/RELEASE-CANDIDATE.md`.
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
