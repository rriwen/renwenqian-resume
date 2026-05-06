import type { Project } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { IconFourPointStar, IconGrid, IconStack } from './Icons'

type ViewMode = 'stack' | 'grid'

type Props = {
  projects: Project[]
  viewMode: ViewMode
  onViewMode: (m: ViewMode) => void
  activeIndex: number
  onActiveChange: (i: number) => void
}

export function FooterBar({ projects, viewMode, onViewMode, activeIndex, onActiveChange }: Props) {
  const { m } = useLanguage()

  return (
    <footer
      className="site-footer"
      style={{
        flexShrink: 0,
        width: '100%',
        minWidth: 1024,
        zIndex: 120,
        padding: '1.1rem 1.5rem max(0.65rem, env(safe-area-inset-bottom))',
        pointerEvents: 'none',
        marginTop: 'auto',
        background:
          'linear-gradient(to top, #F3F6FC 0%, rgba(243, 246, 252, 0.95) 42%, rgba(243, 246, 252, 0.72) 72%, rgba(243, 246, 252, 0) 100%)',
      }}
    >
      <div style={{ pointerEvents: 'auto', width: 413, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '-0.35rem', marginBottom: '0.5rem' }}>
          <img
            src="/images/profile.png"
            alt=""
            width={48}
            height={48}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #fff',
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.55, opacity: 0.78 }}>
          {m.footer.bioLines.map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </p>
        <a
          href="#chat"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            boxSizing: 'border-box',
            minHeight: 32,
            height: 32,
            padding: '0 10px',
            marginTop: 12,
            marginBottom: '0.45rem',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: 'inherit',
            textDecoration: 'none',
            background: 'transparent',
            border: '1px solid rgba(10,10,10,0.22)',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          <span style={{ display: 'flex', flexShrink: 0, opacity: 0.92 }}>
            <IconFourPointStar size={16} />
          </span>
          {m.footer.botLink}
        </a>
      </div>

      <div
        className="site-footer-view-toggle"
        role="presentation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          textTransform: 'none',
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          aria-label={m.footer.ariaStack}
          aria-pressed={viewMode === 'stack'}
          onClick={() => onViewMode('stack')}
          style={{
            padding: '0.2rem',
            borderRadius: 4,
            opacity: viewMode === 'stack' ? 1 : 0.35,
            color: viewMode === 'stack' ? '#0a0a0a' : '#111',
          }}
        >
          <IconStack />
        </button>
        <button
          type="button"
          aria-label={m.footer.ariaGrid}
          aria-pressed={viewMode === 'grid'}
          onClick={() => onViewMode('grid')}
          style={{
            padding: '0.35rem',
            borderRadius: 4,
            opacity: viewMode === 'grid' ? 1 : 0.35,
            color: viewMode === 'grid' ? '#0a0a0a' : '#111',
          }}
        >
          <IconGrid />
        </button>
      </div>

      <nav
        className="site-footer-nav"
        aria-label={m.footer.projectsNavAria}
        style={{
          pointerEvents: 'auto',
          justifySelf: 'end',
          textAlign: 'right',
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          lineHeight: 1.85,
          maxHeight: 280,
          overflowY: 'auto',
          paddingLeft: '1rem',
        }}
      >
        {projects.map((p, i) => (
          <div key={p.id}>
            <button
              type="button"
              onClick={() => {
                onActiveChange(i)
                onViewMode('stack')
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                font: 'inherit',
                color: 'inherit',
                opacity: i === activeIndex ? 1 : 0.38,
                fontWeight: i === activeIndex ? 600 : 400,
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}
            >
              {p.title}
            </button>
          </div>
        ))}
      </nav>
    </footer>
  )
}
