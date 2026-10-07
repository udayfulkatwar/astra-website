import { useState } from 'react'
import { detectTier, hasWebGL } from '../lib/device'
import { store, type PerfTier } from '../lib/store'

/** Detects WebGL support and a quality tier once, and mirrors it into the store. */
export function usePerformanceTier(): { tier: PerfTier; webgl: boolean } {
  const [value] = useState(() => {
    const webgl = hasWebGL()
    const tier = webgl ? detectTier() : 'low'
    store.tier = tier
    document.documentElement.dataset.tier = tier
    return { tier, webgl }
  })
  return value
}
