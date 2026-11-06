import { Fragment, useEffect, useRef } from 'react'
import { getAboutContent } from '../content/about'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionAnchorNav } from '../components/SectionAnchorNav'
import { ReadingPageHeader } from '../components/ReadingPageHeader'
import { ProjectCards } from '../components/about/ProjectCards'
import { WorkEntry, PROJECTS_WORK_ID } from '../components/about/WorkEntry'
import { renderMarkdownInline } from '../components/about/renderMarkdownInline'
import { useAboutTimeline, type TimelineEntry } from '../components/about/useAboutTimeline'
import { anchorTarget, bodyText, contactLink, proseColumn, workArticleList, workArticleTitle, workArticleMeta } from '../components/about/styles'

function getContactHref(label: string, value: string): string | null {
  const normalized = label.toLowerCase()
  if (!value) return null
  if (normalized.includes('mail') || label.includes('邮件')) return `mailto:${value}`
  if (normalized.includes('phone') || normalized.includes('wechat') || label.includes('电话') || label.includes('微信')) {
    return `tel:${value}`
  }
  return null
}

export function About() {
  const { m, locale } = useLanguage()
  const about = getAboutContent(locale)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const title = renderMarkdownInline(about.heading)
  const { activeTimelineId, navigateTimeline } = useAboutTimeline()
  const timelineEntries: TimelineEntry[] = [
    { id: 'about-2026', label: locale === 'zh' ? '简介' : 'About' },
    { id: 'experience', label: locale === 'zh' ? '工作经历' : 'Experience' },
    { id: 'education', label: locale === 'zh' ? '教育经历' : 'Education' },
    { id: 'about-contact', label: locale === 'zh' ? '联系方式' : 'Contact' },
  ]

  useEffect(() => {
    document.title = m.about.title
  }, [m.about.title])

  return (
    <>
      <ReadingPageHeader title={title} titleRef={titleRef} />
      <main className="page-shell about-page">
        <div id="about-2026" style={{ ...anchorTarget, position: 'relative', marginBottom: 'var(--space-6)' }}>
          <h1 ref={titleRef} className="page-title">{title}</h1>
        </div>

        <div style={proseColumn}>
          {about.introParagraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              style={{ ...bodyText, marginBottom: index === about.introParagraphs.length - 1 ? 'var(--space-8)' : 'var(--space-4)' }}
            >
              {renderMarkdownInline(paragraph)}
            </p>
          ))}
        </div>

        <section id="experience" style={{ ...anchorTarget, marginTop: 'var(--section-gap)' }}>
          <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
            {locale === 'zh' ? '工作经历' : 'Experience'}
          </h2>
          {about.work.map((entry) => (
            <Fragment key={entry.id}>
              <WorkEntry entry={entry} />
              {entry.id === PROJECTS_WORK_ID && <ProjectCards projects={about.projects} locale={locale} />}
            </Fragment>
          ))}
          {!about.work.some((entry) => entry.id === PROJECTS_WORK_ID) && (
            <ProjectCards projects={about.projects} locale={locale} />
          )}
        </section>

        <section id="education" style={{ ...anchorTarget, marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)' }}>
          <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
            {locale === 'zh' ? '教育经历' : 'Education'}
          </h2>
          <div style={proseColumn}>
            <h3 style={workArticleTitle}>{renderMarkdownInline(about.education.title)}</h3>
            <p style={workArticleMeta}>{renderMarkdownInline(about.education.period)}</p>
          </div>
        </section>

        <section
          id="about-contact"
          style={{ ...anchorTarget, marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)' }}
        >
          <div style={proseColumn}>
            <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
              {locale === 'zh' ? '联系方式' : 'Contact'}
            </h2>
            <ul style={{ ...workArticleList, marginTop: 'var(--space-4)', marginBottom: 0 }}>
              {about.contact.items.map((item, i, arr) => {
                const href = getContactHref(item.label, item.value)
                return (
                  <li key={item.label} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                    {renderMarkdownInline(item.label)}
                    {locale === 'zh' ? ' ： ' : ': '}
                    {href ? (
                      <a href={href} style={contactLink}>
                        {renderMarkdownInline(item.value)}
                      </a>
                    ) : (
                      renderMarkdownInline(item.value)
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      <SectionAnchorNav
        sections={timelineEntries.map(({ id, label }) => ({ id, title: label }))}
        activeId={activeTimelineId}
        label={m.about.timeline.navAria}
        onNavigate={navigateTimeline}
      />
    </>
  )
}
