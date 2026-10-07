import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import { NEVER, STACK } from '../../lib/content'
import { store } from '../../lib/store'
import styles from './Principles.module.css'

const STATEMENT = 'Account survival comes before every opportunity.'

export function Principles() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || store.reducedMotion) return
    const ctx = gsap.context(() => {
      // words light up at reading pace
      gsap.fromTo(
        `.${styles.word}`,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: `.${styles.statement}`, start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="principles" className="section" data-theme="dark" aria-labelledby="principles-title">
      <p className={`display ${styles.statement}`} aria-label={STATEMENT}>
        {STATEMENT.split(' ').map((w, i) => (
          <span key={i} className={styles.word} aria-hidden="true">
            {w}{' '}
          </span>
        ))}
      </p>

      <div className={styles.body}>
        <div className={styles.side}>
          <h2 id="principles-title" className={styles.h}>
            What ASTRA will never do
          </h2>
          <p className={styles.lead}>
            These are not settings. They are how the system is built, and they hold in paper, shadow and live alike.
          </p>
        </div>
        <ol className={styles.list}>
          {NEVER.map((n, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.x} aria-hidden="true" />
              <span>{n}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.stack} aria-label="Built on">
        <span className="mono">built on</span>
        <ul>
          {STACK.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
