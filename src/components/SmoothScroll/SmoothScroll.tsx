import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { deepLinkSelector } from '../../lib/deepLink'
import { on, store } from '../../lib/store'
import {
  anchorNeedsCorrection,
  beginLockedAnchor,
  flushQueuedAnchor,
  pendingAnchor,
  planAnchorScroll,
  rememberAnchor,
  settledScrollOptions,
  type AnchorDriver,
} from './anchorScroll'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

/** Fonts and the frames after them, so a deep link is not measured against a shifting layout. */
async function settleLayout() {
  try {
    await document.fonts.ready
  } catch {
    /* a rejected font load should not block the jump */
  }
  await nextFrame()
  await nextFrame()
}

let flushScheduled = false
let epoch = 0
let driftCleanup = () => {}

function nativeScroll(target: string | number) {
  if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}

/** After an early or menu scroll, one layout shift can be measured again. A later user scroll is left alone. */
function armDriftCorrection(driver: AnchorDriver, target: string | number) {
  driftCleanup()
  const yAtEnd = window.scrollY
  let done = false
  const fix = () => {
    if (done || typeof target !== 'string') return
    if (Math.abs(window.scrollY - yAtEnd) > 24) {
      done = true
      driftCleanup()
      return
    }
    const id = target.startsWith('#') ? target.slice(1) : ''
    const el = id ? document.getElementById(id) : null
    if (!el || driver.isStopped) return
    const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop)
    const expected = Number.isNaN(margin) ? 0 : margin
    if (!anchorNeedsCorrection(el.getBoundingClientRect().top, expected)) return
    done = true
    driftCleanup()
    driver.resize()
    driver.scrollTo(target, { immediate: true, force: true })
  }
  const ro = new ResizeObserver(() => fix())
  ro.observe(document.documentElement)
  const timer = window.setTimeout(() => {
    ro.disconnect()
    fix()
  }, 2000)
  driftCleanup = () => {
    done = true
    ro.disconnect()
    window.clearTimeout(timer)
  }
}

function scheduleAnchorFlush(driver: AnchorDriver, generation: number) {
  if (flushScheduled) return
  flushScheduled = true
  void (async () => {
    await nextFrame()
    await settleLayout()
    flushScheduled = false
    if (generation !== epoch) return
    flushQueuedAnchor(driver, (target) => armDriftCorrection(driver, target))
    if (pendingAnchor() != null) scheduleAnchorFlush(driver, generation)
  })()
}

function hashSelector() {
  return deepLinkSelector(location.hash, (id) => document.getElementById(id) != null)
}

/** Lenis reads the section's scroll-margin, the same offset the on-page links use. */
function scrollToHash(lenis: Lenis | null) {
  const selector = hashSelector()
  if (!selector) return
  if (lenis && !store.reducedMotion) {
    lenis.resize()
    lenis.scrollTo(selector, { immediate: true, force: true })
    return
  }
  document.querySelector(selector)?.scrollIntoView({ block: 'start' })
}

/**
 * A hash that names a real element is applied when the loader opens, then once
 * more after fonts settle. No hash leaves the page at the top. Reduced motion
 * jumps natively; otherwise the jump goes through Lenis.
 */
async function followHash(lenis: Lenis | null, cancelled: () => boolean) {
  if (!hashSelector()) return
  scrollToHash(lenis)
  await settleLayout()
  if (cancelled() || !hashSelector()) return
  scrollToHash(lenis)
}

/** Lenis driven by the GSAP ticker, so ScrollTrigger and smooth scroll share one clock. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    let cancelled = false
    const isCancelled = () => cancelled

    if (store.reducedMotion) {
      const unlock = () => (document.documentElement.style.overflow = '')
      if (!store.introDone) document.documentElement.style.overflow = 'hidden'
      const afterReveal = () => {
        unlock()
        void followHash(null, isCancelled)
      }
      const offReveal = on('introReveal', afterReveal)
      const off = on('introDone', afterReveal)
      if (store.introDone) afterReveal()
      return () => {
        cancelled = true
        offReveal()
        off()
        unlock()
      }
    }

    const l = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
    })
    l.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    const afterReveal = () => {
      void followHash(l, isCancelled)
    }
    const generation = epoch
    const afterIntro = () => {
      l.start()
      if (pendingAnchor() != null) scheduleAnchorFlush(l, generation)
      else void followHash(l, isCancelled)
    }
    if (!store.introDone) l.stop()
    const offReveal = on('introReveal', afterReveal)
    const off = on('introDone', afterIntro)
    if (store.introDone) afterIntro()
    setLenis(l)
    if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __lenis: Lenis }).__lenis = l
    return () => {
      cancelled = true
      epoch += 1
      driftCleanup()
      offReveal()
      off()
      gsap.ticker.remove(tick)
      l.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** Scroll to an anchor with Lenis when available, natively otherwise. */
export function scrollToTarget(lenis: Lenis | null, target: string | number) {
  const plan = planAnchorScroll({
    reducedMotion: store.reducedMotion,
    hasDriver: lenis != null,
    introDone: store.introDone,
    stopped: lenis?.isStopped ?? false,
  })
  if (plan === 'native') {
    nativeScroll(target)
    return
  }
  if (plan === 'queue') {
    rememberAnchor(target)
    return
  }
  driftCleanup()
  lenis!.scrollTo(target, settledScrollOptions())
}

/**
 * Scroll from the menu. The overlay has Lenis stopped, so a scroll in that same
 * turn is ignored. Unlock first and measure on a later frame, once overflow:clip
 * has cleared. A click before the intro ends waits for the loader instead.
 */
export function releaseLockedScroll(lenis: Lenis | null, target: string | number) {
  driftCleanup()
  const begun = beginLockedAnchor(lenis, target, {
    reducedMotion: store.reducedMotion,
    introDone: store.introDone,
  })
  if (begun === 'native') nativeScroll(target)
  else if (begun === 'queued') scheduleAnchorFlush(lenis as AnchorDriver, epoch)
}
