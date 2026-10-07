import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canTrade, EXAMPLE_PROFILE, type GateInput } from './canTrade.ts'

const ok: GateInput = {
  marketData: 'FRESH',
  setup: 'QUALIFIED',
  calendar: 'CLEAR',
  dailyLossUsedPct: 10,
  riskPct: 0.5,
  killSwitch: false,
}

test('approves only when every gate passes', () => {
  const d = canTrade(ok)
  assert.equal(d.approved, true)
  assert.equal(d.status, 'APPROVED')
  assert.equal(d.health, 'SAFE')
  assert.equal(d.gates.length, 9)
  assert.deepEqual(d.reasons, [])
})

test('stale or unknown data fails closed', () => {
  for (const marketData of ['STALE', 'UNKNOWN'] as const) {
    const d = canTrade({ ...ok, marketData })
    assert.equal(d.approved, false)
    assert.equal(d.gates.find((g) => g.id === 'data')!.state, 'FAIL')
    assert.equal(d.gates.find((g) => g.id === 'market')!.state, 'FAIL')
  }
})

test('unknown calendar fails both news and calendar gates', () => {
  const d = canTrade({ ...ok, calendar: 'UNKNOWN' })
  assert.equal(d.approved, false)
  assert.ok(d.reasons.some((r) => r.includes('UNKNOWN EVENT STATUS')))
  assert.equal(d.gates.find((g) => g.id === 'news')!.state, 'FAIL')
})

test('high-impact event inside blackout rejects', () => {
  const d = canTrade({ ...ok, calendar: 'HIGH_IMPACT' })
  assert.equal(d.approved, false)
  assert.equal(d.health, 'CAUTION')
})

test('risk above the per-trade limit rejects', () => {
  const d = canTrade({ ...ok, riskPct: EXAMPLE_PROFILE.maxRiskPerTradePct + 0.01 })
  assert.equal(d.approved, false)
  assert.equal(d.gates.find((g) => g.id === 'risk')!.state, 'FAIL')
})

test('position must fit within the allowed share of the remaining daily buffer', () => {
  // 70% used → 1.5% buffer left → at most 0.75% may be risked
  assert.equal(canTrade({ ...ok, dailyLossUsedPct: 70, riskPct: 0.75 }).approved, true)
  const d = canTrade({ ...ok, dailyLossUsedPct: 70, riskPct: 0.8 })
  assert.equal(d.approved, false)
  assert.equal(d.gates.find((g) => g.id === 'position')!.state, 'FAIL')
  assert.equal(d.bufferRemainingPct, 1.5)
})

test('daily loss thresholds drive health and the prop-firm gate', () => {
  assert.equal(canTrade({ ...ok, dailyLossUsedPct: 50 }).health, 'CAUTION')
  const restricted = canTrade({ ...ok, dailyLossUsedPct: 80, riskPct: 0.1 })
  assert.equal(restricted.health, 'RESTRICTED')
  assert.equal(restricted.approved, false)
  assert.equal(canTrade({ ...ok, dailyLossUsedPct: 96 }).health, 'BREACH RISK')
})

test('kill switch halts regardless of everything else', () => {
  const d = canTrade({ ...ok, killSwitch: true })
  assert.equal(d.approved, false)
  assert.equal(d.health, 'HALTED')
  assert.deepEqual(d.reasons, ['Kill switch active'])
})

test('invalid numeric input fails closed', () => {
  const d = canTrade({ ...ok, riskPct: Number.NaN })
  assert.equal(d.approved, false)
  const e = canTrade({ ...ok, dailyLossUsedPct: Number.NaN })
  assert.equal(e.approved, false)
  assert.equal(e.health, 'BREACH RISK')
  assert.equal(canTrade({ ...ok, riskPct: 0 }).approved, false)
})

test('inputs are clamped, never trusted', () => {
  const d = canTrade({ ...ok, dailyLossUsedPct: 250 })
  assert.equal(d.bufferRemainingPct, 0)
  assert.equal(d.approved, false)
})
