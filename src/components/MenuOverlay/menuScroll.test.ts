import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { MENU_ACCESS, MENU_ITEMS } from './menuItems.ts'

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

test('the menu is the seven founder links plus request access', () => {
  assert.deepEqual(
    MENU_ITEMS.map((item) => item.label),
    ['Overview', 'Pipeline', 'AI Agents', 'Risk Gate', 'Command Center', 'Product Demo', 'Leadership'],
  )
  assert.equal(MENU_ACCESS.label, 'Request access')
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  assert.match(view, /MarketSessions/)
  for (const label of ['Film', 'Engineering', 'Principles', 'Rollout']) {
    assert.equal(MENU_ITEMS.some((item) => item.label === label), false)
  }
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
  for (const item of [...MENU_ITEMS, MENU_ACCESS]) {
    const id = item.href.slice(1)
    assert.match(sources, new RegExp(`id="${id}"|sectionId: '${id}'`))
  }
})
