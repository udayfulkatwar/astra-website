import {
  ENGINEERING_LAYERS,
  ENGINEERING_NOTE,
  ENGINEERING_P1,
  ENGINEERING_P2,
  ENGINEERING_RULE,
  ENGINEERING_TAG,
  ENGINEERING_TITLE,
  statusTone,
} from '../../lib/capabilities'
import styles from './Engineering.module.css'

/** How the software is built, and the six layers that keep advice apart from execution. */
export function Engineering() {
  return (
    <section id="engineering" className="section" data-theme="dark" aria-labelledby="engineering-title">
      <div className="section-head">
        <span className="tag">{ENGINEERING_TAG}</span>
        <h2 id="engineering-title" className="display section-title">
          {ENGINEERING_TITLE}
        </h2>
        <p className="section-intro">{ENGINEERING_P1}</p>
      </div>
      <p className={styles.follow}>{ENGINEERING_P2}</p>
      <p className={`mono panel ${styles.rule}`}>{ENGINEERING_RULE}</p>
      <ol className={styles.layers}>
        {ENGINEERING_LAYERS.map((layer, i) => {
          const tone = statusTone(layer.status)
          return (
            <li key={layer.id} className={`panel ${styles.layer}`}>
              <span className={`mono ${styles.idx}`}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.name}>{layer.name}</h3>
              <span className="tag" data-tone={tone}>
                {layer.status}
              </span>
              <p className={styles.text}>{layer.text}</p>
            </li>
          )
        })}
      </ol>
      <p className={styles.note}>{ENGINEERING_NOTE}</p>
    </section>
  )
}
