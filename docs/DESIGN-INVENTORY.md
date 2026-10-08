# ASTRA design inventory

Taken from production `d4fac28` (`main`, the commit GitHub Pages is serving). Values are copied from the files named here. Measured rows are from headless Chrome on the local build that matched the live bytes, with reduced motion, on 8 October 2026. Nothing in this table is a proposed new value.

Screenshots of that build, one viewport per section after scrolling, are in the run artifacts: `screenshots/live/{1920x1080,1440x900,1024x768,768x1024,390x844,375x812,320x720}/`. Each folder has `top`, `pipeline`, `agents`, `gate`, `command`, `principles`, `rollout`, `contact`, and `footer`. They are separate viewport shots, not a stitch with the fixed header repeated.

## Stack and hosting

| Item | Value | Source |
| --- | --- | --- |
| App | One Vite + React + TypeScript page. No router. | `src/App.tsx`, `package.json` |
| React / Vite / TypeScript | React 19, Vite 8, TypeScript 6, Node 22 | `package.json`, both workflows |
| Scene | Three.js, React Three Fiber, Drei, postprocessing | `package.json` |
| Motion | GSAP, ScrollTrigger, Lenis, Framer Motion | `package.json`, `SmoothScroll.tsx` |
| Fonts | Archivo Variable (width axis), JetBrains Mono Variable | `src/main.tsx` |
| Host | GitHub Pages from `.github/workflows/deploy.yml` on every push to `main` | workflow file |
| Domain | `public/CNAME` is `astragrp.net`. `base` is `'/'` | `public/CNAME`, `vite.config.ts` |
| Fallback | `dist/404.html` is a copy of `index.html` | `scripts/copy-spa-fallback.mjs` |
| Env vars | None | no `.env`, no `import.meta.env` |

## Section map

Order in `src/App.tsx`. Hero is outside `.content`. Pipeline through Rollout are inside `.content` (opaque `--void` ground). Contact is after `.content` and contains the footer.

| Order | id | Purpose, from the section’s own heading |
| --- | --- | --- |
| 1 | `#top` | Hero. “Survive first. Trade second.” Status pill “Default state NO TRADE”. |
| 2 | `#pipeline` | “From market to order, every step on the record.” Eleven nodes. |
| 3 | `#agents` | “A trading desk of agents. None of them holds the keys alone.” Seven cards. |
| 4 | `#gate` | “Try the gate.” Interactive `canTrade()` example. |
| 5 | `#command` | “Every account, every switch, one screen.” Labelled example data. |
| 6 | `#principles` | “Account survival comes before every opportunity.” Then “What ASTRA will never do”. |
| 7 | `#rollout` | “Paper first. Live last.” |
| 8 | `#contact` | “Let’s protect your next account.” Email, copy button, sessions, disclaimer, footer. |

Primary nav (`Navigation.tsx`): Pipeline, Agents, The gate, Command, and “Request access” (`#contact`). The menu adds Principles and Access (`#contact`) plus the mail link. Desktop nav is `display: none` at `max-width: 860px`.

## Component inventory

| Piece | File | Reuse |
| --- | --- | --- |
| Header | `src/components/Navigation/` | Fixed bar, logo, pill, access button, menu button |
| Menu | `src/components/MenuOverlay/` | Full-screen link list |
| Chapter HUD | `src/components/ChapterHud/` | Hero chapter index and right-edge meter. Opacity 0 until the hero is active |
| Preloader | `src/components/Preloader/` | z-index 120 curtain |
| Smooth scroll | `src/components/SmoothScroll/` | Lenis, off when reduced motion is on |
| Cursor | `src/components/Cursor/` | Only for fine pointers. `html.has-cursor` sets `cursor: none` |
| Magnetic | `src/components/Magnetic/` | Pulls the hero primary, the menu button, and the contact circle |
| Logo | `src/components/Navigation/Logo.tsx` | Mark plus wordmark |
| Market sessions | `src/components/LocalTime/MarketSessions.tsx` | Menu and footer |
| Split lines | `src/components/SplitLines/` | Hero and contact headlines |
| Hero scene | `src/scenes/HeroScene/` | Fixed WebGL canvas, lazy chunk |
| Hero fallback | `src/sections/Hero/HeroFallback.tsx` | When WebGL is unavailable |
| Sections | `src/sections/*/` | The eight regions above |

There is no shared Button component. Buttons and links are the classes below.

## Tokens

Defined on `:root` in `src/styles/global.css`.

| Element | Existing value | Source | Reuse |
| --- | --- | --- | --- |
| Page ground | `--void: #0b0c0f`, `--void-2: #0f1115` | `global.css` | Reuse for every new surface |
| Solid panel | `--panel-solid: #14161b`, `--panel-2: #1a1d23` | `global.css` | Reuse |
| Glass panel fill | `--panel: rgba(22, 24, 30, 0.72)` | `global.css` | Reuse via `.panel` |
| Hairline | `--line: rgba(232, 226, 216, 0.08)` | `global.css` | Reuse |
| Strong hairline | `--line-strong: rgba(232, 226, 216, 0.16)` | `global.css` | Reuse |
| Bone type | `--bone: #e8e2d8` | `global.css` | Body colour |
| Muted / faint | `--mute: rgba(232, 226, 216, 0.62)`, `--faint: rgba(232, 226, 216, 0.4)` | `global.css` | Secondary copy |
| Ember (rules, risk) | `--ember: #ff6b2c`, `--ember-soft: rgba(255, 107, 44, 0.14)` | `global.css` | Reuse. Do not invent a second orange |
| Lilac (AI, advisory) | `--lilac: #b4a6ff`, `--lilac-soft: rgba(180, 166, 255, 0.14)` | `global.css` | Reuse |
| Pass / mint | `--pass: #8fd9b0`, `--pass-soft: rgba(143, 217, 176, 0.14)` | `global.css` | Reuse |
| Record | `--record: #9db8d6` | `global.css` | Reuse |
| Caution | `--caution: #ffc48a` | `global.css` | Reuse |
| Authority tint | `[data-kind]` sets `--k` to bone, lilac, ember, pass, or record | `global.css` | Reuse on anything that has a kind |
| Sans | `--font`: Archivo Variable, then system UI | `global.css` | Reuse |
| Mono | `--mono`: JetBrains Mono Variable | `global.css` | Labels, tags, meta |
| Display size | `--fs-display: clamp(2.9rem, 6.4vw, 7.6rem)` | `global.css` | Hero headline |
| H1 | `--fs-h1: clamp(2.5rem, 5.2vw, 6.2rem)` | `global.css` | Gate title, principles statement |
| H2 | `--fs-h2: clamp(2rem, 3.8vw, 4.4rem)` | `global.css` | `.section-title` |
| H3 | `--fs-h3: clamp(1.35rem, 2vw, 2.1rem)` | `global.css` | Subheads |
| Lead | `--fs-lead: clamp(1.08rem, 0.98rem + 0.4vw, 1.4rem)` | `global.css` | Intros that are not `.section-intro` |
| Body | `--fs-body: clamp(0.96rem, 0.93rem + 0.15vw, 1.06rem)`, line-height 1.55 | `global.css` | Default |
| Small / micro | `--fs-small: 0.8125rem`, `--fs-micro: 0.6875rem` | `global.css` | Meta and `.tag` |
| Display class | stretch 118%, weight 480, tracking −0.035em, line-height 0.95 | `.display` in `global.css` | Every section title |
| Page gutter | `--pad-x: clamp(18px, 3.4vw, 60px)` | `global.css` | Section padding and header padding |
| Column gap | `--gutter: clamp(14px, 1.6vw, 26px)` | `global.css` | 12-column heads and grids |
| Section padding-block | `--section-y: clamp(100px, 13vw, 210px)` | `global.css` | `.section` |
| Radius | `--radius: 14px`, `--radius-lg: clamp(16px, 1.6vw, 24px)` | `global.css` | Cards and large frames |
| Easing | `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`, `--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1)`, `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` | `global.css` | Reuse. Do not add a new curve |
| Selection | background `--ember`, colour `--void` | `global.css` | Already global |
| Focus | 2px `--ember`, offset 3px, radius 4px | `:focus-visible` | Already global |
| Max width | No container max-width. The page is full bleed. | `.section` has only padding | A new section stays full bleed. Text can use `max-width: 40ch` like `.section-intro` |
| Theme colour | `#0B0C0F` | `index.html` | Already set |

Measured `.section-title` (the clamp, not a new size): 70.4px at 1920, 54.72px at 1440, 38.912px at 1024, 32px from 768 down. That matches `clamp(2rem, 3.8vw, 4.4rem)`.

## Section chrome

| Element | Existing value | Source | Reuse |
| --- | --- | --- | --- |
| `.section` | `padding: var(--section-y) var(--pad-x)` | `global.css` | Every new block uses this class |
| `.section-head` | 12 columns, `column-gap: var(--gutter)`, `row-gap: 22px`, `margin-bottom: clamp(44px, 5.5vw, 88px)`, `align-items: end` | `global.css` | Reuse |
| Head tag | `.tag` spans all 12 columns | `global.css` | Reuse |
| `.section-title` | columns 1–8, `font-size: var(--fs-h2)` | `global.css` | Reuse with `.display` |
| `.section-intro` | columns 8–12, `max-width: 40ch`, colour `--mute` | `global.css` | Reuse |
| Stacked head | title and intro go full width at `max-width: 1023px` | `global.css` | Already happens |
| `.tag` | inline-flex, gap 8px, mono, `--fs-micro`, tracking 0.02em, colour `--mute`, 6px round dot in `::before` | `global.css` | The only label. Tones: `data-tone` ember, lilac, pass |
| `.panel` | background `--panel`, 1px `--line`, radius `--radius`, inset highlight `0 1px 0 rgba(255,255,255,0.04)`, shadow `0 30px 80px -40px rgba(0,0,0,0.8)`, blur 14px | `global.css` | Agents cards, pipeline board, command window |
| `.brackets` | 14px corner ticks, 1px `--line-strong` | `global.css` | Pipeline and command |
| Content ground | `.content` background `--void`, plus two faint radial washes (lilac 0.05, ember 0.035) | `global.css` | New sections inside `.content` inherit this |
| Grain | fixed, z-index 90, opacity 0.045, SVG turbulence, 0.9s steps(4). Animation off under reduced motion | `global.css` | Already global. Do not add another overlay |

Gate and Rollout repeat the 12-column head in their own CSS instead of the `.section-head` class, with the same column split. Gate’s title uses `--fs-h1`. Rollout’s head margin is `clamp(56px, 7vw, 110px)`.

## Buttons and links

| Control | Where it actually is | Existing value | Source | Reuse |
| --- | --- | --- | --- | --- |
| “Try the gate” | Hero `.ctas`, the primary pill. `href="#gate"`. It is not a control inside the Pipeline or Gate forms. The Gate `<h2>` repeats the words “Try the gate.” | height 52px, padding `0 26px`, radius 999px, background `--bone`, colour `--void`, weight 600, size 0.9375rem, tracking −0.01em. Hover: background `--ember`, shadow `0 10px 40px -10px rgba(255, 107, 44, 0.7)`. Under 767px: height 46px, padding `0 20px` | `Hero.module.css` `.primary` | The only filled pill in the hero. A new hero action should not become a second one of these |
| “See the pipeline” | Hero `.ctas`, text link, `href="#pipeline"`. Not a button in the Pipeline section | size 0.9375rem, colour `--bone`, 1px underline via `background-image`, `padding-bottom: 2px`. Hover collapses the underline | `Hero.module.css` `.secondary` | The text-link pattern |
| “Click for demo” | Same hero row, same `.secondary` class. `href` is `SITE.demoUrl` in `src/lib/content.ts`, `target="_blank"` | same as “See the pipeline” | `Hero.tsx`, `Hero.module.css` | Same pattern. The current URL is a Claude artifact. See `docs/RESOURCE-CHECKS.md` |
| “Request access” | Header, `href="#contact"` | height 40px, padding `0 18px`, radius 999px, background `--bone`, colour `--void`, weight 600, size 0.8125rem. Hover ember plus `0 8px 30px -10px rgba(255, 107, 44, 0.8)`. At `max-width: 420px`: height 38px, padding `0 14px` | `Navigation.module.css` `.access` | Header pill. Do not restyle it for a new section |
| “Request access” | Contact circle, `mailto:` | width `clamp(140px, 13vw, 184px)`, `aspect-ratio: 1`, radius 50%, background `--ember`, colour `--void`, shadow `0 20px 60px -20px rgba(255, 107, 44, 0.7)`. Hover scales to 1.06 and a bone fill rises | `Contact.module.css` `.cta` | The contact action only |
| Copy address | Contact | padding `6px 12px`, radius 999px, 1px `--line-strong`, `--fs-small`, colour `--mute` | `Contact.module.css` `.copy` | Small ghost pill |
| Menu button | Header | 42×42 circle, fill `rgba(20, 22, 27, 0.66)`, 1px `--line-strong`, blur 16px | `Navigation.module.css` `.menuBtn` | Already global |
| Nav pill links | Header, hidden under 860px | padding `7px 14px 8px`, radius 999px, size 0.8125rem, weight 500, colour `--mute`. Hover plate is `--bone`. Active dot is 3px `--ember` | `Navigation.module.css` | Leave the four labels. New chapters go in the menu, not this pill |
| Default link | global | `color: inherit; text-decoration: none` | `global.css` | Underlines are opt-in via the background-image pattern |

Measured hero “Try the gate” box: 130×52 at 1440 and 1920, 118×46 at 768 and below. Header “Request access”: 40px tall at 1024 and up, 38px at 390 and 320. Menu button: 42px at every measured width. Desktop pill links: 35.1px tall at 1024 and up, and 0×0 below 860px because the nav is `display: none`.

## Cards

| Pattern | Existing value | Source | Reuse |
| --- | --- | --- | --- |
| Agent card | `.panel` plus a 12-column span (`--span`), visual on top (`minmax(190px, 1fr)`), text below with a `.tag`. Hover lifts 3px and tints the border with `--k`. One column under 680px, half width under 1023px | `Agents.module.css` | The roster card |
| Pipeline board | `.panel.brackets`, toolbar, then a 1000×560 canvas (`aspect-ratio`) | `Pipeline.module.css` | Diagrams |
| Command window | `.panel.brackets`, a bar (“astra / command”, “paper mode”, “example data”), then accounts, meters, switches | `Command.module.css` | Fake product UI. A real screenshot should not wear this chrome |
| Principles list | no card. An X mark and a row, hairline between items | `Principles.module.css` | A list of refusals or facts |
| Rollout | a line of stages, 11px ring, index in mono, badge `padding: 5px 10px`, radius 999px | `Rollout.module.css` | A sequence |
| Gate controls | segmented pills inside a 999px track, `box-shadow: inset 0 0 0 1px var(--line-strong)` | `Gate.module.css` | Only for the live `canTrade()` toy |

## Motion

| Pattern | Existing value | Source | Reuse |
| --- | --- | --- | --- |
| Lenis | lerp 0.085, wheel 0.95, touch 1.4. Not created when reduced motion is on | `SmoothScroll.tsx` | Already wraps the app |
| Anchor scroll | `scrollToTarget`: Lenis 1.8s, ease `1 - (1 - t) ** 4`. Otherwise `scrollIntoView` / `scrollTo`. No offset argument | `SmoothScroll.tsx` | Reuse for any new anchor |
| Scroll margin | `0px` on the first content section, measured | computed style | There is no header offset today. A new section should use the same behaviour |
| Header hide-on-scroll | none. `data-scrolled` only fades in a top gradient after `scrollY > 40` | `Navigation.tsx` | Do not hide the bar |
| Hero | GSAP scrub through four text states. Height `560svh`, `500svh` under 767px or a portrait aspect | `Hero.tsx`, `Hero.module.css` | Do not add another pinned scene for a film |
| Preloader | minimum 1500ms, or 300ms when reduced. Safety timer 9000ms | `Preloader.tsx` | Already global |
| Nav hover | Framer spring, stiffness 420, damping 34 | `Navigation.tsx` | Already there |
| Reduced motion | `prefersReducedMotion()` or `?reduced`. Skips Lenis, hero blur, line-rise, grain, and the section scrub animations that check `store.reducedMotion` | `src/lib/device.ts`, `src/main.tsx` | A film must not autoplay |

## Breakpoints in production CSS

| Query | What changes |
| --- | --- |
| `max-width: 1100px` | Hero copy width; agent log hidden. Command body becomes two columns |
| `max-width: 1023px` | Section title and intro stack. “in development” badge hidden. Agent cards span 6. Principles, rollout, and contact reflow |
| `max-width: 860px` | Header becomes two columns. Desktop pill hidden. Pipeline canvas padding tightens |
| `max-width: 767px` and portrait `max-aspect-ratio: 9/10` | Hero copy moves to the top. Primary pill is 46px. Chapter meter hidden. Contact gradient when WebGL is on |
| `max-width: 760px` | Command stacks to one column |
| `max-width: 680px` | Agent cards full width |
| `max-width: 640px` | Principles list padding |
| `max-width: 420px` | Header access button 38×, padding 14px |
| `(hover: hover) and (pointer: fine)` | Custom cursor |
| `prefers-reduced-motion: reduce` | Grain, beacons, and several section animations stop |

## Header and footer

| Element | Existing value | Source | Reuse |
| --- | --- | --- | --- |
| Header | `position: fixed`, z-index 100, three columns `1fr auto 1fr`, padding `clamp(14px, 1.8vw, 22px) var(--pad-x)`, `pointer-events: none` on the bar and `auto` on the children | `Navigation.module.css` | Already global |
| Header height, measured | 89.1px at 1920 and 1440, 82px at 1024, 70px at 768, 390, 375, and 320 | this run | Not a token. Do not hard-code one height |
| Wordmark | 1.0625rem, stretch 125%, weight 620, tracking 0.02em, gap 9px from the mark | `Navigation.module.css` | Already global |
| “in development” | mono 0.625rem, padding `3px 7px`, 1px `--line`, radius 999px. Hidden under 1023px | `Navigation.module.css` | Already global |
| Footer | Inside `#contact`, not its own section. `margin-top: clamp(80px, 10vw, 140px)`, grid `auto minmax(0, 48ch) auto`, gap 28px, `padding-top: 20px`, 1px `--line`, `--fs-small`. Columns: sessions, disclaimer, “© 2026 ASTRA” and “Back to top” | `Contact.module.css` `.footer` | Leave it as the last thing on the page |
| Z-index | canvas 0, main and gate labels 1, chapter HUD 60, grain 90, menu 95, header 100, `#boot` 119, preloader 120, skip link 200 | the CSS files named above | Do not insert a new layer between the header and the preloader |

## Checks

| Check | Result |
| --- | --- |
| Token values copied from `global.css` and the module files named above | PASS |
| Section order taken from `App.tsx` | PASS |
| Viewport shots at 1920×1080, 1440×900, 1024×768, 768×1024, 390×844, 375×812, 320×720, including a footer frame | PASS, headless Chrome, reduced motion, scrolled before capture |
| Physical phone, Safari, Firefox | UNVERIFIED |
| A stitched full-page image | NOT APPLICABLE. Not produced |
