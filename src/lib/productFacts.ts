/** Public labels. "Verified" is intentionally absent: this page does not claim a live deployment. */
export type ProductStatus = 'Implemented' | 'Simulated' | 'Planned'

export interface Capability {
  name: string
  status: ProductStatus
  text: string
}

export interface ProductShot {
  src: string
  width: number
  height: number
  alt: string
  caption: string
}

export const PRODUCT_INTRO =
  'The trading software is separate from this page. This is what its source contains.'

export const PRODUCT_BODY =
  'The operator dashboard, the risk engine, the prop-firm rule check, the decision gate, kill switches, the trade journal, and a hash-chained audit log are implemented. Paper trading runs on simulated prices. Live trading is not enabled.'

export const PRODUCT_GATE =
  'The interactive gate on this page is a simplified model. The product gate is a separate deterministic check: 22 checks across 11 layers. An AI note can veto a trade. It cannot approve one, and it cannot set the size.'

export const CAPABILITIES: Capability[] = [
  {
    name: 'Operator dashboard',
    status: 'Implemented',
    text: 'A command centre for approvals, accounts, risk controls, the journal, and the audit log.',
  },
  {
    name: 'Risk engine',
    status: 'Implemented',
    text: 'Position size, loss limits, and account health are computed by deterministic rules.',
  },
  {
    name: 'Decision gate',
    status: 'Implemented',
    text: 'Twenty-two checks in eleven layers. A trade is allowed only when every required check passes.',
  },
  {
    name: 'Kill switches',
    status: 'Implemented',
    text: 'Seven scopes: global, account, strategy, instrument, execution, AI, and news.',
  },
  {
    name: 'Journal and audit log',
    status: 'Implemented',
    text: 'Decisions are recorded with their inputs. The audit log is append-only and hash-chained.',
  },
  {
    name: 'Paper trading',
    status: 'Simulated',
    text: 'The running path uses simulated prices and a paper broker. It does not send live orders.',
  },
  {
    name: 'Live trading',
    status: 'Planned',
    text: 'Not enabled. It stays off until the founder authorises it and a live broker adapter exists.',
  },
  {
    name: 'Claude adapter',
    status: 'Implemented',
    text: 'The source includes an adapter. It is not used for live decisions. In the simulated demo, fixed rules stand in for a model.',
  },
]

/** Frames from the product's in-browser demo. Every one keeps that demo's own banner. */
export const PRODUCT_SHOTS: ProductShot[] = [
  {
    src: '/media/product/overview.webp',
    width: 1440,
    height: 900,
    alt: 'Simulated demo of the ASTRA command center. The banner says DEMO, simulated prices, no broker and no real money.',
    caption: 'Command center. Simulated prices, running in the browser.',
  },
  {
    src: '/media/product/approvals.webp',
    width: 1440,
    height: 900,
    alt: 'Simulated demo of the Trade Approval Center. The banner says DEMO, simulated prices, no broker and no real money.',
    caption: 'Trade Approval Center in the same simulated demo.',
  },
  {
    src: '/media/product/risk.webp',
    width: 1440,
    height: 900,
    alt: 'Simulated demo of Risk Controls. The banner says DEMO, simulated prices, no broker and no real money.',
    caption: 'Risk controls in the same simulated demo.',
  },
  {
    src: '/media/product/audit.webp',
    width: 1440,
    height: 900,
    alt: 'Simulated demo of the Audit Log. The banner says DEMO, simulated prices, no broker and no real money.',
    caption: 'Audit log in the same simulated demo.',
  },
  {
    src: '/media/product/ai.webp',
    width: 1440,
    height: 900,
    alt: 'Simulated demo of the AI Model Monitor. The banner says DEMO, simulated prices, no broker and no real money.',
    caption: 'AI model monitor in the same simulated demo. This is not a live model call.',
  },
]

export const ENGINEERING_INTRO =
  'Claude Code helps write and test the software. It does not get permission to approve a trade.'

export const ENGINEERING_WRITTEN =
  'Claude (Claude Code) is used to help write and test the software, under the founder’s direction. That is a way of building the software. It is not an Anthropic partnership.'

export const ENGINEERING_DECISIONS =
  'The product source includes a Claude adapter. It is not used for live decisions, and this page does not claim a live connection. AI output is advisory only. The deterministic gate decides: risk, size, prop-firm limits, kill switches, and whether an order may be sent. An advisory note cannot approve a trade or set its size.'

export const FLOW = [
  { name: 'Market, news, calendar', kind: 'data' as const, note: 'Observed inputs. Missing data stays missing.' },
  { name: 'AI analysis', kind: 'ai' as const, note: 'Advisory. It can veto. It cannot approve or set size.' },
  { name: 'Deterministic gate', kind: 'rule' as const, note: 'Risk, prop-firm rules, kill switches, and permission to send an order.' },
  { name: 'Paper broker', kind: 'exec' as const, note: 'Simulated fills. A live broker is not enabled.' },
  { name: 'Journal and audit log', kind: 'record' as const, note: 'What was decided, and why.' },
]

export const COMPANY = [
  { label: 'Founder', text: 'Uday Fulkatwar' },
  { label: 'Company', text: 'ASTRA — Autonomous Strategic Trading & Risk Agent. Founded September 2026. India.' },
  { label: 'What ASTRA is', text: 'AI-powered trading technology and risk-management infrastructure for proprietary trading firm participants and independent traders.' },
  { label: 'Contact', text: 'udayfulkatwar@astragrp.net', href: 'mailto:udayfulkatwar@astragrp.net' },
]
