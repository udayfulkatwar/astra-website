import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ANCHOR_SCROLL_MAX_SECONDS,
  anchorNeedsCorrection,
  anchorScrollSeconds,
  beginLockedAnchor,
  consumeAnchor,
  flushQueuedAnchor,
  pendingAnchor,
  planAnchorScroll,
  queuedScrollOptions,
  rememberAnchor,
  settledScrollOptions,
  shouldRestartScrollOnMenuClose,
  type AnchorDriver,
} from './anchorScroll.ts'

function driver(stopped = false) {
  const calls: string[] = []
  const scrollOptions: unknown[] = []
  const fake: AnchorDriver = {
    isStopped: stopped,
    start() {
      calls.push('start')
      fake.isStopped = false
    },
    resize() {
      calls.push('resize')
    },
    scrollTo(_target, options) {
      calls.push('scrollTo')
      scrollOptions.push(options)
    },
  }
  return { fake, calls, scrollOptions }
}

test('a running Lenis scrolls now, and a stopped or pre-intro Lenis queues', () => {
  assert.equal(
    planAnchorScroll({ reducedMotion: false, hasDriver: true, introDone: true, stopped: false }),
    'scroll',
  )
  assert.equal(
    planAnchorScroll({ reducedMotion: false, hasDriver: true, introDone: false, stopped: true }),
    'queue',
  )
  assert.equal(
    planAnchorScroll({ reducedMotion: false, hasDriver: true, introDone: true, stopped: true }),
    'queue',
  )
  assert.equal(
    planAnchorScroll({ reducedMotion: true, hasDriver: true, introDone: true, stopped: false }),
    'native',
  )
  assert.equal(
    planAnchorScroll({ reducedMotion: false, hasDriver: false, introDone: true, stopped: false }),
    'native',
  )
})

test('queued menu and intro clicks start Lenis before the forced scroll', () => {
  rememberAnchor('#pipeline')
  rememberAnchor('#astra-film')
  assert.equal(pendingAnchor(), '#astra-film')
  assert.equal(consumeAnchor(), '#astra-film')
  assert.equal(consumeAnchor(), null)

  rememberAnchor('#product')
  const { fake, calls, scrollOptions } = driver(true)
  const flushed = flushQueuedAnchor(fake)
  assert.equal(flushed, '#product')
  assert.deepEqual(calls, ['start', 'resize', 'scrollTo'])
  assert.equal((scrollOptions[0] as { force?: boolean }).force, true)
  assert.ok((scrollOptions[0] as { duration: number }).duration <= ANCHOR_SCROLL_MAX_SECONDS)
  assert.equal(fake.isStopped, false)
  assert.equal('force' in settledScrollOptions(), false)
  assert.equal(queuedScrollOptions(9000).force, true)
  assert.equal(queuedScrollOptions(9000).duration, ANCHOR_SCROLL_MAX_SECONDS)
  assert.equal(flushQueuedAnchor(fake), null)

  const locked = driver(true)
  assert.equal(
    beginLockedAnchor(locked.fake, '#company', { reducedMotion: false, introDone: true }),
    'queued',
  )
  assert.deepEqual(locked.calls, ['start'])
  assert.equal(pendingAnchor(), '#company')
  consumeAnchor()

  const duringIntro = driver(true)
  assert.equal(
    beginLockedAnchor(duringIntro.fake, '#contact', { reducedMotion: false, introDone: false }),
    'deferred',
  )
  assert.deepEqual(duringIntro.calls, [])
  assert.equal(consumeAnchor(), '#contact')

  assert.equal(
    beginLockedAnchor(null, '#gate', { reducedMotion: false, introDone: true }),
    'native',
  )
})

test('anchor duration scales with distance and long jumps stay within 1.2s', () => {
  assert.equal(anchorScrollSeconds(0), 0.32)
  assert.ok(anchorScrollSeconds(400) > anchorScrollSeconds(0))
  assert.ok(anchorScrollSeconds(400) < anchorScrollSeconds(2500))
  assert.equal(anchorScrollSeconds(20000), ANCHOR_SCROLL_MAX_SECONDS)
  assert.ok(ANCHOR_SCROLL_MAX_SECONDS <= 1.2)
  assert.ok(ANCHOR_SCROLL_MAX_SECONDS >= 1)
  assert.equal(settledScrollOptions(20000).duration, ANCHOR_SCROLL_MAX_SECONDS)
  assert.equal(shouldRestartScrollOnMenuClose(false), false)
  assert.equal(shouldRestartScrollOnMenuClose(true), true)
})

test('a landing more than 8px off its scroll margin needs another measure', () => {
  assert.equal(anchorNeedsCorrection(96, 96), false)
  assert.equal(anchorNeedsCorrection(0, 0), false)
  assert.equal(anchorNeedsCorrection(104, 96), false)
  assert.equal(anchorNeedsCorrection(120, 96), true)
  assert.equal(anchorNeedsCorrection(-40, 0), true)
})
