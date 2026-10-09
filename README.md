# ASTRA

Public marketing site for **ASTRA**, the Autonomous Strategic Trading & Risk Agent. ASTRA is an independent startup project, not yet formally incorporated. It is AI-assisted trading infrastructure and risk-management software, founded in India in September 2026, bootstrapped and self-funded, and under active development.

The page is a single dark command centre. A scroll-driven WebGL armillary is the centrepiece: nine rings, one per validation gate, around an ember core. Below it sit the pipeline, the agent roster, the interactive gate, a command-centre preview, the principles, the rollout, and the request-access section.

Colour carries meaning: **ember** is deterministic rules and risk, **lilac** is AI (advisory), and **mint** is approved or executing.

The site shows no performance numbers, user counts, or backtest results. The command-centre accounts, decision records, and agent log are illustrative and labelled as such.

## Local development

Requires Node.js 22.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run lint
npm test           # rule-engine unit tests (node:test)
npm run build      # type-check, production build, and SPA fallback → dist/
npm run preview
```

`npm run build` runs `tsc -b` and `vite build`, then copies `dist/index.html` to `dist/404.html` so a refresh or a direct visit to an unknown path still serves the app.

Useful query flags: `?tier=high|mid|low` forces a quality tier, `?reduced` simulates reduced motion, and `?debug` exposes `window.__astra` and `window.__lenis`.

## Contact email

The public address is `founder@astragrp.net`. It lives in one place: `SITE.email` in [`src/lib/content.ts`](src/lib/content.ts). The request-access button, the copy button, and the menu mail link all read that constant.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): checkout, Node 22, `npm ci`, `npm run build`, then the official GitHub Pages upload and deploy actions. The site is published to the custom domain **https://astragrp.net/**. You can also run the workflow by hand with `workflow_dispatch`.

Pull requests run lint and a production build in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

Pages must be set to **GitHub Actions** as the source (Settings → Pages). `public/CNAME` contains `astragrp.net`, so each deploy keeps the apex as the canonical host. `www.astragrp.net` is a CNAME of the apex; GitHub Pages redirects `www` to the apex when the configured custom domain is the apex.

### Squarespace DNS

Leave the existing Google Workspace MX and SPF records in place. Add only the GitHub Pages records:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `udayfulkatwar.github.io` |

After the apex resolves to GitHub Pages, turn on **Enforce HTTPS** in the repository Pages settings. GitHub issues the certificate once DNS is correct.

`public/robots.txt` allows all crawlers and points at `https://astragrp.net/sitemap.xml`, which lists that single URL.

## Structure

```
src/
  components/      Navigation, Cursor, Preloader, SmoothScroll (Lenis + ScrollTrigger),
                   Magnetic, ChapterHud, MenuOverlay, SplitLines, LocalTime/MarketSessions
  scenes/HeroScene WebGL only — HeroCanvas, SceneController, AgentCore (rings, core,
                   radar plate), SignalFlow (GPU streaks + dust), GateLabels, shaders/
  sections/        Hero, Pipeline, Agents, Gate, Command, Principles,
                   Rollout, Contact
  hooks/           usePerformanceTier, useMousePosition, useReducedMotion, useScrollProgress
  lib/
    gate/canTrade.ts   deterministic rule engine behind the gate demo and the
                       command-centre account health (+ unit tests)
    animations.ts      scroll phases, easing, damping
    store.ts           render-free shared state (scroll, pointer, tier)
    content.ts         all copy, section data, and SITE.email
```

There is no client-side router and no analytics.

## How the scene works

- `SceneController` turns scroll progress into three phases (`signals`, `gates`, `lock`), plus layout, camera moves, and the contact outro. The hero text timeline reads the same progress, so words and 3D stay in lockstep.
- `AgentCore` blends each ring between three poses: gyroscope, tunnel, and armillary cage. Positions are lerped and orientations slerped, with a per-ring stagger. Gate labels are plain DOM, projected from the ring positions each frame.
- `SignalFlow` is one `LineSegments` draw call of a few thousand streaks. Each streak's path (orbit, inflow, tunnel with per-gate rejection, AI cloud) is evaluated on the GPU.
- The canvas stops rendering and is hidden whenever opaque content covers it, and resumes for the contact finale.

## Gate demo

`canTrade()` is pure and deterministic. Every input comes from the visitor, every threshold from a rule profile, and every `UNKNOWN` or `STALE` input fails closed. Tests cover fail-closed data, blackout windows, per-trade limits, buffer sizing, health states, kill switch, and invalid input.

## Performance and accessibility

- Three tiers (`lib/three.ts` → `TIERS`) scale streak count, dust, ring and core detail, DPR, and bloom. drei's `PerformanceMonitor` lowers DPR under load.
- The canvas stops rendering while opaque sections cover it, and `three.js` loads in its own chunk after first paint.
- Reduced motion gives native scroll and static states. Without WebGL a CSS-drawn armillary takes the scene's place. Controls are keyboard-operable, and gate decisions are announced to screen readers.
