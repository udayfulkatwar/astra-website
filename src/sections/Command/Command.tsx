import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { scrollToTarget, useLenis } from '../../components/SmoothScroll/SmoothScroll'
import { KILL_SWITCHES } from '../../lib/content'
import { canTrade, EXAMPLE_PROFILE as P, type AccountHealth } from '../../lib/gate/canTrade'
import styles from './Command.module.css'

type SwitchId = (typeof KILL_SWITCHES)[number]['id']

/** Example accounts. Every number here is illustrative and labelled as such in the UI. */
const ACCOUNTS = [
  { id: 'A', name: 'Evaluation A', size: '$100k', used: 34, dd: 22, open: 0.5, target: 61, strategy: 'London breakout', instrument: 'XAUUSD' },
  { id: 'B', name: 'Funded B', size: '$50k', used: 58, dd: 41, open: 0.25, target: 18, strategy: 'London breakout', instrument: 'NAS100' },
  { id: 'C', name: 'Evaluation C', size: '$25k', used: 86, dd: 63, open: 0, target: 9, strategy: 'NY reversal', instrument: 'EURUSD' },
]

const FEED = [
  { t: '14:02:31', acct: 'A', inst: 'XAUUSD', ok: true, why: '9 / 9 gates passed' },
  { t: '13:47:05', acct: 'B', inst: 'NAS100', ok: false, why: 'High-impact event inside blackout' },
  { t: '13:15:44', acct: 'C', inst: 'EURUSD', ok: false, why: 'Daily loss 86% used, restricted at 80%' },
  { t: '12:58:19', acct: 'A', inst: 'XAUUSD', ok: false, why: 'Setup on watch, not yet qualified' },
]

function blockReason(acct: (typeof ACCOUNTS)[number], on: Record<SwitchId, boolean>): string | null {
  if (on.global) return 'Global kill switch'
  if (on.account && acct.id === 'A') return 'Account kill switch'
  if (on.execution) return 'Execution disabled'
  if (on.strategy && acct.strategy === 'London breakout') return 'Strategy disabled'
  if (on.instrument && acct.instrument === 'XAUUSD') return 'Instrument disabled'
  return null
}

const healthTone = (h: AccountHealth) => (h === 'SAFE' ? 'pass' : h === 'CAUTION' ? 'caution' : 'ember')

export function Command() {
  const lenis = useLenis()
  const [on, setOn] = useState<Record<SwitchId, boolean>>({
    global: false, account: false, strategy: false, instrument: false, execution: false, ai: false, news: false,
  })
  const [sel, setSel] = useState('A')

  const rows = useMemo(
    () =>
      ACCOUNTS.map((a) => {
        const block = blockReason(a, on)
        const d = canTrade({
          marketData: 'FRESH',
          setup: 'QUALIFIED',
          calendar: 'CLEAR',
          dailyLossUsedPct: a.used,
          riskPct: 0.5,
          killSwitch: !!block,
        })
        return { ...a, health: d.health, allowed: d.approved, block: block ?? (d.approved ? null : d.reasons[0]) }
      }),
    [on],
  )
  const acct = rows.find((r) => r.id === sel)!
  const anyBlock = Object.entries(on).filter(([, v]) => v)
  const banner = on.global
    ? 'All new trades blocked by the global kill switch'
    : anyBlock.length
      ? `Restricted: ${anyBlock.map(([k]) => KILL_SWITCHES.find((s) => s.id === k)!.name.toLowerCase()).join(', ')}`
      : 'New trades allowed where every gate passes'

  const toggle = (id: SwitchId) => setOn((s) => ({ ...s, [id]: !s[id] }))

  return (
    <section id="command" className="section" data-theme="dark" aria-labelledby="command-title">
      <div className="section-head">
        <span className="tag" data-tone="ember">command centre · interface preview</span>
        <h2 id="command-title" className="display section-title">
          Every account, every switch, one screen.
        </h2>
        <p className="section-intro">
          Watch each account’s buffers in real time and stop anything with one switch. Try them: the accounts below
          respond exactly as ASTRA would.
        </p>
      </div>

      <div className={`panel brackets ${styles.window}`}>
        <div className={styles.bar}>
          <span className="mono">astra / command</span>
          <span className={styles.mode}>paper mode</span>
          <span className={`mono ${styles.example}`}>example data</span>
        </div>

        <div className={styles.banner} data-blocked={anyBlock.length > 0 || undefined} aria-live="polite">
          <span className={styles.bannerDot} aria-hidden="true" />
          {banner}
        </div>

        <div className={styles.body}>
          <nav className={styles.accounts} aria-label="Accounts">
            <span className={`mono ${styles.colHead}`}>accounts</span>
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                className={styles.acct}
                data-active={sel === r.id || undefined}
                onClick={() => setSel(r.id)}
                aria-pressed={sel === r.id}
              >
                <span className={styles.acctName}>{r.name}</span>
                <span className={styles.acctMeta}>{r.size}</span>
                <span className={styles.chip} data-tone={healthTone(r.health)}>
                  {r.health}
                </span>
              </button>
            ))}
          </nav>

          <div className={styles.overview}>
            <div className={styles.ovHead}>
              <div>
                <h3 className={styles.ovName}>{acct.name}</h3>
                <p className="mono" style={{ color: 'var(--faint)' }}>
                  {acct.strategy} · {acct.instrument}
                </p>
              </div>
              <div className={styles.permission} data-ok={acct.allowed || undefined}>
                <span className="mono">trading permission</span>
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={String(acct.allowed) + acct.block}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {acct.allowed ? 'Allowed' : 'Blocked'}
                  </motion.strong>
                </AnimatePresence>
                {acct.block && <span className={styles.why}>{acct.block}</span>}
              </div>
            </div>

            <div className={styles.meters}>
              <Meter label="Daily loss used" value={acct.used} marks={[P.cautionAtPct, P.restrictAtPct]} />
              <Meter label="Max drawdown used" value={acct.dd} marks={[50, 80]} />
              <Meter label="Profit target" value={acct.target} good />
              <div className={styles.stat}>
                <span className="mono">open risk</span>
                <strong>{acct.open.toFixed(2)}%</strong>
              </div>
            </div>

            <div className={styles.feed}>
              <span className={`mono ${styles.colHead}`}>decision records</span>
              <ul>
                {FEED.map((f, i) => (
                  <li key={i} className={styles.feedRow} data-ok={f.ok || undefined}>
                    <span className="mono">{f.t}</span>
                    <span className={styles.feedAcct}>{f.acct}</span>
                    <span className="mono">{f.inst}</span>
                    <span className={styles.feedDecision}>{f.ok ? 'Approved' : 'Rejected'}</span>
                    <span className={styles.feedWhy}>{f.why}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.switches}>
            <span className={`mono ${styles.colHead}`}>kill switches</span>
            <ul>
              {KILL_SWITCHES.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on[s.id] || (s.id !== 'global' && on.global)}
                    className={styles.switch}
                    data-on={on[s.id] || undefined}
                    data-inherited={(s.id !== 'global' && on.global) || undefined}
                    data-global={s.id === 'global' || undefined}
                    onClick={() => toggle(s.id)}
                  >
                    <span className={styles.switchText}>
                      <span className={styles.switchName}>{s.name}</span>
                      <span className={styles.switchScope}>{s.scope}</span>
                    </span>
                    <span className={styles.track} aria-hidden="true">
                      <span className={styles.knob} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {(on.ai || on.news) && (
              <p className={styles.note}>
                {on.ai ? 'AI offline: ASTRA keeps running on deterministic rules only. ' : ''}
                {on.news ? 'News-driven entries are paused.' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.watchRow}>
        <button type="button" className={styles.watch} onClick={() => scrollToTarget(lenis, '#astra-film')}>
          Watch Product Video
        </button>
      </div>
    </section>
  )
}

function Meter({ label, value, marks = [], good }: { label: string; value: number; marks?: number[]; good?: boolean }) {
  const tone = good ? 'pass' : value >= (marks[1] ?? 101) ? 'ember' : value >= (marks[0] ?? 101) ? 'caution' : 'pass'
  return (
    <div className={styles.meter}>
      <div className={styles.meterHead}>
        <span className="mono">{label.toLowerCase()}</span>
        <strong>{value}%</strong>
      </div>
      <div className={styles.meterTrack} data-tone={tone}>
        <motion.span
          className={styles.meterFill}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {marks.map((m) => (
          <i key={m} style={{ left: `${m}%` }} />
        ))}
      </div>
    </div>
  )
}
