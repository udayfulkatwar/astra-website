import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { demoIsPublic, SITE } from './content.ts'
import { DEMO_SUPPORT } from '../sections/Film/filmSource.ts'

const HERO = readFileSync(new URL('../sections/Hero/Hero.tsx', import.meta.url), 'utf8')
const FILM = readFileSync(new URL('../sections/Film/Film.tsx', import.meta.url), 'utf8')

test('the hero is Trade Gate, Meet ASTRA, and Watch the video', () => {
  const trade = HERO.indexOf('Trade Gate')
  const meet = HERO.indexOf('Meet ASTRA')
  const watch = HERO.indexOf('Watch the video')
  assert.ok(trade >= 0 && meet > trade && watch > meet)
  assert.equal(HERO.includes('Click for demo'), false)
  assert.equal(HERO.includes('demoUrl'), false)
})

test('the film demo link is shown and the hero demo link is not', () => {
  assert.equal(SITE.demoUrl, 'https://claude.ai/artifact/7h7cWk7fJHQJHb3tWNVLSr')
  assert.equal(SITE.demoPublic, true)
  assert.equal(demoIsPublic(), true)
  assert.equal(demoIsPublic({ demoPublic: false }), false)
  assert.equal(DEMO_SUPPORT, 'Explore the ASTRA dashboard and available product workflows.')
  assert.match(FILM, /demoIsPublic\(\)/)
  assert.match(FILM, /href=\{SITE\.demoUrl\}/)
  assert.match(FILM, /Explore the Demo/)
  assert.equal(FILM.includes('Live'), false)
  assert.equal(FILM.includes('Click for demo'), false)
})
