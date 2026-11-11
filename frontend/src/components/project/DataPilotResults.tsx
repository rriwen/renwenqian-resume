import type { DataPilotSection } from '../../data/projects/dataPilot'

export function DataPilotResults({ result, description, formula }: {
  result: NonNullable<DataPilotSection['adoptionResult']>
  description: string
  formula: string
}) {
  return <figure className="datapilot-results" aria-label={description}>
    <p>{description}</p>
    <div className="datapilot-results-comparison">
      {[{ label: result.beforeLabel, value: result.before }, { label: result.afterLabel, value: result.after }].map((item, index) =>
        <div className={`datapilot-result-pair${index === 1 ? ' is-current' : ''}`} key={item.label}>
          <dl><dt>{item.label}</dt><dd>{item.value}<span>%</span></dd></dl>
          <div className="datapilot-result-column" aria-hidden="true"><span style={{ height: `${item.value}%` }} /></div>
        </div>
      )}
    </div>
    <figcaption>{formula}</figcaption>
  </figure>
}
