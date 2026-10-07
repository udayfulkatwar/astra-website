/**
 * Mutable, render-free state shared between the DOM layer and the WebGL layer.
 * Scroll and pointer values change every frame, so they never go through React.
 */

export type PerfTier = 'low' | 'mid' | 'high'

type Listener = () => void

export const store = {
  /** Hero sequence progress, 0 → 1 */
  progress: 0,
  /** Contact/outro section progress, 0 → 1 */
  outro: 0,
  /** Normalised pointer, -1 → 1 */
  pointer: { x: 0, y: 0 },
  /** The contact section is on screen (canvas switches to its ink ground) */
  contactVisible: false,
  /** Whether the WebGL canvas should currently render */
  canvasActive: true,
  reducedMotion: false,
  tier: 'high' as PerfTier,
  /** set once the head geometry is ready and the first frame has rendered */
  sceneReady: false,
  /** set once the intro curtain has lifted */
  introDone: false,
}

const listeners = new Map<string, Set<Listener>>()

export function on(event: string, fn: Listener) {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event)!.add(fn)
  return () => {
    listeners.get(event)!.delete(fn)
  }
}

export function emit(event: string) {
  listeners.get(event)?.forEach((fn) => fn())
}
