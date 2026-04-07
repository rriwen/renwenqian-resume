import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { VariableProximityName } from './VariableProximityName'

export function Header() {
  const { pathname } = useLocation()
  const { m } = useLanguage()

  return (
    <header
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 50,
        padding: '1rem clamp(1rem, 3vw, 1.5rem) 0',
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
        <Link to="/" style={{ minWidth: 0 }}>
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
              gap: 'clamp(0.75rem, 2vw, 1.25rem)',
            }}
          >
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
