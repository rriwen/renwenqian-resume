import ReactMarkdown from 'react-markdown'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { getAboutContent, renderMarkdownInline, type AboutContent } from '../content/about'
import { useLanguage } from '../i18n/LanguageContext'

const TIMELINE_IDS = [
  'about-2026',
  'experience',
  'about-contact',
] as const
type TimelineId = (typeof TIMELINE_IDS)[number]
type TimelineEntry = { id: TimelineId; label: string; timePoint: string }

function measureHeaderClearancePx(): number {
  const probe = document.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:var(--header-clearance);pointer-events:none;visibility:hidden;z-index:-1'
  document.body.appendChild(probe)
  const h = probe.getBoundingClientRect().height
  document.body.removeChild(probe)
  return h
}

/** 与 ProjectDetail 正文列同宽 */
const proseColumn: CSSProperties = { maxWidth: 'var(--detail-prose-width)' }

/** 简介段落列宽（浏览器预览调宽） */
const aboutIntroColumn: CSSProperties = { maxWidth: 'var(--detail-prose-width)' }

const bodyText: CSSProperties = {
  margin: '0 0 var(--paragraph-gap)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--project-body-text, var(--text))',
}

function ProjectBackground({ content, label }: { content: string; label: string }) {
  const text = content.replace(/^(?:\*\*)?(?:项目背景|背景|内容|Project background|Content)[:：]?(?:\*\*)?\s*/i, '')
  return <>
    <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}><strong>{label}</strong></p>
    <ReactMarkdown components={{
    p: ({ children }) => <p style={{ ...bodyText, color: 'var(--text)', marginTop: 0, marginBottom: 'var(--space-5)' }}>{children}</p>,
    ul: ({ children }) => <ul style={{ ...workArticleList, marginTop: 0, marginBottom: 'var(--space-5)' }}>{children}</ul>,
    li: ({ children }) => <li style={{ marginBottom: 'var(--space-2)' }}>{children}</li>,
  }}>{text}</ReactMarkdown>
  </>
}

const anchorTarget: CSSProperties = { scrollMarginTop: 'var(--header-clearance)' }

const workMeta: CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  color: 'var(--muted)',
  lineHeight: 'var(--leading-ui)',
  maxWidth: 'var(--detail-prose-width)',
}

const workPeriod: CSSProperties = {
  margin: 0,
  marginBottom: 'var(--space-2)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: 'var(--muted)',
  lineHeight: 'var(--leading-ui)',
}

/** 与 work-oceanbase 一致：职位 → > 时间段 → meta */
const workArticleHeader: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const workArticleTitle: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 'var(--text-lg)',
  fontWeight: 600,
}

const workArticlePeriod: CSSProperties = {
  ...workPeriod,
  margin: 0,
  marginBottom: 4,
  color: 'var(--muted)',
}

const workArticleMeta: CSSProperties = {
  ...workMeta,
  margin: 0,
}

const workArticleProse: CSSProperties = {
  ...proseColumn,
  maxWidth: 'var(--detail-prose-width)',
}

const workArticleList: CSSProperties = {
  margin: 'var(--space-4) 0 0',
  paddingLeft: 'var(--space-5)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--project-body-text, var(--text))',
}

/** 与 ContactOverlay 邮件链接一致 */
const contactLink: CSSProperties = {
  color: 'inherit',
  textDecoration: 'none',
  borderBottom: '1px solid currentColor',
  paddingBottom: 2,
}

function getContactHref(label: string, value: string): string | null {
  const normalized = label.toLowerCase()
  if (!value) return null
  if (normalized.includes('mail') || label.includes('邮件')) return `mailto:${value}`
  if (normalized.includes('phone') || normalized.includes('wechat') || label.includes('电话') || label.includes('微信')) {
    return `tel:${value}`
  }
  return null
}

function ProjectCards({ projects, locale }: { projects: AboutContent['projects']; locale: string }) {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())

  return (
    <div className="about-project-cards">
      {projects.map((project, index) => (
        <article key={`${project.title}-${index}`} className="about-project-card">
          <button
            type="button"
            className="about-project-card-toggle"
            aria-expanded={expandedProjects.has(index)}
            aria-controls={`project-${index + 1}-content`}
            onClick={() =>
              setExpandedProjects((current) => {
                const next = new Set(current)
                if (next.has(index)) next.delete(index)
                else next.add(index)
                return next
              })
            }
          >
            <span className="about-project-card-heading">
              <strong>{renderMarkdownInline(project.title)}</strong>
              <span className="about-project-card-meta">
                {renderMarkdownInline(project.role)}
                <span aria-hidden="true"> {'|'} </span>
                {renderMarkdownInline(project.period)}
              </span>
            </span>
            <span className={`about-section-toggle-icon${expandedProjects.has(index) ? ' is-expanded' : ''}`} aria-hidden="true" />
          </button>
          <div id={`project-${index + 1}-content`} hidden={!expandedProjects.has(index)} className="about-project-card-content" style={workArticleProse}>
            <ProjectBackground label={locale === 'zh' ? (project.title === 'AI 智能问数' ? '背景目标' : '背景与目标') : 'Background and goal'} content={[project.content.trim(), project.goal.trim()].filter(Boolean).join(' ')} />
            <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}><strong>{locale === 'zh' ? (project.title === 'AI 智能问数' ? '我的职责' : '我主要负责') : 'Responsibilities'}</strong></p>
            {project.responsibilities.length > 0 ? (
              <ul style={{ ...workArticleList, marginTop: 0 }}>
                {project.responsibilities.map((item, itemIndex) => <li key={itemIndex} style={{ marginBottom: itemIndex < project.responsibilities.length - 1 ? 'var(--space-2)' : 0 }}>{renderMarkdownInline(item)}</li>)}
              </ul>
            ) : null}
            <p style={{ ...bodyText, margin: 'var(--space-6) 0 var(--space-2)' }}><strong>{locale === 'zh' ? (project.title === 'AI 智能问数' ? '业绩成果' : '业绩') : 'Achievements'}</strong></p>
            {project.achievements.length > 0 ? (
              <ul className="about-project-achievements" style={{ ...workArticleList, marginTop: 0, marginBottom: 0 }}>
                {project.achievements.map((item, itemIndex) => <li key={itemIndex} style={{ marginBottom: itemIndex < project.achievements.length - 1 ? 'var(--space-2)' : 0 }}>{renderMarkdownInline(item)}</li>)}
              </ul>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}

export function About() {
  const { m, locale } = useLanguage()
  const about = useMemo(() => getAboutContent(locale), [locale])
  const [activeTimelineId, setActiveTimelineId] = useState<TimelineId>('about-2026')
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())
  const [educationExpanded, setEducationExpanded] = useState(false)
  const scrollOffsetRef = useRef(0)

  const timelineEntries = useMemo<TimelineEntry[]>(() => {
    const labels =
      locale === 'zh'
        ? {
            intro: '简介',
            experience: '工作经历',
            projects: '项目经历',
            education: '教育经历',
            contact: '联系方式',
          }
        : {
            intro: 'About',
            experience: 'Experience',
            projects: 'Projects',
            education: 'Education',
            contact: 'Contact',
          }

    return [
      { id: 'about-2026', label: labels.intro, timePoint: labels.intro },
      { id: 'experience', label: labels.experience, timePoint: labels.experience },
      { id: 'about-contact', label: labels.contact, timePoint: labels.contact },
    ]
  }, [locale])

  useEffect(() => {
    document.title = m.about.title
  }, [m.about.title])

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if ((TIMELINE_IDS as readonly string[]).includes(hash)) setActiveTimelineId(hash as TimelineId)
  }, [])

  useEffect(() => {
    const syncScrollOffset = () => {
      scrollOffsetRef.current = measureHeaderClearancePx()
    }

    const updateActive = () => {
      const offset = scrollOffsetRef.current
      let current: TimelineId = TIMELINE_IDS[0]
      for (const id of TIMELINE_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= offset) current = id
      }
      setActiveTimelineId((prev) => (prev === current ? prev : current))
    }

    const onResize = () => {
      syncScrollOffset()
      updateActive()
    }

    syncScrollOffset()
    updateActive()
    const raf = requestAnimationFrame(() => {
      syncScrollOffset()
      updateActive()
    })
    const t = window.setTimeout(() => {
      syncScrollOffset()
      updateActive()
    }, 200)
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', updateActive)
    window.addEventListener('load', updateActive)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', updateActive)
      window.removeEventListener('load', updateActive)
    }
  }, [])

  const oceanbase = about.work[0]
  const ecidi = about.work[1]
  const leishu = about.work[2]
  const puhuai = about.work[3]
  const edu = about.education

  if (!oceanbase || !ecidi || !leishu || !puhuai) {
    throw new Error('About markdown is missing one or more work entries')
  }

  return (
    <>
      <main
        className="page-shell about-page"
      >
        <div id="about-2026" style={{ ...anchorTarget, position: 'relative', marginBottom: 'var(--space-6)' }}>
          <h1 className="page-title">{renderMarkdownInline(about.heading)}</h1>
        </div>

        <div style={aboutIntroColumn}>
          {about.introParagraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              style={{ ...bodyText, marginBottom: index === about.introParagraphs.length - 1 ? 'var(--space-8)' : 'var(--space-4)' }}
            >
              {renderMarkdownInline(paragraph)}
            </p>
          ))}
        </div>

        <section
          id="experience"
          style={{ ...anchorTarget, marginTop: 'var(--section-gap)' }}
        >
          <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
            {locale === 'zh' ? '工作经历' : 'Experience'}
          </h2>
          <article id="work-oceanbase" style={{ ...anchorTarget, marginTop: 'var(--space-8)' }}>
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(oceanbase.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 0 }}>
                  {renderMarkdownInline(oceanbase.meta)}
                  <span aria-hidden="true"> {'|'} </span>
                  {renderMarkdownInline(oceanbase.period)}
                </p>
              </header>
              <ul style={{ ...workArticleList, marginBottom: 'var(--space-4)' }}>
                {oceanbase.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <ProjectCards projects={about.projects} locale={locale} />

          <article
            id="work-ecidi"
            style={{ ...anchorTarget, marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)' }}
          >
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(ecidi.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 0 }}>
                  {renderMarkdownInline(ecidi.meta)}
                  <span aria-hidden="true"> {'|'} </span>
                  {renderMarkdownInline(ecidi.period)}
                </p>
              </header>
              <ul style={workArticleList}>
                {ecidi.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article
            id="work-leishu"
            style={{ ...anchorTarget, marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)' }}
          >
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(leishu.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 0 }}>
                  {renderMarkdownInline(leishu.meta)}
                  <span aria-hidden="true"> {'|'} </span>
                  {renderMarkdownInline(leishu.period)}
                </p>
              </header>
              <ul style={{ ...workArticleList, listStyle: 'none', paddingLeft: 0 }}>
                {leishu.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article
            id="work-puhuai"
            style={{ ...anchorTarget, marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)' }}
          >
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(puhuai.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 0 }}>
                  {renderMarkdownInline(puhuai.meta)}
                  <span aria-hidden="true"> {'|'} </span>
                  {renderMarkdownInline(puhuai.period)}
                </p>
              </header>
              <ul style={{ ...workArticleList, listStyle: 'none', paddingLeft: 0 }}>
                {puhuai.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section
          id="projects"
          hidden
          style={{ ...anchorTarget, marginTop: 'var(--section-gap)' }}
        >
          <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
            {locale === 'zh' ? '项目经历' : 'Projects'}
          </h2>
          <div className="about-project-cards">
            {about.projects.map((project, index) => (
              <article
                key={`${project.title}-${index}`}
                id={`project-${index + 1}`}
                className="about-project-card"
              >
                <button
                  type="button"
                  className="about-project-card-toggle"
                  aria-expanded={expandedProjects.has(index)}
                  aria-controls={`project-${index + 1}-content`}
                  onClick={() =>
                    setExpandedProjects((current) => {
                      const next = new Set(current)
                      if (next.has(index)) next.delete(index)
                      else next.add(index)
                      return next
                    })
                  }
                >
                  <span className="about-project-card-heading">
                    <strong>{renderMarkdownInline(project.title)}</strong>
                    <span className="about-project-card-meta">
                      {renderMarkdownInline(project.role)}
                      <span aria-hidden="true"> {'|'} </span>
                      {renderMarkdownInline(project.period)}
                    </span>
                  </span>
                  <span className={`about-section-toggle-icon${expandedProjects.has(index) ? ' is-expanded' : ''}`} aria-hidden="true" />
                </button>

                <div id={`project-${index + 1}-content`} hidden={!expandedProjects.has(index)} className="about-project-card-content" style={workArticleProse}>
                  <ProjectBackground label={locale === 'zh' ? (project.title === 'AI 智能问数' ? '背景目标' : '背景与目标') : 'Background and goal'} content={[project.content.trim(), project.goal.trim()].filter(Boolean).join(' ')} />

                <div>
                  <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}>
                    <strong>{locale === 'zh' ? (project.title === 'AI 智能问数' ? '我的职责' : '我主要负责') : 'Responsibilities'}</strong>
                  </p>
                  {project.responsibilities.length > 0 ? (
                    project.responsibilitiesOrdered ? (
                      <ol style={{ ...workArticleList, marginTop: 0 }}>
                        {project.responsibilities.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ marginBottom: itemIndex < project.responsibilities.length - 1 ? 'var(--space-2)' : 0 }}>
                            {renderMarkdownInline(item)}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul style={{ ...workArticleList, marginTop: 0 }}>
                        {project.responsibilities.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ marginBottom: itemIndex < project.responsibilities.length - 1 ? 'var(--space-2)' : 0 }}>
                            {renderMarkdownInline(item)}
                          </li>
                        ))}
                      </ul>
                    )
                  ) : null}
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}>
                    <strong>{locale === 'zh' ? (project.title === 'AI 智能问数' ? '业绩成果' : '业绩') : 'Achievements'}</strong>
                  </p>
                  {project.achievements.length > 0 ? (
                    project.achievementsOrdered ? (
                      <ol className="about-project-achievements" style={{ ...workArticleList, marginTop: 0 }}>
                        {project.achievements.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ marginBottom: itemIndex < project.achievements.length - 1 ? 'var(--space-2)' : 0 }}>
                            {renderMarkdownInline(item)}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="about-project-achievements" style={{ ...workArticleList, marginTop: 0 }}>
                        {project.achievements.map((item, itemIndex) => (
                          <li key={itemIndex} style={{ marginBottom: itemIndex < project.achievements.length - 1 ? 'var(--space-2)' : 0 }}>
                            {renderMarkdownInline(item)}
                          </li>
                        ))}
                      </ul>
                    )
                  ) : null}
                </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="education"
          hidden
          style={{ ...anchorTarget, marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)' }}
        >
          <h2 style={{ margin: `0 0 ${educationExpanded ? 'var(--space-8)' : '0'}`, fontSize: 'var(--text-section)', fontWeight: 600 }}>
            <button
              type="button"
              className="about-section-toggle"
              aria-expanded={educationExpanded}
              aria-controls="education-content"
              onClick={() => setEducationExpanded((expanded) => !expanded)}
            >
              <span>{locale === 'zh' ? '教育经历' : 'Education'}</span>
              <span className={`about-section-toggle-icon${educationExpanded ? ' is-expanded' : ''}`} aria-hidden="true" />
            </button>
          </h2>
          <div id="education-content" hidden={!educationExpanded}>
            <article id="education-njupt" style={{ ...anchorTarget, marginTop: 'var(--space-8)' }}>
              <div style={workArticleProse}>
                <header style={workArticleHeader}>
                  <h3 style={workArticleTitle}>{renderMarkdownInline(edu.title)}</h3>
                  <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                    <span aria-hidden="true">{'>'} </span>
                    {renderMarkdownInline(edu.period)}
                  </p>
                </header>
                <ul style={{ ...workArticleList, marginTop: 'var(--space-4)', marginBottom: 0 }}>
                  {edu.items.map((item, i, arr) => (
                    <li key={i} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
                      {renderMarkdownInline(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section
          id="about-contact"
          style={{ ...anchorTarget, marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)' }}
        >
          <div style={workArticleProse}>
            <h2 style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-section)', fontWeight: 600 }}>
              {locale === 'zh' ? '联系方式' : 'Contact'}
            </h2>
            <ul style={{ ...workArticleList, marginTop: 'var(--space-4)', marginBottom: 0 }}>
              {about.contact.items.map((item, i, arr) => {
                const href = getContactHref(item.label, item.value)
                return (
                  <li key={`${item.label}-${i}`} style={{ marginBottom: i < arr.length - 1 ? 'var(--space-3)' : 0 }}>
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

      <nav className="about-timeline-nav" aria-label={m.about.timeline.navAria}>
        <ul className="about-timeline-list">
          {timelineEntries.map(({ id, label, timePoint }) => (
            <li key={id} className="about-timeline-item about-timeline-item-section">
              <a
                href={`#${id}`}
                className={activeTimelineId === id ? 'about-timeline-link active' : 'about-timeline-link'}
                aria-label={`${label}, ${timePoint}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`)
                  setActiveTimelineId(id)
                }}
              >
                <span className="about-timeline-tip" aria-hidden>
                  {timePoint}
                </span>
                <span className="about-timeline-tick" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
