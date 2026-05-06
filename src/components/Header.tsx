import { Link, useLocation } from 'react-router-dom'
import { projects } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { VariableProximityName } from './VariableProximityName'

export function Header() {
  const { pathname } = useLocation()
  const { m } = useLanguage()
  const projectPathMatch = pathname.startsWith('/project/')
  const isHome = pathname === '/'

  return (
    <header
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        backgroundColor: isHome ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 1)',
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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '0.75rem',
          lineHeight: 1.25,
        }}
      >
        <Link to="/" style={{ flexShrink: 0 }}>
          <p style={{ margin: 0, lineHeight: 1.25 }}>
            <VariableProximityName text={m.header.name} />
          </p>
          <p style={{ margin: '0.35rem 0 0', opacity: 0.65, fontWeight: 400 }}>{m.header.role}</p>
        </Link>

        <nav aria-label={m.header.navAria} style={{ flexShrink: 0 }}>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1.25rem',
            }}
          >
            <li>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  fontWeight: 500,
                  borderBottom: pathname === '/' ? '1px solid currentColor' : '1px solid transparent',
                }}
              >
                {m.header.home}
              </Link>
            </li>
            <li className="header-nav-dropdown">
              <button
                type="button"
                className="header-nav-dropdown-trigger"
                aria-haspopup="menu"
                aria-controls="header-projects-menu"
                id="header-projects-trigger"
                style={{
                  display: 'inline-block',
                  fontWeight: 500,
                  borderBottom: projectPathMatch ? '1px solid currentColor' : '1px solid transparent',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  textTransform: 'inherit',
                  letterSpacing: 'inherit',
                }}
              >
                {m.header.projects}
              </button>
              <div className="header-nav-dropdown-panel" role="presentation">
                <div className="header-nav-dropdown-panel-inner">
                  <ul
                    id="header-projects-menu"
                    className="header-nav-dropdown-list"
                    role="menu"
                    aria-label={m.header.projectsMenuAria}
                  >
                    {projects.map((p) => {
                      const projectActive = pathname === `/project/${p.slug}`
                      return (
                        <li key={p.id} role="none">
                          <Link
                            role="menuitem"
                            to={`/project/${p.slug}`}
                            className={
                              projectActive
                                ? 'header-nav-dropdown-link header-nav-dropdown-link--active'
                                : 'header-nav-dropdown-link'
                            }
                            aria-current={projectActive ? 'page' : undefined}
                          >
                            {p.title}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </li>
            <li>
              <Link
                to="/about"
                style={{
                  display: 'inline-block',
                  fontWeight: 500,
                  borderBottom: pathname === '/about' ? '1px solid currentColor' : '1px solid transparent',
                }}
              >
                {m.header.about}
              </Link>
            </li>
            <li>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  window.history.pushState(null, '', '#contact')
                  window.dispatchEvent(new HashChangeEvent('hashchange'))
                }}
                style={{ fontWeight: 500 }}
              >
                {m.header.contact}
              </a>
            </li>
            <li style={{ marginLeft: '0.15rem' }}>
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
