import { ENGINEERING_DECISIONS, ENGINEERING_INTRO, ENGINEERING_WRITTEN, FLOW } from '../../lib/productFacts'
import styles from './Engineering.module.css'

export function Engineering() {
  return (
    <section id="engineering" className="section" data-theme="dark" aria-labelledby="engineering-title">
      <div className="section-head">
        <span className="tag" data-tone="lilac">engineering · advice beside the gate</span>
        <h2 id="engineering-title" className="display section-title">
          Claude helps build it. The gate decides.
        </h2>
        <p className="section-intro">{ENGINEERING_INTRO}</p>
      </div>

      <div className={styles.split}>
        <article>
          <h3>How the software is written</h3>
          <p>{ENGINEERING_WRITTEN}</p>
        </article>
        <article>
          <h3>How a trade is allowed</h3>
          <p>{ENGINEERING_DECISIONS}</p>
        </article>
      </div>

      <ol className={styles.flow} aria-label="How a decision moves through ASTRA">
        {FLOW.map((step, i) => (
          <li key={step.name} className={styles.step} data-kind={step.kind}>
            <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.stepName}>{step.name}</span>
            <span className={styles.stepNote}>{step.note}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
