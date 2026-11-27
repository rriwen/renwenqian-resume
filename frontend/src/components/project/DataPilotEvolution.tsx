import { useId, useRef, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import { CaseStudyGallery, CaseStudyPlaceholder } from './CaseStudyMedia'

/** Readers manually choose the explanation and corresponding image. */
export function DataPilotEvolution({ section }: { section: DataPilotSection }) {
  const instanceId = useId()
  const media = section.evolutionMedia ?? []
  const lightboxItems = media.filter(item => item.src).map(item => ({ src: item.src!, caption: item.caption }))
  const [selected, setSelected] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  return <div className="datapilot-evolution">
    <div role="tablist" aria-label={section.title} aria-orientation="vertical">
      {media.map((item, index) => {
        const description = section.bullets?.[index] ?? item.caption
        const separator = description.search(/[：:]/)
        const title = item.title ?? (separator >= 0 ? description.slice(0, separator) : description)
        const stageTitle = title.match(/^(早期|探索|当前)\s*·\s*(.+)$/)
        return <button key={item.caption} type="button" role="tab" style={{ order: index * 2 }}
          id={`${instanceId}-tab-${index}`} aria-controls={`${instanceId}-panel`} aria-selected={selected === index}
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
          <span className="datapilot-evolution-name"><span className="datapilot-evolution-label">{stageTitle && <span className="datapilot-evolution-stage">{stageTitle[1]}</span>}<span>{stageTitle?.[2] ?? title}</span></span><CaretDown size={16} aria-hidden="true" /></span>
          {selected === index && <span className="datapilot-evolution-description" onClick={event => event.stopPropagation()}>
            <span className="datapilot-evolution-summary">{item.description ?? description.slice(separator + 1).trim()}</span>
            <span className="datapilot-evolution-tradeoffs" role="list" aria-label="优势与问题">
              {item.tradeoffs?.map(point => <span role="listitem" key={point.text}>
                <span className="datapilot-evolution-mark" data-kind={point.kind} role="img" aria-label={point.kind === 'advantage' ? '优势' : '问题'}>{point.kind === 'advantage' ? '✓' : '✕'}</span>
                <span>{point.text}</span>
              </span>)}
            </span>
          </span>}
        </button>
      })}
    </div>
    <div id={`${instanceId}-panel`} style={{ order: selected * 2 + 1 }} data-stage={media[selected]?.title?.startsWith('当前') ? 2 : media[selected]?.title?.startsWith('探索') ? 1 : 0} role="tabpanel" aria-labelledby={`${instanceId}-tab-${selected}`} tabIndex={0}>
      {media[selected]?.src
        ? <CaseStudyGallery lightboxItems={lightboxItems} items={[{ src: media[selected].src!, caption: media[selected].caption, hideCaption: true }]} />
        : <CaseStudyPlaceholder title={section.designPlaceholder ?? media[selected]?.caption} />}
    </div>
  </div>
}
