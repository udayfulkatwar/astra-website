/** Existing section ids. The desktop pill nav keeps its own four labels. */
export const MENU_ITEMS = [
  { href: '#top', label: 'Overview', text: 'The introduction' },
  { href: '#pipeline', label: 'Pipeline', text: 'How a decision moves through the system' },
  { href: '#agents', label: 'AI Agents', text: 'Advisory roles, not an order path' },
  { href: '#gate', label: 'Risk Gate', text: 'Deterministic checks that fail closed' },
  { href: '#command', label: 'Command Center', text: 'The operating picture' },
  { href: '#product', label: 'Product Demo', text: 'Frames from the demo build' },
  { href: '#astra-film', label: 'Film', text: 'A product vision film' },
  { href: '#engineering', label: 'Engineering', text: 'What is running, and what is not' },
  { href: '#principles', label: 'Principles', text: 'How the system is meant to behave' },
  { href: '#rollout', label: 'Rollout', text: 'The path from paper toward further checks' },
  { href: '#company', label: 'Leadership', text: 'The people behind ASTRA' },
] as const

export const MENU_ACCESS = { href: '#contact', label: 'Request access' } as const
