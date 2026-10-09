import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { MENU_EXIT_SECONDS, MENU_REVEAL_SECONDS } from './menuMotion.ts'

test('the menu is hittable within 150ms and does not park links off screen', () => {
  assert.ok(MENU_REVEAL_SECONDS <= 0.15)
  assert.ok(MENU_EXIT_SECONDS <= 0.15)
  const view = readFileSync(new URL('./MenuOverlay.tsx', import.meta.url), 'utf8')
  assert.equal(view.includes('110%'), false)
  assert.equal(view.includes('clipPath'), false)
  assert.match(view, /MENU_REVEAL_SECONDS/)
  assert.match(view, /pointerEvents: 'none'/)
})
