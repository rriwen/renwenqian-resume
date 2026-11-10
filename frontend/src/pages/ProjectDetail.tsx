import { lazy, useEffect } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { DataPilotCaseStudy } from '../components/project/DataPilotCaseStudy'
import { StandardProjectDetail } from '../components/project/StandardProjectDetail'
import { getProjectDetail } from '../data/projectDetails'
import { getProjectBySlug, getProjectTitle } from '../data/projects'
import { getProjectViewBySlug } from '../data/projectViews'
import { useLanguage } from '../i18n/LanguageContext'

const DatabaseOpsVisualCaseStudy = lazy(() => import('../components/project/DatabaseOpsVisualCaseStudy').then(module => ({ default: module.DatabaseOpsVisualCaseStudy })))

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const location = useLocation()
  const { locale, m } = useLanguage()
  const view = getProjectViewBySlug(slug)
  const project = getProjectBySlug(view?.sourceSlug ?? slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined

  useEffect(() => {
    document.title = project ? `${view?.title[locale] ?? getProjectTitle(project, locale)} | ${m.header.name}` : m.home.title
  }, [project, view, locale, m.home.title, m.header.name])

  if (!project || !detail) {
    return (
      <main className="page-shell project-detail-page">
        <p style={{ margin: 'var(--space-2) 0 var(--paragraph-gap)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-body)', color: 'var(--text)' }}>
          {m.workDetail.notFound}
        </p>
        <Link to="/" className="back-link project-detail-back-link">{m.workDetail.back}</Link>
      </main>
    )
  }

  if (slug === 'databaseops-visual') {
    return <Navigate replace to={`/project/databaseops${location.search}${location.hash}`} />
  }

  if (project.slug === 'dataagent') {
    return <DataPilotCaseStudy key={project.slug} locale={locale} />
  }

  if (project.slug === 'databaseops') {
    return <DatabaseOpsVisualCaseStudy key={project.slug} project={project} detail={detail} />
  }

  return <StandardProjectDetail key={project.slug} project={project} detail={detail} />
}
