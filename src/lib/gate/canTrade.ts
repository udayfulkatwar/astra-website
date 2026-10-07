/**
 * canTrade() — a deterministic, dependency-free model of ASTRA's validation chain.
 *
 * Used by the interactive demo on the site. Every input is supplied by the
 * visitor and every threshold comes from a rule profile, so nothing here is
 * market data or a performance claim. Any UNKNOWN / STALE input fails closed.
 */

export type Freshness = 'FRESH' | 'STALE' | 'UNKNOWN'
export type SetupState = 'QUALIFIED' | 'WATCH' | 'NO_SETUP'
export type CalendarState = 'CLEAR' | 'HIGH_IMPACT' | 'UNKNOWN'
export type GateState = 'PASS' | 'FAIL'
export type AccountHealth = 'SAFE' | 'CAUTION' | 'RESTRICTED' | 'HALTED' | 'BREACH RISK'

export interface RuleProfile {
  name: string
  /** daily loss limit as % of starting balance */
  dailyLossLimitPct: number
  /** max risk per trade as % of balance */
  maxRiskPerTradePct: number
  /** share of the remaining daily buffer one trade may consume (0..1) */
  maxBufferShare: number
  /** % of daily limit used at which the account enters CAUTION */
  cautionAtPct: number
  /** % of daily limit used at which new trades are refused */
  restrictAtPct: number
  /** % of daily limit used treated as breach risk */
  breachRiskAtPct: number
  /** minutes either side of a high-impact event with no new trades */
  newsBlackoutMin: number
}

export interface GateInput {
  marketData: Freshness
  setup: SetupState
  calendar: CalendarState
  /** share of today's loss limit already used, 0..100 */
  dailyLossUsedPct: number
  /** proposed risk for this trade as % of balance */
  riskPct: number
  killSwitch: boolean
}

export type GateId =
  | 'data'
  | 'market'
  | 'strategy'
  | 'news'
  | 'calendar'
  | 'risk'
  | 'propFirm'
  | 'position'
  | 'execution'

export interface GateResult {
  id: GateId
  label: string
  state: GateState
  detail: string
}

export interface Decision {
  approved: boolean
  status: 'APPROVED' | 'REJECTED'
  health: AccountHealth
  gates: GateResult[]
  reasons: string[]
  /** remaining daily loss buffer as % of balance */
  bufferRemainingPct: number
}

/** Illustrative profile — every value is configurable per account in ASTRA. */
export const EXAMPLE_PROFILE: RuleProfile = {
  name: 'Example evaluation account',
  dailyLossLimitPct: 5,
  maxRiskPerTradePct: 1,
  maxBufferShare: 0.5,
  cautionAtPct: 50,
  restrictAtPct: 80,
  breachRiskAtPct: 95,
  newsBlackoutMin: 15,
}

export const GATE_ORDER: { id: GateId; label: string }[] = [
  { id: 'data', label: 'Data' },
  { id: 'market', label: 'Market' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'news', label: 'News' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'risk', label: 'Risk' },
  { id: 'propFirm', label: 'Prop-firm' },
  { id: 'position', label: 'Position' },
  { id: 'execution', label: 'Execution' },
]

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

export function canTrade(input: GateInput, profile: RuleProfile = EXAMPLE_PROFILE): Decision {
  const used = isFiniteNumber(input.dailyLossUsedPct) ? Math.min(100, Math.max(0, input.dailyLossUsedPct)) : NaN
  const risk = isFiniteNumber(input.riskPct) ? Math.max(0, input.riskPct) : NaN
  const buffer = Number.isNaN(used) ? 0 : profile.dailyLossLimitPct * (1 - used / 100)
  const maxForBuffer = buffer * profile.maxBufferShare

  const check = (ok: boolean, pass: string, fail: string): [GateState, string] => (ok ? ['PASS', pass] : ['FAIL', fail])

  const results: Record<GateId, [GateState, string]> = {
    data: check(
      input.marketData === 'FRESH',
      'Price feed fresh',
      input.marketData === 'STALE' ? 'Market data is stale' : 'Market data status unknown',
    ),
    market: check(
      input.marketData === 'FRESH',
      'Conditions validated',
      'Conditions cannot be validated without fresh data',
    ),
    strategy: check(
      input.setup === 'QUALIFIED',
      'Setup qualified',
      input.setup === 'WATCH' ? 'Setup on watch, not yet qualified' : 'No setup present',
    ),
    news: check(
      input.calendar === 'CLEAR',
      'Outside news blackout',
      input.calendar === 'HIGH_IMPACT'
        ? `High-impact event inside the ${profile.newsBlackoutMin}-minute blackout`
        : 'Cannot confirm the blackout window is clear',
    ),
    calendar: check(input.calendar !== 'UNKNOWN', 'Calendar available', 'UNKNOWN EVENT STATUS: calendar unavailable'),
    risk: check(
      !Number.isNaN(risk) && risk > 0 && risk <= profile.maxRiskPerTradePct,
      `${round(risk)}% within the ${profile.maxRiskPerTradePct}% limit`,
      Number.isNaN(risk) || risk <= 0
        ? 'Risk per trade is invalid'
        : `Risk ${round(risk)}% exceeds the ${profile.maxRiskPerTradePct}% per-trade limit`,
    ),
    propFirm: check(
      !Number.isNaN(used) && used < profile.restrictAtPct,
      `Daily loss ${round(used, 0)}% used`,
      Number.isNaN(used)
        ? 'Account state cannot be verified'
        : `Daily loss ${round(used, 0)}% used, restricted at ${profile.restrictAtPct}%`,
    ),
    position: check(
      !Number.isNaN(risk) && !Number.isNaN(used) && risk <= maxForBuffer,
      `Uses ${round(buffer > 0 ? (risk / buffer) * 100 : 0, 0)}% of today's buffer`,
      `Needs ${round(risk)}%, only ${round(maxForBuffer)}% of the remaining buffer may be risked`,
    ),
    execution: check(!input.killSwitch, 'Execution enabled', 'Kill switch active'),
  }

  const gates: GateResult[] = GATE_ORDER.map(({ id, label }) => ({
    id,
    label,
    state: results[id][0],
    detail: results[id][1],
  }))
  const reasons = gates.filter((g) => g.state === 'FAIL').map((g) => g.detail)
  const approved = reasons.length === 0

  let health: AccountHealth = 'SAFE'
  if (input.killSwitch) health = 'HALTED'
  else if (Number.isNaN(used) || used >= profile.breachRiskAtPct) health = 'BREACH RISK'
  else if (used >= profile.restrictAtPct) health = 'RESTRICTED'
  else if (used >= profile.cautionAtPct || input.calendar !== 'CLEAR' || input.marketData !== 'FRESH') health = 'CAUTION'

  return {
    approved,
    status: approved ? 'APPROVED' : 'REJECTED',
    health,
    gates,
    reasons,
    bufferRemainingPct: round(buffer),
  }
}
