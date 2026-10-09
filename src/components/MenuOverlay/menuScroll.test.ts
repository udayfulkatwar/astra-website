import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SITE } from '../../lib/content.ts'
import { MENU_DEMO, MENU_ITEMS, MENU_POLICIES } from './menuItems.ts'

test('the menu list is excluded from Lenis and only scrolls itself', () => {
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('./MenuOverlay.module.css', import.meta.url), 'utf8')
  assert.match(view, /data-lenis-prevent/)
  assert.match(css, /\.scroller\s*\{[^}]*overflow-y:\s*auto/)
  assert.doesNotMatch(css, /scrollbar-width:\s*none/)
  assert.doesNotMatch(view, /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/)
  assert.match(view, /lenis\?\.stop\(\)/)
  assert.match(view, /lenis\?\.start\(\)/)
  assert.match(view, /history\.pushState/)
  assert.match(css, /overflow-y:\s*auto/)
  assert.doesNotMatch(css, /overflow:\s*hidden/)
})

test('the menu is the seven founder links, without a request-access row', () => {
  assert.deepEqual(
    MENU_ITEMS.map((item) => item.label),
    ['Overview', 'Pipeline', 'AI Agents', 'Risk Gate', 'Command Center', 'Product Demo', 'Leadership'],
  )
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  assert.match(view, /MarketSessions/)
  assert.doesNotMatch(view, /Request access|MENU_ACCESS/)
  const header = readFileSync(new URL('../Navigation/Navigation.tsx', import.meta.url), 'utf8')
  const contact = readFileSync(new URL('../../sections/Contact/Contact.tsx', import.meta.url), 'utf8')
  assert.match(header, /href="#contact"[\s\S]*Request access/)
  assert.match(contact, /Request access/)
  for (const label of ['Film', 'Engineering', 'Principles', 'Rollout']) {
    assert.equal(MENU_ITEMS.some((item) => item.label === label), false)
  }
})

test('the demo action opens the public demo in a new tab', () => {
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  assert.equal(SITE.demoUrl, 'https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr')
  assert.equal(MENU_DEMO.label, 'Launch ASTRA Demo')
  assert.equal(MENU_DEMO.newTab, ' (opens in a new tab)')
  assert.match(view, /href=\{SITE\.demoUrl\}/)
  assert.match(view, /target="_blank"/)
  assert.match(view, /rel="noopener noreferrer"/)
  assert.match(view, /\{MENU_DEMO\.label\}/)
  assert.match(view, /className="sr-only">\{MENU_DEMO\.newTab\}/)
  const demoAt = view.indexOf('href={SITE.demoUrl}')
  const policiesAt = view.indexOf('aria-label="Policies"')
  assert.ok(demoAt >= 0 && policiesAt > demoAt)
})

test('policy links stay in this tab and resolve on the public site', () => {
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  assert.deepEqual(
    MENU_POLICIES.map((link) => link.label),
    ['Privacy', 'Terms', 'Risk'],
  )
  for (const link of MENU_POLICIES) {
    assert.equal(new URL(link.href, 'https://astragrp.net/').href, `https://astragrp.net${link.href}`)
  }
  assert.match(view, /href=\{link\.href\}/)
  const policies = view.slice(view.indexOf('aria-label="Policies"'))
  assert.doesNotMatch(policies, /target=/)
  assert.ok(view.indexOf('href={SITE.demoUrl}') < view.indexOf('aria-label="Policies"'))
})

test('every menu href names a section that exists', () => {
  const sources = [
    'src/sections/Hero/Hero.tsx',
    'src/sections/Pipeline/Pipeline.tsx',
    'src/sections/Agents/Agents.tsx',
    'src/sections/Gate/Gate.tsx',
    'src/sections/Command/Command.tsx',
    'src/sections/Product/Product.tsx',
    'src/sections/Film/Film.tsx',
    'src/sections/Film/filmSource.ts',
    'src/sections/Engineering/Engineering.tsx',
    'src/sections/Principles/Principles.tsx',
    'src/sections/Rollout/Rollout.tsx',
    'src/sections/Company/Company.tsx',
    'src/sections/Contact/Contact.tsx',
  ].map((path) => readFileSync(new URL(`../../../${path}`, import.meta.url), 'utf8')).join('\n')
  for (const item of MENU_ITEMS) {
    const id = item.href.slice(1)
    assert.match(sources, new RegExp(`id="${id}"|sectionId: '${id}'`))
  }
})
