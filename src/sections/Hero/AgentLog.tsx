import { useCallback, useEffect, useRef, useState } from 'react'
import { useDerived } from '../../hooks/useScrollProgress'
import { CHAPTERS } from '../../lib/animations'
import { store } from '../../lib/store'
import styles from './Hero.module.css'

type Tone = 'mute' | 'pass' | 'ember' | 'lilac'
type Entry = [string, string, Tone]

/** What the agent is "thinking" in each chapter. Illustrative system events, no market data. */
const SCRIPT: Entry[][] = [
  [
    ['agent', 'session start · paper mode', 'mute'],
    ['health', 'risk engine ONLINE', 'pass'],
    ['health', 'prop-firm rules loaded · 1 profile', 'pass'],
    ['decision', 'no qualified setup → NO TRADE', 'ember'],
  ],
  [
    ['ingest', 'price feed · fresh', 'pass'],
    ['ingest', 'news headline received', 'mute'],
    ['ai', 'classify impact · advisory only', 'lilac'],
    ['context', 'context ≠ decision', 'mute'],
  ],
  [
    ['gate 01', 'data · PASS', 'pass'],
    ['gate 04', 'news blackout · PASS', 'pass'],
    ['gate 06', 'risk 1.4% > 1.0% · FAIL', 'ember'],
    ['decision', 'REJECTED · logged with reasons', 'ember'],
  ],
  [
    ['ai', 'setup explanation attached', 'lilac'],
    ['gates', '9 / 9 PASS', 'pass'],
    ['canTrade', 'APPROVED · awaiting execution check', 'pass'],
    ['journal', 'decision record written', 'mute'],
  ],
]

export function AgentLog() {
  const readChapter = useCallback(() => {
    let idx = 0
    CHAPTERS.forEach((c, i) => {
      if (store.progress >= c.start) idx = i
    })
    return idx
  }, [])
  const chapter = useDerived(readChapter)
  const [shown, setShown] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  // stream lines one by one whenever the chapter changes
  useEffect(() => {
    setShown(store.reducedMotion ? SCRIPT[chapter].length : 0)
    if (store.reducedMotion) return
    let n = 0
    const step = () => {
      n++
      setShown(n)
      if (n < SCRIPT[chapter].length) timer.current = window.setTimeout(step, 420)
    }
    timer.current = window.setTimeout(step, 250)
    return () => window.clearTimeout(timer.current)
  }, [chapter])

  return (
    <aside className={`panel brackets ${styles.log}`} aria-label="Agent log, illustrative">
      <div className={styles.logHead}>
        <span className="mono">agent.log</span>
        <span className={`mono ${styles.logNote}`}>illustrative</span>
      </div>
      <ol className={styles.logLines} aria-live="off">
        {SCRIPT[chapter].slice(0, shown).map(([k, v, tone], i) => (
          <li key={`${chapter}-${i}`} className={styles.logLine} data-tone={tone}>
            <span className={styles.logKey}>{k}</span>
            <span>{v}</span>
          </li>
        ))}
        {shown < SCRIPT[chapter].length && <li className={styles.caret} aria-hidden="true" />}
      </ol>
    </aside>
  )
}
