import { WORKFLOW_LABEL, WORKFLOW_STAGES, WORKFLOW_TITLE } from './workflow'
import styles from './Hero.module.css'

export function AgentLog() {
  return (
    <aside className={`panel brackets ${styles.log}`} aria-label={WORKFLOW_TITLE}>
      <div className={styles.logHead}>
        <span className="mono">{WORKFLOW_TITLE}</span>
        <span className={`mono ${styles.logNote}`}>{WORKFLOW_LABEL}</span>
      </div>
      <ol className={styles.logLines}>
        {WORKFLOW_STAGES.map((stage) => (
          <li key={stage.n} className={styles.logLine}>
            <span className={styles.logKey}>{stage.n}</span>
            <span>
              <span className={styles.logTitle}>{stage.title}</span>
              <span className={styles.logDetail}>{stage.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
