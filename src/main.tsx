import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/jetbrains-mono'
import './styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { prefersReducedMotion } from './lib/device'
import { store } from './lib/store'

const params = new URLSearchParams(location.search)
store.reducedMotion = prefersReducedMotion() || params.has('reduced')
// test hook: ?debug exposes the shared store for automated checks
if (params.has('debug')) (window as unknown as { __astra: typeof store }).__astra = store

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
