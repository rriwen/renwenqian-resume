import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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

const statBold: CSSProperties = { fontWeight: 700 }

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

export function About() {
  const { locale, m } = useLanguage()
  const [skillIndex, setSkillIndex] = useState(0)
  const [activeTimelineId, setActiveTimelineId] = useState<TimelineId>('about-2026')
  const scrollOffsetRef = useRef(0)
  const skills = m.about.skills

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
    setSkillIndex(0)
  }, [locale])

  useEffect(() => {
    const len = skills.length
    const id = window.setInterval(() => {
      setSkillIndex((i) => (i + 1) % len)
    }, 2200)
    return () => window.clearInterval(id)
  }, [locale, skills.length])

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

  const w = m.about.work
  const edu = m.about.education

  return (
    <>
    <main
      style={{
        minHeight: '100dvh',
        padding: 'var(--header-clearance) clamp(1rem, 4vw, 2.5rem) 4rem',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div id="about-2026" style={{ ...anchorTarget, position: 'relative', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700 }}>{m.about.iDo}</h2>
        <p
          style={{
            margin: '0.75rem 0 0',
            fontSize: '1.06rem',
            fontWeight: 700,
            minHeight: '1.3em',
            transition: 'opacity 0.35s ease',
          }}
        >
          {skills[skillIndex]}
        </p>
      </div>

      <div style={aboutIntroColumn}>
        <p style={bodyText}>
          {m.about.body1IntroBold ? (
            <>
              {m.about.body1IntroBold.beforeName1}
              <strong style={{ fontWeight: 700 }}>{m.about.body1IntroBold.name1}</strong>
              {m.about.body1IntroBold.betweenNames}
              <strong style={{ fontWeight: 700 }}>{m.about.body1IntroBold.name2}</strong>
              {m.about.body1IntroBold.afterName2}
            </>
          ) : (
            m.about.body1
          )}
        </p>
        <p style={bodyText}>{m.about.body2}</p>
        <p style={{ ...bodyText, marginBottom: '2rem' }}>
          {m.about.body3a}
          <span style={statBold}>75%</span>
          {m.about.body3b}
          <span style={statBold}>30%</span>
          {m.about.body3c}
          <span style={statBold}>20%</span>
          {m.about.body3d}
        </p>
      </div>

      <section
        id="experience"
        style={{ ...anchorTarget, marginTop: '2.75rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.12)' }}
      >
        <article id="work-oceanbase" style={{ ...anchorTarget, marginTop: '2.25rem' }}>
          <div style={workArticleProse}>
            <header style={workArticleHeader}>
              <h3 style={workArticleTitle}>{w.oceanbase.role}</h3>
              <p style={{ ...workArticleMeta, marginBottom: 4 }}>{w.oceanbase.meta}</p>
              <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                <span aria-hidden="true">{'>'} </span>
                {w.oceanbase.period}
              </p>
            </header>
            <ul style={workArticleList}>
              {w.oceanbase.highlights.map((item, i, arr) => (
                <li key={i} style={{ marginBottom: i < arr.length - 1 ? '0.65rem' : 0 }}>
                  <strong style={{ fontWeight: 700 }}>{item.keyword}</strong>
                  {item.detail}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article id="work-ecidi" style={{ ...anchorTarget, marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.08)' }}>
          <div style={workArticleProse}>
            <header style={workArticleHeader}>
              <h3 style={workArticleTitle}>{w.ecidi.role}</h3>
              <p style={{ ...workArticleMeta, marginBottom: 4 }}>{w.ecidi.meta}</p>
              <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                <span aria-hidden="true">{'>'} </span>
                {w.ecidi.period}
              </p>
            </header>
            <ul style={workArticleList}>
              <li style={{ marginBottom: '0.65rem' }}>{w.ecidi.li1}</li>
              <li style={{ marginBottom: '0.65rem' }}>{w.ecidi.li2}</li>
              <li style={{ marginBottom: 0 }}>{w.ecidi.li3}</li>
            </ul>
          </div>
        </article>

        <article id="work-puhuai" style={{ ...anchorTarget, marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(10,10,10,0.08)' }}>
          <div style={workArticleProse}>
            <header style={workArticleHeader}>
              <h3 style={workArticleTitle}>{w.puhuai.role}</h3>
              <p style={{ ...workArticleMeta, marginBottom: 4 }}>{w.puhuai.meta}</p>
              <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                <span aria-hidden="true">{'>'} </span>
                {w.puhuai.period}
              </p>
            </header>
            <ul style={workArticleList}>
              <li style={{ marginBottom: '0.65rem' }}>{w.puhuai.li1}</li>
              <li style={{ marginBottom: 0 }}>{w.puhuai.li2}</li>
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
              <h3 style={workArticleTitle}>{edu.njupt.role}</h3>
              <p style={{ ...workArticlePeriod, marginBottom: 0 }}>
                <span aria-hidden="true">{'>'} </span>
                {edu.njupt.period}
              </p>
            </header>
            <p style={{ ...bodyText, marginTop: '1rem', marginBottom: 0 }}>{edu.njupt.body}</p>
          </div>
        </article>
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
