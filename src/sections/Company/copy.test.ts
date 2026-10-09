import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  COMMITMENT_LABEL,
  COMMITMENT_ORIGIN,
  COMMITMENT_TEXT,
  COMPANY_BODY,
  LEADERS,
  LEADERSHIP_INTRO,
  LEADERSHIP_TAG,
  LEADERSHIP_TITLE,
  MISSION,
  PORTRAIT,
  PRINCIPLE_LABEL,
} from './copy.ts'

const VISIBLE = [
  LEADERSHIP_TAG,
  LEADERSHIP_TITLE,
  LEADERSHIP_INTRO,
  ...LEADERS.flatMap((leader) => [leader.name, leader.title, ...leader.bio, PRINCIPLE_LABEL, leader.principle, leader.linkedin.label]),
  COMMITMENT_LABEL,
  COMMITMENT_TEXT,
  COMMITMENT_ORIGIN,
  COMPANY_BODY[0],
  MISSION.title,
  MISSION.text,
].join('\n')

/** Positive claims. Denials such as “not yet formally incorporated” do not match these. */
const POSITIVE =
  /\bPvt\b|\bLLP\b|\binvestor\b|\bis incorporated\b|\bdirector\b|\bshareholder\b|\blicen[cs]e\b|\bregulator\b|\bCEO\b|\bCTO\b/i

const ATTRIBUTION = /—\s*Uday|—\s*Vivek|\b(Uday Fulkatwar|Vivek Chaudhary)\s+says\b|<cite\b/i

test('leadership copy is the approved text and makes no positive corporate claim', () => {
  assert.equal(LEADERSHIP_TAG, 'THE PEOPLE BEHIND ASTRA')
  assert.equal(LEADERSHIP_TITLE, 'Building Intelligence. Engineering Trust.')
  assert.equal(
    LEADERSHIP_INTRO,
    'Behind ASTRA is a commitment to a more disciplined future for trading technology. We believe intelligent systems should be measured not only by what they can automate, but by how responsibly they manage uncertainty, preserve accountability, and demonstrate measurable value.',
  )
  assert.equal(LEADERS[0].name, 'Uday Fulkatwar')
  assert.equal(LEADERS[0].title, 'Founder, ASTRA')
  assert.deepEqual(LEADERS[0].bio, [
    'Uday Fulkatwar founded ASTRA in September 2026 with a vision to develop intelligent trading infrastructure built around discipline, transparency, and responsible automation.',
    'His focus is on shaping a risk-first platform that combines AI-assisted research, systematic strategy evaluation, deterministic safeguards, and human oversight.',
    'Through ASTRA, he aims to make advanced trading and risk-management capabilities more accessible to proprietary trading firm participants and independent traders.',
  ])
  assert.equal(LEADERS[0].principle, 'Intelligence creates possibilities. Discipline creates trust.')
  assert.equal(LEADERS[0].linkedin.href, 'https://www.linkedin.com/in/udayfulkatwar/')
  assert.equal(LEADERS[0].linkedin.label, 'Uday Fulkatwar on LinkedIn (opens in a new tab)')
  assert.equal(LEADERS[0].photo?.alt, 'Uday Fulkatwar, Founder of ASTRA')
  assert.equal(LEADERS[0].photo?.width, PORTRAIT.width)
  assert.equal(LEADERS[0].photo?.height, PORTRAIT.height)

  assert.equal(LEADERS[1].name, 'Vivek Chaudhary')
  assert.equal(LEADERS[1].title, 'Co-Founder, ASTRA')
  assert.equal(LEADERS[1].initials, 'VC')
  assert.equal(LEADERS[1].photo, undefined)
  assert.deepEqual(LEADERS[1].bio, [
    'Vivek Chaudhary is the Co-Founder of ASTRA, an early-stage fintech initiative developing AI-assisted trading and risk-management technology.',
    "As part of ASTRA's founding team, he shares the project's commitment to transparent systems, responsible innovation, and long-term product credibility.",
    "The founding team's vision is to develop technology where automation can be evaluated, decisions can be understood, and financial risk remains a central design consideration.",
  ])
  assert.equal(
    LEADERS[1].principle,
    'Technology earns confidence when its decisions are transparent, testable, and accountable.',
  )
  assert.equal(LEADERS[1].linkedin.href, 'https://www.linkedin.com/in/vivek-chaudhary-77b52a434/')
  assert.equal(LEADERS[1].linkedin.label, 'Vivek Chaudhary on LinkedIn (opens in a new tab)')

  assert.equal(PRINCIPLE_LABEL, 'Leadership principle')
  assert.equal(COMMITMENT_LABEL, 'OUR COMMITMENT')
  assert.equal(COMMITMENT_TEXT, 'Build with discipline. Validate with evidence. Earn trust through transparency.')
  assert.equal(
    COMMITMENT_ORIGIN,
    'ASTRA — Independent, bootstrapped fintech initiative. Founded September 2026, India.',
  )
  assert.match(COMPANY_BODY[0], /not yet formally incorporated/)
  assert.equal(
    MISSION.text,
    'To make disciplined risk management, accountable automation, and transparent trading workflows central to the trading experience.',
  )
  assert.doesNotMatch(VISIBLE, POSITIVE)
  assert.doesNotMatch(VISIBLE, ATTRIBUTION)
  for (const leader of LEADERS) {
    assert.equal(leader.principle.includes(leader.name), false)
  }

  const view = readFileSync(new URL('./Company.tsx', import.meta.url), 'utf8')
  assert.equal(view.includes('<cite'), false)
  assert.doesNotMatch(view, /—\s*Uday|—\s*Vivek|\bsays\b/)
  assert.match(view, /212w/)
  assert.match(view, /424w/)
  assert.doesNotMatch(view, /848w/)

  const css = readFileSync(new URL('./Company.module.css', import.meta.url), 'utf8')
  assert.match(css, /\.card\s*\{[^}]*opacity:\s*1/)
  assert.doesNotMatch(css, /company-rise[^;\n]*\bboth\b/)
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.card[\s\S]*opacity:\s*1/)
  assert.match(css, /\.frame\s*\{[^}]*width:\s*168px/)
  assert.match(css, /min-width:\s*1024px\)[\s\S]*\.frame\s*\{[^}]*width:\s*212px/)
  assert.doesNotMatch(css, /max-width:\s*424px/)

  const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8')
  const noscript = html.slice(html.indexOf('<noscript>'), html.indexOf('</noscript>'))
  assert.doesNotMatch(noscript, /systematic strategy evaluation|early-stage fintech|Leadership principle/)
  assert.match(html, /"sameAs": "https:\/\/www\.linkedin\.com\/in\/udayfulkatwar\/"/)
  assert.match(html, /"sameAs": "https:\/\/www\.linkedin\.com\/in\/vivek-chaudhary-77b52a434\/"/)
  assert.match(html, /"image": "https:\/\/astragrp\.net\/media\/leadership\/uday-fulkatwar\.jpg"/)
  assert.doesNotMatch(html, /systematic strategy evaluation|early-stage fintech/)
})
