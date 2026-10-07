import { LayoutGroup, motion } from 'framer-motion'
import { useId, useMemo, useState } from 'react'
import {
  canTrade,
  EXAMPLE_PROFILE as P,
  type CalendarState,
  type Freshness,
  type GateInput,
  type SetupState,
} from '../../lib/gate/canTrade'
import styles from './Gate.module.css'

interface Option<T extends string> {
  value: T
  label: string
}

function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}) {
  const name = useId()
  return (
    <fieldset className={styles.field}>
      <legend className={styles.legend}>{legend}</legend>
      <LayoutGroup id={name}>
        <div className={styles.segmented}>
          {options.map((o) => (
            <label key={o.value} className={styles.segment} data-on={o.value === value || undefined}>
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={o.value === value}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.value === value && (
                <motion.span layoutId="seg" className={styles.segmentBg} transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
              )}
              <span className={styles.segmentText}>{o.label}</span>
            </label>
          ))}
        </div>
      </LayoutGroup>
    </fieldset>
  )
}

function Range({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
  marks,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  format: (v: number) => string
  marks?: { at: number; label: string }[]
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={styles.field}>
      <div className={styles.rangeHead}>
        <label htmlFor={id} className={styles.legend}>
          {label}
        </label>
        <output htmlFor={id} className={styles.rangeValue}>
          {format(value)}
        </output>
      </div>
      <div className={styles.rangeWrap} style={{ ['--pct' as string]: `${pct}%` }}>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={format(value)}
          className={styles.range}
          data-cursor="hover"
        />
        {marks?.map((m) => (
          <span
            key={m.at}
            className={styles.mark}
            style={{ left: `${((m.at - min) / (max - min)) * 100}%` }}
            aria-hidden="true"
          >
            <span>{m.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_INPUT: GateInput = {
  marketData: 'FRESH',
  setup: 'QUALIFIED',
  calendar: 'CLEAR',
  dailyLossUsedPct: 20,
  riskPct: 0.5,
  killSwitch: false,
}

/** The product's core idea, made touchable: change the world, watch the rules answer. */
export function Gate() {
  const [input, setInput] = useState<GateInput>(DEFAULT_INPUT)
  const set = <K extends keyof GateInput>(k: K) => (v: GateInput[K]) => setInput((s) => ({ ...s, [k]: v }))
  const d = useMemo(() => canTrade(input), [input])
  const firstFail = d.gates.findIndex((g) => g.state === 'FAIL')
  const reach = firstFail === -1 ? d.gates.length : firstFail + 0.5

  const json = JSON.stringify({ approved: d.approved, status: d.status, health: d.health, reasons: d.reasons }, null, 2)

  return (
    <section id="gate" className={styles.gate} data-theme="dark" aria-labelledby="gate-title">
      <header className={styles.head}>
        <span className={`tag ${styles.kicker}`} data-tone="ember">
          live demo · canTrade()
        </span>
        <h2 id="gate-title" className={`display ${styles.title}`}>
          Try the gate.
        </h2>
        <div className={styles.headNote}>
          <p className={styles.intro}>Set the conditions. The rules answer. Same inputs, same decision, every time.</p>
          <p className={styles.profile}>
            Example profile: {P.dailyLossLimitPct}% daily loss limit, {P.maxRiskPerTradePct}% max risk per trade, up to
            half of the remaining daily buffer on one trade, {P.newsBlackoutMin}-minute news blackout. Every value is
            configured per account.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <form className={styles.controls} onSubmit={(e) => e.preventDefault()} aria-label="Trade conditions">
          <Segmented<Freshness>
            legend="Market data"
            value={input.marketData}
            onChange={set('marketData')}
            options={[
              { value: 'FRESH', label: 'Fresh' },
              { value: 'STALE', label: 'Stale' },
              { value: 'UNKNOWN', label: 'Unknown' },
            ]}
          />
          <Segmented<SetupState>
            legend="Strategy setup"
            value={input.setup}
            onChange={set('setup')}
            options={[
              { value: 'QUALIFIED', label: 'Qualified' },
              { value: 'WATCH', label: 'Watch' },
              { value: 'NO_SETUP', label: 'None' },
            ]}
          />
          <Segmented<CalendarState>
            legend="Economic calendar"
            value={input.calendar}
            onChange={set('calendar')}
            options={[
              { value: 'CLEAR', label: 'Clear' },
              { value: 'HIGH_IMPACT', label: 'Event in 10 min' },
              { value: 'UNKNOWN', label: 'Unavailable' },
            ]}
          />
          <Range
            label="Daily loss used"
            min={0}
            max={100}
            step={1}
            value={input.dailyLossUsedPct}
            onChange={set('dailyLossUsedPct')}
            format={(v) => `${v}% of limit`}
            marks={[
              { at: P.cautionAtPct, label: 'Caution' },
              { at: P.restrictAtPct, label: 'Restrict' },
            ]}
          />
          <Range
            label="Risk on this trade"
            min={0.1}
            max={2}
            step={0.05}
            value={input.riskPct}
            onChange={set('riskPct')}
            format={(v) => `${v.toFixed(2)}% of balance`}
            marks={[{ at: P.maxRiskPerTradePct, label: 'Limit' }]}
          />
          <div className={styles.field}>
            <span className={styles.legend} id="kill-label">
              Kill switch
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={input.killSwitch}
              aria-labelledby="kill-label"
              className={styles.switch}
              data-on={input.killSwitch || undefined}
              onClick={() => set('killSwitch')(!input.killSwitch)}
            >
              <span className={styles.knob} />
              <span className={styles.switchText}>{input.killSwitch ? 'Halted' : 'Armed'}</span>
            </button>
          </div>
          <button type="button" className={styles.reset} onClick={() => setInput(DEFAULT_INPUT)}>
            Reset conditions
          </button>
        </form>

        <div className={`panel brackets ${styles.output}`}>
          <ol className={styles.gates} style={{ ['--reach' as string]: reach / d.gates.length }} aria-label="Validation gates">
            {d.gates.map((g, i) => (
              <li key={g.id} className={styles.gateRow} data-state={g.state}>
                <span className={styles.gateIdx}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.gateDot} aria-hidden="true" />
                <span className={styles.gateLabel}>{g.label}</span>
                <span className={styles.gateDetail}>
                  <span className="sr-only">{g.state === 'PASS' ? 'Passed: ' : 'Failed: '}</span>
                  {g.detail}
                </span>
              </li>
            ))}
          </ol>

          <div className={styles.verdict} data-approved={d.approved || undefined} aria-live="polite">
            <div className={styles.verdictTop}>
              <span className={styles.verdictMask}>
                <motion.span
                  key={d.status}
                  className={styles.verdictWord}
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {d.approved ? 'Approved' : 'No trade'}
                </motion.span>
              </span>
              <dl className={styles.verdictFacts}>
                <div>
                  <dt>Account health</dt>
                  <dd data-health={d.health}>{d.health}</dd>
                </div>
                <div>
                  <dt>Daily buffer left</dt>
                  <dd>{d.bufferRemainingPct.toFixed(2)}%</dd>
                </div>
              </dl>
            </div>
            <pre className={styles.code} aria-label="Structured decision">
              <code>{json}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
