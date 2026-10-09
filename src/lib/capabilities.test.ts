import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ALL_CAPABILITIES,
  ENGINEERING_LATER,
  ENGINEERING_LAYERS,
  ENGINEERING_NOTE,
  ENGINEERING_NOW,
  ENGINEERING_RULE,
  PRODUCT_MODULES,
  statusTone,
} from './capabilities.ts'

/** Highest status the Astra source read for this page supports. */
const CEILING: Record<string, 'Implemented' | 'Simulated' | 'Under Development'> = {
  'trading-workspace': 'Implemented',
  'risk-controls': 'Implemented',
  'execution-workflow': 'Simulated',
  'audit-oversight': 'Implemented',
  'market-data': 'Implemented',
  analysis: 'Implemented',
  'risk-eval': 'Implemented',
  'human-auth': 'Implemented',
  'execution-adapter': 'Simulated',
  'audit-monitor': 'Implemented',
}

const RANK = {
  'Under Development': 0,
  Simulated: 1,
  Implemented: 2,
  Verified: 3,
  'Production Validated': 4,
} as const

const BANNED = /win rate|profitab|certified|certification|partner|guarantee|production validated|live trading is enabled|live prop/i

test('no capability is marked above its evidence', () => {
  assert.equal(ALL_CAPABILITIES.length, Object.keys(CEILING).length)
  for (const item of ALL_CAPABILITIES) {
    const ceiling = CEILING[item.id]
    assert.ok(ceiling, item.id)
    assert.ok(RANK[item.status] <= RANK[ceiling], `${item.id} is ${item.status}, ceiling is ${ceiling}`)
    assert.notEqual(item.status, 'Verified')
    assert.notEqual(item.status, 'Production Validated')
    assert.ok(item.evidence.length > 0, item.id)
    assert.equal(statusTone(item.status), item.status === 'Implemented' ? 'pass' : undefined)
    assert.doesNotMatch(item.text, BANNED)
    for (const ev of item.evidence) assert.match(ev.path, /\.(ts|tsx|md)$/)
  }
})

test('execution stays on the paper adapter', () => {
  const workflow = PRODUCT_MODULES.find((m) => m.id === 'execution-workflow')
  const adapter = ENGINEERING_LAYERS.find((l) => l.id === 'execution-adapter')
  assert.equal(workflow?.status, 'Simulated')
  assert.equal(adapter?.status, 'Simulated')
  assert.match(adapter?.text ?? '', /paper adapter/i)
  assert.match(adapter?.text ?? '', /Live trading is not enabled/)
  assert.equal(statusTone('Simulated'), undefined)
})

test('the Claude line does not say Claude authorizes trades', () => {
  const analysis = ENGINEERING_LAYERS.find((l) => l.id === 'analysis')
  assert.match(analysis?.text ?? '', /SimulatedAiProvider/)
  assert.match(analysis?.text ?? '', /does not call Claude/)
  assert.equal(
    ENGINEERING_RULE,
    'AI can support development and analysis. Verified rules and controlled workflows determine what the system is permitted to execute.',
  )
  assert.equal(ENGINEERING_NOTE, 'ASTRA is an independent project and is not affiliated with or endorsed by Anthropic.')
  assert.equal(statusTone('Under Development'), 'lilac')
  assert.match(ENGINEERING_NOW, /Currently used: Claude Code as a development assistant/)
  assert.match(
    ENGINEERING_LATER,
    /Planned \/ not running in the public demo: in-product Claude API adapter \(code exists, demo uses a simulated provider\)/,
  )
  assert.match(ENGINEERING_LATER, /does not call the Claude API/)
  assert.doesNotMatch(`${ENGINEERING_NOW} ${ENGINEERING_LATER} ${ENGINEERING_NOTE}`, BANNED)
  assert.doesNotMatch(ENGINEERING_LATER, /operational|is running in the demo|calls Claude from the demo/i)
})
