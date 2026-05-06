import { createElement, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import { getProjectDetail, type ProjectDetailParagraph } from '../data/projectDetails'
import { getAdjacentProjects, getProjectBySlug } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { isGifSrc } from '../lib/isGifSrc'

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

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { locale, m } = useLanguage()
  const project = getProjectBySlug(slug)
  const detail = project ? getProjectDetail(project.slug, locale) : undefined
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxIntrinsic, setLightboxIntrinsic] = useState<{ w: number; h: number } | null>(null)
  const [heroIntrinsic, setHeroIntrinsic] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | REN WENQIAN`
    } else {
      document.title = m.home.title
    }
  }, [project, m.home.title])

  useEffect(() => {
    setLightboxIndex(null)
  }, [slug])

  useEffect(() => {
    setHeroIntrinsic(null)
  }, [project?.image])

  const galleryLen = detail?.gallery.length ?? 0

  useEffect(() => {
    setLightboxIntrinsic(null)
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i !== null && i < galleryLen - 1 ? i + 1 : i))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxIndex, galleryLen])

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
          className="project-detail-back-link"
          style={{
            display: 'inline-block',
            marginTop: '1.25rem',
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {m.workDetail.back}
        </Link>
      </main>
    )
  }

  const { prev: prevProject, next: nextProject } = getAdjacentProjects(project.slug)

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
        className="project-detail-back-link"
        style={{
          display: 'inline-block',
          marginBottom: '1.75rem',
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: 0.55,
        }}
      >
        {m.workDetail.back}
      </Link>

      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: '2.25rem',
          width: '100%',
          background: '#eaeaea',
          border: '1px solid rgba(10, 10, 10, 0.04)',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          src={project.image}
          alt=""
          loading={isGifSrc(project.image) ? 'eager' : undefined}
          decoding="async"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget
            if (naturalWidth > 0 && naturalHeight > 0) {
              setHeroIntrinsic({ w: naturalWidth, h: naturalHeight })
            }
          }}
          style={{
            maxWidth: heroIntrinsic ? `min(100%, ${heroIntrinsic.w}px)` : '100%',
            width: heroIntrinsic ? 'auto' : '100%',
            height: 'auto',
            objectFit: 'contain',
            objectPosition: 'center top',
            display: 'block',
          }}
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
                onClick={() => setLightboxIndex(idx)}
                style={{
                  display: 'block',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  border: '1px solid rgba(10, 10, 10, 0.04)',
                  borderRadius: 4,
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: '#eaeaea',
                  aspectRatio: '16 / 9',
                }}
              >
                <img
                  src={item.src}
                  alt=""
                  loading={isGifSrc(item.src) ? 'eager' : undefined}
                  decoding="async"
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

      {prevProject || nextProject ? (
        <nav
          aria-label={m.workDetail.projectNavAria}
          style={{
            marginTop: '120px',
            paddingTop: '1.75rem',
            borderTop: '1px solid rgba(10, 10, 10, 0.1)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '1.5rem',
              alignItems: 'start',
            }}
          >
            <div style={{ minWidth: 0 }}>
              {prevProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: '0.68rem',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      opacity: 0.5,
                    }}
                  >
                    {m.workDetail.prevProject}
                  </p>
                  <Link
                    to={`/project/${prevProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: 'inherit',
                    }}
                  >
                    {prevProject.title}
                  </Link>
                </>
              ) : null}
            </div>
            <div style={{ minWidth: 0, textAlign: 'right' }}>
              {nextProject ? (
                <>
                  <p
                    style={{
                      margin: '0 0 0.35rem',
                      fontSize: '0.68rem',
                      letterSpacing: locale === 'zh' ? '0.06em' : '0.1em',
                      textTransform: locale === 'zh' ? 'none' : 'uppercase',
                      fontWeight: 600,
                      opacity: 0.5,
                    }}
                  >
                    {m.workDetail.nextProject}
                  </p>
                  <Link
                    to={`/project/${nextProject.slug}`}
                    className="project-detail-adjacent-link"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      color: 'inherit',
                    }}
                  >
                    {nextProject.title}
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}

      {lightboxIndex !== null &&
        detail.gallery[lightboxIndex] &&
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
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              aria-label={m.contact.closeAria}
              onClick={() => setLightboxIndex(null)}
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
            {galleryLen > 1 && lightboxIndex > 0 ? (
              <button
                type="button"
                aria-label={m.workDetail.galleryPrevAria}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
                }}
                style={{
                  position: 'absolute',
                  left: 'max(10px, env(safe-area-inset-left))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  border: 'none',
                  borderRadius: 4,
                  background: 'rgba(10,10,10,0.06)',
                  color: '#0a0a0a',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ‹
              </button>
            ) : null}
            {galleryLen > 1 && lightboxIndex < galleryLen - 1 ? (
              <button
                type="button"
                aria-label={m.workDetail.galleryNextAria}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => (i !== null && i < galleryLen - 1 ? i + 1 : i))
                }}
                style={{
                  position: 'absolute',
                  right: 'max(10px, env(safe-area-inset-right))',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 44,
                  height: 44,
                  border: 'none',
                  borderRadius: 4,
                  background: 'rgba(10,10,10,0.06)',
                  color: '#0a0a0a',
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ›
              </button>
            ) : null}
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem',
                maxWidth: 'min(100%, calc(100vw - 3rem))',
                maxHeight: 'min(calc(100dvh - 5.5rem), 100%)',
                minHeight: 0,
              }}
            >
              <img
                key={lightboxIndex}
                src={detail.gallery[lightboxIndex].src}
                alt={detail.gallery[lightboxIndex].caption}
                loading={isGifSrc(detail.gallery[lightboxIndex].src) ? 'eager' : undefined}
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget
                  if (naturalWidth > 0 && naturalHeight > 0) {
                    setLightboxIntrinsic({ w: naturalWidth, h: naturalHeight })
                  }
                }}
                style={{
                  maxWidth: lightboxIntrinsic ? `min(100%, ${lightboxIntrinsic.w}px)` : '100%',
                  maxHeight: lightboxIntrinsic
                    ? `min(min(calc(100dvh - 8.5rem), 85dvh), ${lightboxIntrinsic.h}px)`
                    : 'min(calc(100dvh - 8.5rem), 85dvh)',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  display: 'block',
                  borderRadius: 2,
                  boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                  ...(isGifSrc(detail.gallery[lightboxIndex].src)
                    ? {
                        imageRendering: 'smooth',
                      }
                    : {}),
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
                {detail.gallery[lightboxIndex].caption}
              </p>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}
