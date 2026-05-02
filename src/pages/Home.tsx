import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { projects, type Project } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { CardStack } from '../components/CardStack'
import { FooterBar } from '../components/FooterBar'
import { ProjectGrid } from '../components/ProjectGrid'

type ViewMode = 'stack' | 'grid'

type Props = {
  viewMode: ViewMode
  onViewMode: (m: ViewMode) => void
}

export function Home({ viewMode, onViewMode }: Props) {
  const { m } = useLanguage()
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(-1)

  const openProject = (p: Project) => {
    navigate(`/project/${p.slug}`)
  }

  useEffect(() => {
    document.title = m.home.title
  }, [m.home.title])

  const active = activeIndex >= 0 ? projects[activeIndex] : undefined

  return (
    <main
      style={{
        height: '100dvh',
        minHeight: '100dvh',
        maxHeight: '100dvh',
        paddingTop: 'clamp(3.75rem, 10dvh, 4.75rem)',
        paddingBottom: 0,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 0,
          isolation: 'isolate',
        }}
      >
        {viewMode === 'stack' ? (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              width: '100%',
              maxWidth: 1100,
              margin: '0 auto',
              padding: '0 clamp(0.5rem, 2vw, 1rem)',
            }}
          >
            <CardStack
              projects={projects}
              activeIndex={activeIndex}
              onActiveChange={setActiveIndex}
              onOpenProject={openProject}
            />
            {active && (
              <p
                style={{
                  flexShrink: 0,
                  textAlign: 'center',
                  margin: '0.35rem 0 0',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity: 0.42,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {active.title}
              </p>
            )}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              padding: '0.5rem 0 0.5rem',
            }}
          >
            <ProjectGrid projects={projects} activeIndex={activeIndex} onOpenProject={openProject} />
          </div>
        )}
      </div>

      <FooterBar
        projects={projects}
        viewMode={viewMode}
        onViewMode={onViewMode}
        activeIndex={activeIndex}
        onActiveChange={setActiveIndex}
      />
    </main>
  )
}
