import { DataPilotDialogueTabs } from './DataPilotDialogueTabs'
import { DataPilotQATabs } from './DataPilotQATabs'
import { DataPilotDialogue } from './DataPilotDialogue'
import { DataPilotResults } from './DataPilotResults'
import { DataPilotJourney } from './DataPilotJourney'
import { DataPilotEvolution } from './DataPilotEvolution'
import { getCaseStudyMethods } from '../../data/projects/caseStudyPresentation'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { DataPilotPartMenu } from './DataPilotPartMenu'
import { getDataPilotContent, type DataPilotPart, type DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ReadingPageHeader } from '../ReadingPageHeader'
import { CaseStudyHeroPalette, CaseStudyGallery, CaseStudyPlaceholder } from './CaseStudyMedia'
import { DataPilotPocSection } from './DataPilotPocSection'
import { DetailTable } from './DetailTable'

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
  const sectionGroups = visibleSections.reduce<{ id: string; title?: string; sections: DataPilotSection[] }[]>((groups, section) => {
    const id = section.continuationOf ?? section.group?.id ?? section.id
    const existing = groups.find(group => group.id === id)
    if (existing) existing.sections.push(section)
    else groups.push({ id, title: section.group?.title, sections: [section] })
    return groups
  }, [])
  const anchors = sectionGroups.map(group => ({ id: group.id, title: group.title ?? group.sections[0].title }))

  useEffect(() => {
    const id = location.hash.slice(1)
    const part = (Object.keys(content.parts) as DataPilotPart[]).find((key) => content.parts[key].sections.some((section) => section.id === id || section.legacyIds?.includes(id) || section.group?.id === id))
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
          <p className="case-study-lead">{content.lead}</p>
          <div className="datapilot-meta project-case-tags project-case-tags--filled">{getCaseStudyMethods('dataagent', locale).map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}</div>
          <div className="project-case-cover"><CaseStudyHeroPalette slug="dataagent"><CaseStudyGallery items={[{ src: content.heroImage, caption: content.title, hideCaption: true }]} /></CaseStudyHeroPalette></div>
        </header>
        <div className="datapilot-part-tabs" role="tablist" aria-label={content.labels.tabs}>
          {(Object.keys(content.parts) as DataPilotPart[]).map((part, index) => (
            <button key={part} type="button" role="tab" aria-selected={activePart === part} className={activePart === part ? 'is-active' : ''} onClick={() => selectPart(part, true)}>
              <span className="datapilot-tab-number" aria-hidden="true">{index + 1}</span>
              {content.parts[part].title}
            </button>
          ))}
        </div>
        <div className="datapilot-case-layout">
          <article className={`datapilot-case-content project-case-content${activePart === 'poc' ? ' datapilot-poc-content' : ''}`}>
            {sectionGroups.map(group => <section key={group.id} id={group.title ? group.id : undefined} className={group.title ? 'datapilot-content-group project-detail-section' : 'project-detail-section'} aria-labelledby={group.title ? `${group.id}-title` : undefined}>
            {group.title && <h2 id={`${group.id}-title`}>{group.title}</h2>}
            {group.sections.map((section, sectionIndex) => activePart === 'poc' ? <DataPilotPocSection key={section.id} section={section} /> : section.dialogue && !section.groupIntro ? (section.id === group.sections.find(item => item.dialogue && !item.groupIntro)?.id ? <DataPilotDialogueTabs key="dialogue-tabs" sections={group.sections} locale={locale} /> : null) : section.qaExperience ? (section.id === group.sections.find(item => item.qaExperience)?.id ? <DataPilotQATabs key="qa-tabs" sections={group.sections} locale={locale} /> : null) : (
              <section className={`project-detail-section${section.continuationOf ? ' datapilot-section-continuation' : ''}`} id={section.id} key={section.id} aria-label={section.continuationOf || section.groupIntro ? section.title : undefined} aria-labelledby={section.continuationOf || section.groupIntro ? undefined : `${section.id}-title`}>
                <div className="project-detail-section-copy">
                {!section.continuationOf && !section.groupIntro && <HeadingTag id={`${section.id}-title`} grouped={Boolean(group.title)}>{group.title ? `${['①', '②', '③', '④'][group.sections.slice(0, sectionIndex).filter(item => !item.groupIntro).length] ?? sectionIndex + 1} ` : ''}{activePart === 'experience' ? section.title : section.intro || section.title}</HeadingTag>}
                {section.adoptionResult ? <DataPilotResults result={section.adoptionResult} description={section.body} formula={section.bullets?.[0] ?? ''} /> : section.body.split('\n\n').map((paragraph) => <p key={paragraph}>{section.bodyEmphasis ? paragraph.split(section.bodyEmphasis).map((part, index) => <span key={index}>{index > 0 && <strong>{section.bodyEmphasis}</strong>}{part}</span>) : paragraph}</p>)}
                {section.adoptionResult && section.bullets?.slice(1).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {section.groupIntro && !['continuous-dialogue', 'agent-troubleshooting'].includes(section.group?.id ?? '') && section.steps && <ul className="qa-overview-labels">{section.steps.map(step => <li key={step.title}><strong>{step.title}{'：'}</strong><span>{step.detail}</span></li>)}</ul>}
                {section.dialogue && !section.groupIntro && <DataPilotDialogue dialogue={section.dialogue} locale={locale} />}
                {section.diagram && section.id === 'overview' ? <DataPilotJourney diagram={section.diagram} /> : null}
                {section.afterDiagram && <div className="case-study-introduction">{section.afterDiagram.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>}
                {section.table && section.id !== 'overview' ? <DetailTable table={section.table} titleId={`${section.groupIntro ? group.id : section.id}-title`} /> : null}
                {section.afterTable && <p>{section.afterTable}</p>}
                {section.applicationTypes ? <div className="datapilot-application-types">{section.applicationTypes.map((item) => <section key={item.title}>
                  <h4>{item.title}</h4>
                  <p><strong>{content.labels.scene}</strong>{item.scene}</p>
                  <p><strong>{content.labels.problem}</strong>{item.problem}</p>
                  <p><strong>{content.labels.solution}</strong>{item.solution}</p>
                  <CaseStudyPlaceholder title={item.screenshot} />
                </section>)}</div> : null}
                {section.references && <p className="datapilot-related-link">{section.references.map((reference, index) => <span key={reference.href}>{index > 0 && ' · '}{reference.href.startsWith('/') ? <Link to={reference.href}>{reference.label}</Link> : <a href={reference.href} target="_blank" rel="noopener noreferrer">{reference.label} ↗</a>}</span>)}</p>}
                {section.related ? <p className="datapilot-related-link">{content.labels.relatedIntro} <Link to="/project/agentops">{content.labels.relatedProject}</Link>。</p> : null}
                {section.stats ? <div className="datapilot-stat-row">{section.stats.map((stat) => <strong key={stat}>{stat}</strong>)}</div> : null}
                {section.bullets && section.id !== 'overview' && !section.evolutionMedia && !section.adoptionResult ? <ul className="project-detail-subsection-list">{section.bullets.map((bullet) => {
                  const separator = section.group?.id === 'agent-troubleshooting' ? bullet.search(/[：:]/) : -1
                  return <li key={bullet}>{separator > -1 ? <><strong>{bullet.slice(0, separator)}</strong>{bullet.slice(separator)}</> : bullet}</li>
                })}</ul> : null}
                {section.diagram && section.id !== 'overview' ? <DataPilotJourney diagram={section.diagram} /> : null}
                {section.evolutionMedia ? <DataPilotEvolution section={section} /> : null}
                {section.evolutionRationale && <div className="case-study-introduction">{section.evolutionRationale.map(paragraph => <p key={paragraph}>{section.evolutionRationaleEmphasis ? paragraph.split(section.evolutionRationaleEmphasis).map((part, index) => <span key={index}>{index > 0 && <strong>{section.evolutionRationaleEmphasis}</strong>}{part}</span>) : paragraph}</p>)}</div>}
                {section.beforeTable && <p className="datapilot-positioning-intro">{section.beforeTable}</p>}
                {section.table && section.id === 'overview' ? <dl className="datapilot-background-facts">{section.table.rows.map(row => <div key={row.id}>{row.cells.map((cell, index) => {
                  const text = typeof cell === 'string' ? cell : cell?.text
                  return index === 0 ? <dt key={index}>{text}</dt> : <dd key={index}>{text}</dd>
                })}</div>)}</dl> : null}
                {section.designPlaceholder && !section.evolutionMedia && !section.dialogue ? <div className="datapilot-evidence"><CaseStudyPlaceholder title={section.designPlaceholder} /></div> : null}
                {section.images.length ? <div className={`datapilot-evidence ${section.images.length > 1 ? 'is-multi' : 'is-single'}`}>
                  {section.images.map(image => image.display === 'image'
                    ? <CaseStudyGallery key={image.src + image.caption} items={[{ src: image.src, caption: image.caption }]} />
                    : <CaseStudyPlaceholder key={image.src + image.caption} title={image.caption} />)}
                </div> : null}
                {section.bullets && section.id === 'overview' ? <ul className="project-detail-subsection-list">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </div>
              </section>
            ))}
            </section>)}
          </article>
        </div>
      </div>
      <ProjectAnchorNav sections={anchors} label={content.labels.contents} scrollToHash={!preserveTabScroll} />
    </main>
  )
}

function HeadingTag({ grouped, children, id }: { grouped: boolean; children: React.ReactNode; id: string }) {
  const Tag = grouped ? 'h3' : 'h2'
  return <Tag id={id}>{children}</Tag>
}
