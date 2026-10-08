/** Site-wide settings. Public contact address. */
export const SITE = {
  name: 'ASTRA',
  expansion: 'Autonomous Strategic Trading & Risk Agent',
  email: 'udayfulkatwar@astragrp.net',
  demoUrl: 'https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr',
}

/* ------------------------------------------------------------- pipeline */

export type Authority = 'data' | 'ai' | 'rule' | 'exec' | 'record'

export const AUTHORITY_LABEL: Record<Authority, string> = {
  data: 'Data',
  ai: 'AI · advisory',
  rule: 'Deterministic',
  exec: 'Execution',
  record: 'Record',
}

export interface PipelineNode {
  id: string
  name: string
  sub: string
  kind: Authority
  /** position on the 1000 × 560 canvas (node centre) */
  x: number
  y: number
  does: string
  onFailure: string
}

export const PIPELINE: PipelineNode[] = [
  { id: 'market', name: 'Market data', sub: 'price · OHLC · spread', kind: 'data', x: 95, y: 90,
    does: 'Normalises the price feed for each instrument and timestamps every tick.', onFailure: 'Stale or missing feed fails the data gate: no new trade.' },
  { id: 'news', name: 'News feed', sub: 'headline · source · time', kind: 'data', x: 95, y: 280,
    does: 'Collects headlines with source and time, tagged by country and asset.', onFailure: 'Unavailable news marks event status UNKNOWN.' },
  { id: 'calendar', name: 'Economic calendar', sub: 'CPI · NFP · FOMC', kind: 'data', x: 95, y: 470,
    does: 'Tracks scheduled releases and their impact, then opens blackout windows around them.', onFailure: 'UNKNOWN EVENT STATUS: the calendar gate fails closed.' },
  { id: 'structure', name: 'Market structure', sub: 'swings · BOS · liquidity', kind: 'rule', x: 315, y: 150,
    does: 'Computes swing points, breaks of structure, liquidity pools and session levels from price.', onFailure: 'Insufficient data returns NO SETUP.' },
  { id: 'ai', name: 'AI analysis', sub: 'impact · sentiment · context', kind: 'ai', x: 315, y: 400,
    does: 'Classifies news impact and sentiment and explains context. Its output is advice, never permission.', onFailure: 'Malformed or late output is discarded and logged.' },
  { id: 'strategy', name: 'Strategy engine', sub: 'your rules · setup state', kind: 'rule', x: 520, y: 280,
    does: 'Runs your configured strategy and moves setups through watch, qualified and invalidated.', onFailure: 'Expired or unconfirmed setups never advance.' },
  { id: 'risk', name: 'Risk engine', sub: 'size · open risk · streaks', kind: 'rule', x: 720, y: 90,
    does: 'Sizes the position from your risk rules and checks open risk, correlation and loss streaks.', onFailure: 'Any breach rejects the trade with a reason.' },
  { id: 'prop', name: 'Prop-firm engine', sub: 'daily loss · drawdown', kind: 'rule', x: 720, y: 280,
    does: 'Applies this account’s profile: daily loss, static or trailing drawdown, contracts, consistency.', onFailure: 'Unverifiable account state means HALTED.' },
  { id: 'gate', name: 'Execution gate', sub: 'duplicates · slippage · switch', kind: 'rule', x: 720, y: 470,
    does: 'Final check before any order: duplicates, spread, slippage limits and every kill switch.', onFailure: 'One failed check and nothing is sent.' },
  { id: 'broker', name: 'Broker adapter', sub: 'paper · shadow · live', kind: 'exec', x: 915, y: 190,
    does: 'Sends the order through the mode you have authorised and confirms fills.', onFailure: 'Rejected or partial fills raise a critical alert.' },
  { id: 'journal', name: 'Journal & review', sub: 'inputs · reasons · outcome', kind: 'record', x: 915, y: 400,
    does: 'Stores every decision with its inputs, model and reasons. AI reviews it after the close.', onFailure: 'Write failures stop new trades until storage recovers.' },
]

export const PIPELINE_EDGES: [string, string][] = [
  ['market', 'structure'],
  ['market', 'ai'],
  ['news', 'ai'],
  ['calendar', 'ai'],
  ['calendar', 'gate'],
  ['structure', 'strategy'],
  ['ai', 'strategy'],
  ['strategy', 'risk'],
  ['risk', 'prop'],
  ['prop', 'gate'],
  ['gate', 'broker'],
  ['broker', 'journal'],
  ['ai', 'journal'],
]

/* --------------------------------------------------------------- agents */

export interface Agent {
  id: string
  name: string
  kind: Authority
  role: string
  visual: 'radar' | 'news' | 'calendar' | 'gauge' | 'rules' | 'ticket' | 'record'
  span: number
}

export const AGENTS: Agent[] = [
  { id: 'scanner', name: 'Market scanner', kind: 'rule', visual: 'radar', span: 7,
    role: 'Watches your instruments every session for structure, volatility, spread and liquidity, and hands over data, not opinions.' },
  { id: 'news', name: 'News analyst', kind: 'ai', visual: 'news', span: 5,
    role: 'Reads headlines and rates impact and sentiment. A bullish story is context; it can never open a trade on its own.' },
  { id: 'calendar', name: 'Calendar sentinel', kind: 'rule', visual: 'calendar', span: 4,
    role: 'Opens a blackout window around high-impact releases and closes it on time.' },
  { id: 'risk', name: 'Risk officer', kind: 'rule', visual: 'gauge', span: 4,
    role: 'Keeps the survival buffer. Sizing, drawdown and daily loss are computed, never guessed.' },
  { id: 'compliance', name: 'Prop-firm compliance', kind: 'rule', visual: 'rules', span: 4,
    role: 'Holds each account to its own rule profile, isolated from every other account.' },
  { id: 'execution', name: 'Execution agent', kind: 'exec', visual: 'ticket', span: 5,
    role: 'Places, confirms and reconciles orders. Duplicates, partial fills and slippage are caught before they matter.' },
  { id: 'journal', name: 'Journal analyst', kind: 'ai', visual: 'record', span: 7,
    role: 'Writes the decision record and reviews each trade after the close. It suggests improvements; it never changes live risk.' },
]

/* ---------------------------------------------------------- kill switches */

export const KILL_SWITCHES = [
  { id: 'global', name: 'Global', scope: 'Every account, every strategy' },
  { id: 'account', name: 'Account', scope: 'Evaluation A only' },
  { id: 'strategy', name: 'Strategy', scope: 'London breakout' },
  { id: 'instrument', name: 'Instrument', scope: 'XAUUSD' },
  { id: 'execution', name: 'Execution', scope: 'Order routing' },
  { id: 'ai', name: 'AI', scope: 'All model calls' },
  { id: 'news', name: 'News', scope: 'News-driven entries' },
] as const

/* -------------------------------------------------------------- the rest */

export const NEVER = [
  'Invent market data, news, balances or results.',
  'Let a model size a position or move a stop.',
  'Trade while any required input is unknown or stale.',
  'Change live risk limits because an AI suggested it.',
  'Let one account’s state touch another’s.',
  'Go live without your explicit sign-off.',
]

export const STACK = ['TypeScript', 'PostgreSQL', 'n8n', 'Docker', 'REST + WebSocket', 'Any LLM provider', 'Local or cloud']

export const ROLLOUT = [
  { name: 'Backtest', text: 'Strategies proven on history before they see a live price.' },
  { name: 'Paper', text: 'Full pipeline, simulated fills, real rules.' },
  { name: 'Shadow', text: 'Live data and live decisions, recorded but never sent.' },
  { name: 'Controlled live', text: 'Small size, tight limits, only after you authorise it.', gated: true },
  { name: 'Full automation', text: 'Earned by evidence, revocable at any moment.', gated: true },
]

export const DISCLAIMER =
  'ASTRA is in development. Trading involves substantial risk of loss and nothing on this page is financial advice. Live execution only ever runs with explicit human authorisation.'
