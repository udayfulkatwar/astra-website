import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Subscribes to a per-frame reader (e.g. store.progress) and only re-renders
 * React when the derived value changes. Use for coarse UI state like the
 * active chapter — never for continuous motion.
 */
export function useDerived<T>(read: () => T): T {
  const [value, setValue] = useState<T>(read)
  const last = useRef(value)
  useEffect(() => {
    const tick = () => {
      const v = read()
      if (v !== last.current) {
        last.current = v
        setValue(v)
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [read])
  return value
}

/** Whole-page scroll progress 0..1, read without React. */
export function pageProgress() {
  const max = document.documentElement.scrollHeight - innerHeight
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
}
