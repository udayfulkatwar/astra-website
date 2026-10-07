import { useEffect } from 'react'
import { store } from '../lib/store'

/** Writes the normalised pointer into the shared store (no React re-renders). */
export function useMousePosition() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      store.pointer.x = (e.clientX / innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / innerHeight) * 2 - 1)
    }
    const onLeave = () => {
      store.pointer.x = 0
      store.pointer.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}
