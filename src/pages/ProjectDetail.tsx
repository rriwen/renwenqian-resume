import { useEffect, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectDetail } from '../data/projectDetails'
import { getProjectBySlug } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'

const body: CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  opacity: 0.88,
  maxWidth: 720,
}

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, m } = useLanguage()
  const project = getProjectBySlug(slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | REN WENQIAN`
    } else {
      document.title = m.home.title
    }
  }, [project, m.home.title])

  if (!project || !detail) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          padding: 'var(--header-clearance) clamp(1rem, 4vw, 2.5rem) 4rem',
          maxWidth: 720,
        }}
      >
        <p style={{ ...body, marginTop: '0.5rem' }}>{m.workDetail.notFound}</p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '1.25rem',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          {m.workDetail.back}
        </Link>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        padding: 'var(--header-clearance) clamp(1rem, 4vw, 2.5rem) 4rem',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginBottom: '1.75rem',
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.55,
          textDecoration: 'none',
          borderBottom: '1px solid rgba(10,10,10,0.2)',
          paddingBottom: 2,
        }}
      >
        {m.workDetail.back}
      </Link>

      <div
        style={{
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 'clamp(1.5rem, 4vw, 2.25rem)',
          aspectRatio: '16 / 9',
          maxHeight: 'min(52vh, 420px)',
          background: '#0a0a0a',
        }}
      >
        <img
          src={project.image}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <h1
        style={{
          margin: '0 0 1.25rem',
          fontSize: 'clamp(1.65rem, 4.5vw, 2.35rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {project.title}
      </h1>

      <p
        style={{
          margin: '0 0 1.75rem',
          fontSize: '0.68rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.72,
          lineHeight: 1.6,
        }}
      >
        {detail.tags.join(' · ')}
      </p>

      {detail.paragraphs.map((para, idx) => (
        <p key={idx} style={body}>
          {para}
        </p>
      ))}

      {detail.highlightBullets?.length ? (
        <ul
          style={{
            margin: '0 0 1rem',
            paddingLeft: '1.2rem',
            maxWidth: 720,
            fontSize: '0.95rem',
            lineHeight: 1.7,
            opacity: 0.88,
            color: 'inherit',
          }}
        >
          {detail.highlightBullets.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.6rem' }}>
              <strong style={{ fontWeight: 700 }}>{item.keyword}</strong>
              {locale === 'zh' ? '：' : ': '}
              {item.text}
            </li>
          ))}
        </ul>
      ) : null}

      {detail.afterHighlightBullets ? (
        <p style={body}>{detail.afterHighlightBullets}</p>
      ) : null}

      {detail.externalUrl ? (
        <a
          href={detail.externalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            marginBottom: '2.5rem',
            fontSize: '0.95rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'underline',
            textUnderlineOffset: 4,
          }}
        >
          {m.workDetail.viewSite}
        </a>
      ) : null}

      <section
        aria-label={m.workDetail.galleryAria}
        style={{ marginTop: detail.externalUrl ? '1.25rem' : '2.5rem' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 0.85rem)',
          }}
        >
          {detail.gallery.map((src) => (
            <div
              key={src}
              style={{
                borderRadius: 4,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                background: '#eaeaea',
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
