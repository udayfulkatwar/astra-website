import type { ReactNode } from 'react'

interface Props {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  /** accessible text — visual lines are hidden so screen readers get one sentence */
  label: string
}

/** Headline split into masked lines for reveal animations. */
export function SplitLines({ lines, as: Tag = 'h2', className, label }: Props) {
  return (
    <Tag className={className}>
      <span className="sr-only">{label}</span>
      {lines.map((l, i) => (
        <span className="line" key={i} aria-hidden="true">
          <span className="inner">{l}</span>
        </span>
      ))}
    </Tag>
  )
}
