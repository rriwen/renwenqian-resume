import { useRef, useState } from 'react'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import { ProjectLightbox } from './ProjectLightbox'

export function DataPilotWorkflow({ workflow }: { workflow: NonNullable<DataPilotSection['workflow']> }) {
  const [open, setOpen] = useState(false)
  const linkRef = useRef<HTMLButtonElement>(null)
  return <>
    <p>{workflow.summary}（<button ref={linkRef} type="button" className="datapilot-workflow-link" onClick={() => setOpen(true)}>Agent 工作流</button>）</p>
    {open && <ProjectLightbox items={[workflow.image]} index={0} onChange={() => {}} onClose={() => setOpen(false)} returnFocusTo={linkRef.current} />}
  </>
}
