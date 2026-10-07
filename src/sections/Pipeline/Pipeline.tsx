import { useMemo, useState } from 'react'
import { AUTHORITY_LABEL, PIPELINE, PIPELINE_EDGES, type PipelineNode } from '../../lib/content'
import { store } from '../../lib/store'
import styles from './Pipeline.module.css'

const W = 1000
const H = 560
const NODE_W = 150

const byId = Object.fromEntries(PIPELINE.map((n) => [n.id, n])) as Record<string, PipelineNode>

function edgePath(a: PipelineNode, b: PipelineNode) {
  const x1 = a.x + NODE_W / 2
  const x2 = b.x - NODE_W / 2
  const dx = Math.max(40, (x2 - x1) * 0.5)
  if (x2 <= x1) {
    // same column: drop down the right side
    const y1 = a.y + 26
    const y2 = b.y - 26
    return `M ${a.x} ${y1} C ${a.x} ${y1 + 40}, ${b.x} ${y2 - 40}, ${b.x} ${y2}`
  }
  return `M ${x1} ${a.y} C ${x1 + dx} ${a.y}, ${x2 - dx} ${b.y}, ${x2} ${b.y}`
}

const ICONS: Record<PipelineNode['kind'], React.ReactNode> = {
  data: <path d="M3 12h3l2-5 4 10 2-5h7" />,
  ai: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  rule: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 10l2.5 2.5L16 9M8 15.5h8" />
    </>
  ),
  exec: <path d="M5 12h12M13 7l5 5-5 5" />,
  record: (
    <>
      <path d="M6 4h9l3 3v13H6z" />
      <path d="M9 10h6M9 14h6M9 17h4" />
    </>
  ),
}

/** The agent pipeline as an automation canvas. Hover or select a node to inspect it. */
export function Pipeline() {
  const [active, setActive] = useState<string>('prop')
  const [hover, setHover] = useState<string | null>(null)
  const focus = hover ?? active
  const node = byId[active]

  const edges = useMemo(
    () => PIPELINE_EDGES.map(([a, b], i) => ({ id: `e${i}`, a, b, d: edgePath(byId[a], byId[b]), kind: byId[a].kind })),
    [],
  )
  const lit = (e: { a: string; b: string }) => e.a === focus || e.b === focus
  // only dim the rest of the graph while the visitor is pointing at something
  const dimmed = (id: string) =>
    !!hover && hover !== id && !edges.some((e) => (e.a === hover || e.b === hover) && (e.a === id || e.b === id))

  return (
    <section id="pipeline" className="section" data-theme="dark" aria-labelledby="pipeline-title">
      <div className="section-head">
        <span className="tag" data-tone="pass">pipeline · 11 nodes · 1 decision</span>
        <h2 id="pipeline-title" className="display section-title">
          From market to order, every step on the record.
        </h2>
        <p className="section-intro">
          ASTRA runs as a set of small agents wired together by automation. Data becomes context, context becomes a
          signal, and only rules can turn a signal into an order.
        </p>
      </div>

      <div className={`panel brackets ${styles.board}`}>
        <div className={styles.toolbar}>
          <span className="mono">workflow / trade-decision</span>
          <ul className={styles.legend} aria-label="Legend">
            {(['data', 'ai', 'rule', 'exec', 'record'] as const).map((k) => (
              <li key={k} data-kind={k}>
                {AUTHORITY_LABEL[k]}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.canvas} style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className={styles.edges} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <defs>
              {edges.map((e) => (
                <path key={e.id} id={e.id} d={e.d} />
              ))}
            </defs>
            {edges.map((e) => (
              <use key={e.id} href={`#${e.id}`} className={styles.edge} data-kind={e.kind} data-lit={lit(e) || undefined} />
            ))}
            {!store.reducedMotion &&
              edges.map((e, i) => (
                <circle key={`p${e.id}`} r="3" className={styles.packet} data-kind={e.kind} data-lit={lit(e) || undefined}>
                  <animateMotion dur={`${2.6 + (i % 4) * 0.5}s`} repeatCount="indefinite" begin={`${(i * 0.37) % 2}s`}>
                    <mpath href={`#${e.id}`} />
                  </animateMotion>
                </circle>
              ))}
          </svg>

          {PIPELINE.map((n) => (
            <button
              key={n.id}
              type="button"
              className={styles.node}
              data-kind={n.kind}
              data-active={active === n.id || undefined}
              data-dim={dimmed(n.id) || undefined}
              style={{ left: `${(n.x / W) * 100}%`, top: `${(n.y / H) * 100}%` }}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n.id)}
              onBlur={() => setHover(null)}
              onClick={() => setActive(n.id)}
              aria-pressed={active === n.id}
            >
              <span className={styles.icon} aria-hidden="true">
                <svg viewBox="0 0 24 24">{ICONS[n.kind]}</svg>
              </span>
              <span className={styles.nodeText}>
                <span className={styles.nodeName}>{n.name}</span>
                <span className={styles.nodeSub}>{n.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.inspector} aria-live="polite">
          <div className={styles.inspTitle}>
            <span className="tag" data-tone={node.kind === 'ai' ? 'lilac' : node.kind === 'rule' ? 'ember' : 'pass'}>
              {AUTHORITY_LABEL[node.kind]}
            </span>
            <h3 className={styles.inspName}>{node.name}</h3>
          </div>
          <dl className={styles.inspGrid}>
            <div>
              <dt className="mono">does</dt>
              <dd>{node.does}</dd>
            </div>
            <div>
              <dt className="mono">on failure</dt>
              <dd>{node.onFailure}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
