import type { DataPilotSection } from '../../data/projects/dataPilot'

export function DataPilotDelivery({ steps }: {
  steps: NonNullable<DataPilotSection['steps']>
}) {
  return <div className="datapilot-delivery">
    <ol className="datapilot-delivery-path">
      {steps.map(step => <li key={step.title}>
        <h3>{step.title}</h3>
        <ul className="datapilot-delivery-points">
          {step.detail.split('\n').filter(Boolean).map(point => <li key={point}>{point}</li>)}
        </ul>
      </li>)}
    </ol>
  </div>
}
