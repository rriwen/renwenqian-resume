export type SectionAnchor<Id extends string = string> = { id: Id; title: string }

type Props<Id extends string> = {
  sections: SectionAnchor<Id>[]
  activeId: Id | undefined
  label: string
  onNavigate: (id: Id) => void
  className?: string
}

/** Shared tick navigation for About and case-study sections. */
export function SectionAnchorNav<Id extends string>({ sections, activeId, label, onNavigate, className = '' }: Props<Id>) {
  return <nav className={`about-timeline-nav ${className}`.trim()} aria-label={label}>
    <ul className="about-timeline-list">
      {sections.map(({ id, title }) => <li key={id} className="about-timeline-item about-timeline-item-section">
        <a
          href={`#${id}`}
          className={`about-timeline-link${activeId === id ? ' active' : ''}`}
          aria-label={title}
          aria-current={activeId === id ? 'location' : undefined}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
            event.preventDefault()
            onNavigate(id)
          }}
        >
          <span className="about-timeline-tip" aria-hidden>{title}</span>
          <span className="about-timeline-tick" aria-hidden />
        </a>
      </li>)}
    </ul>
  </nav>
}
