/*! Layout evolved from Lieflat Charts L13 “The funnel, poured”, commit 75c6978.
 * The chart now uses solid funnel segments for clearer stage comparisons.
 * https://github.com/larashero3-dotcom/lieflat-charts
 * PolyForm Noncommercial 1.0.0: https://polyformproject.org/licenses/noncommercial/1.0.0
 * Template selection and adaptations: docs/databaseops-chart.md
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { ProjectFunnelData } from '../../data/projects/databaseOps'

type Props = {
  data: ProjectFunnelData
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

const center = 170
const stageHeight = 80

function roundedSegmentPath(top: number, bottom: number, halfWidth: number, nextHalfWidth: number) {
  const radius = Math.min(10, nextHalfWidth / 3)
  const sideLength = Math.hypot(halfWidth - nextHalfWidth, bottom - top)
  const dx = radius * (halfWidth - nextHalfWidth) / sideLength
  const dy = radius * (bottom - top) / sideLength
  return [
    `M${center - halfWidth + radius} ${top}`,
    `H${center + halfWidth - radius}`,
    `Q${center + halfWidth} ${top} ${center + halfWidth - dx} ${top + dy}`,
    `L${center + nextHalfWidth + dx} ${bottom - dy}`,
    `Q${center + nextHalfWidth} ${bottom} ${center + nextHalfWidth - radius} ${bottom}`,
    `H${center - nextHalfWidth + radius}`,
    `Q${center - nextHalfWidth} ${bottom} ${center - nextHalfWidth - dx} ${bottom - dy}`,
    `L${center - halfWidth + dx} ${top + dy}`,
    `Q${center - halfWidth} ${top} ${center - halfWidth + radius} ${top} Z`,
  ].join(' ')
}

export default function FunnelGraphic({ data, activeIndex, onActiveIndexChange }: Props) {
  const elementRef = useRef<SVGSVGElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const width = (value: number) => value / data.stages[0].value * 290

  return (
    <svg ref={elementRef} className={`project-funnel-graphic${revealed ? ' is-revealed' : ''}`} viewBox="0 0 340 320" preserveAspectRatio="none" aria-hidden="true">
      {data.stages.map((stage, index) => {
        const top = index * stageHeight + 6
        const bottom = (index + 1) * stageHeight - 6
        const halfWidth = width(stage.value) / 2
        const nextHalfWidth = width(data.stages[index + 1]?.value ?? stage.value) / 2
        const active = index === activeIndex
        return (
          <g key={stage.id} className={`project-funnel-segment${active ? ' is-active' : ''}`} style={{ '--stage-color': `var(--funnel-stage-${index + 1})` } as CSSProperties}>
            <path
              className="project-funnel-shape"
              d={roundedSegmentPath(top, bottom, halfWidth, nextHalfWidth)}
              vectorEffect="non-scaling-stroke"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
            <line className="project-funnel-leader" x1={center + (halfWidth + nextHalfWidth) / 2 + 8} x2="340" y1={index * stageHeight + 40} y2={index * stageHeight + 40} vectorEffect="non-scaling-stroke" />
            <rect className="project-funnel-hit" x="0" y={index * stageHeight} width="340" height={stageHeight} fill="transparent" onPointerEnter={() => onActiveIndexChange(index)} onClick={() => onActiveIndexChange(index)} />
          </g>
        )
      })}
    </svg>
  )
}
