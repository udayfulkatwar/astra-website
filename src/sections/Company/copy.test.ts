import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  COMMITMENTS,
  COMMITMENT_TITLE,
  COMPANY_BODY,
  COMPANY_TAG,
  COMPANY_TITLE,
  LEADERS,
  LEADERSHIP_INTRO,
  LEADERSHIP_TITLE,
  MISSION,
  leaderExtras,
} from './copy.ts'

const ABOUT = [
  COMPANY_BODY.join(' '),
  LEADERSHIP_TITLE,
  LEADERSHIP_INTRO,
  ...LEADERS.flatMap((leader) => [leader.name, leader.title, leader.roleNote, leader.bio, leader.quote]),
  COMMITMENT_TITLE,
  ...COMMITMENTS.map((item) => `${item.label} ${item.text}`),
  MISSION.title,
  MISSION.text,
].join(' ')

/** Positive claims. Denials such as “not yet formally incorporated” do not match these. */
const POSITIVE =
  /\bPvt\b|\bLLP\b|\binvestor\b|\bis incorporated\b|funding round|\bdirector\b|\bshareholder\b|\blicen[cs]e\b|\bregulator\b|\bCEO\b|\bCTO\b/i

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
  assert.equal(LEADERSHIP_TITLE, 'The People Behind ASTRA')
  assert.match(LEADERSHIP_INTRO, /not yet formally incorporated/)
  assert.match(LEADERSHIP_INTRO, /September 2026/)
  assert.match(LEADERSHIP_INTRO, /bootstrapped/)
  assert.equal(LEADERS[0].name, 'Uday Fulkatwar')
  assert.equal(LEADERS[0].title, 'Founder')
  assert.equal(LEADERS[0].initials, 'UF')
  assert.match(LEADERS[0].roleNote, /project leadership title/)
  assert.match(LEADERS[0].roleNote, /not proof of incorporation, directorship, or share ownership/)
  assert.equal(LEADERS[1].name, 'Vivek Chaudhary')
  assert.equal(LEADERS[1].title, 'Co-Founder')
  assert.equal(LEADERS[1].initials, 'VC')
  assert.match(LEADERS[1].roleNote, /project leadership title/)
  assert.match(LEADERS[1].roleNote, /not proof of incorporation, directorship, or share ownership/)
  for (const leader of LEADERS) {
    const extra = leaderExtras(leader)
    assert.equal(extra.bio, '')
    assert.equal(extra.quote, '')
    assert.deepEqual(extra.links, [])
  }
  assert.equal(leaderExtras({ ...LEADERS[0], bio: '  ', quote: ' ', links: [{ label: ' ', href: '' }] }).bio, '')
  assert.equal(COMMITMENT_TITLE, 'Shared commitment')
  assert.deepEqual(
    COMMITMENTS.map((item) => item.label),
    ['Risk discipline', 'Evidence', 'Transparency', 'Responsible AI development'],
  )
  assert.match(COMMITMENTS[0].text, /before any execution/)
  assert.match(COMMITMENTS[1].text, /implemented, simulated, or planned/)
  assert.match(COMMITMENTS[2].text, /simulated data is marked/)
  assert.match(COMMITMENTS[3].text, /Humans authorise/)
  assert.equal(MISSION.title, 'Our Mission')
  assert.equal(
    MISSION.text,
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
