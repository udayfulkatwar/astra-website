import { useEffect, useState } from 'react'
import { HOLIDAY_NOTE, SESSION_LABEL, sessionSnapshot } from './sessions'

export function MarketSessions({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  const [zone, setZone] = useState('')
  useEffect(() => {
    setZone(Intl.DateTimeFormat().resolvedOptions().timeZone || '')
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  const rows = sessionSnapshot(now)
  return (
    <div className="session-block">
      <p className="session-note">{SESSION_LABEL}</p>
      <ul className={className} aria-label={SESSION_LABEL}>
        {rows.map((row) => (
          <li key={row.city} data-open={row.open || undefined}>
            <span>{row.city}</span> <time dateTime={now.toISOString()}>{row.time}</time>{' '}
            <span className="session-state">{row.open ? 'open' : 'closed'}</span>
          </li>
        ))}
      </ul>
      <p className="session-note">
        {HOLIDAY_NOTE}
        {zone ? ` Your timezone: ${zone}.` : ''} Each time above is that city's local time.
      </p>
    </div>
  )
}
