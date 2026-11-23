import { useEffect, useId, useRef, useState } from 'react'

/** Inline definition available on hover, keyboard focus and touch. */
export function TermTooltip({ text, definition, title }: { text: string; definition: string; title?: string }) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const show = () => {
    const rect = trigger.current?.getBoundingClientRect()
    if (rect) setPosition({ left: Math.max(16, Math.min(rect.left, window.innerWidth - 296)), top: rect.bottom })
  }
  useEffect(() => {
    if (!position) return
    const close = () => setPosition(null)
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
      window.removeEventListener('keydown', escape)
    }
  }, [position])
  return <span className="project-term" onMouseEnter={show} onMouseLeave={() => setPosition(null)}>
    <button ref={trigger} type="button" className="project-term-trigger" aria-describedby={position ? id : undefined}
      onFocus={show} onBlur={() => setPosition(null)} onClick={show}>{text}</button>
    {position && <span id={id} role="tooltip" className="project-term-tooltip" style={position}>{title && <strong style={{ display: 'block', marginBottom: 6 }}>{title}</strong>}{definition}</span>}
  </span>
}
