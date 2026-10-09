import {
  COMMITMENTS,
  COMMITMENT_TITLE,
  COMPANY_BODY,
  COMPANY_TAG,
  COMPANY_TITLE,
  LEADERS,
  LEADERSHIP_INTRO,
  LEADERSHIP_TITLE,
  MISSION,
  leaderExtras,
} from './copy'
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

      <div className={styles.leadership}>
        <h3 id="company-people" className={styles.subhead}>
          {LEADERSHIP_TITLE}
        </h3>
        <p className={styles.lead}>{LEADERSHIP_INTRO}</p>
        <ul className={styles.people}>
          {LEADERS.map((person) => {
            const extra = leaderExtras(person)
            return (
              <li key={person.id}>
                <article className={`panel brackets ${styles.card}`} aria-labelledby={person.id}>
                  <p className={styles.initials} aria-hidden="true">
                    {person.initials}
                  </p>
                  <h4 id={person.id} className={styles.name}>
                    {person.name}
                  </h4>
                  <p className={styles.role}>{person.title}</p>
                  <p className={styles.note}>{person.roleNote}</p>
                  {extra.bio ? <p className={styles.bio}>{extra.bio}</p> : null}
                  {extra.quote ? (
                    <blockquote className={styles.quote}>
                      <p>{extra.quote}</p>
                    </blockquote>
                  ) : null}
                  {extra.links.length > 0 ? (
                    <ul className={styles.links}>
                      {extra.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} rel="noopener noreferrer">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.commitment}>
        <h3 id="company-commitment" className={styles.subhead}>
          {COMMITMENT_TITLE}
        </h3>
        <ul className={styles.points}>
          {COMMITMENTS.map((item) => (
            <li key={item.label} className={styles.point}>
              <h4>{item.label}</h4>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.blocks}>
        <article className={styles.block}>
          <h3 className={styles.h}>{MISSION.title}</h3>
          <p>{MISSION.text}</p>
        </article>
      </div>
    </section>
  )
}
