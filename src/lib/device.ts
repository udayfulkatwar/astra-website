import type { PerfTier } from './store'

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Rough device classification. Runs once before the canvas mounts.
 * `?tier=high|mid|low` overrides it for testing.
 */
export function detectTier(): PerfTier {
  const forced = new URLSearchParams(location.search).get('tier')
  if (forced === 'high' || forced === 'mid' || forced === 'low') return forced

  const coarse = matchMedia('(pointer: coarse)').matches
  const small = innerWidth < 768
  const cores = navigator.hardwareConcurrency || 4
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8

  let renderer = ''
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    const ext = gl?.getExtension('WEBGL_debug_renderer_info')
    if (gl && ext) renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL))
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    /* ignore */
  }
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return 'low'
  if (coarse || small) return cores >= 6 && mem >= 4 ? 'mid' : 'low'
  if (/intel/i.test(renderer) && !/iris xe|arc/i.test(renderer)) return 'mid'
  if (cores <= 4 || mem < 4) return 'mid'
  return 'high'
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
export const isFinePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches
