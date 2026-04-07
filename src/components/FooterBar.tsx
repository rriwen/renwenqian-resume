import type { Project } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { IconGrid, IconStack } from './Icons'

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
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 'clamp(14px, 3.2vh, 32px)',
        zIndex: 120,
        padding: '1.1rem clamp(1rem, 3vw, 1.5rem) max(0.65rem, env(safe-area-inset-bottom))',
        pointerEvents: 'none',
        background:
          'linear-gradient(to top, #fff 0%, rgba(255,255,255,0.95) 42%, rgba(255,255,255,0.72) 72%, rgba(255,255,255,0) 100%)',
      }}
    >
      <div style={{ pointerEvents: 'auto', maxWidth: 396 }}>
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
        <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.55, opacity: 0.78, maxWidth: 396 }}>
          {m.footer.bio}
        </p>
        <a
          href="#chat"
          style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            letterSpacing: '0.14em',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            marginTop: 12,
            marginBottom: '0.45rem',
            fontWeight: 600,
          }}
        >
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
          maxHeight: 'min(38vh, 280px)',
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
