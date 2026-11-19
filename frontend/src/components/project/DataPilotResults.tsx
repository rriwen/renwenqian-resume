import type { DataPilotSection } from '../../data/projects/dataPilot'

export function DataPilotResults({ result, description, formula }: {
  result: NonNullable<DataPilotSection['adoptionResult']>
  description: string
  formula: string
}) {
  return <figure className="datapilot-results" aria-label={description}>
    <p>{description}</p>
    <p className="datapilot-results-formula">{formula}</p>
    <div className="datapilot-results-comparison">
      {[{ label: result.beforeLabel, value: result.before }, { label: result.afterLabel, value: result.after }].map((item, index) =>
        <div className={`datapilot-result-pair${index === 1 ? ' is-current' : ''}`} key={item.label}>
          <dl><dt>{item.label}</dt><dd>{item.value}<span>%</span></dd></dl>
          <svg className="datapilot-result-ring" viewBox="0 0 80 80" aria-hidden="true">
            <circle className="datapilot-result-ring-track" cx="40" cy="40" r="32" />
            <circle className="datapilot-result-ring-value" cx="40" cy="40" r="32" pathLength="100" strokeDasharray={`${item.value} ${100 - item.value}`} transform="rotate(-90 40 40)" />
          </svg>
        </div>
      )}
    </div>
  </figure>
}
