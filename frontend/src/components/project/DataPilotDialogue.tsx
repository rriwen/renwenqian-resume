import { useId, useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { CaseStudyMediaFrame } from './CaseStudyMedia'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'

type Dialogue = NonNullable<DataPilotSection['dialogue']>
type Frame = Dialogue['visual']['frames'][number]

/** Native diagrams describe the proposal; they do not imitate shipped screenshots. */
export function DataPilotDialogue({ dialogue, locale: _locale }: { dialogue: Dialogue; locale: Locale }) {
  const { decisions, visual } = dialogue
  const [selected, setSelected] = useState(0)
  const id = useId()
  const current = visual.frames[selected]
  const fields = (frame: Frame) => <dl className="dialogue-fields">{frame.fields.map(field => <div key={field.label} data-changed={field.changed || undefined}>
    <dt>{field.label}</dt><dd>{field.value}{field.changed && visual.kind === 'context' && <small>{'本轮替换'}</small>}</dd>
  </div>)}</dl>

  return <div className="datapilot-dialogue">
    {decisions.length > 0 && <ul className="dialogue-design-points">{decisions.map(decision => <li key={decision.title}>{decision.body}</li>)}</ul>}
    <CaseStudyMediaFrame animated index={visual.kind === 'context' ? 0 : visual.kind === 'workspace' ? 1 : 2}>
    <figure className={`dialogue-visual dialogue-visual--${visual.kind}`} aria-labelledby={`${id}-caption`}>
      <figcaption id={`${id}-caption`}>{visual.caption}</figcaption>
      {visual.kind === 'sequence' ? <ol className="dialogue-sequence">{visual.frames.map((frame, index) => <li key={frame.title}>
        <span className="dialogue-step-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <h4>{frame.title}</h4><p>{frame.prompt}</p><p className="dialogue-response">{frame.response}</p>
        {index < visual.frames.length - 1 && <ArrowRight className="dialogue-step-arrow" size={18} aria-hidden="true" />}
      </li>)}</ol> : visual.kind === 'context' ? <>
        <div className="dialogue-selector" role="group" aria-label={visual.caption}>{visual.frames.map((frame, index) => <button
          type="button" key={frame.title} aria-pressed={index === selected} aria-controls={`${id}-state`}
          onClick={() => setSelected(index)}>{index + 1}. {frame.title}</button>)}</div>
        <div className="dialogue-context-state" id={`${id}-state`} aria-live="polite" aria-atomic="true">
          <div className="dialogue-turn"><span>{'本轮请求'}</span><p>{current.prompt}</p><p className="dialogue-response">{current.response}</p></div>
          {fields(current)}
        </div>
      </> : <div className={`dialogue-panels dialogue-panels--${visual.kind}`}>{visual.frames.map((frame, index) => <section className="dialogue-panel" key={frame.title}>
        <div className="dialogue-panel-heading"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h4>{frame.title}</h4></div>
        <p className="dialogue-request">{frame.prompt}</p>
        {fields(frame)}<p className="dialogue-response">{frame.response}</p>
      </section>)}</div>}
      <p className="dialogue-visual-note">{visual.note}</p>
    </figure>
    </CaseStudyMediaFrame>
  </div>
}
