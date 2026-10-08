/**
 * Statuses a section may show. Verified and Production Validated are in the
 * type so a higher mark is a type error to add by accident, and the test
 * rejects them. Nothing on this page is either.
 */
export type CapabilityStatus =
  | 'Implemented'
  | 'Simulated'
  | 'Under Development'
  | 'Verified'
  | 'Production Validated'

export type StatusTone = 'pass' | 'lilac'

export interface Evidence {
  path: string
  note: string
}

export interface Capability {
  id: string
  name: string
  status: CapabilityStatus
  text: string
  evidence: readonly Evidence[]
}

/** Mint only for Implemented. Lilac for work still underway. Simulated stays mute. */
export function statusTone(status: CapabilityStatus): StatusTone | undefined {
  if (status === 'Implemented') return 'pass'
  if (status === 'Under Development') return 'lilac'
  return undefined
}

export const PRODUCT_TAG = 'product overview'
export const PRODUCT_TITLE = 'Built Around Risk. Designed for Control.'
export const PRODUCT_INTRO =
  'ASTRA brings trading workflows, rule-based risk assessment, account monitoring, and human approval concepts into a unified software architecture.'
export const SHOT_CAPTION = 'Demo build · simulated data'

export interface ProductModule extends Capability {
  image: string
  alt: string
}

export const PRODUCT_MODULES: readonly ProductModule[] = [
  {
    id: 'trading-workspace',
    name: 'Trading Workspace',
    status: 'Implemented',
    text: 'The dashboard source includes an overview, accounts, charts, and a paper-trading screen. The frame below is that overview from the in-browser demo, which runs on simulated prices.',
    image: '/media/product/overview.webp',
    alt: 'Demo build of the ASTRA overview screen. The banner says DEMO and simulated prices.',
    evidence: [
      { path: 'apps/dashboard/src/pages/Overview.tsx', note: 'Overview screen.' },
      { path: 'apps/dashboard/src/pages/Trading.tsx', note: 'Paper trading, strategies, and rules screens.' },
      { path: 'apps/dashboard/src/demo/DemoBanner.tsx', note: 'Demo banner: simulated prices, no broker, no real money.' },
    ],
  },
  {
    id: 'risk-controls',
    name: 'Risk Controls',
    status: 'Implemented',
    text: 'Position size, loss limits, and seven kill-switch scopes are deterministic code, with tests. The frame is the demo’s risk screen on simulated data.',
    image: '/media/product/risk.webp',
    alt: 'Demo build of the ASTRA risk controls screen. The banner says DEMO and simulated prices.',
    evidence: [
      { path: 'packages/risk/src/position-sizing.ts', note: 'Position sizing.' },
      { path: 'packages/safety/src/kill-switch.ts', note: 'Seven scopes: global, account, strategy, instrument, execution, AI, and news.' },
      { path: 'packages/safety/test/kill-switch.test.ts', note: 'Kill-switch tests.' },
    ],
  },
  {
    id: 'execution-workflow',
    name: 'Execution Workflow',
    status: 'Simulated',
    text: 'The dashboard has an approvals screen. The only broker adapter in the repo is the paper broker. Live trading is not enabled.',
    image: '/media/product/approvals.webp',
    alt: 'Demo build of the ASTRA trade approval screen. The banner says DEMO and simulated prices.',
    evidence: [
      { path: 'apps/dashboard/src/pages/Approvals.tsx', note: 'Approvals screen.' },
      { path: 'packages/execution/src/paper/paper-broker.ts', note: 'PaperBrokerAdapter is the only BrokerAdapter implementation.' },
      { path: 'docs/adr/0008-live-trading-authorization.md', note: 'Live orders need a server flag, live mode, and a live adapter. The system does not boot into live.' },
    ],
  },
  {
    id: 'audit-oversight',
    name: 'Audit and Oversight',
    status: 'Implemented',
    text: 'Decisions can be written to a hash-chained audit log, and the dashboard has an audit screen. The frame is that screen in the simulated demo.',
    image: '/media/product/audit.webp',
    alt: 'Demo build of the ASTRA audit log. The banner says DEMO and simulated prices.',
    evidence: [
      { path: 'packages/db/src/repositories/audit.ts', note: 'Append-only log. Each entry hashes the previous hash.' },
      { path: 'apps/dashboard/src/pages/Operations.tsx', note: 'Audit screen.' },
      { path: 'apps/dashboard/src/demo/router.ts', note: 'Demo route that recomputes the chain.' },
    ],
  },
]

export const ENGINEERING_TAG = 'engineering approach'
export const ENGINEERING_TITLE = 'AI-Assisted Development. Deterministic Risk Controls.'
export const ENGINEERING_P1 =
  'ASTRA is developed with the support of Claude Code, which assists with implementation, debugging, test creation, and iterative software development.'
export const ENGINEERING_P2 =
  'Within the product architecture, advisory intelligence is kept separate from rule-based risk enforcement: analysis can inform decisions, but deterministic controls and human authorization govern what may be executed.'
export const ENGINEERING_RULE =
  'AI can support development and analysis. Verified rules and controlled workflows determine what the system is permitted to execute.'
export const ENGINEERING_NOTE = 'ASTRA is an independent project and is not affiliated with or endorsed by Anthropic.'

export const ENGINEERING_LAYERS: readonly Capability[] = [
  {
    id: 'market-data',
    name: 'Market and account data',
    status: 'Implemented',
    text: 'Market data and account records are packages in the repo. The public demo substitutes simulated prices.',
    evidence: [
      { path: 'packages/market-data/src/index.ts', note: 'Market-data package.' },
      { path: 'packages/core/src/domain/account.ts', note: 'Account domain type.' },
      { path: 'apps/dashboard/src/demo/runtime.ts', note: 'The demo wires simulated prices.' },
    ],
  },
  {
    id: 'analysis',
    name: 'Analysis and signals',
    status: 'Implemented',
    text: 'Strategy and market-structure code produce signals. A Claude adapter exists for server-side analysis and is constructed only when an API key is present. The demo uses SimulatedAiProvider and does not call Claude.',
    evidence: [
      { path: 'packages/ai/src/anthropic.ts', note: 'AnthropicProvider. Server-side. Not used by the demo.' },
      { path: 'packages/ai/src/simulated.ts', note: 'SimulatedAiProvider.' },
      { path: 'apps/api/src/main.ts', note: 'The provider is added only when the named env var holds a key.' },
      { path: 'apps/dashboard/src/demo/runtime.ts', note: 'Demo providers map contains only the simulated provider.' },
    ],
  },
  {
    id: 'risk-eval',
    name: 'Deterministic risk evaluation',
    status: 'Implemented',
    text: 'The decision package runs 22 checks across 11 layers. A required check must pass before an order is allowed. Tests cover the engine.',
    evidence: [
      { path: 'packages/decision/src/checks/index.ts', note: 'STANDARD_CHECKS has 22 checks. GATE_LAYERS has 11 names.' },
      { path: 'packages/decision/test/engine.test.ts', note: 'Engine tests.' },
    ],
  },
  {
    id: 'human-auth',
    name: 'Human authorization',
    status: 'Implemented',
    text: 'The dashboard has an approvals screen. Live mode is refused unless the server environment authorizes it. The process does not boot into live trading.',
    evidence: [
      { path: 'apps/dashboard/src/pages/Approvals.tsx', note: 'Approvals screen.' },
      { path: 'apps/api/src/runtime/mode-service.ts', note: 'Effective mode is HALTED until loaded. LIVE is rejected without ASTRA_LIVE_TRADING_AUTHORIZED.' },
      { path: 'docs/adr/0008-live-trading-authorization.md', note: 'Live execution needs several independent authorizations.' },
    ],
  },
  {
    id: 'execution-adapter',
    name: 'Authorized execution adapter',
    status: 'Simulated',
    text: 'The execution gateway submits through a registered adapter. The repo includes a paper adapter. It does not include a live broker adapter. Live trading is not enabled.',
    evidence: [
      { path: 'packages/execution/src/paper/paper-broker.ts', note: 'PaperBrokerAdapter.' },
      { path: 'packages/execution/src/gateway.ts', note: 'Gateway. LIVE still requires liveTradingEnvironmentAuthorized.' },
      { path: 'packages/execution/test/paper-broker.test.ts', note: 'Paper broker tests.' },
    ],
  },
  {
    id: 'audit-monitor',
    name: 'Audit and monitoring',
    status: 'Implemented',
    text: 'The audit log stores each entry with the hash of the one before it. The demo can recompute that chain.',
    evidence: [
      { path: 'packages/db/src/repositories/audit.ts', note: 'Hash-chained append-only log.' },
      { path: 'apps/dashboard/src/demo/router.ts', note: 'Demo audit verify route.' },
    ],
  },
]

export const ALL_CAPABILITIES: readonly Capability[] = [...PRODUCT_MODULES, ...ENGINEERING_LAYERS]
