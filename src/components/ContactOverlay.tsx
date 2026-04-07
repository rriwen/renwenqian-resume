import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const contactRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

function isContactHash() {
  return window.location.hash === '#contact'
}

export function ContactOverlay() {
  const { m } = useLanguage()
  const [open, setOpen] = useState(isContactHash)

  const sync = useCallback(() => setOpen(isContactHash()), [])

  const close = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [sync])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={m.contact.dialogAria}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 28px 80px rgba(0,0,0,0.12)',
          padding: '2rem 2rem 1.75rem',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <h2
            style={{
              margin: 0,
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {m.contact.title}
          </h2>
          <button
            type="button"
            aria-label={m.contact.closeAria}
            onClick={close}
            style={{
              fontSize: '1.25rem',
              lineHeight: 1,
              opacity: 0.45,
              padding: '0 0.25rem',
            }}
          >
            ×
          </button>
        </div>
        <p style={{ margin: '1.25rem 0 0', fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.85 }}>
          {m.contact.intro}
        </p>
        <div style={{ marginTop: '1.5rem', fontSize: '1rem', lineHeight: 1.75, fontWeight: 600 }}>
          <div style={contactRow}>
            <a
              href="mailto:rriwen@gmail.com"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                borderBottom: '1px solid currentColor',
                paddingBottom: 2,
              }}
            >
              rriwen@gmail.com
            </a>
          </div>
          <div style={{ ...contactRow, marginTop: '0.35rem' }} aria-label={m.contact.wechatAria}>
            18362976211
          </div>
        </div>
      </div>
    </div>
  )
}
