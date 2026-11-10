import type { DataPilotSection } from '../../data/projects/dataPilot'
import { DetailTable } from './DetailTable'

export function DataPilotPocSection({ section }: { section: DataPilotSection }) {
  const titleId = `${section.id}-title`
  return (
    <section id={section.id} className="project-detail-section" aria-labelledby={titleId}>
      <div className="project-detail-section-copy">
        <h2 id={titleId}>{section.title}</h2>
        <p className="datapilot-poc-intro">{section.intro}</p>
        {section.body.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.table && <DetailTable table={section.table} titleId={titleId} />}
        {section.steps && <ol className="datapilot-poc-flow" aria-labelledby={titleId}>
          {section.steps.map((step, index) => <li key={step.title}>
            <span className="datapilot-poc-step" aria-hidden="true">{index + 1}</span>
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
          </li>)}
        </ol>}
        {section.bullets && <ul className="project-detail-subsection-list">
          {section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
        </ul>}
      </div>
    </section>
  )
}
