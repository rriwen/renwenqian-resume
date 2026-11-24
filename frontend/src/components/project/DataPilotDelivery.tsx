import type { DataPilotSection } from '../../data/projects/dataPilot'

export function DataPilotDelivery({ steps }: {
  steps: NonNullable<DataPilotSection['steps']>
}) {
  return <div className="datapilot-delivery">
    <ol className="datapilot-delivery-path">
      {steps.map(step => <li key={step.title}>
        <h3>{step.title}</h3>
        <p>{step.detail}</p>
      </li>)}
    </ol>
  </div>
}
