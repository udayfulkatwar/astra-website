import { useEffect, useState } from 'react'
import { SESSION_DETAIL, SESSION_LABEL, sessionSnapshot } from './sessions'

export function MarketSessions({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  const rows = sessionSnapshot(now)
  return (
    <div className="session-block" title={SESSION_DETAIL}>
      <p className="session-heading">{SESSION_LABEL}</p>
      <ul className={className} aria-label={SESSION_LABEL}>
        {rows.map((row) => (
          <li key={row.city} data-open={row.open || undefined}>
            <span>{row.city}</span> <time dateTime={now.toISOString()}>{row.time}</time>{' '}
            <span className="session-state">{row.open ? 'open' : 'closed'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
