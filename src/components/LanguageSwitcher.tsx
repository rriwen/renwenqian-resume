import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { IconGlobe } from './Icons'

export function LanguageSwitcher() {
  const { locale, setLocale, m } = useLanguage()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div ref={wrapRef} style={{ position: 'relative', textTransform: 'none' }}>
      <button
        type="button"
        aria-label={m.language.switcherAria}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          padding: 0,
          color: 'inherit',
          background: 'transparent',
          border: '1px solid rgba(10,10,10,0.22)',
          borderRadius: 4,
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <IconGlobe size={15} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={m.language.switcherAria}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            margin: '0.35rem 0 0',
            padding: '0.25rem 0',
            listStyle: 'none',
            minWidth: '100%',
            background: '#fff',
            border: '1px solid rgba(10,10,10,0.1)',
            borderRadius: 8,
            boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
            zIndex: 80,
          }}
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={locale === 'en'}
              onClick={() => {
                setLocale('en')
                setOpen(false)
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                border: 'none',
                background: locale === 'en' ? 'rgba(10,10,10,0.06)' : 'transparent',
                padding: '0.45rem 0.75rem',
                cursor: 'pointer',
                fontWeight: locale === 'en' ? 600 : 500,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {m.language.english}
            </button>
          </li>
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={locale === 'zh'}
              onClick={() => {
                setLocale('zh')
                setOpen(false)
              }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                font: 'inherit',
                border: 'none',
                background: locale === 'zh' ? 'rgba(10,10,10,0.06)' : 'transparent',
                padding: '0.45rem 0.75rem',
                cursor: 'pointer',
                fontWeight: locale === 'zh' ? 600 : 500,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                textTransform: 'none',
              }}
            >
              {m.language.chinese}
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
