export const ANCHOR_SCROLL_SECONDS = 1.8

export const anchorEase = (t: number) => 1 - Math.pow(1 - t, 4)

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

/** Settled clicks keep the previous options so the landing distance does not change. */
export function settledScrollOptions() {
  return { duration: ANCHOR_SCROLL_SECONDS, easing: anchorEase }
}

export function queuedScrollOptions(onComplete?: () => void) {
  return {
    duration: ANCHOR_SCROLL_SECONDS,
    easing: anchorEase,
    force: true as const,
    onComplete,
  }
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
  driver.scrollTo(target, queuedScrollOptions(() => onComplete?.(target)))
  return target
}

/** True when the section is not sitting on the scroll-margin the anchor used. */
export function anchorNeedsCorrection(top: number, scrollMarginTop: number) {
  return Math.abs(top - scrollMarginTop) > 8
}
