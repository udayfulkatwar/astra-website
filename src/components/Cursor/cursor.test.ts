import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

test('an open menu restores the native pointer', () => {
  const css = readFileSync(new URL('../../styles/global.css', import.meta.url), 'utf8')
  const cursor = readFileSync(new URL('./Cursor.module.css', import.meta.url), 'utf8')
  assert.match(
    css,
    /html\.has-cursor,\s*html\.has-cursor a,\s*html\.has-cursor button,\s*html\.has-cursor label \{\s*cursor:\s*none/,
  )
  assert.match(
    css,
    /html\.has-cursor\[data-menu-open\],\s*html\.has-cursor\[data-menu-open\] body,\s*html\.has-cursor\[data-menu-open\] label \{\s*cursor:\s*auto/,
  )
  assert.match(
    css,
    /html\.has-cursor\[data-menu-open\] a,\s*html\.has-cursor\[data-menu-open\] button \{\s*cursor:\s*pointer/,
  )
  assert.match(cursor, /html\[data-menu-open\]\) \.cursor \{\s*visibility:\s*hidden/)
})
