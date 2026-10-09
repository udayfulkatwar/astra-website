import assert from 'node:assert/strict'
import { test } from 'node:test'
import { forexWeekOpen, sessionOpen, sessionSnapshot, zonedClock, FOREX_SESSIONS, SESSION_LABEL, SESSION_DETAIL } from './sessions.ts'

const sydney = FOREX_SESSIONS[0]
const tokyo = FOREX_SESSIONS[1]
const london = FOREX_SESSIONS[2]
const ny = FOREX_SESSIONS[3]

test('session copy does not claim a live feed or holiday awareness', () => {
  assert.equal(SESSION_LABEL, 'forex sessions · approx. · local time')
  assert.match(SESSION_DETAIL, /Not exchange hours, no live data/)
  assert.match(SESSION_DETAIL, /Holidays are not included/)
})

test('weekday hours follow each city local window', () => {
  // Wednesday 2026-10-14 14:30 UTC.
  // Sydney AEDT 01:30 Thursday — closed (before 07:00).
  // Tokyo JST 23:30 Wednesday — closed (after 17:00).
  // London BST 15:30 Wednesday — open.
  // New York EDT 10:30 Wednesday — open.
  const midweek = new Date('2026-10-14T14:30:00Z')
  assert.equal(forexWeekOpen(midweek), true)
  assert.equal(sessionOpen(midweek, sydney), false)
  assert.equal(sessionOpen(midweek, tokyo), false)
  assert.equal(sessionOpen(midweek, london), true)
  assert.equal(sessionOpen(midweek, ny), true)
  assert.equal(zonedClock(midweek, 'Europe/London').label, '15:30')
  assert.equal(zonedClock(midweek, 'America/New_York').label, '10:30')
})

test('the forex week closes Friday 17:00 New York and stays shut on Saturday', () => {
  const fridayOpen = new Date('2026-10-16T20:59:00Z') // 16:59 EDT
  const fridayClose = new Date('2026-10-16T21:00:00Z') // 17:00 EDT
  const saturday = new Date('2026-10-17T15:00:00Z')
  assert.equal(forexWeekOpen(fridayOpen), true)
  assert.equal(sessionOpen(fridayOpen, ny), true)
  assert.equal(forexWeekOpen(fridayClose), false)
  assert.equal(sessionOpen(fridayClose, london), false)
  assert.equal(sessionOpen(fridayClose, ny), false)
  assert.equal(sessionSnapshot(saturday).every((row) => row.open === false), true)
})

test('Sunday before 17:00 New York is closed, and Sydney can be open after it', () => {
  const before = new Date('2026-10-11T20:59:00Z') // Sunday 16:59 EDT
  const after = new Date('2026-10-11T21:00:00Z') // Sunday 17:00 EDT = Monday 08:00 Sydney AEDT
  assert.equal(forexWeekOpen(before), false)
  assert.equal(sessionOpen(before, sydney), false)
  assert.equal(forexWeekOpen(after), true)
  assert.equal(zonedClock(after, 'Australia/Sydney').label, '08:00')
  assert.equal(sessionOpen(after, sydney), true)
  assert.equal(zonedClock(after, 'Asia/Tokyo').label, '06:00')
  assert.equal(sessionOpen(after, tokyo), false)
})

test('US and London clocks follow DST, and Sydney follows its own', () => {
  // US springs forward on 2026-03-08. 10:30 UTC is 06:30 EDT (after) and was 05:30 EST the week before.
  const afterUs = new Date('2026-03-09T10:30:00Z')
  const beforeUs = new Date('2026-03-02T10:30:00Z')
  assert.equal(zonedClock(beforeUs, 'America/New_York').label, '05:30')
  assert.equal(zonedClock(afterUs, 'America/New_York').label, '06:30')
  // London springs forward on 2026-03-29. 10:30 UTC is 11:30 BST after, 10:30 GMT before.
  const beforeUk = new Date('2026-03-22T10:30:00Z')
  const afterUk = new Date('2026-03-30T10:30:00Z')
  assert.equal(zonedClock(beforeUk, 'Europe/London').label, '10:30')
  assert.equal(zonedClock(afterUk, 'Europe/London').label, '11:30')
  // Sydney starts daylight time on 2026-10-04. 21:00 UTC is 07:00 AEST before and 08:00 AEDT after.
  const beforeAu = new Date('2026-09-27T21:00:00Z')
  const afterAu = new Date('2026-10-11T21:00:00Z')
  assert.equal(zonedClock(beforeAu, 'Australia/Sydney').label, '07:00')
  assert.equal(zonedClock(afterAu, 'Australia/Sydney').label, '08:00')
})
