/** Existing section ids. Film, Engineering, Principles, and Rollout stay on the page. */
export const MENU_ITEMS = [
  { href: '#top', label: 'Overview', text: 'The introduction' },
  { href: '#pipeline', label: 'Pipeline', text: 'How a decision moves through the system' },
  { href: '#agents', label: 'AI Agents', text: 'Advisory roles, not an order path' },
  { href: '#gate', label: 'Risk Gate', text: 'Deterministic checks that fail closed' },
  { href: '#command', label: 'Command Center', text: 'The operating picture' },
  { href: '#product', label: 'Product Demo', text: 'Frames from the demo build' },
  { href: '#company', label: 'Leadership', text: 'The people behind ASTRA' },
] as const

export const MENU_ACCESS = { href: '#contact', label: 'Request access' } as const

export const MENU_DEMO = {
  label: 'Launch ASTRA Demo',
  note: 'demo · simulated data',
  newTab: ' (opens in a new tab)',
} as const

/** Same-tab policy pages. Relative paths resolve on https://astragrp.net/. */
export const MENU_POLICIES = [
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/risk/', label: 'Risk' },
] as const
