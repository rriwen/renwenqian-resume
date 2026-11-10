import { getCaseStudyMethods } from '../../data/projects/caseStudyPresentation'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { DataPilotPartMenu } from './DataPilotPartMenu'
import { getDataPilotContent, type DataPilotPart } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ReadingPageHeader } from '../ReadingPageHeader'
import { CaseStudyGallery, CaseStudyPlaceholder } from './CaseStudyMedia'
import { DataPilotPocSection } from './DataPilotPocSection'

type Props = { locale: Locale }

export function DataPilotCaseStudy({ locale }: Props) {
  const content = getDataPilotContent(locale)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [activePart, setActivePart] = useState<DataPilotPart>('experience')
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const preserveTabScroll = navigationType === 'PUSH' && location.state?.preserveDataPilotTabScroll === true
  const visibleSections = content.parts[activePart].sections

  useEffect(() => {
    const id = location.hash.slice(1)
    const part = (Object.keys(content.parts) as DataPilotPart[]).find((key) => content.parts[key].sections.some((section) => section.id === id))
    if (part) setActivePart(part)
    else if (!location.hash) setActivePart('experience')
  }, [location.hash, content])

  const selectPart = (part: DataPilotPart, preserveScroll = false) => {
    if (preserveScroll && part === activePart) return
    setActivePart(part)
    const id = content.parts[part].sections[0]?.id
    navigate({ pathname: location.pathname, search: location.search, hash: id ? `#${id}` : '' }, {
      preventScrollReset: true,
      state: preserveScroll ? { preserveDataPilotTabScroll: true } : null,
    })
  }

  return (
    <main className="datapilot-case-page case-study-page">
      <ReadingPageHeader title={content.title} titleRef={titleRef} controls={
        <DataPilotPartMenu label={content.labels.tabs} value={activePart} onSelect={selectPart}
          options={(Object.keys(content.parts) as DataPilotPart[]).map((part) => ({ value: part, label: content.parts[part].title }))} />
      } />
      <div className="page-shell datapilot-case-shell">
        <header className="datapilot-case-hero">
          <h1 ref={titleRef}>{content.title}</h1>
          <p className="case-study-lead">{locale === 'zh' ? '串联自然语言问数与数据应用生成，支持业务分析的完整流程' : 'Connect natural-language queries and data applications across the analysis workflow'}</p>
          <div className="datapilot-meta project-case-tags project-case-tags--filled">{getCaseStudyMethods('dataagent', locale).map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}</div>
          <div className="project-case-cover"><CaseStudyGallery items={[{ src: '/images/datapilot-hero.png', caption: content.title, hideCaption: true }]} /></div>
          <a className="ui-button case-study-demo" href={content.demoUrl} target="_blank" rel="noopener noreferrer">{content.labels.demo} ↗</a>
          <div className="case-study-introduction">{content.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className="datapilot-meta case-study-metadata">{content.metadata.map(item => <span key={item}>{item}</span>)}</div>
        </header>
        <div className="datapilot-part-tabs" role="tablist" aria-label={content.labels.tabs}>
          {(Object.keys(content.parts) as DataPilotPart[]).map((part) => (
            <button key={part} type="button" role="tab" aria-selected={activePart === part} className={activePart === part ? 'is-active' : ''} onClick={() => selectPart(part, true)}>
              {content.parts[part].title}
            </button>
          ))}
        </div>
        <div className="datapilot-case-layout">
          <article className={`datapilot-case-content project-case-content${activePart === 'poc' ? ' datapilot-poc-content' : ''}`}>
            {visibleSections.map((section) => activePart === 'poc' ? <DataPilotPocSection key={section.id} section={section} /> : (
              <section className="project-detail-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
                <div className="project-detail-section-copy">
                <h2 id={`${section.id}-title`}>{section.intro || section.title}</h2>
                {section.body.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.applicationTypes ? <div className="datapilot-application-types">{section.applicationTypes.map((item) => <section key={item.title}>
                  <h4>{item.title}</h4>
                  <p><strong>{content.labels.scene}</strong>{item.scene}</p>
                  <p><strong>{content.labels.problem}</strong>{item.problem}</p>
                  <p><strong>{content.labels.solution}</strong>{item.solution}</p>
                  <CaseStudyPlaceholder title={item.screenshot} />
                </section>)}</div> : null}
                {section.related ? <p className="datapilot-related-link">{content.labels.relatedIntro} <Link to="/project/agentops">{content.labels.relatedProject}</Link>。</p> : null}
                {section.stats ? <div className="datapilot-stat-row">{section.stats.map((stat) => <strong key={stat}>{stat}</strong>)}</div> : null}
                {section.bullets && section.id !== 'overview' ? <ul className="project-detail-subsection-list">{section.bullets.map((bullet) => {
                  const separator = section.id === 'accuracy' ? bullet.indexOf('：') : -1
                  return <li key={bullet}>{separator > -1 ? <><strong>{bullet.slice(0, separator)}</strong>{bullet.slice(separator)}</> : bullet}</li>
                })}</ul> : null}
                {section.images.length ? <div className={`datapilot-evidence ${section.images.length > 1 ? 'is-multi' : 'is-single'}`}>
                  {section.images.map(image => image.display === 'image'
                    ? <CaseStudyGallery key={image.src + image.caption} items={[{ src: image.src, caption: image.caption }]} />
                    : <CaseStudyPlaceholder key={image.src + image.caption} title={image.caption} />)}
                </div> : null}
                {section.bullets && section.id === 'overview' ? <ul className="project-detail-subsection-list">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
      <ProjectAnchorNav sections={visibleSections} label={content.labels.contents} scrollToHash={!preserveTabScroll} />
    </main>
  )
}
