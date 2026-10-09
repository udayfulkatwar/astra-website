/**
 * Forex session windows in each city's local time. These are conventional
 * desk hours, not exchange open/close and not a live feed.
 *
 * Sydney 07:00–16:00 Australia/Sydney.
 * Tokyo, London, and New York 08:00–17:00 in Asia/Tokyo, Europe/London,
 * and America/New_York. DST follows those zones.
 *
 * The forex week runs from Sunday 17:00 America/New_York until Friday
 * 17:00 America/New_York. Outside that, every city is closed.
 * Holidays are not accounted for.
 */

export const SESSION_LABEL =
  'Forex sessions (approx., local time) — not exchange hours, no live data'

export const HOLIDAY_NOTE = 'Holidays are not accounted for.'

export interface ForexSession {
  city: string
  timeZone: string
  /** Minutes from local midnight, inclusive. */
  openMinute: number
  /** Minutes from local midnight, exclusive. */
  closeMinute: number
}

export const FOREX_SESSIONS: readonly ForexSession[] = [
  { city: 'Sydney', timeZone: 'Australia/Sydney', openMinute: 7 * 60, closeMinute: 16 * 60 },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo', openMinute: 8 * 60, closeMinute: 17 * 60 },
  { city: 'London', timeZone: 'Europe/London', openMinute: 8 * 60, closeMinute: 17 * 60 },
  { city: 'New York', timeZone: 'America/New_York', openMinute: 8 * 60, closeMinute: 17 * 60 },
]

const NY = 'America/New_York'

export interface ZonedClock {
  weekday: string
  minutes: number
  label: string
}

export function zonedClock(date: Date, timeZone: string): ZonedClock {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  let hour = Number(get('hour'))
  if (hour === 24) hour = 0
  const minute = Number(get('minute'))
  return {
    weekday: get('weekday'),
    minutes: hour * 60 + minute,
    label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  }
}

/** Sunday 17:00 New York through Friday 17:00 New York. */
export function forexWeekOpen(date: Date) {
  const ny = zonedClock(date, NY)
  if (ny.weekday === 'Sat') return false
  if (ny.weekday === 'Fri' && ny.minutes >= 17 * 60) return false
  if (ny.weekday === 'Sun' && ny.minutes < 17 * 60) return false
  return true
}

export function sessionOpen(date: Date, session: ForexSession) {
  if (!forexWeekOpen(date)) return false
  const local = zonedClock(date, session.timeZone)
  return local.minutes >= session.openMinute && local.minutes < session.closeMinute
}

export function sessionSnapshot(date: Date) {
  return FOREX_SESSIONS.map((session) => {
    const local = zonedClock(date, session.timeZone)
    return {
      city: session.city,
      timeZone: session.timeZone,
      time: local.label,
      open: sessionOpen(date, session),
    }
  })
}
