export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (a: number, b: number, v: number) => {
  const t = range(v, a, b)
  return t * t * (3 - 2 * t)
}

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
export const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/** Frame-rate independent exponential damping. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))

/**
 * The hero sequence timeline. Every value the scene reads is derived from
 * scroll progress here, so DOM text and WebGL stay in lockstep.
 */
export const PHASES = {
  signals: [0.08, 0.34],
  gates: [0.38, 0.6],
  lock: [0.68, 0.88],
} as const

export function heroPhases(p: number) {
  return {
    signals: easeInOutCubic(range(p, ...PHASES.signals)),
    gates: easeInOutQuart(range(p, ...PHASES.gates)),
    lock: easeInOutQuart(range(p, ...PHASES.lock)),
  }
}

export const CHAPTERS = [
  { id: 'core', label: 'Agent core', start: 0 },
  { id: 'signals', label: 'Signals', start: 0.16 },
  { id: 'gates', label: 'Nine gates', start: 0.42 },
  { id: 'decision', label: 'Decision', start: 0.7 },
] as const

/** Premium cubic-bezier curves shared by CSS-in-JS and GSAP. */
export const EASE = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  css: 'cubic-bezier(0.16, 1, 0.3, 1)',
}
