import { useEffect, useState, type ReactNode, type RefObject } from 'react'

type Props = {
  title: ReactNode
  titleRef: RefObject<HTMLHeadingElement>
  controls?: ReactNode
}

/** Keep the page identity visible after its original heading scrolls out of view. */
export function ReadingPageHeader({ title, titleRef, controls }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heading = titleRef.current
    if (!heading) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0)
    })
    observer.observe(heading)
    return () => observer.disconnect()
  }, [titleRef])

  // The original h1 remains the accessible page heading; this is its visual continuation.
  return (
    <div className={`reading-page-header${visible ? ' is-visible' : ''}${visible && controls ? ' has-controls' : ''}`} aria-hidden={visible ? undefined : true}>
      <div className="reading-page-header-surface">
        <div className="reading-page-header-inner">
          <p aria-hidden="true">{title}</p>
          {visible && controls && <div className="reading-page-header-controls">{controls}</div>}
        </div>
      </div>
    </div>
  )
}
