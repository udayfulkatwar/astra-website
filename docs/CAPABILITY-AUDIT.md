# Capability audit — 8 October 2026

Read-only source: https://github.com/udayfulkatwar/Astra at `c54df2d` on `claude/astra-master-instructions-kdahkc`. The page data lives in `src/lib/capabilities.ts`. The test in `src/lib/capabilities.test.ts` refuses any status above the ceiling in this note. Nothing is marked Verified or Production Validated. Live trading is not enabled.

Mint (`.tag[data-tone="pass"]`) is used only for Implemented. Simulated has no tone, so the dot stays the default mute colour.

## Product modules

| Module | Status | Evidence |
| --- | --- | --- |
| Trading Workspace | Implemented | `apps/dashboard/src/pages/Overview.tsx`, `apps/dashboard/src/pages/Trading.tsx` (paper, strategies, rules). `apps/dashboard/src/demo/DemoBanner.tsx` says the demo runs in the browser on simulated prices, with no broker and no real money. |
| Risk Controls | Implemented | `packages/risk/src/position-sizing.ts`. `packages/safety/src/kill-switch.ts` lists seven scopes: GLOBAL, ACCOUNT, STRATEGY, INSTRUMENT, EXECUTION, AI, NEWS. `packages/safety/test/kill-switch.test.ts`. |
| Execution Workflow | Simulated | `apps/dashboard/src/pages/Approvals.tsx`. `packages/execution/src/paper/paper-broker.ts` is the only `BrokerAdapter` implementation found. `docs/adr/0008-live-trading-authorization.md` requires a server flag, live mode, a verified account, and a live adapter before a live order. |
| Audit and Oversight | Implemented | `packages/db/src/repositories/audit.ts` hashes each entry with the previous hash. `apps/dashboard/src/pages/Operations.tsx` exports the audit screen. `apps/dashboard/src/demo/router.ts` serves `/api/v1/audit/verify`. |

The four pictures are the demo frames from the earlier pull request: `public/media/product/overview.webp`, `risk.webp`, `approvals.webp`, `audit.webp`. Each is 1440×900. Each caption is “Demo build · simulated data”.

## Engineering layers

| Layer | Status | Evidence |
| --- | --- | --- |
| Market and account data | Implemented | `packages/market-data/src/index.ts`, `packages/core/src/domain/account.ts`. `apps/dashboard/src/demo/runtime.ts` feeds the demo simulated prices. |
| Analysis and signals | Implemented | `packages/ai/src/anthropic.ts` is a server-side Claude adapter. `apps/api/src/main.ts` constructs it only when the env var named in config is set. `apps/dashboard/src/demo/runtime.ts` registers only `SimulatedAiProvider`. The demo does not call Claude. |
| Deterministic risk evaluation | Implemented | `packages/decision/src/checks/index.ts`: `STANDARD_CHECKS` lists 22 checks. `packages/decision/src/types.ts`: `GATE_LAYERS` lists 11 layers. `packages/decision/test/engine.test.ts`. |
| Human authorization | Implemented | `apps/dashboard/src/pages/Approvals.tsx`. `apps/api/src/runtime/mode-service.ts`: until the mode is loaded the effective mode is HALTED, and LIVE is rejected unless `ASTRA_LIVE_TRADING_AUTHORIZED` is set. |
| Authorized execution adapter | Simulated | `packages/execution/src/paper/paper-broker.ts`, `packages/execution/src/gateway.ts`, `packages/execution/test/paper-broker.test.ts`. No live broker class was found. |
| Audit and monitoring | Implemented | Same audit log and demo verify route as the audit module. |

`STANDARD_CHECKS` entries, counted from the array: system mode, kill switches, component health, quote, account, source kinds, session, spread, entry, eligibility, signal, levels, limits, news, calendar, AI analysis, capital preservation, prop-firm rules, prop-firm config, duplicates, execution readiness, live authorization. That is 22. The layers are SYSTEM, DATA, MARKET, STRATEGY, NEWS, CALENDAR, AI, RISK, PROP_FIRM, POSITION, EXECUTION. That is 11.

## What this page does not claim

No profitability, win rate, live prop-firm execution, partnership, certification, or guarantee. The Claude adapter is not described as a live integration, and the page says ASTRA is not affiliated with or endorsed by Anthropic.
