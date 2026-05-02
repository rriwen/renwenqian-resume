import { createElement, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { getProjectDetail, type ProjectDetailParagraph } from '../data/projectDetails'
import { getProjectBySlug } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'

const body: CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  opacity: 0.88,
}

function renderParagraphContent(para: ProjectDetailParagraph) {
  if (typeof para === 'string') return para
  return para.map((run, j) =>
    run.bold ? (
      <strong key={j} style={{ fontWeight: 700 }}>
        {run.text}
      </strong>
    ) : (
      <span key={j}>{run.text}</span>
    ),
  )
}

type LightboxItem = { src: string; caption: string }

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, m } = useLanguage()
  const project = getProjectBySlug(slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | REN WENQIAN`
    } else {
      document.title = m.home.title
    }
  }, [project, m.home.title])

  useEffect(() => {
    setLightbox(null)
  }, [slug])

  useEffect(() => {
    if (!lightbox) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  if (!project || !detail) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          padding: 'var(--header-clearance) 2.5rem 4rem',
          width: 720,
          margin: '0 auto',
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
        padding: 'var(--header-clearance) 2.5rem 4rem',
        width: 900,
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
          marginBottom: '2.25rem',
          aspectRatio: '16 / 9',
          maxHeight: 420,
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
          fontSize: '2.35rem',
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
          {renderParagraphContent(para)}
        </p>
      ))}

      {detail.responsibilities ? (
        <section style={{ margin: '0 0 1rem' }}>
          <p style={{ ...body, marginBottom: '0.65rem' }}>{detail.responsibilities.intro}</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: '1.35rem',
              listStyleType: 'disc',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              opacity: 0.88,
              color: 'inherit',
            }}
          >
            {detail.responsibilities.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1rem' }}>
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
                      margin: '0.5rem 0 0',
                      paddingLeft: '1.25rem',
                      listStyleType: 'circle',
                    }}
                  >
                    {item.nested.map((sub, j) => (
                      <li key={j} style={{ marginBottom: '0.55rem' }}>
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
        </section>
      ) : null}

      {detail.afterResponsibilities?.map((para, idx) => (
        <p key={`after-resp-${idx}`} style={body}>
          {para}
        </p>
      ))}

      {detail.highlightBullets?.length
        ? createElement(
            detail.highlightBulletsOrdered ? 'ol' : 'ul',
            {
              style: {
                margin: '0 0 1rem',
                paddingLeft: detail.highlightBulletsOrdered ? '1.5rem' : '1.2rem',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                opacity: 0.88,
                color: 'inherit',
                listStyleType: detail.highlightBulletsOrdered ? 'decimal' : 'disc',
              },
            },
            detail.highlightBullets.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '0.6rem' }}>
                <strong style={{ fontWeight: 700 }}>{item.keyword}</strong>
                {locale === 'zh' ? '：' : ': '}
                {item.text}
              </li>
            )),
          )
        : null}

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
            letterSpacing: '0.1em',
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
            gap: '0.85rem',
          }}
        >
          {detail.gallery.map((item, idx) => (
            <figure
              key={`${item.src}-${idx}`}
              style={{
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <button
                type="button"
                aria-label={`${m.workDetail.galleryOpenFullscreenAria}: ${item.caption}`}
                onClick={() => setLightbox({ src: item.src, caption: item.caption })}
                style={{
                  display: 'block',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  border: 'none',
                  borderRadius: 4,
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: '#eaeaea',
                  aspectRatio: '4 / 3',
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                />
              </button>
              <figcaption
                style={{
                  fontSize: '0.78rem',
                  lineHeight: 1.55,
                  opacity: 0.5,
                  letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
                }}
              >
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightbox &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={m.workDetail.galleryLightboxAria}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 220,
              background: 'rgba(255,255,255,0.92)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
              paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
            }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label={m.contact.closeAria}
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: 'max(10px, env(safe-area-inset-right))',
                width: 44,
                height: 44,
                border: 'none',
                borderRadius: 4,
                background: 'rgba(10,10,10,0.06)',
                color: '#0a0a0a',
                fontSize: '1.35rem',
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <img
                src={lightbox.src}
                alt={lightbox.caption}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: 2,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                }}
              />
              <p
                style={{
                  margin: 0,
                  maxWidth: '42rem',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  lineHeight: 1.55,
                  color: 'rgba(10,10,10,0.58)',
                  letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
                }}
              >
                {lightbox.caption}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}
