import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SectionAnchorNav, type SectionAnchor } from '../SectionAnchorNav'

export type ProjectAnchor = SectionAnchor

/** Shared case-study navigation; existing section IDs are also shareable URLs. */
export function ProjectAnchorNav({ sections, label }: { sections: ProjectAnchor[]; label: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(sections[0]?.id)
  const ids = sections.map(({ id }) => id).join('|')

  useEffect(() => {
    const elements = ids.split('|').map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element))
    const readingLine = (elements[0] ? parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0 : 0)
      + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0) + 2
    const update = () => {
      const passed = elements.filter((element) => element.getBoundingClientRect().top <= readingLine)
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      const current = atBottom ? elements[elements.length - 1] : passed[passed.length - 1] ?? elements[0]
      if (current) setActiveId(current.id)
    }
    const observer = new IntersectionObserver(update, { rootMargin: `-${readingLine}px 0px -45% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] })
    elements.forEach((element) => observer.observe(element))
    update()
    return () => observer.disconnect()
  }, [ids])

  useEffect(() => {
    const id = location.hash.slice(1)
    const target = document.getElementById(id)
    const anchorId = ids.split('|').find((sectionId) => document.getElementById(sectionId)?.contains(target))
    if (!target || !anchorId) return
    // Wait until the route's scroll reset and lazy content have committed.
    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      setActiveId(anchorId)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.key, location.hash, ids])

  return <SectionAnchorNav
    sections={sections}
    activeId={activeId}
    label={label}
    className="project-anchor-nav"
    onNavigate={(id) => {
      if (location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView({ block: 'start' })
      else navigate({ pathname: location.pathname, search: location.search, hash: `#${id}` }, { preventScrollReset: true })
      setActiveId(id)
    }}
  />
}
