import { useEffect, useRef } from 'react'
import { getAboutContent } from '../content/about'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionAnchorNav } from '../components/SectionAnchorNav'
import { ReadingPageHeader } from '../components/ReadingPageHeader'
import { WorkEntry } from '../components/about/WorkEntry'
import { renderMarkdownInline } from '../components/about/renderMarkdownInline'
import { useAboutTimeline, type TimelineEntry } from '../components/about/useAboutTimeline'
import { anchorTarget, bodyText } from '../components/about/styles'

export function About() {
  const { m, locale } = useLanguage()
  const about = getAboutContent(locale)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const title = renderMarkdownInline(about.heading)
  const { activeTimelineId, navigateTimeline } = useAboutTimeline()
  const timelineEntries: TimelineEntry[] = [
    { id: 'about-2026', label: '简介' },
    { id: 'experience', label: '工作经历' },
    { id: 'education', label: '教育经历' },
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
          <ul className="about-tags" aria-label="专业领域">
            {m.about.tags.map(tag => <li key={tag} className="project-case-tag">{tag}</li>)}
          </ul>
        </div>

        <div className="about-intro">
          {about.introParagraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              style={{ ...bodyText, marginBottom: index === about.introParagraphs.length - 1 ? 'var(--space-8)' : 'var(--space-4)' }}
            >
              {renderMarkdownInline(paragraph)}
            </p>
          ))}
        </div>

        <section id="experience" aria-label="工作与教育经历" style={{ ...anchorTarget, marginTop: 'var(--space-12)' }}>
          <div className="about-career-timeline">
            {about.work.map(entry => <WorkEntry key={entry.id} entry={entry} projects={about.projects} />)}
            <article id="education" className="about-career-entry about-career-education">
              <div className="about-career-content">
                <h3>{renderMarkdownInline(about.education.title)}</h3>
                <p className="about-career-role">
                  {about.education.period.split('|').map((part, index) => (
                    <span key={index}>
                      {index > 0 && <span className="about-career-separator"> | </span>}
                      {renderMarkdownInline(part.trim())}
                    </span>
                  ))}
                </p>
                {about.education.summary && <p className="about-career-summary">{renderMarkdownInline(about.education.summary)}</p>}
              </div>
            </article>
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
