import { useEffect, useState } from 'react'
import { scrollToTarget, useLenis } from '../../components/SmoothScroll/SmoothScroll'
import { SITE } from '../../lib/content'
import { store } from '../../lib/store'
import { FILM, chooseFilmFile, compactMediaQuery, DEMO_SUPPORT, readSaveData } from './filmSource'
import styles from './Film.module.css'

/**
 * Product film. No autoplay. The browser picks the 720p file from the source
 * media query; save-data is not a media feature, so that case assigns the
 * compact file directly. The master file is unchanged.
 */
export function Film() {
  const lenis = useLenis()
  const [saveData] = useState(readSaveData)
  const [failed, setFailed] = useState(false)
  const forceCompact = chooseFilmFile({ width: window.innerWidth, saveData }) === '720' && saveData

  useEffect(() => {
    const onPop = () => {
      const section = document.getElementById(FILM.sectionId)
      if (location.hash === `#${FILM.sectionId}`) {
        if (lenis && !store.reducedMotion) scrollToTarget(lenis, `#${FILM.sectionId}`)
        else section?.scrollIntoView()
        section?.focus({ preventScroll: true })
        return
      }
      // The page records scroll restoration as manual, so Back would otherwise
      // stay at the film. Following the film anchor should return to the top.
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [lenis])

  return (
    <section
      id={FILM.sectionId}
      className={`section ${styles.film}`}
      tabIndex={-1}
      aria-labelledby="astra-film-title"
    >
      <div className="section-head">
        <span className="tag">astra in motion</span>
        <h2 id="astra-film-title" className="display section-title">
          See the Thinking Behind ASTRA
        </h2>
        <p className="section-intro">
          Explore ASTRA&apos;s approach to trading workflows, deterministic risk controls, and human oversight through a
          cinematic product introduction.
        </p>
      </div>

      <figure className={styles.figure}>
        <p className={`mono ${styles.label}`}>{FILM.label}</p>
        <div className={styles.frame}>
          <video
            className={styles.player}
            controls
            playsInline
            preload="none"
            poster={FILM.poster}
            width={1920}
            height={1080}
            aria-label={FILM.label}
            title={FILM.label}
            src={forceCompact ? FILM.compact : undefined}
            onError={() => setFailed(true)}
          >
            {forceCompact ? null : (
              <>
                <source src={FILM.compact} type="video/mp4" media={compactMediaQuery} />
                <source src={FILM.master} type="video/mp4" />
              </>
            )}
            <p>
              Your browser cannot play this film.{' '}
              <a className={styles.download} href={FILM.master}>
                Download the film
              </a>
              .
            </p>
          </video>
        </div>
        {failed && (
          <p className={styles.error} role="status">
            The film could not be loaded.{' '}
            <a className={styles.download} href={FILM.master}>
              Download the film
            </a>
            .
          </p>
        )}
        <figcaption className={styles.disclosure}>{FILM.disclosure}</figcaption>
        <p className={styles.support}>{DEMO_SUPPORT}</p>
        <a className={styles.demo} href={SITE.demoUrl} target="_blank" rel="noopener noreferrer">
          Explore the Demo
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </figure>
    </section>
  )
}
