import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SITE } from './content.ts'
import {
  CAPABILITIES,
  COMPANY,
  ENGINEERING_DECISIONS,
  ENGINEERING_INTRO,
  ENGINEERING_WRITTEN,
  FLOW,
  PRODUCT_BODY,
  PRODUCT_GATE,
  PRODUCT_INTRO,
  PRODUCT_SHOTS,
  COMPANY_INTRO,
} from './productFacts.ts'

const publicCopy = [
  PRODUCT_INTRO,
  PRODUCT_BODY,
  PRODUCT_GATE,
  ENGINEERING_INTRO,
  ENGINEERING_WRITTEN,
  ENGINEERING_DECISIONS,
  ...CAPABILITIES.flatMap((c) => [c.name, c.text, c.status]),
  ...COMPANY.flatMap((c) => [c.label, c.text]),
  ...FLOW.flatMap((s) => [s.name, s.note]),
  ...PRODUCT_SHOTS.flatMap((s) => [s.alt, s.caption]),
  COMPANY_INTRO,
].join('\n')

test('company facts stay inside what the founder supplied', () => {
  const contact = COMPANY.find((c) => c.label === 'Contact')
  assert.equal(contact?.text, 'udayfulkatwar@astragrp.net')
  assert.equal(contact?.text, SITE.email)
  assert.match(COMPANY.map((c) => c.text).join(' '), /Uday Fulkatwar/)
  assert.match(COMPANY.map((c) => c.text).join(' '), /September 2026/)
  assert.match(COMPANY.map((c) => c.text).join(' '), /India/)
  assert.doesNotMatch(publicCopy, /10\s*%/)
  assert.doesNotMatch(publicCopy, /oversight/i)
  assert.doesNotMatch(publicCopy, /LSFVG/i)
  assert.doesNotMatch(publicCopy, /github\.com/i)
  assert.doesNotMatch(publicCopy, /\$\d/)
})

test('engineering copy does not claim a live model connection', () => {
  assert.match(ENGINEERING_WRITTEN, /Claude Code/)
  assert.match(ENGINEERING_WRITTEN, /founder’s direction/)
  assert.match(ENGINEERING_WRITTEN, /not affiliated with Anthropic/)
  assert.doesNotMatch(ENGINEERING_DECISIONS, /does not claim a live connection/)
  assert.match(ENGINEERING_DECISIONS, /not used for live decisions/)
  assert.match(ENGINEERING_DECISIONS, /advisory only/)
  assert.match(ENGINEERING_DECISIONS, /deterministic gate/)
  assert.match(PRODUCT_INTRO, /What is built today/)
  assert.match(COMPANY_INTRO, /Built in India/)
})

test('every demo frame is labelled simulated', () => {
  assert.ok(PRODUCT_SHOTS.length >= 1)
  for (const shot of PRODUCT_SHOTS) {
    assert.match(shot.alt, /Simulated/)
    assert.match(shot.caption, /[Ss]imulated/)
    assert.match(shot.src, /^\/media\/product\//)
  }
})
