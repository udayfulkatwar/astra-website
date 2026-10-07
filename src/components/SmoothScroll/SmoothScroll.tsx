import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { on, store } from '../../lib/store'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/** Lenis driven by the GSAP ticker, so ScrollTrigger and smooth scroll share one clock. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    if (store.reducedMotion) {
      const unlock = () => (document.documentElement.style.overflow = '')
      if (!store.introDone) document.documentElement.style.overflow = 'hidden'
      const off = on('introDone', unlock)
      return () => { off(); unlock() }
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
    if (!store.introDone) l.stop()
    const off = on('introDone', () => l.start())
    setLenis(l)
    if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __lenis: Lenis }).__lenis = l
    return () => {
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
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}
