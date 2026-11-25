import { ArrowUpRight } from '@phosphor-icons/react'
import type { AboutWorkEntry, AboutProjectEntry } from '../../content/about/parseAboutContent'
import { renderMarkdownInline } from './renderMarkdownInline'
import { getProjectBySlug } from '../../data/projects'

const projectSlugs: Record<string, string> = {
  analytics: 'dataagent',
  'design-engineering': 'aidesignsystem',
  'database-operations': 'databaseops',
  'data-development': 'datadevelop',
}

export function WorkEntry({ entry, projects = [] }: { entry: AboutWorkEntry; projects?: AboutProjectEntry[] }) {
  return (
    <article id={`work-${entry.id}`} className="about-career-entry">
      <div className="about-career-content">
        <h3>{renderMarkdownInline(entry.meta)}</h3>
        <p className="about-career-role">
          {renderMarkdownInline(entry.title)}
          <span className="about-career-separator"> | </span>
          <span>{renderMarkdownInline(entry.period)}</span>
        </p>
        {entry.summary && <p className="about-career-summary">{renderMarkdownInline(entry.summary)}</p>}
        {entry.id === 'oceanbase' && projects.length > 0 && (
          <ul className="about-career-projects" aria-label="蚂蚁集团项目经历">
            {projects.filter(project => projectSlugs[project.id]).map(project => (
              <li key={project.id}>
                <a href={`/project/${projectSlugs[project.id]}`}>
                  <span className="about-career-project-info">
                    <span className="about-career-project-title">{getProjectBySlug(projectSlugs[project.id])?.title ?? project.title}</span>
                    <span className="about-career-project-meta">
                      {project.role}
                    </span>
                  </span>
                  <ArrowUpRight className="about-career-project-arrow" size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
