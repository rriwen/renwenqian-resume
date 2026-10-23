import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdjacentProjects, getProjectTitle, type Project } from '../../data/projects'
import { getDataPilotContent, type DataPilotPart } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'

type Props = { project: Project; locale: Locale }

export function DataPilotCaseStudy({ project, locale }: Props) {
  const content = getDataPilotContent(locale)
  const { prev: prevProject, next: nextProject } = getAdjacentProjects(project.slug)
  const [activePart, setActivePart] = useState<DataPilotPart>('experience')
  const [activeSectionId, setActiveSectionId] = useState('overview')
  const visibleSections = content.parts[activePart].sections

  useEffect(() => {
    const sectionIds = visibleSections.map((section) => section.id)
    const updateActiveSection = () => {
      let current = sectionIds[0]
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 120) current = id
      }
      setActiveSectionId(current)
    }

    setActiveSectionId(sectionIds[0])
    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [visibleSections])

  return (
    <main className="datapilot-case-page">
      <div className="page-shell datapilot-case-shell">
        <Link to="/" className="back-link datapilot-back">{content.labels.back}</Link>
        <header className="datapilot-case-hero">
          <h1>{content.title}</h1>
          <p className="datapilot-hero-copy">{content.paragraphs[0]}</p>
          <p className="datapilot-hero-copy is-secondary">{content.paragraphs[1]}</p>
          <div className="datapilot-meta">{content.metadata.map((item) => <span key={item}>{item}</span>)}<a className="datapilot-demo-link" href={content.demoUrl} target="_blank" rel="noreferrer">{content.labels.demo} ↗</a></div>
        </header>
        <div className="datapilot-part-tabs" role="tablist" aria-label={content.labels.tabs}>
          {(Object.keys(content.parts) as DataPilotPart[]).map((part) => (
            <button key={part} type="button" role="tab" aria-selected={activePart === part} className={activePart === part ? 'is-active' : ''} onClick={() => setActivePart(part)}>
              {content.parts[part].title}
            </button>
          ))}
        </div>
        <div className="datapilot-case-layout">
          <article className="datapilot-case-content">
            {visibleSections.map((section) => (
              <section className="datapilot-module" id={section.id} key={section.id}>
                <div className="datapilot-module-heading"><span>{section.index}</span><h2>{section.title}</h2></div>
                {section.intro ? <h3>{section.intro}</h3> : null}
                {section.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.applicationTypes ? <div className="datapilot-application-types">{section.applicationTypes.map((item) => <section key={item.title}>
                  <h4>{item.title}</h4>
                  <p><strong>{content.labels.scene}</strong>{item.scene}</p>
                  <p><strong>{content.labels.problem}</strong>{item.problem}</p>
                  <p><strong>{content.labels.solution}</strong>{item.solution}</p>
                  <div className="datapilot-application-screenshot" role="img" aria-label={item.screenshot}><span>{item.screenshot}</span></div>
                </section>)}</div> : null}
                {section.related ? <p className="datapilot-related-link">{content.labels.relatedIntro} <Link to="/project/agentops">{content.labels.relatedProject}</Link>。</p> : null}
                {section.stats ? <div className="datapilot-stat-row">{section.stats.map((stat) => <strong key={stat}>{stat}</strong>)}</div> : null}
                {section.bullets && section.id !== 'overview' ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => {
                  const separator = section.id === 'accuracy' ? bullet.indexOf('：') : -1
                  return <li key={bullet}>{separator > -1 ? <><strong>{bullet.slice(0, separator)}</strong>{bullet.slice(separator)}</> : bullet}</li>
                })}</ul> : null}
                {section.images.length ? <div className={`datapilot-evidence ${section.images.length > 1 ? 'is-multi' : 'is-single'}`}>
                  {section.images.map((image) => <figure key={image.src + image.caption}>{image.display === 'image' ? <img className="datapilot-evidence-image" src={image.src} alt={image.alt ?? image.caption} /> : <div className="datapilot-image-placeholder" role="img" aria-label={image.caption} />}{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}
                </div> : null}
                {section.bullets && section.id === 'overview' ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
            <nav className="datapilot-adjacent" aria-label={content.labels.navigation}>
              <div>
                {prevProject ? <><span>{content.labels.previous}</span><Link to={`/project/${prevProject.slug}`}>{getProjectTitle(prevProject, locale)}</Link></> : null}
              </div>
              <div className="is-next">
                {nextProject ? <><span>{content.labels.next}</span><Link to={`/project/${nextProject.slug}`}>{getProjectTitle(nextProject, locale)}</Link></> : null}
              </div>
            </nav>
          </article>
        </div>
      </div>
      <nav className="about-timeline-nav datapilot-anchor-nav" aria-label={content.labels.contents}>
        <ul className="about-timeline-list">
          {visibleSections.map((section) => <li key={section.id} className="about-timeline-item about-timeline-item-section">
            <a
              href={`#${section.id}`}
              className={activeSectionId === section.id ? 'about-timeline-link active' : 'about-timeline-link'}
              aria-label={section.title}
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${section.id}`)
                setActiveSectionId(section.id)
              }}
            >
              <span className="about-timeline-tip" aria-hidden>{section.title}</span>
              <span className="about-timeline-tick" aria-hidden />
            </a>
          </li>)}
        </ul>
      </nav>
    </main>
  )
}
