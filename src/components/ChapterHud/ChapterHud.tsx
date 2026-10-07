import gsap from 'gsap'
import { useCallback, useEffect, useRef } from 'react'
import { useDerived, pageProgress } from '../../hooks/useScrollProgress'
import { CHAPTERS, range } from '../../lib/animations'
import { store } from '../../lib/store'
import styles from './ChapterHud.module.css'

/**
 * Two quiet instruments: the hero's chapter index (a real sequence, so it is
 * numbered) and a hairline page meter on the right edge.
 */
export function ChapterHud() {
  const segs = useRef<(HTMLSpanElement | null)[]>([])
  const meter = useRef<HTMLSpanElement>(null)
  const root = useRef<HTMLDivElement>(null)

  const readChapter = useCallback(() => {
    let idx = 0
    CHAPTERS.forEach((c, i) => {
      if (store.progress >= c.start) idx = i
    })
    return idx
  }, [])
  const readInHero = useCallback(() => store.progress < 0.995 && store.introDone, [])
  const chapter = useDerived(readChapter)
  const inHero = useDerived(readInHero)

  useEffect(() => {
    const tick = () => {
      const p = store.progress
      CHAPTERS.forEach((c, i) => {
        const end = CHAPTERS[i + 1]?.start ?? 1
        const el = segs.current[i]
        if (el) el.style.transform = `scaleX(${range(p, c.start, end)})`
      })
      if (meter.current) meter.current.style.transform = `scaleY(${pageProgress()})`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div ref={root} className={styles.hud} aria-hidden="true">
      <div className={styles.chapters} data-visible={inHero || undefined}>
        <span className={styles.index}>
          {String(chapter + 1).padStart(2, '0')}
          <span className={styles.of}>/{String(CHAPTERS.length).padStart(2, '0')}</span>
        </span>
        <span className={styles.labelMask}>
          <span key={chapter} className={styles.label}>
            {CHAPTERS[chapter].label}
          </span>
        </span>
        <span className={styles.segs}>
          {CHAPTERS.map((c, i) => (
            <span key={c.id} className={styles.seg}>
              <span ref={(el) => { segs.current[i] = el }} className={styles.fill} />
            </span>
          ))}
        </span>
      </div>
      <div className={styles.meter}>
        <span ref={meter} className={styles.meterFill} />
      </div>
    </div>
  )
}
