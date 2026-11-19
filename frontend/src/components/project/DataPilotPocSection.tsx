import type { DataPilotSection } from '../../data/projects/dataPilot'
import { DetailTable } from './DetailTable'
import { MeshGradientBackground } from './MeshGradientBackground'

export function DataPilotPocSection({ section }: { section: DataPilotSection }) {
  const titleId = `${section.id}-title`
  const bulletLayout = section.id === 'poc-validation' ? 'datapilot-poc-stage-cards'
    : section.id === 'poc-demo-data' ? 'datapilot-poc-data-principles' : 'project-detail-subsection-list'
  const separateBulletTitle = bulletLayout !== 'project-detail-subsection-list'
  return (
    <section id={section.id} className="project-detail-section" aria-labelledby={titleId}>
      <div className="project-detail-section-copy">
        {section.intro && <>
          <h2>背景</h2>
          <p className="datapilot-poc-intro">{section.intro}</p>
        </>}
        <h2 id={titleId}>{section.title}</h2>
        {section.body.split('\n\n').map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.beforeTable && <p className="datapilot-poc-note">{section.beforeTable}</p>}
        {section.table && <DetailTable table={section.table} titleId={titleId} />}
        {section.steps && <div className="datapilot-journey datapilot-journey--paths datapilot-poc-diagram">
          <MeshGradientBackground speed={0.4} />
          <ol className="datapilot-poc-flow" aria-labelledby={titleId}>
          {section.steps.map((step, index) => <li key={step.title}>
            {index > 0 && <svg className="datapilot-path-connector" viewBox="0 0 40 16" aria-hidden="true">
              <path className="datapilot-path-track" d="M 0 8 H 38" />
              <path className="datapilot-path-arrow" d="m 32 3 6 5 -6 5" />
            </svg>}
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
          </li>)}
          </ol>
        </div>}
        {section.bullets && <ul className={bulletLayout}>
          {section.bullets.map(bullet => {
            const separator = bullet.indexOf('：')
            return <li key={bullet}>{separator < 0 ? bullet : <><strong>{bullet.slice(0, separator + (separateBulletTitle ? 0 : 1))}</strong><span>{bullet.slice(separator + 1)}</span></>}</li>
          })}
        </ul>}
        {section.afterTable && <p>{section.afterTable}</p>}
      </div>
    </section>
  )
}
