import assert from 'node:assert/strict'
import { test } from 'node:test'
import { COMPANY_BLOCKS, COMPANY_BODY, COMPANY_TAG, COMPANY_TITLE } from './copy.ts'

const ABOUT = [COMPANY_BODY.join(' '), ...COMPANY_BLOCKS.map((b) => `${b.title} ${b.text}`)].join(' ')

/** Positive claims. Denials such as “not yet formally incorporated” do not match these. */
const POSITIVE =
  /\bPvt\b|\bLLP\b|\binvestor\b|\bis incorporated\b|funding round|\bdirector\b|\bshareholder\b|\blicen[cs]e\b|\bregulator\b/i

test('the about copy states leadership and status without positive claims', () => {
  assert.equal(COMPANY_TAG, 'about astra')
  assert.equal(COMPANY_TITLE, 'Building a More Disciplined Trading Infrastructure.')
  assert.equal(
    COMPANY_BODY[0],
    'ASTRA is an independent startup project, not yet formally incorporated. It was founded in India in September 2026 and is under active development. The project is bootstrapped and self-funded. It builds AI-assisted trading infrastructure and risk-management software.',
  )
  assert.equal(
    COMPANY_BODY[1],
    'The project is designed with the needs of proprietary trading participants and independent traders in mind, with an emphasis on system reliability, transparent controls, and progressive technical validation.',
  )
  assert.equal(COMPANY_BLOCKS[0].title, 'Founder — Uday Fulkatwar')
  assert.match(COMPANY_BLOCKS[0].text, /project leadership title/)
  assert.match(COMPANY_BLOCKS[0].text, /not proof of incorporation, directorship, or share ownership/)
  assert.equal(COMPANY_BLOCKS[1].title, 'Co-Founder — Vivek Chaudhary')
  assert.match(COMPANY_BLOCKS[1].text, /project leadership title/)
  assert.match(COMPANY_BLOCKS[1].text, /not proof of incorporation, directorship, or share ownership/)
  assert.equal(COMPANY_BLOCKS[2].title, 'Our Mission')
  assert.equal(
    COMPANY_BLOCKS[2].text,
    'To make disciplined risk management, accountable automation, and transparent trading workflows central to the trading experience.',
  )
  assert.match(ABOUT, /not yet formally incorporated/)
  assert.match(ABOUT, /self-funded/)
  assert.match(ABOUT, /bootstrapped/)
  assert.match(ABOUT, /under active development/)
  assert.match(ABOUT, /Uday Fulkatwar/)
  assert.match(ABOUT, /Vivek Chaudhary/)
  assert.doesNotMatch(ABOUT, POSITIVE)
})
