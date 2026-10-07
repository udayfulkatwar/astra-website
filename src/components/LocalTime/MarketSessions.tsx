import { useEffect, useState } from 'react'

/** Approximate FX session hours in UTC (no DST adjustment). Display only. */
const SESSIONS = [
  { city: 'Sydney', zone: 'Australia/Sydney', open: 21, close: 6 },
  { city: 'Tokyo', zone: 'Asia/Tokyo', open: 0, close: 9 },
  { city: 'London', zone: 'Europe/London', open: 7, close: 16 },
  { city: 'New York', zone: 'America/New_York', open: 12, close: 21 },
]

function isOpen(now: Date, open: number, close: number) {
  const day = now.getUTCDay()
  const h = now.getUTCHours() + now.getUTCMinutes() / 60
  // FX week: Sunday 21:00 UTC → Friday 21:00 UTC
  if (day === 6 || (day === 5 && h >= 21) || (day === 0 && h < 21)) return false
  return open < close ? h >= open && h < close : h >= open || h < close
}

const fmt = (zone: string, d: Date) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: zone }).format(d)

export function MarketSessions({ className }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return (
    <ul className={className} aria-label="Market sessions, approximate hours">
      {SESSIONS.map((s) => {
        const open = isOpen(now, s.open, s.close)
        return (
          <li key={s.city} data-open={open || undefined}>
            <span>{s.city}</span> <time>{fmt(s.zone, now)}</time>{' '}
            <span className="session-state">{open ? 'open' : 'closed'}</span>
          </li>
        )
      })}
    </ul>
  )
}
