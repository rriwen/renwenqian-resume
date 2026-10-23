import { useCallback, useRef, useState } from 'react'
import type { ProjectGalleryItem } from '../../data/projectDetails'
import { useLanguage } from '../../i18n/LanguageContext'
import { isGifSrc } from '../../lib/isGifSrc'
import { ProjectLightbox } from './ProjectLightbox'

export function ProjectGallery({ items }: { items: ProjectGalleryItem[] }) {
  const { locale, m } = useLanguage()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  return (
    <>
      <section
        aria-label={m.workDetail.galleryAria}
        className="project-detail-gallery"
      >
        <div className="project-detail-gallery-grid">
          {items.map((item, idx) => (
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
                onClick={(event) => {
                  // Safari does not necessarily focus a button when it is clicked.
                  triggerRef.current = event.currentTarget
                  setLightboxIndex(idx)
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  border: '1px solid var(--rule)',
                  borderRadius: 'var(--radius-sm)',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  background: 'var(--subtle)',
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
                  fontSize: 'var(--text-xs)',
                  lineHeight: 'var(--leading-ui)',
                  color: 'var(--muted)',
                  letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
                }}
              >
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && items[lightboxIndex] ? (
        <ProjectLightbox items={items} index={lightboxIndex} onChange={setLightboxIndex} onClose={closeLightbox} returnFocusTo={triggerRef.current} />
      ) : null}
    </>
  )
}
