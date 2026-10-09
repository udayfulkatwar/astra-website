import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { MarketSessions } from '../LocalTime/MarketSessions'
import { releaseLockedScroll, useLenis } from '../SmoothScroll/SmoothScroll'
import { shouldRestartScrollOnMenuClose } from '../SmoothScroll/anchorScroll'
import { store } from '../../lib/store'
import { MENU_ACCESS, MENU_ITEMS } from './menuItems'
import { MENU_EXIT_SECONDS, MENU_REVEAL_SECONDS } from './menuMotion'
import styles from './MenuOverlay.module.css'

const ease = [0.16, 1, 0.3, 1] as const

function currentHref() {
  const hash = location.hash
  if (hash === '' || hash === '#top') return '#top'
  return hash
}

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenis = useLenis()
  const first = useRef<HTMLAnchorElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const y = window.scrollY
    const hashAtOpen = location.hash
    lenis?.stop()
    document.documentElement.setAttribute('data-menu-open', '')
    const prev = document.activeElement as HTMLElement | null
    first.current?.focus({ preventScroll: true })

    const focusables = () => {
      const root = panel.current
      const button = document.querySelector<HTMLElement>('button[aria-controls="site-menu"]')
      const inside = root
        ? [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
        : []
      return [button, ...inside].filter((node): node is HTMLElement => node != null)
    }

    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      const list = scroller.current
      if (list && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Home' || e.key === 'End')) {
        e.preventDefault()
        const page = Math.max(48, list.clientHeight * 0.85)
        if (e.key === 'ArrowDown') list.scrollBy({ top: 40 })
        if (e.key === 'ArrowUp') list.scrollBy({ top: -40 })
        if (e.key === 'PageDown') list.scrollBy({ top: page })
        if (e.key === 'PageUp') list.scrollBy({ top: -page })
        if (e.key === 'Home') list.scrollTop = 0
        if (e.key === 'End') list.scrollTop = list.scrollHeight
        return
      }
      if (e.key !== 'Tab') return
      const nodes = focusables()
      if (nodes.length === 0) return
      const index = nodes.indexOf(document.activeElement as HTMLElement)
      const next = e.shiftKey ? (index <= 0 ? nodes.length - 1 : index - 1) : index === nodes.length - 1 || index === -1 ? 0 : index + 1
      e.preventDefault()
      nodes[next]?.focus({ preventScroll: true })
      nodes[next]?.scrollIntoView?.({ block: 'nearest' })
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('keydown', key)
      document.documentElement.removeAttribute('data-menu-open')
      if (location.hash === hashAtOpen && Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y)
      if (shouldRestartScrollOnMenuClose(store.introDone)) lenis?.start()
      prev?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, lenis])

  const go = (href: string) => {
    onClose()
    if (location.hash !== href) {
      history.replaceState({ y: window.scrollY }, '')
      history.pushState(null, '', href)
    }
    releaseLockedScroll(lenis, href === '#top' ? 0 : href)
  }

  const here = currentHref()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={styles.overlay}
          data-lenis-prevent
          data-theme="dark"
          initial={store.reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: MENU_EXIT_SECONDS, ease } }}
          transition={{ duration: store.reducedMotion ? 0 : MENU_REVEAL_SECONDS, ease }}
        >
          <button type="button" className={styles.backdrop} aria-label="Close menu" onClick={onClose} />
          <motion.div
            ref={panel}
            className={styles.panel}
            initial={store.reducedMotion ? false : { x: 16 }}
            animate={{ x: 0 }}
            exit={{ x: 12, transition: { duration: store.reducedMotion ? 0 : MENU_EXIT_SECONDS, ease } }}
            transition={{ duration: store.reducedMotion ? 0 : MENU_REVEAL_SECONDS, ease }}
          >
            <div ref={scroller} className={styles.scroller} tabIndex={-1} data-lenis-prevent>
              <nav aria-label="Menu">
                <ul>
                  {MENU_ITEMS.map((item, i) => (
                    <li key={item.href}>
                      <a
                        ref={i === 0 ? first : undefined}
                        href={item.href}
                        className={styles.item}
                        aria-current={here === item.href ? 'location' : undefined}
                        onClick={(e) => {
                          e.preventDefault()
                          go(item.href)
                        }}
                      >
                        <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={styles.label}>{item.label}</span>
                        <span className={styles.text}>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <a
                className={styles.cta}
                href={MENU_ACCESS.href}
                onClick={(e) => {
                  e.preventDefault()
                  go(MENU_ACCESS.href)
                }}
              >
                {MENU_ACCESS.label}
              </a>
            </div>
            <div className={styles.foot}>
              <MarketSessions className={styles.times} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
