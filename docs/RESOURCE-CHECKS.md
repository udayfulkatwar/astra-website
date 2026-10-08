# Resource checks — 8 October 2026

No feature was built. The film file was added unchanged. No demo was deployed.

## R1 — Launch film

The attached archive contained one file, `ASTRA-launch-film-1080p.mp4`.

| Check | Result |
| --- | --- |
| sha256 `00570b56f8f3151bb281508d207ba97be04577870250b89b18c4db3b772889cd` | PASS, before and after the copy into this branch |
| Size 22,187,489 bytes | PASS |
| 1920×1080, H.264, AAC, 30 fps | PASS (`ffprobe`) |
| Duration 81.003 seconds, 2,430 frames | PASS |
| Under GitHub’s 100 MB limit | PASS |
| File bytes unchanged | PASS (`cmp` against the extracted archive member) |
| `moov` atom at the front | PASS. Atoms are `ftyp` at 0, `moov` at 32 (89,916 bytes), then `mdat`. A player can read the index without scanning the whole file |
| Poster WebP | PASS. Frame at 48.0 seconds (the ASTRA wordmark card, no burned caption). 1920×1080, libwebp quality 82, 61,808 bytes. Path: `public/media/film/astra-launch-film-poster.webp` |
| Smaller derivative committed | NOT APPLICABLE. Not created |

Container metadata says “Made with Remotion 4.0.532”. That is in the file. It was not added here.

A temporary 1280×720 re-encode (H.264 CRF 28, `veryfast`, AAC 96 kbps) was 3,811,826 bytes, about 17% of the master. That is a meaningful saving for a phone. The probe is a low-quality size check, not a recommended encode, and it was not added to the repo. The master is already about 2.19 Mbps, and most of that is the picture (video ~1,928 kb/s, audio ~253 kb/s). A smaller derivative would help mobile. It should wait for an approved encode.

Byte range:

| Check | Result |
| --- | --- |
| GitHub Pages range on a live asset | PASS. `Range: bytes=0-99` against `https://astragrp.net/assets/index-5Ehd9tgT.js` returned HTTP 206, `content-range: bytes 0-99/400206`, `accept-ranges: bytes` |
| This MP4 on GitHub Pages | UNVERIFIED. It is not deployed. This branch must not be merged to `main` for a test |
| Range against the file itself | PASS. A small Node server returned HTTP 206 for `bytes=0-15` (`ftyp`/`isom` header) and for `bytes=1000000-1000015`, each with `Content-Length: 16` and the full size 22,187,489 |
| Python `http.server` on this VM | FAIL as a range preview. It answered `Range` with HTTP 200 and the entire 22,187,489 bytes. That is the preview tool, not the file |

Paths on this branch:

- `public/media/film/astra-launch-film-1080p.mp4`
- `public/media/film/astra-launch-film-poster.webp`

## R2 — Dashboard demo destination

**DEMO DESTINATION BLOCKED.** No genuine deployed dashboard URL was found. Nothing was guessed.

Evidence from a read-only clone of https://github.com/udayfulkatwar/Astra (default branch `claude/astra-master-instructions-kdahkc`, shallow):

| Place searched | What is there |
| --- | --- |
| `README.md`, `docs/DEPLOYMENT.md` | Local URLs only: dashboard `http://localhost:5173` (dev) and `http://localhost:3000` (Docker). Cloud example is the placeholder `astra.example.com` in a sample Caddyfile. |
| `apps/dashboard`, `infra/`, `.github/workflows/` | No Vercel, Netlify, Cloudflare, or GitHub Pages config. CI is format, lint, typecheck, test, and `pnpm build`. It does not deploy. |
| GitHub repo metadata | `homepage` is null. `GET /repos/udayfulkatwar/Astra/pages` returns 404, so Pages is not enabled on that repo. |
| Website `SITE.demoUrl` | `https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr` in `src/lib/content.ts`. That is the current “Click for demo” target. It is a Claude artifact, not the ASTRA app. It must not be the “Explore the Live Demo” destination. |

### What `build:demo` is

`apps/dashboard/package.json`:

`vite build --mode demo --outDir dist-demo && node scripts/inline-demo.mjs`

From `apps/dashboard/vite.config.ts`, `src/demo/runtime.ts`, `src/demo/config.ts`, `src/api/client.ts`, and `src/App.tsx`:

- It is a static build of the real dashboard. `__ASTRA_DEMO__` is true only in that mode.
- API calls are answered in the browser by the demo runtime. The runtime wires the real engines (gate, risk, prop-firm, paper broker, kill switches) to simulated prices, a simulated clock, a simulated calendar, and `SimulatedAiProvider`.
- Login is skipped. The operator token is not baked in. Normal builds keep the token in `sessionStorage` and call `/api`.
- `base` is `'./'` in demo mode and `'/'` otherwise, so the demo’s asset URLs are relative.
- The demo uses `createMemoryRouter`. The address bar does not change. There is no `/approvals` URL inside the demo.
- `scripts/inline-demo.mjs` writes `dist-demo/astra-demo.html`: a fragment (title, inlined CSS, `#root`, inlined script), not a full document. Vite also emits a normal `index.html` before that step.
- Config is bundled with `import.meta.glob` of `config/**/*.yaml`. The repo’s own `config/README.md` says those files are templates and that secrets are rejected. `config/accounts/paper-demo.yaml` says “No real money, no credentials.”
- No `import.meta.env` secret was found in the dashboard source. The AI page mentions the variable name `ANTHROPIC_API_KEY` as something that lives on the server, not in the bundle.

Output size of `dist-demo` was not measured. `build:demo` was not run.

Security concern if that build were later published on the marketing site: `config/strategies/lsfvg-a.yaml` and `lsfvg-b.yaml` are in the glob. The file header calls `lsfvg-a` the owner’s strategy (`ownership: USER`) and records the owner’s risk numbers. A public demo bundle would contain those parameters. The Yahoo chart and stream hostnames also exist in `packages/market-data`. Whether the demo chunk actually includes that code was not checked, because the bundle was not built.

Serving it under `/demo/` would mean: run `build:demo` in the product repo, review the bundle for the strategy YAML and for any endpoint or secret, then place the static demo files on this site with the existing relative `base`. It does not need the API, Postgres, or tokens to boot. It is not a deployed destination today. Do not point a button at it until that review is done and the founder approves a publish.

## Where the founder’s labels actually are

| Words | Where they are | Where they are not |
| --- | --- | --- |
| “Try the gate” | Hero primary pill, links to `#gate`. Also the Gate section’s `<h2>` | Not a button inside the Pipeline section, and not one of the Gate form controls |
| “See the pipeline” | Hero text link, links to `#pipeline` | Not a control in the Pipeline section. Pipeline’s buttons are the eleven stage names |
| “Click for demo” | Third hero text link, same style, external `SITE.demoUrl` | Nowhere else |
| “Request access” | Header pill to `#contact`, and the contact section’s ember circle (`mailto:`) | Not inside Gate, Pipeline, or Command |
| Gate / Pipeline / Command as nav | Header pill: Pipeline, Agents, The gate, Command. Menu adds Principles and Access | Command’s sentence “Try them” is prose about the kill-switch examples, not a link |

## Recommended placement

Do not build these in this run. When they are built, use only the patterns in `docs/DESIGN-INVENTORY.md`.

**“Watch the video”.** Make it a hero text link, the same `.secondary` treatment as “See the pipeline”, `href="#astra-film"`. Leave “Try the gate” as the only hero pill. Keep it out of the desktop nav pill. The menu can list it beside Principles, in the existing big-type list. At 320 the hero row already wraps (`flex-wrap` on `.ctas`), so a fourth control will sit on a second line rather than needing a new layout.

**`#astra-film` before the footer.** The footer is not its own section. It is the bottom of `#contact`. Put the new section after `#rollout` and before `#contact`, inside `.content`, so it sits on the same ground as the other chapters and the contact finale stays last.

Use `<section id="astra-film" class="section">`, then `.section-head` with a `.tag`, an `<h2 class="display section-title">`, and a `.section-intro`. The film itself is a `<video>` with the poster, `controls`, `playsInline`, and `preload="metadata"`. Do not autoplay: the file has audio, and reduced motion already disables the site’s decorative motion. Frame it with the existing edge: `width: 100%`, `border: 1px solid var(--line-strong)`, `border-radius: var(--radius-lg)`, `background: var(--panel-solid)`. Do not put it inside the command window’s fake chrome. Scroll behaviour stays `scrollToTarget` with no offset, which is what every current anchor does. The fixed header is 70–89px depending on width and will cover the top of the section the same way it covers Pipeline.

“Explore the Live Demo” has nowhere honest to go until R2 is unblocked. Do not retarget “Click for demo” at the Claude artifact under a new label, and do not point it at a screenshot.
