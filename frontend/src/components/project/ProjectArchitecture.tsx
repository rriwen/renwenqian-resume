import { MeshGradientBackground } from './MeshGradientBackground'
import type { ProjectArchitectureData } from '../../data/projectDetails'

type ProjectArchitectureProps = {
  architecture: ProjectArchitectureData
}

export function ProjectArchitecture({ architecture }: ProjectArchitectureProps) {
  return (
    <figure
      className="project-architecture project-hero-gradient"
      aria-label={architecture.title}
    >
      <MeshGradientBackground speed={0.4} />
      <ol className="project-architecture-layers" role="list">
        {architecture.layers.map(layer => (
          <li
            key={layer.id}
            className={`project-architecture-layer project-architecture-layer--${layer.id}`}
          >
            <div className="project-architecture-layer-label">
              <strong className="project-architecture-layer-title">{layer.title}</strong>
              {layer.description && <span className="project-architecture-layer-description">{layer.description}</span>}
            </div>
            <ul className="project-architecture-nodes" role="list">
              {layer.nodes.map(node => (
                <li key={node.id} className={`project-architecture-node project-architecture-node--${node.status ?? 'existing'}${node.span === 'full' ? ' project-architecture-node--full' : ''}`}  aria-label={`${node.title}：${node.description ?? (node.status === 'planned' ? '待建设' : '已有实践')}`} title={node.description}>
                  <strong className="project-architecture-node-title">{node.title}</strong>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </figure>
  )
}
