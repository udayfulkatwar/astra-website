/** ASTRA mark: a four-point star drawn as two crossing arcs, with an ember core. */
export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5C12.6 8.4 15.6 11.4 21.5 12C15.6 12.6 12.6 15.6 12 21.5C11.4 15.6 8.4 12.6 2.5 12C8.4 11.4 11.4 8.4 12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.2" fill="var(--ember)" />
    </svg>
  )
}
