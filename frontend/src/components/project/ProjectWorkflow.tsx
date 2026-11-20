import type { ProjectWorkflowData } from '../../data/projectDetails'
import { MeshGradientBackground } from './MeshGradientBackground'
import '../../styles/components/project-workflow.css'

export function ProjectWorkflow({ workflow }: { workflow: ProjectWorkflowData }) {
  return <>
  <figure className="project-workflow datapilot-journey datapilot-journey--paths" aria-label={workflow.title}>
    <MeshGradientBackground speed={0.4} />
    <div className="project-workflow-ring">
      <ol className="project-workflow-nodes">
        {workflow.steps.map((step, index) => <li className="project-workflow-node" data-step={index + 1} data-participant={index === 0 || index === 5 ? 'user' : 'ai'} key={step.title}>
          <div className="project-workflow-node-heading"><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.title}</strong></div>
          <p>{step.body}</p>
          {step.branch && <div className={`project-workflow-branch${index === 1 ? ' project-workflow-branch--detached' : ''}`}>
            <strong>{step.branch.title}</strong>
          </div>}
          {index < workflow.steps.length - 1 && <span className="project-workflow-arrow" aria-hidden="true" />}
        </li>)}
      </ol>
      <div className="project-workflow-return" aria-hidden="true"><span>重新输入 · 新请求</span></div>
    </div>
    <div className="project-workflow-legend" role="group" aria-label="流程图图例">
      <span><i className="workflow-key-node workflow-key-node--user" aria-hidden="true" />用户</span>
      <span><i className="workflow-key-node" aria-hidden="true" />AI</span>
    </div>
  </figure>
  {workflow.limitation && <p className="project-workflow-limitation"><strong>{workflow.limitation.title}</strong>{workflow.limitation.body}</p>}
  </>
}
