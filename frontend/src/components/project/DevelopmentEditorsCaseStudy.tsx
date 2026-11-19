import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProjectDetail } from '../../data/projectDetails'
import { getProjectBySlug } from '../../data/projects'
import { useLanguage } from '../../i18n/LanguageContext'
import { StandardProjectDetail } from './StandardProjectDetail'

const editors = [
  { id: 'sql', slug: 'datadevelop', title: 'SQL 编辑器' },
  { id: 'workflow', slug: 'workflow-editor', title: '任务流编辑器' },
] as const

/** Keep original case data and deep links while sharing one navigation entry. */
export function DevelopmentEditorsCaseStudy() {
  const { locale } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const active = new URLSearchParams(location.search).get('editor') === 'workflow' ? 1 : 0
  const editor = editors[active]
  const select = (index: number) => {
    if (index === active) return
    const search = new URLSearchParams(location.search)
    search.set('editor', editors[index].id)
    navigate({ pathname: location.pathname, search: search.toString(), hash: '' }, { preventScrollReset: true })
  }
  return <StandardProjectDetail
    project={getProjectBySlug(editor.slug)!}
    detail={getProjectDetail(editor.slug, locale)!}
    presentation={{
      project: getProjectBySlug('datadevelop')!,
      title: '开发编辑器',
      introduction: '围绕数据查询与任务编排，持续打磨 SQL 开发和任务编排的操作体验',
    }}
    panelId={`editor-panel-${editor.id}`}
    labelledBy={`editor-tab-${editor.id}`}
    tabs={<div className="datapilot-part-tabs" role="tablist" aria-label="开发编辑器案例">
      {editors.map((item, index) => <button
        key={item.id}
        ref={node => { buttons.current[index] = node }}
        id={`editor-tab-${item.id}`}
        type="button"
        role="tab"
        aria-selected={index === active}
        aria-controls={`editor-panel-${item.id}`}
        tabIndex={index === active ? 0 : -1}
        className={index === active ? 'is-active' : ''}
        onClick={() => select(index)}
        onKeyDown={event => {
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1
            : ['ArrowLeft', 'ArrowRight'].includes(event.key) ? 1 - index : undefined
          if (next === undefined) return
          event.preventDefault()
          select(next)
          buttons.current[next]?.focus()
        }}
      ><span className="datapilot-tab-number" aria-hidden="true">{index + 1}</span>{item.title}</button>)}
    </div>}
  />
}
