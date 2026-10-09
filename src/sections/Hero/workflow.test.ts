import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { WORKFLOW_LABEL, WORKFLOW_STAGES, WORKFLOW_TITLE } from './workflow.ts'

test('the workflow panel is a labelled simulation with six factual stages', () => {
  assert.equal(WORKFLOW_TITLE, 'ASTRA — System Workflow Preview')
  assert.equal(WORKFLOW_LABEL, 'SIMULATED DEMONSTRATION')
  assert.deepEqual(
    WORKFLOW_STAGES.map((stage) => stage.title),
    [
      'Market Data Assessment',
      'Strategy Evaluation',
      'Deterministic Risk Validation',
      'Human Approval',
      'Simulated Order Workflow',
      'Audit and Monitoring',
    ],
  )
  const text = WORKFLOW_STAGES.map((stage) => stage.text).join('\n')
  assert.match(text, /simulated prices/i)
  assert.match(text, /not a live feed/i)
  assert.match(text, /No broker and no real money/)
  assert.doesNotMatch(text, /P&L|profit|account result|performance number|%\s*return/i)
  const view = readFileSync(new URL('./AgentLog.tsx', import.meta.url), 'utf8')
  assert.equal(view.includes('agent.log'), false)
  assert.equal(view.includes('NO TRADE'), false)
})
