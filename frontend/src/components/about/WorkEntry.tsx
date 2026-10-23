import type { AboutWorkEntry } from '../../content/about/parseAboutContent'
import { renderMarkdownInline } from './renderMarkdownInline'
import { anchorTarget, workArticleHeader, workArticleList, workArticleMeta, proseColumn, workArticleTitle } from './styles'

// Presentation belongs to stable content IDs, never to array order or translated titles.
export const PROJECTS_WORK_ID = 'oceanbase'
const PARAGRAPH_WORK_IDS = new Set(['leishu', 'puhuai'])

export function WorkEntry({ entry }: { entry: AboutWorkEntry }) {
  const hasProjects = entry.id === PROJECTS_WORK_ID
  return (
    <article
      id={`work-${entry.id}`}
      style={{
        ...anchorTarget,
        marginTop: hasProjects ? 'var(--space-8)' : 'var(--space-10)',
        ...(hasProjects ? {} : { paddingTop: 'var(--space-8)' }),
      }}
    >
      <div style={proseColumn}>
        <header style={workArticleHeader}>
          <h3 style={workArticleTitle}>{renderMarkdownInline(entry.title)}</h3>
          <p style={workArticleMeta}>
            {renderMarkdownInline(entry.meta)}
            <span aria-hidden="true"> {'|'} </span>
            {renderMarkdownInline(entry.period)}
          </p>
        </header>
        <ul style={{
          ...workArticleList,
          ...(hasProjects ? { marginBottom: 'var(--space-4)' } : {}),
          ...(PARAGRAPH_WORK_IDS.has(entry.id) ? { listStyle: 'none', paddingLeft: 0 } : {}),
        }}>
          {entry.bullets.map((item, index) => (
            <li key={item} style={{ marginBottom: index < entry.bullets.length - 1 ? 'var(--space-3)' : 0 }}>
              {renderMarkdownInline(item)}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
