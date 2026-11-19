import { createElement, useRef, type ReactNode, type CSSProperties } from 'react'
import { type ProjectDetailBlock, type ProjectDetailComparison, type ProjectDetailParagraph, type ProjectDetailSection, type ProjectGalleryItem } from '../../data/projectDetails'
import { getProjectTitle, type Project } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import { DetailTable } from './DetailTable'
import { CaseStudyHeroPalette, CaseStudyGallery, CaseStudyMediaFrame, CaseStudyPlaceholder } from './CaseStudyMedia'
import { ProjectFunnel } from './ProjectFunnel'
import { ProjectArchitecture } from './ProjectArchitecture'
import { ScreenshotCarousel } from './ScreenshotCarousel'
import { PrototypePreview } from './PrototypePreview'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { getProjectAnchors } from '../../data/projectAnchors'
import { ReadingPageHeader } from '../ReadingPageHeader'
import { getCaseStudyIntroduction, getCaseStudyMethods } from '../../data/projects/caseStudyPresentation'

const body: CSSProperties = {
  margin: '0 0 var(--paragraph-gap)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--text)',
}

function renderParagraphContent(para: ProjectDetailParagraph) {
  if (typeof para === 'string') return para
  return para.map((run, j) =>
    createElement(
      run.href ? 'a' : run.bold ? 'strong' : 'span',
      {
        key: j,
        ...(run.href ? { href: run.href, target: '_blank', rel: 'noopener noreferrer', className: 'project-detail-reference-link' } : {}),
        style: run.bold || run.tone ? {
          fontWeight: run.bold ? 700 : undefined,
          color: run.tone === 'danger' ? 'var(--danger)' : undefined,
        } : undefined,
      },
      run.text,
    ),
  )
}


function SectionGallery({ items, disclosure, layout }: { items: ProjectGalleryItem[]; disclosure?: string; layout?: 'row' | 'carousel' }) {
  const gallery = layout === 'carousel'
    ? <ScreenshotCarousel locale="zh" titles={items.map(item => item.caption)} renderSlide={index => <CaseStudyGallery items={[items[index]]} lightboxItems={items} />} />
    : layout === 'row'
    ? <div className="project-detail-gallery-row"><CaseStudyGallery items={items} /></div>
    : <CaseStudyGallery items={items} />
  return disclosure ? (
    <details className="project-detail-design-comparison project-detail-evidence">
      <summary><span className="project-detail-comparison-heading"><span>{disclosure}</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
      <div className="project-detail-comparison-content">{gallery}</div>
    </details>
  ) : gallery
}

function DesignComparison({ comparison }: { comparison: ProjectDetailComparison }) {
  const labels = ['优势', '局限']
  return (
    <details id={comparison.id} className="project-detail-design-comparison project-detail-evidence" aria-labelledby={`${comparison.id}-title`}>
      <summary id={`${comparison.id}-title`}><span className="project-detail-comparison-heading"><span>{comparison.title}</span>{comparison.description && <span className="project-detail-comparison-subtitle">{comparison.description}</span>}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
      <div className="project-detail-comparison-content">
      {comparison.paragraphs.map((para, index) => <p key={index}>{renderParagraphContent(para)}</p>)}
      <div className="project-detail-table-scroll" role="region" aria-labelledby={`${comparison.id}-title`} tabIndex={0}>
        <table className="project-detail-table project-detail-stepper-table" aria-labelledby={`${comparison.id}-title`}>
          <thead><tr>{comparison.options.map(option => <th key={option.id} scope="col">{option.title}</th>)}</tr></thead>
          <tbody>
            <tr>{comparison.options.map(option => <td key={option.id}><SectionGallery items={option.images.map(image => ({ ...image, caption: option.title }))} /></td>)}</tr>
            <tr>{comparison.options.map(option => <td key={option.id}>
              <div className="project-detail-tradeoffs">
                {[0, 1].map(index => <div key={index} className="project-detail-tradeoff">
                  <span className={`project-detail-tradeoff-mark${index === 0 ? ' is-positive' : ' is-negative'}`} role="img" aria-label={labels[index]}>{index === 0 ? '✓' : '✕'}</span>
                  <span>{renderParagraphContent(option.listItems[index])}</span>
                </div>)}
              </div>
            </td>)}</tr>
          </tbody>
        </table>
      </div>
      </div>
    </details>
  )
}

type Props = {
  project: Project
  detail: ProjectDetailBlock
  presentation?: { project: Project; title: string; introduction: string }
  tabs?: ReactNode
  panelId?: string
  labelledBy?: string
}

export function StandardProjectDetail({ project, detail, presentation, tabs, panelId, labelledBy }: Props) {
  const { locale, m } = useLanguage()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroProject = presentation?.project ?? project
  const title = presentation?.title ?? getProjectTitle(project, locale)
  const introduction = getCaseStudyIntroduction(project.slug, locale)
  const bodyParagraphs = introduction ? detail.paragraphs : detail.paragraphs.slice(1)
  const heroArchitecture = project.slug === 'aidesignsystem'
    ? detail.sections?.find(section => section.architecture)?.architecture
    : undefined
  const anchors = getProjectAnchors(detail, locale)
  const titleFor = (id: string) => anchors.find((anchor) => anchor.id === id)!.title
  const overviewFacts = detail.overviewFacts && (
    <div className="project-overview-facts">
      <dl>{detail.overviewFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
    </div>
  )
  const renderSection = (section: ProjectDetailSection) => (
    <section key={section.id} id={section.id} className="project-detail-section" aria-labelledby={`${section.id}-title`}>
      <div className="project-detail-section-copy">
        {section.legacyIds?.map((id) => <span key={id} id={id} className="project-detail-anchor-alias" aria-hidden="true" />)}
        <h2 id={`${section.id}-title`} hidden={section.hideTitle}>{section.title}</h2>
        {section.paragraphs.map((para, idx) => (
          <p key={idx}>{renderParagraphContent(para)}</p>
        ))}
        {project.slug === 'agentops' && section.id === 'project-origin' && overviewFacts}
        {section.table && <DetailTable table={section.table} titleId={`${section.id}-title`} />}
        {section.architecture && section.architecture !== heroArchitecture && <ProjectArchitecture architecture={section.architecture} />}
        {section.subsections?.map((subsection) => (
          <div key={subsection.id} className="project-detail-subsection">
            <h3 id={`${section.id}-${subsection.id}-title`} hidden={subsection.hideTitle}>{subsection.title}</h3>
            <div className={`project-detail-subsection-body${subsection.layout === 'text-image' ? ' project-detail-subsection-body--text-image' : ''}`}>
              {subsection.mediaFirst && <>
                {subsection.funnel && <ProjectFunnel data={subsection.funnel} />}
                {!!subsection.images?.length && <SectionGallery items={subsection.images} disclosure={subsection.imagesDisclosure} layout={subsection.imagesLayout} />}
              </>}
              <div className="project-detail-subsection-text">
                {subsection.paragraphs.map((para, idx) => (
                  <p key={idx}>{renderParagraphContent(para)}</p>
                ))}
                {subsection.prototypeEmbed && (
                  <a className="ui-button case-study-demo" href={subsection.prototypeEmbed.url} target="_blank" rel="noopener noreferrer">{subsection.prototypeEmbed.title} ↗</a>
                )}
                {!!subsection.listItems?.length && (
                  <ul className="project-detail-subsection-list">
                    {subsection.listItems.map((item, idx) => (
                      <li key={idx}>{renderParagraphContent(item)}</li>
                    ))}
                  </ul>
                )}
                {subsection.table && <DetailTable table={subsection.table} titleId={`${section.id}-${subsection.id}-title`} />}
                {subsection.closingParagraphs?.map((para, idx) => (
                  <p key={`closing-${idx}`}>{renderParagraphContent(para)}</p>
                ))}
              </div>
              {subsection.comparison && <DesignComparison comparison={subsection.comparison} />}
              {subsection.comparisonPlaceholder && (
                <div className="project-detail-comparison" role="group" aria-label={'方案前后对比，配图待补'}>
                  {(['before', 'after'] as const).map((side) => {
                    const item = subsection.comparisonPlaceholder![side]
                    return (
                      <figure key={side} className="project-detail-comparison-panel">
                        <figcaption>
                          <span className="project-detail-comparison-label">{(side === 'before' ? '优化前' : '优化后')}</span>
                          <strong>{item.title}</strong>
                        </figcaption>
                        <div className="project-detail-image-placeholder">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 6-6 4 4 3-3 5 5" /></svg>
                          <span>{'配图待补'}</span>
                        </div>
                        <span className="project-detail-comparison-description">{item.description}</span>
                      </figure>
                    )
                  })}
                </div>
              )}
              {!subsection.mediaFirst && subsection.funnel && <ProjectFunnel data={subsection.funnel} />}
              {!subsection.mediaFirst && !!subsection.images?.length && <SectionGallery items={subsection.images} disclosure={subsection.imagesDisclosure} layout={subsection.imagesLayout} />}
              {subsection.afterImagesParagraphs?.map((para, idx) => <p key={`after-images-${idx}`}>{renderParagraphContent(para)}</p>)}
            </div>
          </div>
        ))}
      </div>
      {section.images.length > 0 && <SectionGallery items={section.images} disclosure={section.imagesDisclosure} />}
    </section>
  )
  return (
    <main className="datapilot-case-page project-detail-standard-page case-study-page" data-project-slug={project.slug}>
      <ReadingPageHeader title={title} titleRef={titleRef} />
      <div className="page-shell datapilot-case-shell">
        <header id="project-overview" className="datapilot-case-hero project-case-overview">
          <h1 ref={titleRef} className="page-title">
            {title}
          </h1>

          {(presentation?.introduction ?? introduction) ? <p className="case-study-lead">{presentation?.introduction ?? introduction}</p> : detail.paragraphs.slice(0, 1).map((para, idx) => <p key={idx} className="case-study-lead">{renderParagraphContent(para)}</p>)}
          <div className="datapilot-meta project-case-tags project-case-tags--filled">
            {getCaseStudyMethods(heroProject.slug, locale).map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}
          </div>
          {!detail.hideOverviewMedia && <div className="project-case-cover"><CaseStudyHeroPalette slug={heroProject.slug}>
            {heroArchitecture ? <ProjectArchitecture architecture={heroArchitecture} />
              : detail.overviewPrototype ? <CaseStudyMediaFrame><PrototypePreview {...detail.overviewPrototype} /></CaseStudyMediaFrame>
              : ['design-token', 'design-md'].includes(project.slug) ? <CaseStudyPlaceholder title={title} />
              : <CaseStudyGallery items={[{ src: heroProject.image, caption: title, hideCaption: true, previewCrop: { aspectRatio: heroProject.slug === 'text2sql' ? 2 : 1.88, objectPosition: 'top' } }]} />}
          </CaseStudyHeroPalette></div>}
          {(detail.demoUrl || detail.externalUrl) && <a className="ui-button case-study-demo" href={detail.demoUrl || detail.externalUrl} target="_blank" rel="noopener noreferrer">{detail.demoUrl ? ('体验交互原型') : m.workDetail.viewSite} ↗</a>}
        </header>
        {tabs}
        <article id={panelId} role={tabs ? "tabpanel" : undefined} aria-labelledby={labelledBy} tabIndex={tabs ? 0 : undefined} className="datapilot-case-content project-case-content">
          {bodyParagraphs.length > 0 && <div className="case-study-introduction">{bodyParagraphs.map((para, idx) => <p key={idx}>{renderParagraphContent(para)}</p>)}</div>}
          {detail.sections?.filter((section) => section.placement === 'overview').map(renderSection)}

          {project.slug !== 'agentops' && overviewFacts}

          {detail.responsibilities ? (
            <section id="responsibilities" className="project-detail-section" aria-labelledby="responsibilities-title">
              <h2 id="responsibilities-title">{titleFor('responsibilities')}</h2>
              <p style={{ ...body, marginBottom: 'var(--space-3)' }}>{detail.responsibilities.intro}</p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 'var(--space-6)',
                  listStyleType: 'disc',
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-body)',
                  color: 'var(--text)',
                }}
              >
                {detail.responsibilities.items.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 'var(--space-4)' }}>
                    <strong style={{ fontWeight: 700 }}>{item.title}</strong>
                    {item.body ? (
                      <>
                        {'：'}
                        {item.body}
                      </>
                    ) : null}
                    {item.nested?.length ? (
                      <ul
                        style={{
                          margin: 'var(--space-2) 0 0',
                          paddingLeft: 'var(--space-5)',
                          listStyleType: 'circle',
                        }}
                      >
                        {item.nested.map((sub, j) => (
                          <li key={j} style={{ marginBottom: 'var(--space-2)' }}>
                            <strong style={{ fontWeight: 700 }}>{sub.title}</strong>
                            {'：'}
                            {sub.body}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
              {detail.afterResponsibilities?.map((para, idx) => <p key={idx} style={body}>{para}</p>)}
            </section>
          ) : detail.afterResponsibilities?.map((para, idx) => <p key={idx} style={body}>{para}</p>)}

          {detail.highlightBullets?.length ? (
            <section id="design-highlights" className="project-detail-section" aria-labelledby="design-highlights-title">
              <h2 id="design-highlights-title">{titleFor('design-highlights')}</h2>
              {createElement(
                detail.highlightBulletsOrdered ? 'ol' : 'ul',
                {
                  style: {
                    margin: '0 0 var(--space-4)',
                    paddingLeft: detail.highlightBulletsOrdered ? 'var(--space-6)' : 'var(--space-5)',
                    fontSize: 'var(--text-base)',
                    lineHeight: 'var(--leading-body)',
                    color: 'var(--text)',
                    listStyleType: detail.highlightBulletsOrdered ? 'decimal' : 'disc',
                  },
                },
                detail.highlightBullets.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>
                    <strong style={{ fontWeight: 700 }}>{item.keyword}</strong>
                    {'：'}
                    {item.text}
                  </li>
                )),
              )}
              {detail.afterHighlightBullets && <p style={body}>{detail.afterHighlightBullets}</p>}
            </section>
          ) : detail.afterHighlightBullets ? <p style={body}>{detail.afterHighlightBullets}</p> : null}

          {detail.sections?.filter((section) => section.placement !== 'overview').map(renderSection)}

          {detail.gallery.length > 0 && <section id="project-gallery" className="project-detail-section" aria-labelledby="project-gallery-title">
            <h2 id="project-gallery-title">{titleFor('project-gallery')}</h2>
            <CaseStudyGallery items={detail.gallery} />
          </section>}
        </article>
      </div>
      <ProjectAnchorNav sections={anchors} label={'项目目录'} />
    </main>
  )
}
