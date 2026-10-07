import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { emit, on, store } from '../../lib/store'
import styles from './Preloader.module.css'

/**
 * The one orchestrated load moment: a counter that tracks real work
 * (fonts → head sculpted → first frame), then a curtain that lifts on the bust.
 */
export function Preloader({ waitForScene }: { waitForScene: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el) return
    document.getElementById('boot')?.remove()
    let target = 8
    let shown = 0
    let finished = false
    const start = performance.now()
    const minTime = store.reducedMotion ? 300 : 1500

    document.fonts?.ready.then(() => (target = Math.max(target, 38)))
    const t1 = setTimeout(() => (target = Math.max(target, 62)), 500)
    const offReady = on('sceneReady', () => (target = 100))
    const offFail = on('webglFailed', () => (target = 100))
    if (!waitForScene) target = 100
    // never hold anyone hostage
    const safety = setTimeout(() => (target = 100), 9000)

    let last = performance.now()
    const tick = () => {
      const now = performance.now()
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      // time-based so slow devices don't crawl to 100
      shown += (target - shown) * (1 - Math.exp(-dt * 6))
      if (target === 100 && shown > 98.5) shown = 100
      if (num.current) num.current.textContent = String(Math.round(shown)).padStart(3, '0')
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`
      if (!finished && shown === 100 && performance.now() - start > minTime) {
        finished = true
        exit()
      }
    }
    gsap.ticker.add(tick)

    const exit = () => {
      gsap.ticker.remove(tick)
      const done = () => {
        store.introDone = true
        emit('introDone')
        setGone(true)
      }
      if (store.reducedMotion) {
        gsap.to(el, { autoAlpha: 0, duration: 0.5, onComplete: done })
        return
      }
      const tl = gsap.timeline({ onComplete: done })
      tl.to(el.querySelectorAll('[data-fade]'), { yPercent: -110, duration: 0.7, ease: 'power3.in', stagger: 0.04 })
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'expo.inOut' }, '-=0.15')
        // let the hero start rising while the curtain is still moving
        .call(() => emit('introStart'), [], '-=0.75')
    }

    return () => {
      gsap.ticker.remove(tick)
      clearTimeout(t1)
      clearTimeout(safety)
      offReady()
      offFail()
    }
  }, [waitForScene])

  if (gone) return null
  return (
    <div ref={root} className={styles.preloader} role="status" aria-label="Loading ASTRA">
      <div className={styles.center}>
        <span className={styles.mask}>
          <span data-fade className={styles.word}>ASTRA</span>
        </span>
        <span className={styles.mask}>
          <span data-fade className={styles.note}>arming nine gates · default state NO TRADE</span>
        </span>
      </div>
      <div className={styles.foot}>
        <span className={styles.mask}>
          <span data-fade className={styles.count} ref={num}>000</span>
        </span>
        <span className={styles.track}>
          <span className={styles.bar} ref={bar} />
        </span>
      </div>
    </div>
  )
}
