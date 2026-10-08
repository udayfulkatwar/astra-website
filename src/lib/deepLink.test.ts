import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { deepLinkSelector, hashId } from './deepLink.ts'

const present = new Set([
  'pipeline',
  'agents',
  'gate',
  'command',
  'product',
  'principles',
  'engineering',
  'rollout',
  'company',
  'astra-film',
  'contact',
])

test('a hash names an existing section, and a missing or empty hash does not', () => {
  assert.equal(hashId(''), null)
  assert.equal(hashId('#'), null)
  assert.equal(hashId('#product'), 'product')
  assert.equal(hashId('#astra-film'), 'astra-film')
  assert.equal(deepLinkSelector('', (id) => present.has(id)), null)
  assert.equal(deepLinkSelector('#missing', (id) => present.has(id)), null)
  assert.equal(deepLinkSelector('#product', (id) => present.has(id)), '#product')
  assert.equal(deepLinkSelector('#contact', (id) => present.has(id)), '#contact')
  assert.equal(deepLinkSelector('#pipeline', () => false), null)
})

test('every deep-link section shares the header scroll margin, including contact', () => {
  const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8')
  for (const id of present) {
    assert.match(css, new RegExp(`#${id}[,\\s{]`))
  }
  assert.match(css, /#contact[\s\S]*scroll-margin-top:\s*80px/)
  assert.match(css, /#contact[\s\S]*scroll-margin-top:\s*96px/)
})
