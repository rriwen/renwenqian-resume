import { useEffect, useState } from 'react'

const TIMELINE_IDS = ['about-2026', 'experience', 'about-contact'] as const
type TimelineId = (typeof TIMELINE_IDS)[number]
export type TimelineEntry = { id: TimelineId; label: string }

function measureHeaderClearancePx(): number {
  const probe = document.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:var(--header-clearance);pointer-events:none;visibility:hidden;z-index:-1'
  document.body.appendChild(probe)
  const height = probe.getBoundingClientRect().height
  probe.remove()
  return height
}

export function useAboutTimeline() {
  const [activeTimelineId, setActiveTimelineId] = useState<TimelineId>(TIMELINE_IDS[0])

  useEffect(() => {
    let offset = measureHeaderClearancePx()
    let frame: number | null = null

    const updateActive = () => {
      frame = null
      let current: TimelineId = TIMELINE_IDS[0]
      for (const id of TIMELINE_IDS) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= offset) current = id
      }
      setActiveTimelineId((previous) => previous === current ? previous : current)
    }
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updateActive)
    }
    const onResize = () => {
      offset = measureHeaderClearancePx()
      scheduleUpdate()
    }

    scheduleUpdate()
    // Expanded project cards, locale changes and loaded fonts can move anchors without scrolling.
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize)
    const page = document.querySelector('.about-page')
    if (page) observer?.observe(page)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', scheduleUpdate)
    window.addEventListener('load', scheduleUpdate)
    return () => {
      if (frame !== null) cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', scheduleUpdate)
      window.removeEventListener('load', scheduleUpdate)
    }
  }, [])

  const navigateTimeline = (id: TimelineId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`)
    setActiveTimelineId(id)
  }

  return { activeTimelineId, navigateTimeline }
}
