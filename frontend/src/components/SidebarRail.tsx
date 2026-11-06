import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getProjectGroups, getProjectNavigationTitle, type ProjectCategory } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { IconCamera, IconFileText, IconMail, IconNewChat, IconPalette, IconSparkle, IconTerminal } from './Icons'

export function SidebarRail({ onNewChat, onOpenContact }: { onNewChat: () => void; onOpenContact: () => void }) {
  const { pathname, hash, key } = useLocation()
  const selectedPathname = hash === '#chat' ? '' : pathname
  const projectGroups = getProjectGroups()
  const isDesignEngineering = projectGroups.find((group) => group.id === 'design-systems')!.projects.some((project) => selectedPathname === `/project/${project.slug}`)
  const { locale, m } = useLanguage()
  const [openGroup, setOpenGroup] = useState<ProjectCategory | null>(null)
  const groupRefs = useRef<Partial<Record<ProjectCategory, HTMLDivElement | null>>>({})
  const triggerRefs = useRef<Partial<Record<ProjectCategory, HTMLButtonElement | null>>>({})
  const photographyLabel = locale === 'zh' ? '摄影记录' : 'Photography journal'
  const contactLabel = locale === 'zh' ? '联系我' : 'Contact me'

  useEffect(() => { setOpenGroup(null) }, [key])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)')
    const onResize = () => { if (!desktop.matches) setOpenGroup(null) }
    desktop.addEventListener('change', onResize)
    return () => desktop.removeEventListener('change', onResize)
  }, [])

  useEffect(() => {
    if (!openGroup) return
    const onPointerDown = (event: PointerEvent) => {
      if (!groupRefs.current[openGroup]?.contains(event.target as Node)) setOpenGroup(null)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpenGroup(null)
      if (groupRefs.current[openGroup]?.contains(document.activeElement)) triggerRefs.current[openGroup]?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openGroup])

  const closeGroup = (id: ProjectCategory) => setOpenGroup(current => current === id ? null : current)

  const openOnHover = (id: ProjectCategory) => setOpenGroup(current => {
    if (current && current !== id && groupRefs.current[current]?.querySelector('.sidebar-project-flyout')?.contains(document.activeElement)) return current
    return id
  })

  return (
    <nav className="sidebar-rail" aria-label={m.header.navAria}>
      <button type="button" className="sidebar-rail-link sidebar-tooltip-host" aria-label={m.header.home} aria-current={selectedPathname === '/' && !hash ? 'page' : undefined} onClick={onNewChat}>
        <IconNewChat /><span className="sidebar-tooltip" aria-hidden="true">{m.header.home}</span>
      </button>
      <Link to="/about" className="sidebar-rail-link sidebar-tooltip-host" aria-label={m.header.about} aria-current={selectedPathname === '/about' ? 'page' : undefined}>
        <IconFileText /><span className="sidebar-tooltip" aria-hidden="true">{m.header.about}</span>
      </Link>
      {projectGroups.filter(group => group.id !== 'design-systems').map(group => (
        <div key={group.id} className="sidebar-rail-projects" ref={element => { groupRefs.current[group.id] = element }}
          onMouseEnter={() => openOnHover(group.id)}
          onMouseLeave={() => { if (!groupRefs.current[group.id]?.contains(document.activeElement)) closeGroup(group.id) }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) closeGroup(group.id) }}>
          <button ref={element => { triggerRefs.current[group.id] = element }} type="button" className="sidebar-rail-link" aria-label={group.label[locale]} aria-expanded={openGroup === group.id} aria-controls={`sidebar-${group.id}-flyout`} data-active={group.projects.some(project => selectedPathname === `/project/${project.slug}`) || undefined}
            onClick={() => setOpenGroup(group.id)}>
            {group.id === 'ai-products' ? <IconSparkle /> : <IconTerminal />}
          </button>
          <div id={`sidebar-${group.id}-flyout`} className="sidebar-project-flyout" hidden={openGroup !== group.id}>
            <div className="sidebar-project-flyout-panel">
              <section aria-labelledby={`rail-${group.id}`}>
                <h2 id={`rail-${group.id}`}>{group.label[locale]}</h2>
                <ul>
                  {group.projects.filter((item) => !item.hiddenFromNavigation).map((project) => (
                    <li key={project.id}><Link to={`/project/${project.slug}`} className="sidebar-link" aria-current={selectedPathname === `/project/${project.slug}` ? 'page' : undefined}>{getProjectNavigationTitle(project, locale)}</Link></li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      ))}
      <Link to="/project/aidesignsystem" className="sidebar-rail-link sidebar-tooltip-host" aria-label={locale === 'zh' ? '设计工程化' : 'Design Engineering'} aria-current={isDesignEngineering ? 'page' : undefined}>
        <IconPalette /><span className="sidebar-tooltip" aria-hidden="true">{locale === 'zh' ? '设计工程化' : 'Design Engineering'}</span>
      </Link>
      <Link to="/photography" className="sidebar-rail-link sidebar-tooltip-host" aria-label={photographyLabel} aria-current={selectedPathname === '/photography' ? 'page' : undefined}>
        <IconCamera /><span className="sidebar-tooltip" aria-hidden="true">{photographyLabel}</span>
      </Link>
      <button type="button" className="sidebar-rail-link sidebar-contact-button sidebar-tooltip-host" aria-label={contactLabel} aria-haspopup="dialog" onClick={(event) => {
        event.currentTarget.focus()
        onOpenContact()
      }}><IconMail /><span className="sidebar-tooltip" aria-hidden="true">{contactLabel}</span></button>
    </nav>
  )
}
