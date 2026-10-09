import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { NAV_LINKS } from '../Navigation/Navigation'
import { releaseLockedScroll, useLenis } from '../SmoothScroll/SmoothScroll'
import { shouldRestartScrollOnMenuClose } from '../SmoothScroll/anchorScroll'
import { MarketSessions } from '../LocalTime/MarketSessions'
import { SITE } from '../../lib/content'
import { store } from '../../lib/store'
import { MENU_EXIT_SECONDS, MENU_REVEAL_SECONDS } from './menuMotion'
import styles from './MenuOverlay.module.css'

const LINKS = [
  ...NAV_LINKS,
  { href: '#product', label: 'Product' },
  { href: '#principles', label: 'Principles' },
  { href: '#company', label: 'About' },
  { href: '#contact', label: 'Access' },
]
const ease = [0.16, 1, 0.3, 1] as const

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis()
  const first = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prev = document.activeElement as HTMLElement | null
    first.current?.focus({ preventScroll: true })
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      if (shouldRestartScrollOnMenuClose(store.introDone)) lenis?.start()
      prev?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, lenis])

  const go = (href: string) => {
    onClose()
    releaseLockedScroll(lenis, href)
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
          initial={store.reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: MENU_EXIT_SECONDS, ease } }}
          transition={{ duration: store.reducedMotion ? 0 : MENU_REVEAL_SECONDS, ease }}
        >
          <nav aria-label="Menu" className={styles.nav}>
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.href}>
                  <a
                    ref={i === 0 ? first : undefined}
                    href={l.href}
                    className={styles.big}
                    onClick={(e) => {
                      e.preventDefault()
                      go(l.href)
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.foot}>
            <a className={styles.mail} href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <MarketSessions className={styles.times} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
