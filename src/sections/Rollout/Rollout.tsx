import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef } from 'react'
import { ROLLOUT } from '../../lib/content'
import { store } from '../../lib/store'
import styles from './Rollout.module.css'

/** The path to live trading, in order. The ember line fills as you read it. */
export function Rollout() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const stages = gsap.utils.toArray<HTMLElement>(`.${styles.stage}`, el)
    const apply = (p: number) => {
      el.style.setProperty('--p', String(p))
      stages.forEach((s, i) => {
        const at = (i / (stages.length - 1)) * 0.92
        s.style.setProperty('--lit', String(Math.min(1, Math.max(0, (p - at) / 0.08))))
      })
    }
    if (store.reducedMotion) {
      apply(1)
      return
    }
    apply(0)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el.querySelector(`.${styles.track}`),
        start: 'top 75%',
        end: 'bottom 45%',
        onUpdate: (self) => apply(self.progress),
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="rollout" className={styles.rollout} data-theme="dark" aria-labelledby="rollout-title">
      <div className={styles.head}>
        <span className="tag" data-tone="pass" style={{ gridColumn: '1 / -1' }}>
          rollout · backtest → live
        </span>
        <h2 id="rollout-title" className={`display ${styles.title}`}>
          Paper first. Live last.
        </h2>
        <p className={styles.intro}>
          Nothing reaches a funded account because the code compiles. Each stage is earned with evidence, and the last
          two only open with your explicit sign-off.
        </p>
      </div>
      <div className={styles.track}>
        <div className={styles.line} aria-hidden="true">
          <span className={styles.fill} />
        </div>
        <ol className={styles.stages}>
          {ROLLOUT.map((s, i) => (
            <li key={s.name} className={styles.stage} data-gated={s.gated || undefined}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.idx}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.name}>{s.name}</h3>
              <p className={styles.text}>{s.text}</p>
              {s.gated && <span className={styles.badge}>Needs your authorisation</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
