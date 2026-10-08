import { CAPABILITIES, PRODUCT_BODY, PRODUCT_GATE, PRODUCT_INTRO, PRODUCT_SHOTS } from '../../lib/productFacts'
import { StatusMark } from '../../components/StatusMark/StatusMark'
import styles from './Product.module.css'

export function Product() {
  return (
    <section id="product" className="section" data-theme="dark" aria-labelledby="product-title">
      <div className="section-head">
        <span className="tag" data-tone="ember">product · from the source</span>
        <h2 id="product-title" className="display section-title">
          What the software contains.
        </h2>
        <p className="section-intro">{PRODUCT_INTRO}</p>
      </div>

      <p className={styles.body}>{PRODUCT_BODY}</p>

      <ul className={styles.rows}>
        {CAPABILITIES.map((item) => (
          <li key={item.name} className={styles.row}>
            <h3 className={styles.name}>{item.name}</h3>
            <StatusMark status={item.status} />
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>

      <p className={styles.note}>{PRODUCT_GATE}</p>

      <div className={styles.shots}>
        {PRODUCT_SHOTS.map((shot) => (
          <figure key={shot.src} className={styles.shot}>
            <img
              src={shot.src}
              width={shot.width}
              height={shot.height}
              alt={shot.alt}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              <StatusMark status="Simulated" />
              <span>{shot.caption}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
