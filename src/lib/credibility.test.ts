import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SITE } from './content.ts'

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')

test('the public contact address is founder@astragrp.net', () => {
  assert.equal(SITE.email, 'founder@astragrp.net')
  const surfaces = [
    read('../../index.html'),
    read('../../README.md'),
    read('../../public/privacy/index.html'),
    read('../../public/terms/index.html'),
    read('../../public/risk/index.html'),
  ]
  for (const src of surfaces) assert.equal(src.includes('udayfulkatwar@astragrp.net'), false)
  assert.match(read('../../index.html'), /founder@astragrp\.net/)
})

test('seo and the noscript blurb use authorized facts only', () => {
  const html = read('../../index.html')
  assert.match(html, /name="twitter:card" content="summary_large_image"/)
  assert.match(html, /name="twitter:image" content="https:\/\/astragrp\.net\/og\.png"/)
  assert.match(html, /"@type": "Organization"/)
  assert.match(html, /"name": "ASTRA"/)
  assert.match(html, /"foundingDate": "2026-09"/)
  assert.match(html, /Uday Fulkatwar/)
  assert.match(html, /Vivek Chaudhary/)
  assert.doesNotMatch(html, /legalName|streetAddress|vatID|taxID|leiCode/)
  const noscript = html.slice(html.indexOf('<noscript>'), html.indexOf('</noscript>'))
  assert.match(noscript, /not yet formally incorporated/)
  assert.match(noscript, /Uday Fulkatwar/)
  assert.match(noscript, /Vivek Chaudhary/)
  assert.match(noscript, /India/)
  assert.match(noscript, /September 2026/)
  assert.match(noscript, /bootstrapped and self-funded/)
  assert.match(noscript, /under active development/)
  assert.match(noscript, /founder@astragrp\.net/)
  assert.match(noscript, /not affiliated with or endorsed by Anthropic/)
})

test('legal pages are static files and the sitemap lists them', () => {
  const privacy = read('../../public/privacy/index.html')
  const terms = read('../../public/terms/index.html')
  const risk = read('../../public/risk/index.html')
  const sitemap = read('../../public/sitemap.xml')
  for (const page of [privacy, terms, risk]) {
    assert.match(page, /<h1>/)
    assert.equal(page.includes('<script'), false)
    assert.match(page, /founder@astragrp\.net/)
    assert.match(page.replace(/\s+/g, ' '), /not yet formally incorporated/)
  }
  assert.match(privacy, /does not set cookies/)
  assert.match(privacy, /does not run analytics/)
  assert.match(privacy, /claude\.ai/)
  assert.match(privacy, /not affiliated with or endorsed by Anthropic/)
  assert.match(privacy, /Google Fonts/)
  assert.doesNotMatch(terms, /governing law|jurisdiction/i)
  assert.match(risk, /not financial advice/i)
  assert.match(risk, /not a live trading record/i)
  assert.match(risk, /simulated/i)
  assert.match(risk, /human authorisation/)
  assert.match(sitemap, /https:\/\/astragrp\.net\/privacy\//)
  assert.match(sitemap, /https:\/\/astragrp\.net\/terms\//)
  assert.match(sitemap, /https:\/\/astragrp\.net\/risk\//)
})
