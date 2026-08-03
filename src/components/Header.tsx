import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { IconCommentSquare, IconContrast } from './Icons'

type HeaderProps = { dark: boolean; onToggleTheme: () => void }

export function Header({ dark, onToggleTheme }: HeaderProps) {
  const { pathname } = useLocation()
  const { m, locale } = useLanguage()
  const isHome = pathname === '/'
  const isArticle = pathname.startsWith('/blog/')

  return (
    <header
      className={isArticle ? 'site-header site-header--article' : 'site-header'}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        backgroundColor: isHome ? 'var(--page-bg)' : isArticle ? 'var(--blog-hero-bg)' : 'var(--page-bg)',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.75rem',
          lineHeight: 1.25,
        }}
      >
        <div className="header-left-group">
          <Link to="/" className="header-logo">Design.4x</Link>
          <nav aria-label={m.header.navAria}>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '1.2rem',
            }}
          >
            <li><Link to="/" className={pathname === '/' ? 'header-menu-link is-active' : 'header-menu-link'}>{m.header.home}</Link></li>
            <li>
              <Link
                to="/about"
                className={pathname === '/about' ? 'header-menu-link is-active' : 'header-menu-link'}
              >
                {locale === 'zh' ? '关于我' : 'About me'}
              </Link>
            </li>
            <li><Link to="/blog" className={pathname.startsWith('/blog') ? 'header-menu-link is-active' : 'header-menu-link'}>{locale === 'zh' ? '博客' : 'Journal'}</Link></li>
            <li><Link to="/photography" className={pathname === '/photography' ? 'header-menu-link is-active' : 'header-menu-link'}>{locale === 'zh' ? '摄影' : 'Photo'}</Link></li>
          </ul>
          </nav>
        </div>

        <div className="header-actions">
          <a href="#chat" className="header-control header-chat-link" onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '#chat'); window.dispatchEvent(new HashChangeEvent('hashchange')) }}><IconCommentSquare size={14} /><span>{locale === 'zh' ? '和我聊聊' : 'Chat with me'}</span></a>
          <span className="header-control header-language-control"><LanguageSwitcher /></span>
          <button type="button" className="header-control theme-toggle" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}><IconContrast size={15} /></button>
        </div>
      </div>
    </header>
  )
}
