import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { DataPilotPartMenu } from './DataPilotPartMenu'
import { getDataPilotContent, type DataPilotPart } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ReadingPageHeader } from '../ReadingPageHeader'
import { LoadingImage } from './LoadingImage'

type Props = { locale: Locale }

export function DataPilotCaseStudy({ locale }: Props) {
  const content = getDataPilotContent(locale)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [activePart, setActivePart] = useState<DataPilotPart>('experience')
  const location = useLocation()
  const navigate = useNavigate()
  const visibleSections = content.parts[activePart].sections

  useEffect(() => {
    const id = location.hash.slice(1)
    const part = (Object.keys(content.parts) as DataPilotPart[]).find((key) => content.parts[key].sections.some((section) => section.id === id))
    if (part) setActivePart(part)
    else if (!location.hash) setActivePart('experience')
  }, [location.hash, content])

  const selectPart = (part: DataPilotPart) => {
    setActivePart(part)
    const id = content.parts[part].sections[0]?.id
    navigate({ pathname: location.pathname, search: location.search, hash: id ? `#${id}` : '' }, { preventScrollReset: true })
  }

  return (
    <main className="datapilot-case-page">
      <ReadingPageHeader title={content.title} titleRef={titleRef} controls={
        <DataPilotPartMenu label={content.labels.tabs} value={activePart} onSelect={selectPart}
          options={(Object.keys(content.parts) as DataPilotPart[]).map((part) => ({ value: part, label: content.parts[part].title }))} />
      } />
      <div className="page-shell datapilot-case-shell">
        <header className="datapilot-case-hero">
          <h1 ref={titleRef}>{content.title}</h1>
          <div className="datapilot-meta project-case-tags project-case-tags--filled">{content.tags.map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}</div>
          <p className="datapilot-hero-copy">{content.paragraphs[0]}</p>
          <p className="datapilot-hero-copy is-secondary">{content.paragraphs[1]}</p>
          <div className="datapilot-meta">{content.metadata.map((item) => <span key={item}>{item}</span>)}<a className="datapilot-demo-link" href={content.demoUrl} target="_blank" rel="noreferrer">{content.labels.demo} ↗</a></div>
        </header>
        <div className="datapilot-part-tabs" role="tablist" aria-label={content.labels.tabs}>
          {(Object.keys(content.parts) as DataPilotPart[]).map((part) => (
            <button key={part} type="button" role="tab" aria-selected={activePart === part} className={activePart === part ? 'is-active' : ''} onClick={() => selectPart(part)}>
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
                  {section.images.map((image) => <figure key={image.src + image.caption}>{image.display === 'image' ? <div className="media-frame"><LoadingImage className="datapilot-evidence-image" src={image.src} alt={image.alt ?? image.caption} /></div> : <div className="datapilot-image-placeholder" role="img" aria-label={image.caption} />}{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}
                </div> : null}
                {section.bullets && section.id === 'overview' ? <ul className="datapilot-bullets">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
              </section>
            ))}
          </article>
        </div>
      </div>
      <ProjectAnchorNav sections={visibleSections} label={content.labels.contents} />
    </main>
  )
}
