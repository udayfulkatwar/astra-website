import {
  COMMITMENT_LABEL,
  COMMITMENT_ORIGIN,
  COMMITMENT_TEXT,
  COMPANY_BODY,
  LEADERS,
  LEADERSHIP_INTRO,
  LEADERSHIP_TAG,
  LEADERSHIP_TITLE,
  PRINCIPLE_LABEL,
  type Leader,
} from './copy'
import styles from './Company.module.css'

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.84v2.12h.05c.53-1.01 1.84-2.08 3.79-2.08 4.06 0 4.81 2.67 4.81 6.15V24h-4v-7.71c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z"
      />
    </svg>
  )
}

function Portrait({ person }: { person: Leader }) {
  const photo = person.photo
  if (!photo) {
    return (
      <p className={styles.initials} aria-hidden="true">
        {person.initials}
      </p>
    )
  }
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${photo.avif} 212w, ${photo.avif2x} 424w`}
        sizes="(min-width: 1024px) 212px, 168px"
      />
      <source
        type="image/webp"
        srcSet={`${photo.webp} 212w, ${photo.webp2x} 424w`}
        sizes="(min-width: 1024px) 212px, 168px"
      />
      <img
        className={styles.photo}
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

/** About the project. Names and titles are project leadership, not a corporate filing. */
export function Company() {
  return (
    <section id="company" className="section" data-theme="dark" aria-labelledby="company-title">
      <div className={`section-head ${styles.head}`}>
        <span className="tag">{LEADERSHIP_TAG}</span>
        <h2 id="company-title" className="display section-title">
          {LEADERSHIP_TITLE}
        </h2>
        <p className="section-intro">{LEADERSHIP_INTRO}</p>
      </div>

      <ul className={styles.people}>
        {LEADERS.map((person) => (
          <li key={person.id}>
            <article className={`panel brackets ${styles.card}`} aria-labelledby={person.id}>
              <div className={styles.identity}>
                <div className={styles.frame}>
                  <Portrait person={person} />
                </div>
                <div className={styles.who}>
                  <h3 id={person.id} className={styles.name}>
                    {person.name}
                  </h3>
                  <p className={styles.role}>{person.title}</p>
                </div>
              </div>
              <div className={styles.bio}>
                {person.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className={styles.principle}>
                <p className={styles.principleLabel}>{PRINCIPLE_LABEL}</p>
                <blockquote>
                  <p>{person.principle}</p>
                </blockquote>
              </div>
              <a
                className={styles.profile}
                href={person.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={person.linkedin.label}
              >
                <LinkedInIcon />
                <span aria-hidden="true">LinkedIn</span>
              </a>
            </article>
          </li>
        ))}
      </ul>

      <footer className={styles.commitment}>
        <h3 className={styles.commitLabel}>{COMMITMENT_LABEL}</h3>
        <blockquote className={styles.commitQuote}>
          <p>{COMMITMENT_TEXT}</p>
        </blockquote>
        <p className={styles.origin}>{COMMITMENT_ORIGIN}</p>
        <p className={styles.status}>{COMPANY_BODY[0]}</p>
      </footer>
    </section>
  )
}
