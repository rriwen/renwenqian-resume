import { ArrowUpRight } from '@phosphor-icons/react'

import { WRITING_URL } from '../data/siteLinks'

export function WritingLink({ compact = false }: { compact?: boolean }) {
  return <a className={compact ? 'sidebar-rail-link sidebar-tooltip-host sidebar-writing' : 'sidebar-link sidebar-writing'} href={WRITING_URL} target="_blank" rel="noopener noreferrer" aria-label={compact ? '随便写写（新页签打开）' : undefined}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 2 15-.8 3 3v17l-15 1-5-4V4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m2 4 5 3 15-2.8M7 7v15" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m9 9 3-.2 5 7V9.5l-1.4-.2V8l4-.3V9l-1.2.4v10l-2 .2-5.1-7.3v6l1.4.2v1.3l-4 .3v-1.3l1.2-.4v-8L9 10.2Z" fill="currentColor" />
    </svg>
    <span className={compact ? 'sidebar-tooltip' : undefined} aria-hidden={compact || undefined}>随便写写</span>
    {!compact && <ArrowUpRight className="sidebar-writing-external" size={18} aria-hidden="true" />}
  </a>
}
