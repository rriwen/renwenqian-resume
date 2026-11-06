import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { ContextUsage } from '../../lib/chat/context'

export function ContextMeter({ usage }: { usage: ContextUsage }) {
  const { m } = useLanguage()
  const copy = m.chatbot
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const descriptionId = useId()
  const label = `${copy.contextRemaining} ${usage.remainingPercent}% · ${copy.contextEstimated}`

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])

  return (
    <div ref={rootRef} className={`chatbot-context${usage.remainingPercent <= 10 || usage.omittedMessages ? ' is-low' : ''}`}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="chatbot-context-trigger" aria-label={label}
        aria-describedby={open ? descriptionId : undefined}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onClick={() => setOpen(true)}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false) } }}>
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <circle className="chatbot-context-track" cx="18" cy="18" r="15" />
          <circle className="chatbot-context-remaining" cx="18" cy="18" r="15" pathLength="100"
            strokeDasharray={`${usage.remainingPercent} 100`} transform="rotate(-90 18 18)" />
        </svg>
      </button>
      <span className="chatbot-context-value" role="meter" aria-label={copy.contextRemaining}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={usage.remainingPercent} aria-valuetext={label} />
      {open && <div id={descriptionId} role="tooltip" className="chatbot-context-tooltip">
        {label}
      </div>}
    </div>
  )
}
