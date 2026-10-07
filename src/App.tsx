import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { ChapterHud } from './components/ChapterHud/ChapterHud'
import { Cursor } from './components/Cursor/Cursor'
import { MenuOverlay } from './components/MenuOverlay/MenuOverlay'
import { Navigation } from './components/Navigation/Navigation'
import { Preloader } from './components/Preloader/Preloader'
import { SmoothScroll } from './components/SmoothScroll/SmoothScroll'
import { useMousePosition } from './hooks/useMousePosition'
import { usePerformanceTier } from './hooks/usePerformanceTier'
import { on } from './lib/store'
import { Agents } from './sections/Agents/Agents'
import { Command } from './sections/Command/Command'
import { Contact } from './sections/Contact/Contact'
import { Gate } from './sections/Gate/Gate'
import { Hero } from './sections/Hero/Hero'
import { HeroFallback } from './sections/Hero/HeroFallback'
import { Pipeline } from './sections/Pipeline/Pipeline'
import { Principles } from './sections/Principles/Principles'
import { Rollout } from './sections/Rollout/Rollout'

// three.js and friends load in their own chunk; the DOM paints first
const HeroCanvas = lazy(() => import('./scenes/HeroScene/HeroCanvas'))

export default function App() {
  const { webgl: supported } = usePerformanceTier()
  const [webgl, setWebgl] = useState(supported)
  const [menuOpen, setMenuOpen] = useState(false)
  useMousePosition()

  useEffect(() => on('webglFailed', () => setWebgl(false)), [])
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <SmoothScroll>
      <a className="skip-link" href="#pipeline">
        Skip to content
      </a>
      <Preloader waitForScene={webgl} />
      {webgl ? (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      ) : (
        <HeroFallback />
      )}
      <Navigation menuOpen={menuOpen} onMenu={toggleMenu} />
      <MenuOverlay open={menuOpen} onClose={closeMenu} />
      <ChapterHud />
      <main>
        <Hero />
        <div className="content">
          <Pipeline />
          <Agents />
          <Gate />
          <Command />
          <Principles />
          <Rollout />
        </div>
        <Contact webgl={webgl} />
      </main>
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  )
}
