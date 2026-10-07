import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef, useState } from 'react'
import { MarketSessions } from '../../components/LocalTime/MarketSessions'
import { Magnetic } from '../../components/Magnetic/Magnetic'
import { scrollToTarget, useLenis } from '../../components/SmoothScroll/SmoothScroll'
import { SplitLines } from '../../components/SplitLines/SplitLines'
import { DISCLAIMER, SITE } from '../../lib/content'
import { store } from '../../lib/store'
import { setCanvas } from '../Hero/Hero'
import styles from './Contact.module.css'

/** The finale: the locked core returns behind the invitation. */
export function Contact({ webgl }: { webgl: boolean }) {
  const root = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const [copied, setCopied] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setCanvas('contact', self.isActive),
      })
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (self) => (store.outro = self.progress),
        onLeaveBack: () => (store.outro = 0),
      })
      if (!store.reducedMotion) {
        gsap.fromTo(
          el.querySelectorAll('.inner'),
          { yPercent: 108 },
          {
            yPercent: 0,
            duration: 1.4,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 55%', toggleActions: 'play none none reverse' },
          },
        )
      }
    }, el)
    return () => ctx.revert()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      const range = document.createRange()
      const node = document.getElementById('contact-email')
      if (node) {
        range.selectNodeContents(node)
        const sel = getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
    }
  }

  return (
    <section
      ref={root}
      id="contact"
      className={styles.contact}
      data-theme="dark"
      data-webgl={webgl || undefined}
      aria-labelledby="contact-title"
    >
      <div className={styles.main}>
        <span className="tag" data-tone="pass">
          early access · paper mode first
        </span>
        <SplitLines
          as="h2"
          className={`display ${styles.title}`}
          lines={["Let's protect", 'your next account.']}
          label="Let's protect your next account."
        />
        <p className={styles.lead}>
          ASTRA is being built in the open, one gate at a time. Tell us how you trade and which firms you trade with.
        </p>
        <div className={styles.actions}>
          <Magnetic strength={0.3}>
            <a className={styles.cta} href={`mailto:${SITE.email}?subject=ASTRA%20early%20access`}>
              <span className={styles.ctaFill} aria-hidden="true" />
              <span className={styles.ctaText}>
                <span>Request access</span>
                <span aria-hidden="true">Write to us</span>
              </span>
            </a>
          </Magnetic>
          <div className={styles.mailBox}>
            <span className="mono" style={{ color: 'var(--faint)' }}>
              email
            </span>
            <span id="contact-email" className={styles.mail}>
              {SITE.email}
            </span>
            <button type="button" className={styles.copy} onClick={copy}>
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footCol}>
          <span className="mono" style={{ color: 'var(--faint)' }}>
            market sessions · approx.
          </span>
          <MarketSessions className={styles.sessions} />
        </div>
        <p className={styles.disclaimer}>{DISCLAIMER}</p>
        <div className={styles.legal}>
          <span>© 2026 ASTRA</span>
          <button type="button" className={styles.link} onClick={() => scrollToTarget(lenis, 0)}>
            Back to top
          </button>
        </div>
      </footer>
    </section>
  )
}
