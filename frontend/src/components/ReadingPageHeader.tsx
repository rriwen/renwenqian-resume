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
    const syncVisibility = () => setVisible(heading.getBoundingClientRect().bottom <= 0)
    syncVisibility()
    const observer = new IntersectionObserver(syncVisibility, { threshold: [0, 1] })
    observer.observe(heading)
    return () => observer.disconnect()
    // A layout edit can replace the h1 while retaining the same ref object.
    // Rebind after commits so the observer always tracks the current heading.
  })

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
