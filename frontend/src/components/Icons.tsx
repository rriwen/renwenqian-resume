export function IconLightbulb({ lit }: { lit: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.5 16c0-1.8-2.5-2.6-2.5-6a6 6 0 0 1 12 0c0 3.4-2.5 4.2-2.5 6Z" fill={lit ? '#fbbf24' : 'none'} fillOpacity=".38" />
      <path d="M9 19h6 M10 22h4 M12 16v-4 m-2-2 2 2 2-2" />
      {lit && <path d="M12 1v1 M3 3l1 1 M21 3l-1 1 M1 10h1 M22 10h1" />}
    </svg>
  )
}

export function IconSidebarToggle({ expanded }: { expanded: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {expanded && <path d="M9.5 4.5H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h3.5Z" fill="currentColor" fillOpacity=".22" stroke="none" />}
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </svg>
  )
}

export function IconFolder({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7a2.5 2.5 0 0 1 2.5-2.5h3.6a2 2 0 0 1 1.4.6L12 6.6a2 2 0 0 0 1.4.6h5.1A2.5 2.5 0 0 1 21 9.7v7.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5Z" />
    </svg>
  )
}

export function IconSparkle({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c1.2 5.6 3.4 7.8 9 9-5.6 1.2-7.8 3.4-9 9-1.2-5.6-3.4-7.8-9-9 5.6-1.2 7.8-3.4 9-9Z" />
    </svg>
  )
}

export function IconTerminal({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="m7 9 3 3-3 3 M13 15h4" />
    </svg>
  )
}

export function IconPalette({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 0 18h1.2a2.8 2.8 0 0 0 2.2-4.5 1.4 1.4 0 0 1 1.1-2.3H18a3 3 0 0 0 3-3C21 6.7 17 3 12 3Z" />
      <circle cx="7.4" cy="10.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="6.8" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconNewChat({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 4h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8l-5 3V7a3 3 0 0 1 3-3Z" />
    </svg>
  )
}

export function IconFileText({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13.2 3H7a2.5 2.5 0 0 0-2.5 2.5v13A2.5 2.5 0 0 0 7 21h10a2.5 2.5 0 0 0 2.5-2.5V9.3a2 2 0 0 0-.6-1.4l-4.3-4.3a2 2 0 0 0-1.4-.6Z" />
      <path d="M13 3v4a2 2 0 0 0 2 2h4.5" />
    </svg>
  )
}

export function IconPuzzle({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5V3.5a2.5 2.5 0 0 1 5 0V5h3a2 2 0 0 1 2 2v3h1.5a2.5 2.5 0 0 1 0 5H19v4a2 2 0 0 1-2 2h-3v-1.5a2.5 2.5 0 0 0-5 0V21H5a2 2 0 0 1-2-2v-4h1.5a2.5 2.5 0 0 0 0-5H3V7a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function IconCamera({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8.1 5.1A2 2 0 0 1 9.8 4h4.4a2 2 0 0 1 1.7 1.1L17 7h2a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 19 20H5a2.5 2.5 0 0 1-2.5-2.5v-8A2.5 2.5 0 0 1 5 7h2Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  )
}

export function IconClose({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}

export function IconMail({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m3 7 7.9 5.1a2 2 0 0 0 2.2 0L21 7" />
    </svg>
  )
}

export function IconSun({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  )
}

export function IconMoon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.5 13.2A8.7 8.7 0 0 1 10.8 3.5a8.7 8.7 0 1 0 9.7 9.7Z" />
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
