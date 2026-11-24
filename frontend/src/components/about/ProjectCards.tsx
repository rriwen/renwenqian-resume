import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import type { AboutContent } from '../../content/about/parseAboutContent'
import type { Locale } from '../../i18n/translations'
import { renderMarkdownInline } from './renderMarkdownInline'
import { bodyText, workArticleList, proseColumn } from './styles'

const projectPaths: Record<string, string> = {
  analytics: '/project/dataagent',
  'design-engineering': '/project/aidesignsystem',
  'database-operations': '/project/databaseops',
  'data-development': '/project/datadevelop',
}

function ProjectBackground({ content, label }: { content: string; label: string }) {
  const text = content.replace(/^(?:\*\*)?(?:项目背景|背景|内容|Project background|Content)[:：]?(?:\*\*)?\s*/i, '')
  return (
    <>
      <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}><strong>{label}</strong></p>
      <ReactMarkdown components={{
        p: ({ children }) => <p style={{ ...bodyText, color: 'var(--text)', marginTop: 0, marginBottom: 'var(--space-5)' }}>{children}</p>,
        ul: ({ children }) => <ul style={{ ...workArticleList, marginTop: 0, marginBottom: 'var(--space-5)' }}>{children}</ul>,
        li: ({ children }) => <li style={{ marginBottom: 'var(--space-2)' }}>{children}</li>,
      }}>{text}</ReactMarkdown>
    </>
  )
}

export function ProjectCards({ projects, locale: _locale }: { projects: AboutContent['projects']; locale: Locale }) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  return (
    <div className="about-project-cards">
      {projects.map((project) => {
        const expanded = expandedProjects.has(project.id)
        const ResponsibilitiesList = project.responsibilitiesOrdered ? 'ol' : 'ul'
        return (
          <article key={project.id} id={`about-project-${project.id}`} className="about-project-card">
            <div className={`about-project-card-header${projectPaths[project.id] ? ' has-detail-link' : ''}`}>
            <button
              type="button"
              className="about-project-card-toggle"
              aria-expanded={expanded}
              aria-controls={`about-project-${project.id}-content`}
              onClick={() =>
                setExpandedProjects((current) => {
                  const next = new Set(current)
                  if (next.has(project.id)) next.delete(project.id)
                  else next.add(project.id)
                  return next
                })
              }
            >
              <span className="about-project-card-heading">
                <strong>{renderMarkdownInline(project.title)}</strong>
                <span className="about-project-card-meta">
                  {renderMarkdownInline(project.role)}
                  <span aria-hidden="true"> {'|'} </span>
                  {renderMarkdownInline(project.period)}
                </span>
              </span>
              <span className={`about-section-toggle-icon${expanded ? ' is-expanded' : ''}`} aria-hidden="true" />
            </button>
            {projectPaths[project.id] && (
              <a className="ui-button about-project-detail-link" href={projectPaths[project.id]} aria-label={`查看${project.title}详情`} title="查看详情">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            )}
            </div>
            <div id={`about-project-${project.id}-content`} hidden={!expanded} className="about-project-card-content" style={proseColumn}>
              {expanded && <>
                <ProjectBackground label={(project.id === 'design-engineering' ? '项目背景' : (['analytics', 'database-operations', 'data-development'].includes(project.id) ? '背景目标' : '背景与目标'))} content={[project.content.trim(), project.goal.trim()].filter(Boolean).join(' ')} />
                <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}><strong>{(['analytics', 'database-operations', 'data-development', 'design-engineering'].includes(project.id) ? '我的职责' : '我主要负责')}</strong></p>
                {project.responsibilities.length > 0 ? (
                  <ResponsibilitiesList style={{ ...workArticleList, marginTop: 0 }}>
                    {project.responsibilities.map((item, itemIndex) => <li key={itemIndex} style={{ marginBottom: itemIndex < project.responsibilities.length - 1 ? 'var(--space-2)' : 0 }}>{renderMarkdownInline(item)}</li>)}
                  </ResponsibilitiesList>
                ) : null}
                {project.achievements.length > 0 ? (
                  <>
                    <p style={{ ...bodyText, margin: 'var(--space-6) 0 var(--space-2)' }}><strong>业绩</strong></p>
                    <div className="about-project-achievements">
                      {project.achievements.map((item, itemIndex) => <p key={itemIndex} style={{ ...bodyText, margin: itemIndex > 0 ? 'var(--space-2) 0 0' : 0 }}>{renderMarkdownInline(item)}</p>)}
                    </div>
                  </>
                ) : null}
              </>}
            </div>
          </article>
        )
      })}
    </div>
  )
}

