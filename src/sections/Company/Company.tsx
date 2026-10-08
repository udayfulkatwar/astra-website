import { COMPANY } from '../../lib/productFacts'
import styles from './Company.module.css'

export function Company() {
  return (
    <section id="company" className="section" data-theme="dark" aria-labelledby="company-title">
      <div className="section-head">
        <span className="tag" data-tone="pass">company</span>
        <h2 id="company-title" className="display section-title">
          ASTRA, founded September 2026.
        </h2>
        <p className="section-intro">India. One name: ASTRA.</p>
      </div>

      <dl className={styles.facts}>
        {COMPANY.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>
              {fact.href ? (
                <a href={fact.href}>{fact.text}</a>
              ) : (
                fact.text
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
