import gsap from 'gsap'
import { cloneElement, useEffect, useRef, type ReactElement, type Ref } from 'react'
import { isFinePointer } from '../../lib/device'
import { store } from '../../lib/store'

interface Props {
  children: ReactElement<{ ref?: Ref<HTMLElement> }>
  strength?: number
}

/** Pulls its child toward the pointer, then springs back. */
export function Magnetic({ children, strength = 0.35 }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || store.reducedMotion) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return cloneElement(children, { ref })
}
