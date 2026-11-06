import { createElement, useRef, type CSSProperties } from 'react'
import { type ProjectDetailBlock, type ProjectDetailComparison, type ProjectDetailParagraph, type ProjectDetailSection, type ProjectDetailTable, type ProjectGalleryItem } from '../../data/projectDetails'
import { getProjectTitle, type Project } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import { ProjectGallery } from './ProjectGallery'
import { ProjectFunnel } from './ProjectFunnel'
import { ProjectArchitecture } from './ProjectArchitecture'
import { PrototypePreview } from './PrototypePreview'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { getProjectAnchors } from '../../data/projectAnchors'
import { ReadingPageHeader } from '../ReadingPageHeader'

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

function DetailTable({ table, titleId }: { table: ProjectDetailTable; titleId: string }) {
  return (
    <div className="project-detail-table-scroll" role="region" aria-labelledby={titleId} tabIndex={0}>
      <table className={`project-detail-table${table.columns.length === 2 ? ' project-detail-table--two-column' : ''}`} aria-labelledby={titleId}>
        <thead>
          <tr>{table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell, index) => {
                if (cell === null) return null
                const text = typeof cell === 'string' ? cell : cell.text
                const rowSpan = typeof cell === 'string' ? undefined : cell.rowSpan
                const content = typeof cell !== 'string' && cell.groups
                  ? cell.groups.map((group) => <div key={group.title} className="project-detail-table-group"><strong>{group.title}</strong><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)
                  : text
                return index === 0
                  ? <th key={index} scope="row" rowSpan={rowSpan}>{content}</th>
                  : <td key={index} rowSpan={rowSpan}>{content}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionGallery({ items, disclosure, layout }: { items: ProjectGalleryItem[]; disclosure?: string; layout?: 'row' }) {
  const gallery = layout === 'row'
    ? <div className="project-detail-gallery-row"><ProjectGallery items={items} layout="stacked" /></div>
    : <ProjectGallery items={items} layout="stacked" />
  return disclosure ? (
    <details className="project-detail-design-comparison project-detail-evidence">
      <summary><span className="project-detail-comparison-heading"><span>{disclosure}</span></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
      <div className="project-detail-comparison-content">{gallery}</div>
    </details>
  ) : gallery
}

function DesignComparison({ comparison }: { comparison: ProjectDetailComparison }) {
  const { locale } = useLanguage()
  const labels = locale === 'zh' ? ['优势', '局限'] : ['Strengths', 'Limitations']
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

type Props = { project: Project; detail: ProjectDetailBlock }

export function StandardProjectDetail({ project, detail }: Props) {
  const { locale, m } = useLanguage()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const title = getProjectTitle(project, locale)
  const anchors = getProjectAnchors(detail, locale)
  const titleFor = (id: string) => anchors.find((anchor) => anchor.id === id)!.title
  const renderSection = (section: ProjectDetailSection) => (
    <section key={section.id} id={section.id} className="project-detail-section" aria-labelledby={`${section.id}-title`}>
      <div className="project-detail-section-copy">
        {section.legacyIds?.map((id) => <span key={id} id={id} className="project-detail-anchor-alias" aria-hidden="true" />)}
        <h2 id={`${section.id}-title`} hidden={section.hideTitle}>{section.title}</h2>
        {section.paragraphs.map((para, idx) => (
          <p key={idx}>{renderParagraphContent(para)}</p>
        ))}
        {section.table && <DetailTable table={section.table} titleId={`${section.id}-title`} />}
        {section.architecture && <ProjectArchitecture architecture={section.architecture} />}
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
                  <PrototypePreview url={subsection.prototypeEmbed.url} title={subsection.prototypeEmbed.title} />
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
                <div className="project-detail-comparison" role="group" aria-label={locale === 'zh' ? '方案前后对比，配图待补' : 'Before-and-after comparison, images pending'}>
                  {(['before', 'after'] as const).map((side) => {
                    const item = subsection.comparisonPlaceholder![side]
                    return (
                      <figure key={side} className="project-detail-comparison-panel">
                        <figcaption>
                          <span className="project-detail-comparison-label">{locale === 'zh' ? (side === 'before' ? '优化前' : '优化后') : (side === 'before' ? 'Before' : 'After')}</span>
                          <strong>{item.title}</strong>
                        </figcaption>
                        <div className="project-detail-image-placeholder">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 6-6 4 4 3-3 5 5" /></svg>
                          <span>{locale === 'zh' ? '配图待补' : 'Image to be added'}</span>
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
    <main className="datapilot-case-page project-detail-standard-page">
      <ReadingPageHeader title={title} titleRef={titleRef} />
      <div className="page-shell datapilot-case-shell">
        <header id="project-overview" className="datapilot-case-hero project-case-overview">
          <h1 ref={titleRef} className="page-title">
            {title}
          </h1>

          <div className="datapilot-meta project-case-tags project-case-tags--filled">
            {detail.tags.map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}
            {detail.externalUrl && <a className="datapilot-demo-link" href={detail.externalUrl} target="_blank" rel="noreferrer">{m.workDetail.viewSite}</a>}
          </div>

          {detail.paragraphs.map((para, idx) => (
            <p key={idx} style={body}>
              {renderParagraphContent(para)}
            </p>
          ))}

          {detail.sections?.filter((section) => section.placement === 'overview').map(renderSection)}

          {detail.overviewFacts && (
            <div className="project-overview-facts">
              <dl>{detail.overviewFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
              {detail.demoUrl && <a className="project-overview-demo" href={detail.demoUrl} target="_blank" rel="noreferrer">Demo ↗</a>}
            </div>
          )}

          {detail.overviewPrototype && <PrototypePreview {...detail.overviewPrototype} />}
        </header>
        {detail.showCover !== false && (
          <div className="project-case-cover">
            <ProjectGallery items={[{ src: project.image, caption: getProjectTitle(project, locale) }]} layout="stacked" />
          </div>
        )}
        <article className="datapilot-case-content project-case-content">
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
                        {locale === 'zh' ? '：' : ': '}
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
                            {locale === 'zh' ? '：' : ': '}
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
                    {locale === 'zh' ? '：' : ': '}
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
            <ProjectGallery items={detail.gallery} layout="stacked" />
          </section>}
        </article>
      </div>
      <ProjectAnchorNav sections={anchors} label={locale === 'zh' ? '项目目录' : 'Project contents'} />
    </main>
  )
}
