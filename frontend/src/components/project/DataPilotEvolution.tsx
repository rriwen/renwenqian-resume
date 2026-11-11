import { useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import { CaseStudyGallery, CaseStudyPlaceholder } from './CaseStudyMedia'

/** Deliberately manual: readers keep control of the stage and screenshot. */
export function DataPilotEvolution({ section }: { section: DataPilotSection }) {
  const [selected, setSelected] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const media = section.evolutionMedia ?? []
  return <div className="datapilot-evolution">
    <div role="tablist" aria-label={section.title} aria-orientation="vertical">
      {media.map((item, index) => {
        const description = section.bullets?.[index] ?? item.caption
        const separator = description.search(/[：:]/)
        const title = separator >= 0 ? description.slice(0, separator) : description
        return <button key={item.caption} type="button" role="tab"
          id={`evolution-tab-${index}`} aria-controls="evolution-panel" aria-selected={selected === index}
          tabIndex={selected === index ? 0 : -1} ref={node => { buttons.current[index] = node }}
          onClick={() => setSelected(index)} onKeyDown={event => {
            const next = event.key === 'ArrowDown' ? (index + 1) % media.length
              : event.key === 'ArrowUp' ? (index + media.length - 1) % media.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? media.length - 1 : null
            if (next === null) return
            event.preventDefault()
            setSelected(next)
            buttons.current[next]?.focus()
          }}>
          <span className="datapilot-evolution-name"><span className="datapilot-evolution-label"><span className="datapilot-tab-number" aria-hidden="true">{index + 1}</span>{title}</span><CaretDown size={16} aria-hidden="true" /></span>
          {selected === index && <span className="datapilot-evolution-description" role="list">
            {description.slice(separator + 1).trim().split(/(?<=[。.!?])\s*(?=[^”’"'])/u).filter(Boolean).map((point, pointIndex, points) =>
              <span role="listitem" key={pointIndex}>{pointIndex < points.length - 1 ? point.replace(/[。.!?]$/, point.endsWith('。') ? '；' : ';') : point}</span>
            )}
          </span>}
        </button>
      })}
    </div>
    <div id="evolution-panel" role="tabpanel" aria-labelledby={`evolution-tab-${selected}`} tabIndex={0}>
      {media[selected]?.src
        ? <CaseStudyGallery items={[{ src: media[selected].src!, caption: media[selected].caption, hideCaption: true }]} />
        : <CaseStudyPlaceholder title={section.designPlaceholder ?? media[selected]?.caption} />}
    </div>
  </div>
}
