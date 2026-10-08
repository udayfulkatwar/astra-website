import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { NAV_LINKS } from '../Navigation/Navigation'
import { scrollToTarget, useLenis } from '../SmoothScroll/SmoothScroll'
import { MarketSessions } from '../LocalTime/MarketSessions'
import { SITE } from '../../lib/content'
import styles from './MenuOverlay.module.css'

const LINKS = [
  ...NAV_LINKS,
  { href: '#product', label: 'Product' },
  { href: '#engineering', label: 'Engineering' },
  { href: '#principles', label: 'Principles' },
  { href: '#company', label: 'Company' },
  { href: '#contact', label: 'Access' },
]
const ease = [0.76, 0, 0.24, 1] as const

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis()
  const first = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prev = document.activeElement as HTMLElement | null
    const t = setTimeout(() => first.current?.focus(), 350)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', key)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', key)
      lenis?.start()
      prev?.focus?.()
    }
  }, [open, onClose, lenis])

  const go = (href: string) => {
    onClose()
    setTimeout(() => scrollToTarget(lenis, href), 450)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={styles.overlay}
          data-theme="dark"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease }}
        >
          <nav aria-label="Menu" className={styles.nav}>
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.href} className={styles.mask}>
                  <motion.a
                    ref={i === 0 ? first : undefined}
                    href={l.href}
                    className={styles.big}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.href)
                    }}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-110%' }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.06 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className={styles.foot}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <a className={styles.mail} href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <MarketSessions className={styles.times} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
