export function IconClose({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function IconMail({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

export function IconWeChat({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9 3C4.58 3 1 5.91 1 9.5c0 2.02 1.14 3.83 2.93 5.02L3.2 17l2.9-1.45c.66.2 1.36.34 2.09.41A6.77 6.77 0 0 1 8 14.4C8 10.6 11.75 7.5 16.35 7.5h.28C15.6 4.89 12.58 3 9 3Zm-2.7 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      <path d="M16.35 9C12.57 9 9.5 11.42 9.5 14.4s3.07 5.4 6.85 5.4c.69 0 1.36-.08 1.99-.24L21 21l-.63-2.33C22 17.68 23.2 16.15 23.2 14.4c0-2.98-3.07-5.4-6.85-5.4Zm-2.3 4.65a.85.85 0 1 1 0-1.7.85.85 0 0 1 0 1.7Zm4.6 0a.85.85 0 1 1 0-1.7.85.85 0 0 1 0 1.7Z" />
    </svg>
  )
}

export function IconCommentSquare({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H11l-5 3v-3H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  )
}

export function IconMenu({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconContrast({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18V3Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
