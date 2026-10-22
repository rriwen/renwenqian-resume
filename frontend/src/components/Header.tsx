import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { IconClose, IconCommentSquare, IconContrast, IconMenu } from './Icons'
import { projects, getProjectTitle } from '../data/projects'

type HeaderProps = { dark: boolean; onToggleTheme: () => void }

export function Header({ dark, onToggleTheme }: HeaderProps) {
  const { pathname } = useLocation()
  const { m, locale } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [projectsOpen, setProjectsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const hasHoverNavigation = () => window.matchMedia('(min-width: 901px) and (hover: hover)').matches

  useEffect(() => { setProjectsOpen(false); setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 0)
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  return (
    <header
      className={`site-header${isScrolled ? " site-header--scrolled" : ""}`}
    >
      <div className="header-inner">
        <div className="header-left-group">
          <button ref={menuButtonRef} type="button" className="mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="site-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <IconClose size={16} /> : <IconMenu size={17} />}</button>
          <Link to="/" className="header-logo">Design.4x</Link>
          <nav id="site-navigation" className={menuOpen ? 'mobile-nav-open' : ''} aria-label={m.header.navAria} onClick={(event) => { if ((event.target as HTMLElement).closest('a')) { setMenuOpen(false); setProjectsOpen(false) } }} onKeyDown={(event) => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); setProjectsOpen(false); menuButtonRef.current?.focus() } }}>
          <ul className="header-nav-list">
            <li><Link to="/" className={pathname === '/' ? 'header-menu-link is-active' : 'header-menu-link'}>{m.header.home}</Link></li>
            <li>
              <Link
                to="/about"
                className={pathname === '/about' ? 'header-menu-link is-active' : 'header-menu-link'}
              >
                {locale === 'zh' ? '关于' : 'About'}
              </Link>
            </li>
            <li className="header-projects" onMouseEnter={() => { if (hasHoverNavigation()) setProjectsOpen(true) }} onMouseLeave={() => { if (hasHoverNavigation()) setProjectsOpen(false) }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setProjectsOpen(false) }} onKeyDown={(event) => { if (event.key === 'Escape' && projectsOpen) { event.stopPropagation(); setProjectsOpen(false); event.currentTarget.querySelector('button')?.focus() } }}>
              <button type="button" className={`header-menu-link header-projects-trigger${pathname.startsWith('/project/') ? ' is-active' : ''}`} aria-expanded={projectsOpen} aria-controls="header-project-list" onClick={(event) => setProjectsOpen((open) => event.detail > 0 && hasHoverNavigation() ? true : !open)}>
                {locale === 'zh' ? '产品' : 'PRODUCTS'}
              </button>
              <ul id="header-project-list" className="header-project-list" hidden={!projectsOpen}>
                {projects.map((project) => (
                  <li key={project.id}><Link to={`/project/${project.slug}`} aria-current={pathname === `/project/${project.slug}` ? 'page' : undefined}>{getProjectTitle(project, locale)}</Link></li>
                ))}
              </ul>
            </li>
            <li><Link to="/photography" className={pathname === '/photography' ? 'header-menu-link is-active' : 'header-menu-link'}>{locale === 'zh' ? '摄影' : 'Photo'}</Link></li>
            <li><a href="https://app.notion.com/p/rriwen/Hi-I-m-4x-204195a9bba880f787b4dc0eec18a101?source=copy_link" className="header-menu-link" target="_blank" rel="noopener noreferrer">{locale === 'zh' ? '博客' : 'Blog'} <span className="external-link-icon" aria-hidden="true">↗</span></a></li>
          </ul>
          </nav>
        </div>

        <div className="header-actions">
          <a href="#chat" className="header-control header-chat-link" aria-label={locale === 'zh' ? '和我聊聊' : 'Chat with me'} onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '#chat'); window.dispatchEvent(new HashChangeEvent('hashchange')) }}><IconCommentSquare size={14} /><span>{locale === 'zh' ? '和我聊聊' : 'Chat with me'}</span></a>
          <span className="header-control header-language-control"><LanguageSwitcher /></span>
          <button type="button" className="header-control theme-toggle" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}><IconContrast size={15} /></button>
        </div>
      </div>
    </header>
  )
}
