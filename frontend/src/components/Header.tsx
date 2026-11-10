import { Link, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { IconMenu } from './Icons'
import { SiteSidebar } from './SiteSidebar'
import { PageToolbar } from './PageToolbar'

type HeaderProps = { onNewChat: () => void; onSelectConversation: (id: string) => void; onOpenContact: () => void; dark: boolean; onToggleTheme: () => void; sidebarCollapsed: boolean; onToggleSidebar: () => void }

export function Header({ onNewChat, onSelectConversation, onOpenContact, dark, onToggleTheme, sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const { locale } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const collapseButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyCollapsed = useRef(sidebarCollapsed)
  const launcherRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (previouslyCollapsed.current !== sidebarCollapsed && window.matchMedia('(min-width: 901px)').matches) {
      const button = sidebarCollapsed ? expandButtonRef.current : collapseButtonRef.current
      button?.focus()
    }
    previouslyCollapsed.current = sidebarCollapsed
  }, [sidebarCollapsed])

  useEffect(closeMenu, [location.key, closeMenu])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)')
    const onResize = () => { if (desktop.matches) closeMenu() }
    desktop.addEventListener('change', onResize)
    return () => desktop.removeEventListener('change', onResize)
  }, [closeMenu])

  return (
    <>
      <div ref={launcherRef} className="navigation-launcher">
        <button ref={menuButtonRef} type="button" className="mobile-menu-button" aria-label={locale === 'zh' ? '打开导航' : 'Open navigation'} aria-controls="site-sidebar" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><IconMenu size={17} /></button>
        <Link to="/" className="header-logo mobile-header-logo">DESIGN.4x</Link>
      </div>
      <PageToolbar onOpenContact={onOpenContact} onSelectConversation={onSelectConversation} showHistory={location.pathname === '/' || location.hash === '#chat'} dark={dark} onToggleTheme={onToggleTheme} />
      <SiteSidebar onNewChat={onNewChat} open={menuOpen} onClose={closeMenu} triggerRef={menuButtonRef} launcherRef={launcherRef} desktopCollapsed={sidebarCollapsed} onToggleSidebar={onToggleSidebar} collapseButtonRef={collapseButtonRef} expandButtonRef={expandButtonRef} />
    </>
  )
}
