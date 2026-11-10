import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { getProjectBySlug, getProjectNavigationTitle, type ProjectCategory } from '../data/projects'
import { getProjectNavigationGroups, getProjectViewBySlug } from '../data/projectViews'
import { useLanguage } from '../i18n/LanguageContext'
import { IconCamera, IconClose, IconFileText, IconMail, IconNewChat, IconPalette, IconSidebarToggle, IconSparkle, IconTerminal } from './Icons'
import { SidebarRail } from './SidebarRail'
import { BookOpenIcon } from '@phosphor-icons/react'

type Props = {
  onNewChat: () => void
  onOpenContact: () => void
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement>
  launcherRef: RefObject<HTMLDivElement>
  desktopCollapsed: boolean
  onToggleSidebar: () => void
  collapseButtonRef: RefObject<HTMLButtonElement>
  expandButtonRef: RefObject<HTMLButtonElement>
}

export function SiteSidebar({ onNewChat, onOpenContact, open, onClose, triggerRef, launcherRef, desktopCollapsed, onToggleSidebar, collapseButtonRef, expandButtonRef }: Props) {
  const { pathname, hash } = useLocation()
  const selectedPathname = hash === '#chat' ? '' : pathname
  const match = useMatch('/project/:slug')
  const view = getProjectViewBySlug(match?.params.slug)
  const project = getProjectBySlug(view?.sourceSlug ?? match?.params.slug)
  const selectedProjectSlug = view?.slug ?? project?.slug
  const { locale, m } = useLanguage()
  const [collapsed, setCollapsed] = useState<Partial<Record<ProjectCategory, boolean>>>({})
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (project) setCollapsed((previous) => ({ ...previous, [project.category]: false }))
  }, [project, selectedProjectSlug])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const background = [document.getElementById('site-main'), launcherRef.current, document.querySelector<HTMLElement>('.page-toolbar')]
      .filter((element): element is HTMLElement => element !== null)
    const previousInert = background.map((element) => element.inert)
    const previousOverflow = document.body.style.overflow
    background.forEach((element) => { element.inert = true })
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        .filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    panel.addEventListener('keydown', onKeyDown)
    return () => {
      panel.removeEventListener('keydown', onKeyDown)
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.body.style.overflow = previousOverflow
      const trigger = triggerRef.current
      if (trigger?.getClientRects().length) trigger.focus()
    }
  }, [open, onClose, triggerRef, launcherRef])

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} aria-hidden="true" />}
      <aside ref={panelRef} id="site-sidebar" className={`site-sidebar${desktopCollapsed ? ' is-collapsed' : ''}${open ? ' is-open' : ''}`} role={open ? 'dialog' : undefined} aria-modal={open ? true : undefined} aria-label={m.header.navAria}>
        <div className="sidebar-heading">
          <Link to="/" className="header-logo" onClick={onClose}>DESIGN.4x</Link>
          <button ref={collapseButtonRef} type="button" className="icon-button sidebar-collapse-button" aria-label={locale === 'zh' ? '收起侧栏' : 'Collapse sidebar'} title={locale === 'zh' ? '收起侧栏' : 'Collapse sidebar'} aria-controls="site-sidebar" aria-expanded={true} onClick={onToggleSidebar}><IconSidebarToggle expanded /></button>
          <button ref={expandButtonRef} type="button" className="icon-button sidebar-expand-button sidebar-tooltip-host" aria-label={locale === 'zh' ? '展开侧栏' : 'Expand sidebar'} aria-controls="site-sidebar" aria-expanded={false} onClick={onToggleSidebar}><span className="sidebar-expand-brand" aria-hidden="true">4x</span><span className="sidebar-expand-icon" aria-hidden="true"><IconSidebarToggle expanded={false} /></span><span className="sidebar-tooltip" aria-hidden="true">{locale === 'zh' ? '展开侧栏' : 'Expand sidebar'}</span></button>
          <button ref={closeRef} type="button" className="icon-button sidebar-close" aria-label={locale === 'zh' ? '关闭导航' : 'Close navigation'} onClick={onClose}><IconClose /></button>
        </div>
        <nav id="site-navigation" className="sidebar-navigation" aria-label={m.header.navAria} onClick={(event) => { if ((event.target as HTMLElement).closest('a')) onClose() }}>
          <button type="button" className="sidebar-link" aria-current={selectedPathname === '/' && !hash ? 'page' : undefined} onClick={() => { onClose(); onNewChat() }}><IconNewChat /><span>{m.header.home}</span></button>
          <Link to="/about" className="sidebar-link" aria-current={selectedPathname === '/about' ? 'page' : undefined}><IconFileText /><span>{m.header.about}</span></Link>
          {getProjectNavigationGroups().map((group) => {
            if (group.id === 'design-systems') return (
              <Link key={group.id} to="/project/aidesignsystem" className="sidebar-link" aria-current={selectedPathname && project?.category === group.id ? 'page' : undefined}>
                <IconPalette /><span>{group.label[locale]}</span>
              </Link>
            )
            return (
            <div className="sidebar-group" key={group.id}>
              <button type="button" className="sidebar-group-toggle" aria-expanded={!collapsed[group.id]} aria-controls={`sidebar-${group.id}`} onClick={() => setCollapsed((previous) => ({ ...previous, [group.id]: !previous[group.id] }))}>
                {group.id === 'ai-products' ? <IconSparkle /> : <IconTerminal />}<span className="sidebar-group-label">{group.label[locale]}</span><span className="sidebar-chevron" aria-hidden="true" />
              </button>
              <ul id={`sidebar-${group.id}`} className="sidebar-projects" hidden={!!collapsed[group.id]}>
                {group.projects.filter((item) => !item.hiddenFromNavigation).map((item) => (
                  <li key={item.id}><Link to={`/project/${item.slug}`} className="sidebar-link" aria-current={selectedPathname && selectedProjectSlug === item.slug ? 'page' : undefined}>{getProjectNavigationTitle(item, locale)}</Link></li>
                ))}
              </ul>
            </div>
            )
          })}
          <Link to="/photography" className="sidebar-link sidebar-photography" aria-current={selectedPathname === '/photography' ? 'page' : undefined}><IconCamera /><span>{locale === 'zh' ? '摄影记录' : 'Photography journal'}</span></Link>
          <button type="button" className="sidebar-link sidebar-contact-button" aria-haspopup="dialog" onClick={(event) => {
            event.currentTarget.focus()
            onClose()
            onOpenContact()
          }}><IconMail size={18} /><span>{locale === 'zh' ? '联系我' : 'Contact me'}</span></button>
          <a hidden className="sidebar-link sidebar-blog" href="https://app.notion.com/p/rriwen/Hi-I-m-4x-204195a9bba880f787b4dc0eec18a101?source=copy_link" target="_blank" rel="noopener noreferrer"><BookOpenIcon size={18} aria-hidden="true" /><span>{locale === 'zh' ? '博客' : 'Blog'}</span><span className="external-link-icon" aria-hidden="true">↗</span></a>
        </nav>
        {desktopCollapsed && <SidebarRail onNewChat={onNewChat} onOpenContact={onOpenContact} />}
      </aside>
    </>
  )
}
