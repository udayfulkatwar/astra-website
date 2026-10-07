import styles from './HeroFallback.module.css'

/** No WebGL: the armillary core drawn in CSS, so the page keeps its composition. */
export function HeroFallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <div className={styles.core}>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} style={{ ['--i' as string]: i }} />
        ))}
        <b />
      </div>
    </div>
  )
}
