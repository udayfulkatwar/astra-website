/** Factual stages for the public demo. No trades, P&L, or performance figures. */
export const WORKFLOW_TITLE = 'ASTRA — System Workflow Preview'
export const WORKFLOW_LABEL = 'SIMULATED DEMONSTRATION'

export const WORKFLOW_STAGES = [
  {
    n: '01',
    title: 'Market Data Assessment',
    text: 'The public demo reads simulated prices, not a live feed.',
  },
  {
    n: '02',
    title: 'Strategy Evaluation',
    text: 'Rules are checked on that simulated path. This is not a performance record.',
  },
  {
    n: '03',
    title: 'Deterministic Risk Validation',
    text: 'Limits fail closed. This step does not send a live order.',
  },
  {
    n: '04',
    title: 'Human Approval',
    text: 'A pass can wait for a person. The demo does not submit to a broker.',
  },
  {
    n: '05',
    title: 'Simulated Order Workflow',
    text: 'Any order path here is simulated. No broker and no real money.',
  },
  {
    n: '06',
    title: 'Audit and Monitoring',
    text: 'A decision can be written down. This is not a live account.',
  },
] as const
