import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Magnetic } from '../../components/Magnetic/Magnetic'
import { scrollToTarget, useLenis } from '../../components/SmoothScroll/SmoothScroll'
import { SplitLines } from '../../components/SplitLines/SplitLines'
import { SITE } from '../../lib/content'
import { FILM, filmHref } from '../Film/filmSource'
import { emit, on, store } from '../../lib/store'
import { AgentLog } from './AgentLog'
import styles from './Hero.module.css'

const STATES = [
  {
    lines: ['Survive first.', 'Trade second.'],
    label: 'Survive first. Trade second.',
    note: 'ASTRA is an autonomous agent for prop-firm trading. It watches markets around the clock, and nine deterministic gates decide whether it may act.',
    as: 'h1' as const,
  },
  {
    lines: ['Every market', 'speaks in signals.'],
    label: 'Every market speaks in signals.',
    note: 'Price, news, the economic calendar and sentiment stream in as data. Agents turn them into context. Context is never a decision.',
  },
  {
    lines: ['Nine gates', 'between a signal', 'and an order.'],
    label: 'Nine gates between a signal and an order.',
    note: 'Most signals are stopped. The few that pass every gate become an order. One unknown is enough to stop.',
  },
  {
    lines: ['AI advises.', 'Rules decide.'],
    label: 'AI advises. Rules decide.',
    note: 'The lilac cloud is the model’s view. The ember cage is the rules. Nothing reaches the core without passing all nine.',
  },
]

/** Scroll windows for each text state: [inStart, inEnd, outStart, outEnd] */
const WINDOWS: [number, number, number, number][] = [
  [0, 0, 0.07, 0.14],
  [0.17, 0.25, 0.33, 0.38],
  [0.43, 0.51, 0.62, 0.67],
  [0.72, 0.8, 2, 2],
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = store.reducedMotion
    const mobile = innerWidth < 768
    const blur = (v: number) => (reduced || mobile ? 'blur(0px)' : `blur(${v}px)`)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => (store.progress = self.progress),
        onLeave: () => (store.progress = 1),
      })
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => setCanvas('hero', self.isActive),
      })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: reduced ? true : 0.8 },
      })
      tl.set({}, {}, 1)

      gsap.utils.toArray<HTMLElement>(`.${styles.state}`, el).forEach((block, i) => {
        const [a, b, c, d] = WINDOWS[i]
        const inners = block.querySelectorAll('.inner')
        const fades = block.querySelectorAll('[data-fade]')
        if (i > 0) {
          tl.fromTo(block, { autoAlpha: 0, filter: blur(10) }, { autoAlpha: 1, filter: blur(0), duration: (b - a) * 0.7 }, a)
          tl.fromTo(
            inners,
            { yPercent: reduced ? 0 : 108 },
            { yPercent: 0, duration: (b - a) * 0.8, stagger: (b - a) * 0.08, ease: 'power3.out' },
            a,
          )
          if (fades.length) tl.fromTo(fades, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: (b - a) * 0.6 }, a + (b - a) * 0.4)
        }
        if (c < 1) {
          tl.to(block, { autoAlpha: 0, y: reduced ? 0 : -36, filter: blur(12), duration: d - c, ease: 'power2.in' }, c)
        }
      })
      if (hint.current) tl.to(hint.current, { autoAlpha: 0, duration: 0.03 }, 0.005)
    }, el)

    return () => ctx.revert()
  }, [])

  // Intro: headline rises as the curtain lifts
  useEffect(() => {
    const el = root.current
    if (!el) return
    const first = el.querySelector(`.${styles.state}`)
    if (!first) return
    const inners = first.querySelectorAll('.inner')
    const fades = first.querySelectorAll('[data-fade]')
    const reduced = store.reducedMotion
    if (!reduced) {
      gsap.set(inners, { yPercent: 108 })
      gsap.set([...fades, hint.current], { autoAlpha: 0, y: 12 })
    }
    const play = () => {
      if (reduced) return
      gsap.to(inners, { yPercent: 0, duration: 1.5, ease: 'expo.out', stagger: 0.1, delay: 0.1 })
      gsap.to(fades, { autoAlpha: 1, y: 0, duration: 1.1, delay: 0.55, stagger: 0.08, ease: 'power3.out' })
      gsap.to(hint.current, { autoAlpha: 1, y: 0, duration: 1, delay: 1.1 })
    }
    if (store.introDone) play()
    return on('introStart', play)
  }, [])

  return (
    <section ref={root} id="top" className={styles.hero} data-theme="dark" aria-label="Introduction">
      <div className={styles.sticky}>
        <div className={styles.copy}>
          {STATES.map((s, i) => (
            <div key={i} className={styles.state} data-state={i}>
              {i === 0 && (
                <p className={styles.status} data-fade>
                  <span className={styles.statusDot} aria-hidden="true" />
                  Default state <strong>NO TRADE</strong>
                </p>
              )}
              <SplitLines as={s.as ?? 'p'} lines={s.lines} label={s.label} className={`display ${styles.headline}`} />
              <p className={styles.note} data-fade>
                {s.note}
              </p>
              {i === 0 && (
                <div className={styles.ctas} data-fade>
                  <Magnetic strength={0.25}>
                    <a
                      href="#gate"
                      className={styles.primary}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToTarget(lenis, '#gate')
                      }}
                    >
                      Trade Gate
                    </a>
                  </Magnetic>
                  <a
                    href="#pipeline"
                    className={styles.secondary}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToTarget(lenis, '#pipeline')
                    }}
                  >
                    Meet ASTRA
                  </a>
                  <a
                    href={filmHref}
                    className={styles.secondary}
                    onClick={(e) => {
                      const section = document.getElementById(FILM.sectionId)
                      if (!store.reducedMotion) {
                        e.preventDefault()
                        scrollToTarget(lenis, filmHref)
                        if (location.hash !== filmHref) history.pushState(null, '', filmHref)
                      }
                      section?.focus({ preventScroll: true })
                    }}
                  >
                    Watch the video
                  </a>
                  <a
                    href={SITE.demoUrl}
                    className={styles.secondary}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Click for demo
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
        <AgentLog />
        <div ref={hint} className={styles.hint} aria-hidden="true">
          <span className="mono">scroll</span>
          <span className={styles.hintLine} />
        </div>
      </div>
    </section>
  )
}

/** Canvas runs only while the hero or the contact section can be seen. */
const activeZones = new Set<string>(['hero'])
export function setCanvas(zone: string, active: boolean) {
  if (zone === 'contact') store.contactVisible = active
  if (active) activeZones.add(zone)
  else activeZones.delete(zone)
  const next = activeZones.size > 0
  if (next !== store.canvasActive) {
    store.canvasActive = next
    emit('canvasActive')
  }
}
