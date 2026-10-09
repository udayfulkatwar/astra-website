export const COMPANY_TAG = 'about astra'
export const COMPANY_TITLE = 'Building a More Disciplined Trading Infrastructure.'
export const COMPANY_BODY = [
  'ASTRA is an independent startup project, not yet formally incorporated. It was founded in India in September 2026 and is under active development. The project is bootstrapped and self-funded. It builds AI-assisted trading infrastructure and risk-management software.',
  'The project is designed with the needs of proprietary trading participants and independent traders in mind, with an emphasis on system reliability, transparent controls, and progressive technical validation.',
] as const

/** Kept in copy. Not rendered: the commitment footer already carries the section close. */
export const MISSION = {
  title: 'Our Mission',
  text: 'To make disciplined risk management, accountable automation, and transparent trading workflows central to the trading experience.',
} as const

export const LEADERSHIP_TAG = 'THE PEOPLE BEHIND ASTRA'
export const LEADERSHIP_TITLE = 'Building Intelligence. Engineering Trust.'
export const LEADERSHIP_INTRO =
  'Behind ASTRA is a commitment to a more disciplined future for trading technology. We believe intelligent systems should be measured not only by what they can automate, but by how responsibly they manage uncertainty, preserve accountability, and demonstrate measurable value.'

export const PRINCIPLE_LABEL = 'Leadership principle'

export const COMMITMENT_LABEL = 'OUR COMMITMENT'
export const COMMITMENT_TEXT =
  'Build with discipline. Validate with evidence. Earn trust through transparency.'
export const COMMITMENT_ORIGIN =
  'ASTRA — Independent, bootstrapped fintech initiative. Founded September 2026, India.'

/** 2× file for the 212px desktop frame. 1× is half of this. Same crop, no upscale. */
export const PORTRAIT = { width: 424, height: 392 } as const

export interface LeaderPhoto {
  src: string
  avif: string
  avif2x: string
  webp: string
  webp2x: string
  width: number
  height: number
  alt: string
}

export interface Leader {
  id: string
  initials: string
  name: string
  title: string
  bio: readonly string[]
  /** A section theme. Not a verified personal quote, and not attributed to the person. */
  principle: string
  linkedin: { href: string; label: string }
  /** Absent until a real photo is supplied. The card then shows initials in the same frame. */
  photo?: LeaderPhoto
}

const PORTRAIT_BASE = '/media/leadership/uday-fulkatwar'

export const LEADERS: readonly Leader[] = [
  {
    id: 'leader-uday',
    initials: 'UF',
    name: 'Uday Fulkatwar',
    title: 'Founder, ASTRA',
    bio: [
      'Uday Fulkatwar founded ASTRA in September 2026 with a vision to develop intelligent trading infrastructure built around discipline, transparency, and responsible automation.',
      'His focus is on shaping a risk-first platform that combines AI-assisted research, systematic strategy evaluation, deterministic safeguards, and human oversight.',
      'Through ASTRA, he aims to make advanced trading and risk-management capabilities more accessible to proprietary trading firm participants and independent traders.',
    ],
    principle: 'Intelligence creates possibilities. Discipline creates trust.',
    linkedin: {
      href: 'https://www.linkedin.com/in/udayfulkatwar/',
      label: 'Uday Fulkatwar on LinkedIn (opens in a new tab)',
    },
    photo: {
      src: `${PORTRAIT_BASE}.jpg`,
      avif: `${PORTRAIT_BASE}-212.avif`,
      avif2x: `${PORTRAIT_BASE}-424.avif`,
      webp: `${PORTRAIT_BASE}-212.webp`,
      webp2x: `${PORTRAIT_BASE}-424.webp`,
      width: PORTRAIT.width,
      height: PORTRAIT.height,
      alt: 'Uday Fulkatwar, Founder of ASTRA',
    },
  },
  {
    id: 'leader-vivek',
    initials: 'VC',
    name: 'Vivek Chaudhary',
    title: 'Co-Founder, ASTRA',
    bio: [
      'Vivek Chaudhary is the Co-Founder of ASTRA, an early-stage fintech initiative developing AI-assisted trading and risk-management technology.',
      "As part of ASTRA's founding team, he shares the project's commitment to transparent systems, responsible innovation, and long-term product credibility.",
      "The founding team's vision is to develop technology where automation can be evaluated, decisions can be understood, and financial risk remains a central design consideration.",
    ],
    principle: 'Technology earns confidence when its decisions are transparent, testable, and accountable.',
    linkedin: {
      href: 'https://www.linkedin.com/in/vivek-chaudhary-77b52a434/',
      label: 'Vivek Chaudhary on LinkedIn (opens in a new tab)',
    },
    photo: {
      src: '/media/leadership/vivek-chaudhary.jpg',
      avif: '/media/leadership/vivek-chaudhary-212.avif',
      avif2x: '/media/leadership/vivek-chaudhary-424.avif',
      webp: '/media/leadership/vivek-chaudhary-212.webp',
      webp2x: '/media/leadership/vivek-chaudhary-424.webp',
      width: PORTRAIT.width,
      height: PORTRAIT.height,
      alt: 'Vivek Chaudhary, Co-Founder of ASTRA',
    },
  },
]
