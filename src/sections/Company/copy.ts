export const COMPANY_TAG = 'about astra'
export const COMPANY_TITLE = 'Building a More Disciplined Trading Infrastructure.'
export const COMPANY_BODY = [
  'ASTRA is an independent startup project, not yet formally incorporated. It was founded in India in September 2026 and is under active development. The project is bootstrapped and self-funded. It builds AI-assisted trading infrastructure and risk-management software.',
  'The project is designed with the needs of proprietary trading participants and independent traders in mind, with an emphasis on system reliability, transparent controls, and progressive technical validation.',
] as const

export const LEADERSHIP_TITLE = 'The People Behind ASTRA'
export const LEADERSHIP_INTRO =
  'Two people are building ASTRA, an independent startup project founded in India in September 2026. It is bootstrapped and self-funded, not yet formally incorporated, and focused on disciplined, auditable trading and risk software.'

export interface LeaderLink {
  label: string
  href: string
}

export interface Leader {
  id: string
  initials: string
  name: string
  title: string
  /** Shown under the title. Empty bios, quotes, and links stay in the data and are not rendered. */
  roleNote: string
  bio: string
  quote: string
  links: readonly LeaderLink[]
}

const ROLE_NOTE =
  'This is a project leadership title. It is not proof of incorporation, directorship, or share ownership.'

export const LEADERS: readonly Leader[] = [
  {
    id: 'leader-uday',
    initials: 'UF',
    name: 'Uday Fulkatwar',
    title: 'Founder',
    roleNote: `Uday Fulkatwar is Founder. ${ROLE_NOTE}`,
    bio: '',
    quote: '',
    links: [],
  },
  {
    id: 'leader-vivek',
    initials: 'VC',
    name: 'Vivek Chaudhary',
    title: 'Co-Founder',
    roleNote: `Vivek Chaudhary is Co-Founder. ${ROLE_NOTE}`,
    bio: '',
    quote: '',
    links: [],
  },
]

/** Fields a later approved bio, quote, or profile link can fill. Empty values are omitted. */
export function leaderExtras(leader: Leader) {
  return {
    bio: leader.bio.trim(),
    quote: leader.quote.trim(),
    links: leader.links.filter((link) => link.label.trim() !== '' && link.href.trim() !== ''),
  }
}

export const COMMITMENT_TITLE = 'Shared commitment'
export const COMMITMENTS = [
  { label: 'Risk discipline', text: 'Deterministic controls run before any execution.' },
  { label: 'Evidence', text: 'Claims are labelled implemented, simulated, or planned.' },
  { label: 'Transparency', text: 'Status is stated clearly, and simulated data is marked.' },
  { label: 'Responsible AI development', text: 'AI advises. Humans authorise.' },
] as const

export const MISSION = {
  title: 'Our Mission',
  text: 'To make disciplined risk management, accountable automation, and transparent trading workflows central to the trading experience.',
} as const
