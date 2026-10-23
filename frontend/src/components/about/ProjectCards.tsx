import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import type { AboutContent } from '../../content/about/parseAboutContent'
import type { Locale } from '../../i18n/translations'
import { renderMarkdownInline } from './renderMarkdownInline'
import { bodyText, workArticleList, proseColumn } from './styles'

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

export function ProjectCards({ projects, locale }: { projects: AboutContent['projects']; locale: Locale }) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

  return (
    <div className="about-project-cards">
      {projects.map((project) => {
        const expanded = expandedProjects.has(project.id)
        const ResponsibilitiesList = project.responsibilitiesOrdered ? 'ol' : 'ul'
        const AchievementsList = project.achievementsOrdered ? 'ol' : 'ul'
        return (
          <article key={project.id} id={`about-project-${project.id}`} className="about-project-card">
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
            <div id={`about-project-${project.id}-content`} hidden={!expanded} className="about-project-card-content" style={proseColumn}>
              {expanded && <>
                <ProjectBackground label={locale === 'zh' ? (project.id === 'analytics' ? '背景目标' : '背景与目标') : 'Background and goal'} content={[project.content.trim(), project.goal.trim()].filter(Boolean).join(' ')} />
                <p style={{ ...bodyText, marginBottom: 'var(--space-2)' }}><strong>{locale === 'zh' ? (project.id === 'analytics' ? '我的职责' : '我主要负责') : 'Responsibilities'}</strong></p>
                {project.responsibilities.length > 0 ? (
                  <ResponsibilitiesList style={{ ...workArticleList, marginTop: 0 }}>
                    {project.responsibilities.map((item, itemIndex) => <li key={itemIndex} style={{ marginBottom: itemIndex < project.responsibilities.length - 1 ? 'var(--space-2)' : 0 }}>{renderMarkdownInline(item)}</li>)}
                  </ResponsibilitiesList>
                ) : null}
                <p style={{ ...bodyText, margin: 'var(--space-6) 0 var(--space-2)' }}><strong>{locale === 'zh' ? (project.id === 'analytics' ? '业绩成果' : '业绩') : 'Achievements'}</strong></p>
                {project.achievements.length > 0 ? (
                  <AchievementsList className="about-project-achievements" style={{ ...workArticleList, marginTop: 0, marginBottom: 0 }}>
                    {project.achievements.map((item, itemIndex) => <li key={itemIndex} style={{ marginBottom: itemIndex < project.achievements.length - 1 ? 'var(--space-2)' : 0 }}>{renderMarkdownInline(item)}</li>)}
                  </AchievementsList>
                ) : null}
              </>}
            </div>
          </article>
        )
      })}
    </div>
  )
}

