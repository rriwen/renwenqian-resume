import { useEffect, useId, useRef, useState } from 'react'
import { ProjectGallery } from './ProjectGallery'
import type { Locale } from '../../i18n/translations'

const DURATION = 5000

/** Screenshot slots remain explicit placeholders until project images are supplied. */
export function ScreenshotCarousel({ titles, descriptions, images, locale: _locale }: { titles: string[]; descriptions?: string[]; images?: (string | null)[]; locale: Locale }) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const elapsed = useRef(0)
  const [slide, setSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [reduced, setReduced] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const running = visible && pageVisible && !reduced && !hovered && !focused && titles.length > 1
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 })
    if (root.current) observer.observe(root.current)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduced(motion.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    motion.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    return () => { observer.disconnect(); motion.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])
  useEffect(() => {
    if (!running) return
    let last = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      elapsed.current += now - last
      last = now
      if (elapsed.current >= DURATION) {
        elapsed.current %= DURATION
        setSlide(current => (current + 1) % titles.length)
      }
      setProgress(elapsed.current / DURATION)
    }, 100)
    return () => window.clearInterval(timer)
  }, [running, titles.length])
  function select(index: number) {
    setSlide(index)
    elapsed.current = 0
    setProgress(0)
    setFocused(false)
  }
  return <div ref={root} className="screenshot-carousel"
    onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div id={`${id}-slide`} className={images?.[slide] ? "qa-screenshot-image" : "qa-screenshot-placeholder"} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} aria-live={running ? 'off' : 'polite'}>
      {images?.[slide] ? <ProjectGallery items={[{ src: images[slide]!, caption: titles[slide], hideCaption: true }]} layout="stacked" /> : <>
      <strong>{'截图轮播占位'}</strong>
      <p>{`第 ${slide + 1} / ${titles.length} 张`}</p>
      <p className="qa-placeholder-topics">{titles[slide]}</p>
      {descriptions?.[slide] && <p className="qa-placeholder-brief">{descriptions[slide]}</p>}
      <small>{'截图待补充'}</small>
      </>}
    </div>
    {titles.length > 1 && <div className="qa-carousel-controls">
      <div className="qa-carousel-dots" role="group" aria-label={'截图切换'}>
        {titles.map((title, index) => <button key={title} type="button" aria-label={`${'截图'} ${index + 1}: ${title}`}
          aria-pressed={slide === index} aria-controls={`${id}-slide`} onClick={() => select(index)}>
          <span><i style={{ transform: `scaleX(${slide === index ? progress : 0})` }} /></span>
        </button>)}
      </div>
    </div>}
  </div>
}
