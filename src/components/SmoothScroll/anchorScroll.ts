/** Long jumps stay under about 1.2s. Short hops are quicker. The curve is unchanged. */
export const ANCHOR_SCROLL_MAX_SECONDS = 1.15
export const ANCHOR_SCROLL_MIN_SECONDS = 0.32

export const anchorEase = (t: number) => 1 - Math.pow(1 - t, 4)

/** Seconds for an anchor jump. Distance is in CSS pixels. The cap is the same for every long jump. */
export function anchorScrollSeconds(distancePx: number) {
  const distance = Math.abs(Number.isFinite(distancePx) ? distancePx : 0)
  const scaled = ANCHOR_SCROLL_MIN_SECONDS + distance / 3800
  const capped = Math.min(ANCHOR_SCROLL_MAX_SECONDS, Math.max(ANCHOR_SCROLL_MIN_SECONDS, scaled))
  return Math.round(capped * 1000) / 1000
}

/** The slice of Lenis this module needs. The real instance satisfies it. */
export interface AnchorDriver {
  isStopped: boolean
  start: () => void
  resize: () => void
  scrollTo: (
    target: string | number,
    options: {
      duration?: number
      easing?: (t: number) => number
      immediate?: boolean
      force?: boolean
      onComplete?: () => void
    },
  ) => void
}

export type AnchorPlan = 'native' | 'scroll' | 'queue'

let pending: string | number | null = null

export function pendingAnchor() {
  return pending
}

export function rememberAnchor(target: string | number) {
  pending = target
}

export function consumeAnchor() {
  const target = pending
  pending = null
  return target
}

/**
 * A click while the loader is up, or while the menu has stopped Lenis, must not
 * call scrollTo. Lenis returns immediately when it is stopped unless force is set,
 * and force still measures the target under overflow:clip. Hold the latest target.
 */
export function planAnchorScroll(input: {
  reducedMotion: boolean
  hasDriver: boolean
  introDone: boolean
  stopped: boolean
}): AnchorPlan {
  if (input.reducedMotion || !input.hasDriver) return 'native'
  if (!input.introDone || input.stopped) return 'queue'
  return 'scroll'
}

/** How far the viewport must travel. A missing document (unit tests) reports 0. */
export function readAnchorDistance(target: string | number) {
  if (typeof target === 'number') {
    const y = typeof window === 'undefined' ? 0 : window.scrollY
    return target - y
  }
  if (typeof document === 'undefined') return 0
  const el = document.querySelector(target)
  if (!(el instanceof Element)) return 0
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop)
  const inset = Number.isNaN(margin) ? 0 : margin
  return el.getBoundingClientRect().top - inset
}

/** Settled clicks keep the same easing and the same destination. Duration scales with distance. */
export function settledScrollOptions(distancePx = 0) {
  return { duration: anchorScrollSeconds(distancePx), easing: anchorEase }
}

export function queuedScrollOptions(distancePx = 0, onComplete?: () => void) {
  return {
    duration: anchorScrollSeconds(distancePx),
    easing: anchorEase,
    force: true as const,
    onComplete,
  }
}

/** The loader still owns the scroll lock until the intro finishes. */
export function shouldRestartScrollOnMenuClose(introDone: boolean) {
  return introDone
}

export type LockedAnchor = 'native' | 'queued' | 'deferred'

/**
 * Menu links close an overlay that has stopped Lenis. Start first, then scroll on
 * a later frame. Starting after scrollTo resets the animation. Before the intro
 * finishes, only remember the target — the loader still owns the lock.
 */
export function beginLockedAnchor(
  driver: AnchorDriver | null,
  target: string | number,
  env: { reducedMotion: boolean; introDone: boolean },
): LockedAnchor {
  if (!driver || env.reducedMotion) return 'native'
  if (!env.introDone) {
    rememberAnchor(target)
    return 'deferred'
  }
  if (driver.isStopped) driver.start()
  rememberAnchor(target)
  return 'queued'
}

/** Start if needed, refresh dimensions after overflow:clip is cleared, then scroll. */
export function flushQueuedAnchor(driver: AnchorDriver, onComplete?: (target: string | number) => void) {
  const target = consumeAnchor()
  if (target == null) return null
  if (driver.isStopped) driver.start()
  driver.resize()
  driver.scrollTo(target, queuedScrollOptions(readAnchorDistance(target), () => onComplete?.(target)))
  return target
}

/** True when the section is not sitting on the scroll-margin the anchor used. */
export function anchorNeedsCorrection(top: number, scrollMarginTop: number) {
  return Math.abs(top - scrollMarginTop) > 8
}
