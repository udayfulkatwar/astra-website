import type { PerfTier } from './store'

/** Scene palette (sRGB hex; THREE.Color converts to linear). Mirrors the CSS tokens. */
export const PALETTE = {
  void: '#0B0C0F',
  bone: '#E8E2D8',
  ember: '#FF6B2C',
  lilac: '#B4A6FF',
  pass: '#8FD9B0',
}

export interface TierConfig {
  streaks: number
  dust: number
  ringSegments: number
  coreDetail: number
  dpr: [number, number]
  bloom: boolean
}

export const TIERS: Record<PerfTier, TierConfig> = {
  high: { streaks: 5200, dust: 900, ringSegments: 256, coreDetail: 6, dpr: [1, 2], bloom: true },
  mid: { streaks: 3200, dust: 600, ringSegments: 192, coreDetail: 5, dpr: [1, 1.6], bloom: true },
  low: { streaks: 1500, dust: 320, ringSegments: 128, coreDetail: 4, dpr: [1, 1.3], bloom: false },
}

/** Deterministic PRNG so every load composes the same scene. */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
