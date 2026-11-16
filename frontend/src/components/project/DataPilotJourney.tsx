import { MeshGradientBackground } from './MeshGradientBackground'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import { useEffect, useRef, useState } from 'react'

export function DataPilotJourney({ diagram }: { diagram: NonNullable<DataPilotSection['diagram']> }) {
  const figureRef = useRef<HTMLElement>(null)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (diagram.kind !== 'paths' || !figureRef.current) return
    let visible = false
    const sync = () => setRunning(visible && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(figureRef.current)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync) }
  }, [diagram.kind])
  return <figure ref={figureRef} className={`datapilot-journey datapilot-journey--${diagram.kind}`} data-running={running} aria-label={diagram.caption}>
    {diagram.kind === 'paths' && <MeshGradientBackground speed={0.4} />}
    <div className="datapilot-journey-lanes">
      {diagram.lanes.map((lane, laneIndex) => <div className="datapilot-journey-lane" key={lane.title}>
        <h3>{lane.title}</h3>
        {lane.summary && <p className="datapilot-path-summary">{lane.summary}</p>}
        <div>
        <ol style={diagram.kind === 'paths' ? { gridTemplateColumns: lane.steps.length === 4 ? '80px minmax(0, 2fr) minmax(0, 5fr) 80px' : `80px repeat(${lane.steps.length - 2}, minmax(0, 1fr)) 80px` } : undefined}>{lane.steps.map((step, index) => <li key={step.title} data-actor={step.actor} aria-label={step.actorLabel ? `${step.actorLabel}：${step.title}` : undefined}>
          {diagram.kind === 'paths' && index > 0 && <svg className="datapilot-path-connector" viewBox="0 0 40 16" aria-hidden="true">
            <path className="datapilot-path-track" d="M 0 8 H 38" />
            <path className="datapilot-path-pulse" d="M 0 8 H 38" pathLength="100" />
            <path className="datapilot-path-arrow" d="m 32 3 6 5 -6 5" />
          </svg>}
          <strong>{step.title}</strong>
          {step.detail && <p>{step.detail}</p>}
          {step.response && <p className="datapilot-journey-response">{step.response}</p>}
        </li>)}</ol>
        {diagram.kind === 'paths' && lane.processingLabel && <>
          <div className="datapilot-path-guide" aria-hidden="true"><span /></div>
          <p className="datapilot-path-note" data-tone={laneIndex === 0 ? 'problem' : 'benefit'}><span aria-hidden="true">{laneIndex === 0 ? '✕' : '✓'}</span>{lane.processingLabel}</p>
        </>}
        </div>
      </div>)}
    </div>
    {diagram.kind === 'paths' && <div className="datapilot-path-legend">
      {Array.from(new Map(diagram.lanes.flatMap(lane => lane.steps).filter(step => step.actor).map(step => [step.actor, step.actorLabel])).entries()).map(([actor, label]) =>
        <span key={actor}><i data-actor={actor} aria-hidden="true" />{label}</span>)}
    </div>}
    {diagram.kind !== 'paths' && <figcaption>{diagram.caption}</figcaption>}
  </figure>
}
