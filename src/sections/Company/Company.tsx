import { COMPANY_BLOCKS, COMPANY_BODY, COMPANY_TAG, COMPANY_TITLE } from './copy'
import styles from './Company.module.css'

/** About the project. Names and titles are project leadership, not a corporate filing. */
export function Company() {
  return (
    <section id="company" className="section" data-theme="dark" aria-labelledby="company-title">
      <div className="section-head">
        <span className="tag">{COMPANY_TAG}</span>
        <h2 id="company-title" className="display section-title">
          {COMPANY_TITLE}
        </h2>
        <p className="section-intro">{COMPANY_BODY[0]}</p>
      </div>
      <p className={styles.follow}>{COMPANY_BODY[1]}</p>
      <div className={styles.blocks}>
        {COMPANY_BLOCKS.map((block) => (
          <article key={block.title} className={styles.block}>
            <h3 className={styles.h}>{block.title}</h3>
            <p>{block.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
