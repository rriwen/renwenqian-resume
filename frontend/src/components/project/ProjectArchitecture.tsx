import type { ProjectArchitectureData } from '../../data/projectDetails'

type ProjectArchitectureProps = {
  architecture: ProjectArchitectureData
}

export function ProjectArchitecture({ architecture }: ProjectArchitectureProps) {
  return (
    <figure
      className="project-architecture"
      aria-label={architecture.title}
    >
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
                <li key={node.id} className="project-architecture-node">
                  <strong className="project-architecture-node-title">{node.title}</strong>
                  {node.description && <span className="project-architecture-node-description">{node.description}</span>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </figure>
  )
}
