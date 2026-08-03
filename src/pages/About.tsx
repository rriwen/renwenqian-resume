import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { getAboutContent, renderMarkdownInline } from '../content/about'
import { useLanguage } from '../i18n/LanguageContext'

const TIMELINE_IDS = ['about-2026', 'work-oceanbase', 'work-ecidi', 'work-puhuai', 'education-njupt'] as const
type TimelineId = (typeof TIMELINE_IDS)[number]

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
const proseColumn: CSSProperties = { maxWidth: 720 }

/** 简介段落列宽（浏览器预览调宽） */
const aboutIntroColumn: CSSProperties = { maxWidth: 720 }

const bodyText: CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  opacity: 0.88,
}

const anchorTarget: CSSProperties = { scrollMarginTop: 'var(--header-clearance)' }

const workMeta: CSSProperties = {
  margin: 0,
  fontSize: '0.88rem',
  opacity: 0.72,
  lineHeight: 1.45,
  maxWidth: 720,
}

const workPeriod: CSSProperties = {
  margin: 0,
  marginBottom: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  opacity: 0.55,
  lineHeight: 1.4,
}

/** 与 work-oceanbase 一致：职位 → > 时间段 → meta */
const workArticleHeader: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

const workArticleTitle: CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: '1.05rem',
  fontWeight: 700,
}

const workArticlePeriod: CSSProperties = {
  ...workPeriod,
  margin: 0,
  marginBottom: 4,
  opacity: 0.4,
}

const workArticleMeta: CSSProperties = {
  ...workMeta,
  margin: 0,
}

const workArticleProse: CSSProperties = {
  ...proseColumn,
  maxWidth: 720,
}

const workArticleList: CSSProperties = {
  margin: '1rem 0 0',
  paddingLeft: '1.15rem',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  opacity: 0.88,
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

export function About() {
  const { m, locale } = useLanguage()
  const about = useMemo(() => getAboutContent(locale), [locale])
  const [activeTimelineId, setActiveTimelineId] = useState<TimelineId>('about-2026')
  const scrollOffsetRef = useRef(0)

  const timelineEntries = useMemo(
    () =>
      [
        { id: 'about-2026' as const, ...m.about.timeline.present },
        { id: 'work-oceanbase' as const, ...m.about.timeline.oceanbase },
        { id: 'work-ecidi' as const, ...m.about.timeline.ecidi },
        { id: 'work-puhuai' as const, ...m.about.timeline.puhuai },
        { id: 'education-njupt' as const, ...m.about.timeline.education },
      ] satisfies { id: TimelineId; label: string; timePoint: string }[],
    [m.about.timeline],
  )

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
  const puhuai = about.work[2]
  const edu = about.education

  if (!oceanbase || !ecidi || !puhuai) {
    throw new Error('About markdown is missing one or more work entries')
  }

  return (
    <>
      <main
        style={{
          minHeight: '100dvh',
          padding: '10rem 5vw 4rem',
          width: '100%',
          maxWidth: 'none',
          margin: 0,
        }}
      >
        <div id="about-2026" style={{ ...anchorTarget, position: 'relative', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{renderMarkdownInline(about.heading)}</h2>
        </div>

        <div style={aboutIntroColumn}>
          {about.introParagraphs.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 24)}`}
              style={{ ...bodyText, marginBottom: index === about.introParagraphs.length - 1 ? '2rem' : '1rem' }}
            >
              {renderMarkdownInline(paragraph)}
            </p>
          ))}
        </div>

        <section
          id="experience"
          style={{ ...anchorTarget, marginTop: '2.75rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.12)' }}
        >
          <article id="work-oceanbase" style={{ ...anchorTarget, marginTop: '2.25rem' }}>
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(oceanbase.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 4 }}>{renderMarkdownInline(oceanbase.meta)}</p>
                <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                  <span aria-hidden="true">{'>'} </span>
                  {renderMarkdownInline(oceanbase.period)}
                </p>
              </header>
              <ul style={workArticleList}>
                {oceanbase.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article
            id="work-ecidi"
            style={{ ...anchorTarget, marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.08)' }}
          >
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(ecidi.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 4 }}>{renderMarkdownInline(ecidi.meta)}</p>
                <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                  <span aria-hidden="true">{'>'} </span>
                  {renderMarkdownInline(ecidi.period)}
                </p>
              </header>
              <ul style={workArticleList}>
                {ecidi.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article
            id="work-puhuai"
            style={{ ...anchorTarget, marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.08)' }}
          >
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(puhuai.title)}</h3>
                <p style={{ ...workArticleMeta, marginBottom: 4 }}>{renderMarkdownInline(puhuai.meta)}</p>
                <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                  <span aria-hidden="true">{'>'} </span>
                  {renderMarkdownInline(puhuai.period)}
                </p>
              </header>
              <ul style={workArticleList}>
                {puhuai.bullets.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section
          id="education"
          style={{ ...anchorTarget, marginTop: '2.75rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.12)' }}
        >
          <article id="education-njupt" style={{ ...anchorTarget, marginTop: '2.25rem' }}>
            <div style={workArticleProse}>
              <header style={workArticleHeader}>
                <h3 style={workArticleTitle}>{renderMarkdownInline(edu.title)}</h3>
                <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                  <span aria-hidden="true">{'>'} </span>
                  {renderMarkdownInline(edu.period)}
                </p>
              </header>
              <ul style={{ ...workArticleList, marginTop: '1rem', marginBottom: 0 }}>
                {edu.items.map((item, i, arr) => (
                  <li key={i} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
                    {renderMarkdownInline(item)}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>

        <section
          id="about-contact"
          style={{ ...anchorTarget, marginTop: '2.75rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.12)' }}
        >
          <div style={workArticleProse}>
            <h3 style={workArticleTitle}>{renderMarkdownInline(about.contact.title)}</h3>
            <ul style={{ ...workArticleList, marginTop: '1rem', marginBottom: 0 }}>
              {about.contact.items.map((item, i, arr) => {
                const href = getContactHref(item.label, item.value)
                return (
                  <li key={`${item.label}-${i}`} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
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
            <li key={id} className="about-timeline-item">
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
