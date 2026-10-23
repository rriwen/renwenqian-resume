import { Link } from 'react-router-dom'
import { getAdjacentProjects, getProjectTitle, projects } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'

export function ProjectNavigation({ slug }: { slug: string }) {
  const { locale, m } = useLanguage()
  const adjacent = getAdjacentProjects(slug)
  const prevProject = adjacent.prev ?? projects[projects.length - 1]
  const nextProject = adjacent.next

  return (
    <>
      {prevProject || nextProject ? (
        <nav
          aria-label={m.workDetail.projectNavAria}
          className="project-detail-adjacent"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: 'var(--space-6)',
              alignItems: 'start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              {prevProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      color: 'var(--muted)',
                    }}
                  >
                    {m.workDetail.prevProject}
                  </p>
                  <Link
                    to={`/project/${prevProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      lineHeight: 'var(--leading-ui)',
                      color: 'inherit',
                    }}
                  >
                    {getProjectTitle(prevProject, locale)}
                  </Link>
                </>
              ) : null}
            </div>
            <div style={{ minWidth: 0, textAlign: 'right' }}>
              {nextProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: 'var(--text-xs)',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      color: 'var(--muted)',
                    }}
                  >
                    {m.workDetail.nextProject}
                  </p>
                  <Link
                    to={`/project/${nextProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: 'var(--text-base)',
                      fontWeight: 600,
                      lineHeight: 'var(--leading-ui)',
                      color: 'inherit',
                    }}
                  >
                    {getProjectTitle(nextProject, locale)}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}

    </>
  )
}
