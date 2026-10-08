import assert from 'node:assert/strict'
import { test } from 'node:test'
import { COMPANY_BLOCKS, COMPANY_BODY, COMPANY_TAG, COMPANY_TITLE } from './copy.ts'

test('the about copy is the founder text', () => {
  assert.equal(COMPANY_TAG, 'about astra')
  assert.equal(COMPANY_TITLE, 'Building a More Disciplined Trading Infrastructure.')
  assert.equal(
    COMPANY_BODY[0],
    'ASTRA is an independent trading-technology project founded in India in September 2026. It is being developed to bring together market intelligence, configurable trading-risk controls, automated workflows, account monitoring, and human oversight in a unified platform.',
  )
  assert.equal(
    COMPANY_BODY[1],
    'The project is designed with the needs of proprietary trading participants and independent traders in mind, with an emphasis on system reliability, transparent controls, and progressive technical validation.',
  )
  assert.equal(COMPANY_BLOCKS[0].title, 'Founded by Uday Fulkatwar')
  assert.equal(
    COMPANY_BLOCKS[0].text,
    'Uday Fulkatwar founded ASTRA with the goal of developing a trading platform in which automation operates within clearly defined risk and operational safeguards. The project follows an evidence-led development approach, progressing through software testing, simulation, and controlled validation before broader operational use.',
  )
  assert.equal(COMPANY_BLOCKS[1].title, 'Our Mission')
  assert.equal(
    COMPANY_BLOCKS[1].text,
    'To make disciplined risk management, accountable automation, and transparent trading workflows central to the trading experience.',
  )
  assert.doesNotMatch(COMPANY_BODY.join(' '), /incorporat|investor|funding/i)
})
