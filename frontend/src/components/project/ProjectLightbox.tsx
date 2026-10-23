import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectGalleryItem } from '../../data/projectDetails'
import { useLanguage } from '../../i18n/LanguageContext'
import { isGifSrc } from '../../lib/isGifSrc'

type Props = {
  items: ProjectGalleryItem[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
  returnFocusTo: HTMLElement | null
}

export function ProjectLightbox({ items, index, onChange, onClose, returnFocusTo }: Props) {
  const { locale, m } = useLanguage()
  const galleryLen = items.length
  const dialogRef = useRef<HTMLDivElement>(null)
  const [lightboxIntrinsic, setLightboxIntrinsic] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    // Capture the outside focus before either effect moves it into the dialog.
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.querySelector('button')?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      const target = returnFocusTo?.isConnected ? returnFocusTo : previousFocus
      if (target?.isConnected) target.focus()
    }
  }, [returnFocusTo])

  useEffect(() => {
    setLightboxIntrinsic(null)
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.querySelector('button')?.focus()
  }, [index])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        if (event.key === 'ArrowLeft' && index > 0) onChange(index - 1)
        if (event.key === 'ArrowRight' && index < galleryLen - 1) onChange(index + 1)
      }
      if (event.key === 'Tab') {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button')
        if (!buttons?.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, galleryLen, onChange, onClose])

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={m.workDetail.galleryLightboxAria}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'var(--lightbox-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        paddingTop: 'max(var(--space-3), env(safe-area-inset-top))',
        paddingBottom: 'max(var(--space-3), env(safe-area-inset-bottom))',
      }}
      onClick={() => onClose()}
    >
      <button
        type="button"
        aria-label={m.contact.closeAria}
        onClick={() => onClose()}
        style={{
          position: 'absolute',
          top: '10px',
          right: 'max(10px, env(safe-area-inset-right))',
          width: 44,
          height: 44,
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--hover-bg)',
          color: 'var(--text)',
          fontSize: 'var(--text-xl)',
          lineHeight: 1,
          cursor: 'pointer',
        }}
      >
        ×
      </button>
      {galleryLen > 1 && index > 0 ? (
        <button
          type="button"
          aria-label={m.workDetail.galleryPrevAria}
          onClick={(e) => {
            e.stopPropagation()
            onChange(index - 1)
          }}
          style={{
            position: 'absolute',
            left: 'max(10px, env(safe-area-inset-left))',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--hover-bg)',
            color: 'var(--text)',
            fontSize: 'var(--text-xl)',
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
      {galleryLen > 1 && index < galleryLen - 1 ? (
        <button
          type="button"
          aria-label={m.workDetail.galleryNextAria}
          onClick={(e) => {
            e.stopPropagation()
            onChange(index + 1)
          }}
          style={{
            position: 'absolute',
            right: 'max(10px, env(safe-area-inset-right))',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--hover-bg)',
            color: 'var(--text)',
            fontSize: 'var(--text-xl)',
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
          maxWidth: 'min(100%, calc(100vw - var(--space-12)))',
          maxHeight: 'min(calc(100dvh - 5.5rem), 100%)',
          minHeight: 0,
        }}
      >
        <img
          key={index}
          src={items[index].src}
          alt={items[index].caption}
          loading={isGifSrc(items[index].src) ? 'eager' : undefined}
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
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-overlay)',
            ...(isGifSrc(items[index].src)
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
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-ui)',
            color: 'var(--muted)',
            letterSpacing: locale === 'zh' ? '0.01em' : '0.02em',
          }}
        >
          {items[index].caption}
        </p>
      </div>
    </div>,
    document.body,
  )
}
