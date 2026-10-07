import { AGENTS, AUTHORITY_LABEL, type Agent } from '../../lib/content'
import styles from './Agents.module.css'

const tone = (k: Agent['kind']) => (k === 'ai' ? 'lilac' : k === 'rule' ? 'ember' : 'pass')

function Visual({ kind }: { kind: Agent['visual'] }) {
  switch (kind) {
    case 'radar':
      return (
        <div className={styles.radar} aria-hidden="true">
          <span className={styles.sweep} />
          {[22, 38, 54, 70].map((r) => (
            <i key={r} style={{ width: `${r}%`, height: `${r}%` }} />
          ))}
          {[
            [28, 34],
            [64, 26],
            [72, 62],
            [38, 70],
            [52, 46],
          ].map(([x, y], i) => (
            <b key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.7}s` }} />
          ))}
        </div>
      )
    case 'news':
      return (
        <ul className={styles.news} aria-hidden="true">
          {[
            ['Bullish', 'pass', 82],
            ['Neutral', 'mute', 64],
            ['Bearish', 'ember', 74],
            ['Neutral', 'mute', 52],
          ].map(([label, t, w], i) => (
            <li key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <span className={styles.bars}>
                <i style={{ width: `${w}%` }} />
                <i style={{ width: `${Number(w) - 22}%` }} />
              </span>
              <em data-tone={t}>{label}</em>
            </li>
          ))}
        </ul>
      )
    case 'calendar':
      return (
        <div className={styles.calendar} aria-hidden="true">
          <div className={styles.axis}>
            {['−30', '−15', '0', '+15', '+30'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          <div className={styles.track}>
            <span className={styles.blackout} />
            <span className={styles.event} />
            <span className={styles.now} />
          </div>
          <p className="mono">blackout · high impact ± 15 min</p>
        </div>
      )
    case 'gauge':
      return (
        <div className={styles.gauge} aria-hidden="true">
          <svg viewBox="0 0 200 120">
            <path d="M20 110 A 80 80 0 0 1 180 110" className={styles.gaugeTrack} />
            <path d="M20 110 A 80 80 0 0 1 180 110" className={styles.gaugeFill} pathLength={100} />
            <line x1="100" y1="22" x2="100" y2="34" className={styles.mark} />
            <line x1="164.7" y1="63" x2="155" y2="70" className={styles.mark} />
          </svg>
          <div className={styles.gaugeRead}>
            <strong>34%</strong>
            <span className="mono">daily loss used · example</span>
          </div>
        </div>
      )
    case 'rules':
      return (
        <ul className={styles.rules} aria-hidden="true">
          {['Daily loss 5%', 'Trailing drawdown', 'Max 5 contracts', 'Consistency 40%', 'No weekend holds'].map((r, i) => (
            <li key={r} style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
              <span className={styles.check} />
              {r}
            </li>
          ))}
        </ul>
      )
    case 'ticket':
      return (
        <div className={styles.ticket} aria-hidden="true">
          <div className={styles.ticketHead}>
            <span className="mono">order · paper</span>
            <span className={styles.ticketState}>confirmed</span>
          </div>
          {[
            ['duplicate check', 'pass'],
            ['spread within limit', 'pass'],
            ['slippage within limit', 'pass'],
            ['kill switches', 'pass'],
          ].map(([k]) => (
            <div key={k} className={styles.ticketRow}>
              <span>{k}</span>
              <span className={styles.ok}>ok</span>
            </div>
          ))}
        </div>
      )
    case 'record':
      return (
        <pre className={styles.record} aria-hidden="true">
          <code>
            <span className={styles.k}>{'{'}</span>
            {'\n  '}
            <span className={styles.k}>"decision"</span>: <span className={styles.e}>"REJECTED"</span>,{'\n  '}
            <span className={styles.k}>"gate"</span>: <span className={styles.s}>"risk"</span>,{'\n  '}
            <span className={styles.k}>"reason"</span>: <span className={styles.s}>"risk 1.4% exceeds 1.0% limit"</span>,{'\n  '}
            <span className={styles.k}>"model"</span>: <span className={styles.l}>"advisory, logged"</span>,{'\n  '}
            <span className={styles.k}>"review"</span>: <span className={styles.l}>"setup valid; size rule held"</span>
            {'\n'}
            <span className={styles.k}>{'}'}</span>
          </code>
        </pre>
      )
  }
}

/** The crew. Each agent has one job and a clearly marked level of authority. */
export function Agents() {
  return (
    <section id="agents" className="section" data-theme="dark" aria-labelledby="agents-title">
      <div className="section-head">
        <span className="tag" data-tone="lilac">agents · 7 roles · 1 authority model</span>
        <h2 id="agents-title" className="display section-title">
          A trading desk of agents. None of them holds the keys alone.
        </h2>
        <p className="section-intro">
          Lilac agents think and explain. Ember agents enforce. Green agents act, and only after the ember ones agree.
        </p>
      </div>
      <ul className={styles.grid}>
        {AGENTS.map((a) => (
          <li key={a.id} className={`panel ${styles.card}`} style={{ ['--span' as string]: a.span }} data-kind={a.kind}>
            <div className={styles.visual}>
              <Visual kind={a.visual} />
            </div>
            <div className={styles.text}>
              <span className="tag" data-tone={tone(a.kind)}>
                {AUTHORITY_LABEL[a.kind]}
              </span>
              <h3 className={styles.name}>{a.name}</h3>
              <p className={styles.role}>{a.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
