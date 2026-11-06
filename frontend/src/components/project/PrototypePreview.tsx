import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'

/** Keep page scrolling available until the reader deliberately dwells on the demo. */
export function PrototypePreview({ url, title, viewportWidth }: { url: string; title: string; viewportWidth?: number }) {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const container = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (!viewportWidth || !container.current) return
    const element = container.current
    const update = () => setScale(element.clientWidth / viewportWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [viewportWidth])
  const [active, setActive] = useState(false)
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null)
  const loading = loadedUrl !== url
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    setSlow(false)
    if (!loading) return
    const timeout = setTimeout(() => setSlow(true), 15000)
    return () => clearTimeout(timeout)
  }, [url, loading])
  const [remaining, setRemaining] = useState<number | null>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)

  const clearTimer = () => {
    if (timer.current !== null) clearInterval(timer.current)
    timer.current = null
  }
  const reset = () => {
    clearTimer()
    setActive(false)
    setRemaining(null)
  }
  const activate = (focus = false) => {
    clearTimer()
    setActive(true)
    setRemaining(null)
    if (focus) frame.current?.focus()
  }
  const trackPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({ x: Math.max(8, Math.min(event.clientX - rect.left + 16, rect.width - 172)), y: Math.max(8, Math.min(event.clientY - rect.top + 16, rect.height - 40)) })
  }
  const start = (event: PointerEvent<HTMLButtonElement>) => {
    if (loading || event.pointerType !== 'mouse') return
    clearTimer()
    trackPointer(event)
    const started = performance.now()
    setRemaining(2)
    timer.current = setInterval(() => {
      const left = 2000 - (performance.now() - started)
      if (left <= 0) activate()
      else setRemaining(Math.ceil(left / 1000))
    }, 50)
  }
  useEffect(() => {
    reset()
    return clearTimer
  }, [url])

  return (
    <div ref={container} className={`project-detail-prototype-preview${active ? ' is-interactive' : ''}`} onPointerLeave={reset} onKeyDown={event => { if (event.key === 'Escape') reset() }}>
      <iframe key={url} ref={frame} className={`media-image${loading ? '' : ' is-ready'}`} onLoad={() => setLoadedUrl(url)} style={viewportWidth ? { position: 'absolute', width: viewportWidth, height: viewportWidth * 9 / 16, transform: `scale(${scale})`, transformOrigin: 'top left' } : undefined} src={url} title={title} loading="lazy" allowFullScreen tabIndex={active ? 0 : -1} />
      {loading && <span className="media-loading" role="status" aria-label="Demo 加载中"><span className="media-loading-dot" aria-hidden="true" /></span>}
      {loading && slow && <a className="media-load-fallback" href={url} target="_blank" rel="noopener noreferrer">加载较慢，单独打开 Demo ↗</a>}
      {!active && <button type="button" disabled={loading} className="project-detail-prototype-gate"
        aria-label={zh ? `启用${title}，鼠标停留两秒或按 Enter` : `Activate ${title}: hover for two seconds or press Enter`}
        onPointerEnter={start} onPointerMove={trackPointer}
        onPointerDown={event => { if (event.pointerType !== 'mouse') activate() }}
        onClick={event => { if (event.detail === 0) activate(true) }}>
        {remaining !== null && <span className="project-detail-prototype-countdown" style={{ left: position.x, top: position.y }} aria-hidden="true">{zh ? `${remaining} 秒后可交互` : `Interact in ${remaining}s`}</span>}
      </button>}
      {active && <button type="button" className="project-detail-prototype-exit" onClick={reset}>{zh ? '退出交互' : 'Exit interaction'}</button>}
    </div>
  )
}
