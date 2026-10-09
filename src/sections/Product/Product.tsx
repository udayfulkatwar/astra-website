import { PRODUCT_INTRO, PRODUCT_MODULES, PRODUCT_TAG, PRODUCT_TITLE, SHOT_CAPTION, statusTone } from '../../lib/capabilities'
import styles from './Product.module.css'

/** Four product areas. Status dots follow the evidence in src/lib/capabilities.ts. */
export function Product() {
  return (
    <section id="product" className="section" data-theme="dark" aria-labelledby="product-title">
      <div className="section-head">
        <span className="tag">{PRODUCT_TAG}</span>
        <h2 id="product-title" className="display section-title">
          {PRODUCT_TITLE}
        </h2>
        <p className="section-intro">{PRODUCT_INTRO}</p>
      </div>
      <ul className={styles.grid}>
        {PRODUCT_MODULES.map((mod, i) => {
          const tone = statusTone(mod.status)
          return (
            <li key={mod.id} className={`panel ${styles.card}`}>
              <img
                className={styles.shot}
                src={mod.image}
                width={1440}
                height={900}
                alt={mod.alt}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.body}>
                <span className="tag" data-tone={tone}>
                  {mod.status}
                </span>
                <h3 className={styles.name}>{mod.name}</h3>
                <p className={styles.text}>{mod.text}</p>
                <p className={styles.caption}>
                  <span className={styles.step}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{SHOT_CAPTION}</span>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
