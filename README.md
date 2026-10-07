# ASTRA — marketing site

Landing site for **ASTRA, the Autonomous Strategic Trading & Risk Agent**: an AI-orchestrated operating system for prop-firm trading where deterministic rules, not models, decide whether a trade happens.

The page is a dark "command centre". A scroll-driven WebGL armillary sphere is the centrepiece: nine engraved rings (one per validation gate) around an ember core. The rings pull apart into a tunnel that market signals fly through and get rejected by, then lock into a cage with the lilac AI cloud held outside it. Below it sit a live workflow canvas, an agent roster, the interactive `canTrade()` gate, a command-centre preview with working kill switches, the never-list and the paper → live rollout.

Colour carries meaning everywhere: **ember = deterministic rules and risk**, **lilac = AI (advisory)**, **mint = approved / executing**.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # rule-engine unit tests (node:test)
npm run build      # type-check + production build → dist/
npm run preview
```

Useful query flags: `?tier=high|mid|low` forces a quality tier, `?reduced` simulates reduced motion, and `?debug` exposes `window.__astra` and `window.__lenis` for automated checks.

## Before launch

- The public inbox is `udayfulkatwar@astragrp.net`, set in `src/lib/content.ts` → `SITE.email`.
- Review all copy against ASTRA's no-fabrication rule. The site deliberately shows **no performance numbers, user counts or backtest results**. Keep it that way until real, verified figures exist.
- The command-centre accounts, decision records and agent log are illustrative and labelled as such on the page. Swap in real data only once ASTRA produces it.

## Structure

```
src/
  components/      Navigation, Cursor, Preloader, SmoothScroll (Lenis + ScrollTrigger),
                   Magnetic, ChapterHud, MenuOverlay, SplitLines, LocalTime/MarketSessions
  scenes/HeroScene WebGL only — HeroCanvas, SceneController, AgentCore (rings, core,
                   radar plate), SignalFlow (GPU streaks + dust), GateLabels, shaders/
  sections/        Hero (+ AgentLog), Pipeline, Agents, Gate, Command, Principles,
                   Rollout, Contact
  hooks/           usePerformanceTier, useMousePosition, useReducedMotion, useScrollProgress
  lib/
    gate/canTrade.ts   deterministic rule engine behind the gate demo and the
                       command-centre account health (+ unit tests)
    animations.ts      scroll phases, easing, damping
    store.ts           render-free shared state (scroll, pointer, tier)
    content.ts         all copy and section data
```

## How the scene works

- `SceneController` turns scroll progress into three phases (`signals`, `gates`, `lock`), plus layout, camera moves and the contact outro. The hero text timeline reads the same progress, so words and 3D stay in lockstep.
- `AgentCore` blends each ring between three poses: gyroscope → tunnel → armillary cage. Positions are lerped and orientations slerped, with a per-ring stagger. Gate labels are plain DOM, projected from the ring positions each frame.
- `SignalFlow` is one `LineSegments` draw call of a few thousand streaks. Each streak's path (orbit, inflow, tunnel with per-gate rejection, AI cloud) is evaluated entirely on the GPU.
- The canvas stops rendering and is hidden whenever opaque content covers it, and resumes for the contact finale.

## Gate demo

`canTrade()` is pure and deterministic. Every input comes from the visitor, every threshold from a rule profile, and every `UNKNOWN`/`STALE` input fails closed. Tests cover fail-closed data, blackout windows, per-trade limits, buffer sizing, health states, kill switch and invalid input.

## Performance and accessibility

- Three tiers (`lib/three.ts → TIERS`) scale streak count, dust, ring and core detail, DPR and bloom. drei's `PerformanceMonitor` lowers DPR under load.
- The canvas stops rendering while opaque sections cover it, and `three.js` loads in its own chunk after first paint.
- Reduced motion gives native scroll and static states. Without WebGL a CSS-drawn armillary takes the scene's place. All controls are keyboard-operable and gate decisions are announced to screen readers.
