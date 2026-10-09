import { LayoutGroup, motion } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import { Magnetic } from '../Magnetic/Magnetic'
import { scrollToTarget, useLenis } from '../SmoothScroll/SmoothScroll'
import { LogoMark } from './Logo'
import styles from './Navigation.module.css'

export const NAV_LINKS = [
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#agents', label: 'Agents' },
  { href: '#gate', label: 'The gate' },
  { href: '#command', label: 'Command' },
]

export function Navigation({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const lenis = useLenis()
  const [hovered, setHovered] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = `#${e.target.id}`
            setActive(NAV_LINKS.some((l) => l.href === id) ? id : null)
          }
        }
      },
      { rootMargin: '-45% 0px -54% 0px' },
    )
    sections.forEach((s) => obs.observe(s))
    const onScroll = () => setScrolled(scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const go = (e: MouseEvent, href: string | number) => {
    e.preventDefault()
    scrollToTarget(lenis, href)
  }

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined}>
      <a href="#top" className={styles.logo} onClick={(e) => go(e, 0)} aria-label="ASTRA, in development, back to top">
        <LogoMark />
        <span className={styles.wordmark}>ASTRA</span>
        <span className={styles.version}>in development</span>
      </a>

      <nav aria-label="Primary" className={styles.navWrap}>
        <LayoutGroup>
          <ul className={styles.pill} onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={styles.link}
                  data-active={active === l.href || undefined}
                  onMouseEnter={() => setHovered(l.href)}
                  onFocus={() => setHovered(l.href)}
                  onBlur={() => setHovered(null)}
                  onClick={(e) => go(e, l.href)}
                  aria-current={active === l.href ? 'location' : undefined}
                >
                  {hovered === l.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className={styles.hover}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className={styles.linkText}>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </LayoutGroup>
      </nav>

      <div className={styles.right}>
        <a href="#contact" className={styles.access} onClick={(e) => go(e, '#contact')}>
          Request access
        </a>
        <Magnetic strength={0.4}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={onMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            data-open={menuOpen || undefined}
          >
            <span className={styles.bars} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </Magnetic>
      </div>
    </header>
  )
}
