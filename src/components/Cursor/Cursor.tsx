import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { isFinePointer } from '../../lib/device'
import styles from './Cursor.module.css'

type Mode = 'default' | 'hover' | 'view'

/**
 * A small dot that grows into a translucent lens over interactive things
 * and into an ember "View" disc over projects. Colour follows the section theme.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null)
  const [enabled] = useState(isFinePointer)
  const [mode, setMode] = useState<Mode>('default')
  const [label, setLabel] = useState('View')
  const [dark, setDark] = useState(false)
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (!enabled || !el.current) return
    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(el.current, 'x', { duration: 0.42, ease: 'power3.out' })
    const yTo = gsap.quickTo(el.current, 'y', { duration: 0.42, ease: 'power3.out' })

    let lastTarget: Element | null = null
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      xTo(e.clientX)
      yTo(e.clientY)
      setHidden(false)
      const t = e.target as Element
      if (t === lastTarget) return
      lastTarget = t
      const view = t.closest('[data-cursor="view"]')
      const interactive = t.closest('a, button, [role="button"], [data-cursor="hover"]')
      if (view) {
        setMode('view')
        setLabel(view.getAttribute('data-cursor-label') || 'View')
      } else setMode(interactive ? 'hover' : 'default')
      setDark(t.closest('[data-theme]')?.getAttribute('data-theme') === 'dark')
    }
    const leave = () => setHidden(true)
    const down = () => el.current?.classList.add(styles.pressed)
    const up = () => el.current?.classList.remove(styles.pressed)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div
      ref={el}
      className={styles.cursor}
      data-mode={mode}
      data-dark={dark || undefined}
      data-hidden={hidden || undefined}
      aria-hidden="true"
    >
      <div className={styles.disc}>
        <span className={styles.label}>{label}</span>
      </div>
    </div>
  )
}
