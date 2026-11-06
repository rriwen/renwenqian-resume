import { Fragment, useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowCounterClockwise, ArrowLeft, ArrowUUpLeft, ArrowUUpRight, BracketsCurly, CaretDown, ChatTeardropText, Check, Code, Copy, Database, GearSix, MagnifyingGlass, Moon, PaperPlaneTilt, Play, Plus, Sparkle, Square, Sun, Table, WarningCircle, X } from '@phosphor-icons/react'
import { applyProposal, buildDiff, createProposal, formatSql, getLineRange, INITIAL_SQL, SQL_COMMANDS, type Proposal, type SqlCommand, type SqlRange } from '../components/sql-prototype/model'
import { SqlSyntax } from '../components/sql-prototype/SqlSyntax'
import '../styles/components/sql-prototype.css'

type Stage = 'idle' | 'ready' | 'generating' | 'review' | 'error'
type Scenario = 'success' | 'no-result' | 'network-error'
type Document = { id: number; name: string; sql: string; past: string[]; future: string[] }
type Context = { source: string; range: SqlRange; documentId: number }
const initialDocument = (): Document => ({ id: 1, name: 'customer_analysis.sql', sql: INITIAL_SQL, past: [], future: [] })
const mockRows = [
  ['1001', '陈小雨', '杭州', '2024-12-12 09:42:18'],
  ['1002', '林子墨', '上海', '2024-12-11 16:08:32'],
  ['1003', '王晨', '深圳', '2024-12-10 11:26:05'],
  ['1004', '李思远', '北京', '2024-12-09 14:35:47'],
]

function Tool({ label, children, active, ...props }: { label: string; children: ReactNode; active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`sql-tool${active ? ' is-active' : ''}${props.className ? ` ${props.className}` : ''}`} title={label} aria-label={label}>{children}</button>
}

function AiComposer({ stage, command, prompt, onCommand, onPrompt, onSubmit, onStop, onClose, onAccept, onDismiss, focusKey }: {
  stage: Stage; command: SqlCommand | null; prompt: string; focusKey: number
  onCommand: (command: SqlCommand | null) => void; onPrompt: (prompt: string) => void
  onSubmit: () => void; onStop: () => void; onClose: () => void; onAccept: () => void; onDismiss: () => void
}) {
  const [menu, setMenu] = useState(false)
  const [option, setOption] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => { input.current?.focus() }, [focusKey])
  useEffect(() => {
    if (!menu) return
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setMenu(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [menu])
  const choose = (id: SqlCommand) => { onCommand(id); if (prompt === '/') onPrompt(''); setMenu(false); input.current?.focus() }
  const selected = SQL_COMMANDS.find(item => item.id === command)
  return <div ref={root} className={`sql-ai-panel${stage === 'generating' ? ' is-generating' : ''}`}>
    <div className="sql-ai-input-row">
      <div className="sql-ai-input-border">
        <div className="sql-ai-input-inner">
          {selected && <button type="button" className="sql-command-tag" aria-label={`当前指令：${selected.label}，点击更换`} aria-expanded={menu} onClick={() => { setMenu(!menu); input.current?.focus() }} onKeyDown={event => { if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); onCommand(null); input.current?.focus() } }} disabled={stage === 'generating'}>{selected.label}<CaretDown size={10} /></button>}
          <input ref={input} aria-label="AI 编辑指令" placeholder="描述你的需求，或输入 / 选择指令" value={prompt} disabled={stage === 'generating'} autoComplete="off"
            role="combobox" aria-expanded={menu} aria-controls={menu ? 'sql-command-list' : undefined} aria-activedescendant={menu ? `sql-command-${option}` : undefined}
            onChange={event => { onPrompt(event.target.value); setMenu(event.target.value === '/'); setOption(0) }}
            onKeyDown={event => {
              if (event.nativeEvent.isComposing) return
              if (menu && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setOption(index => (index + (event.key === 'ArrowDown' ? 1 : 3)) % 4) }
              else if (event.key === 'Enter' && !event.metaKey && !event.ctrlKey) { event.preventDefault(); if (menu) choose(SQL_COMMANDS[option].id); else onSubmit() }
              else if (event.key === 'Escape') { event.stopPropagation(); if (menu) setMenu(false); else onClose() }
              else if ((event.key === 'Backspace' || event.key === 'Delete') && !prompt && command) { event.preventDefault(); onCommand(null) }
            }} />
          {stage === 'generating'
            ? <Tool label="终止生成" onClick={onStop}><Square size={16} /></Tool>
            : <Tool label="发送指令 Enter" disabled={!prompt.trim() || prompt === '/'} onClick={onSubmit}><PaperPlaneTilt size={17} /></Tool>}
        </div>
      </div>
      <Tool label="关闭 AI 编辑 Esc" onClick={onClose}><X size={16} /></Tool>
    </div>
    {menu && <div id="sql-command-list" className="sql-command-menu" role="listbox" aria-label="选择 SQL 指令">
      <div className="sql-menu-heading">指令</div>
      {SQL_COMMANDS.map((item, index) => <button id={`sql-command-${index}`} type="button" key={item.id} role="option" aria-selected={option === index} className={option === index ? 'is-selected' : ''} onMouseEnter={() => setOption(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(item.id)}><span>{item.label}</span><small>{item.description}</small></button>)}
    </div>}
    {stage === 'review' ? <div className="sql-review-actions"><button className="sql-primary" onClick={onAccept}><Check size={14} />接受 <kbd>⌘ ↵</kbd></button><button className="sql-text-button" onClick={onDismiss}>忽略 <kbd>⌘ ⌫</kbd></button><span>请审阅下方代码变更</span></div>
      : <div className={`sql-ai-note${stage === 'error' ? ' is-error' : ''}`} role="status" aria-live="polite">{stage === 'generating' ? <><span className="sql-pulse" />AI 生成中…</> : stage === 'error' ? <><WarningCircle size={13} weight="fill" />网络异常，未能获取结果。请重试。</> : 'AI 生成内容的准确性和完整性无法保证，仅供参考'}</div>}
  </div>
}

export function SqlEditorPrototype() {
  const [searchParams] = useSearchParams()
  const embedded = searchParams.get('embed') === '1'
  const [documents, setDocuments] = useState<Document[]>([initialDocument()])
  const [activeId, setActiveId] = useState(1)
  const sequence = useRef(1)
  const doc = documents.find(item => item.id === activeId)!
  const [selection, setSelection] = useState<SqlRange>({ start: INITIAL_SQL.length - 1, end: INITIAL_SQL.length - 1 })
  const [stage, setStage] = useState<Stage>('idle')
  const [mode, setMode] = useState<'inline' | 'sidebar'>('inline')
  const [context, setContext] = useState<Context | null>(null)
  const [command, setCommand] = useState<SqlCommand | null>(null)
  const [prompt, setPrompt] = useState('')
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [scenario, setScenario] = useState<Scenario>('success')
  const [dark, setDark] = useState(false)
  const [fontSize, setFontSize] = useState(13)
  const [settings, setSettings] = useState(false)
  const [search, setSearch] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [scroll, setScroll] = useState({ top: 0, left: 0 })
  const [queryState, setQueryState] = useState<'closed' | 'running' | 'result'>('closed')
  const [focusKey, setFocusKey] = useState(0)
  const [notice, setNotice] = useState('')
  const editor = useRef<HTMLTextAreaElement>(null)
  const aiTimer = useRef<ReturnType<typeof setTimeout>>()
  const queryTimer = useRef<ReturnType<typeof setTimeout>>()
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>()
  const request = useRef(0)
  const panel = useRef<HTMLDivElement>(null)
  const isOpen = stage !== 'idle'
  const lineHeight = fontSize + 11
  const selectedText = doc.sql.slice(selection.start, selection.end)
  const currentLine = doc.sql.slice(0, selection.start).split('\n').length - 1
  const lines = doc.sql.split('\n')
  const targetLine = context ? context.source.slice(0, context.range.start).split('\n').length - 1 : currentLine
  const currentColumn = selection.start - (selection.start === 0 ? 0 : doc.sql.lastIndexOf('\n', selection.start - 1) + 1) + 1
  const displayRows = proposal && mode === 'inline'
    ? buildDiff(proposal.source, applyProposal(proposal.source, proposal) ?? proposal.source)
    : (context?.source ?? doc.sql).split('\n').map(text => ({ kind: 'same' as const, text }))

  const notify = (message: string) => { clearTimeout(noticeTimer.current); setNotice(message); noticeTimer.current = setTimeout(() => setNotice(''), 2800) }
  const updateSql = useCallback((sql: string) => {
    setDocuments(current => current.map(item => item.id === activeId && item.sql !== sql ? { ...item, sql, past: [...item.past, item.sql].slice(-80), future: [] } : item))
  }, [activeId])
  const restoreEditor = (range = selection) => requestAnimationFrame(() => { if (editor.current) { editor.current.focus(); editor.current.setSelectionRange(range.start, range.end) } })
  const cancelGeneration = useCallback(() => { request.current++; clearTimeout(aiTimer.current) }, [])
  const closeAssistant = useCallback(() => { cancelGeneration(); setStage('idle'); setProposal(null); setContext(null); setPrompt(''); setCommand(null); setScroll({ top: 0, left: 0 }) }, [cancelGeneration])
  const openAssistant = useCallback((nextMode: 'inline' | 'sidebar', nextCommand?: SqlCommand) => {
    if (stage === 'generating') return
    if (!context) {
      const range = selection.start !== selection.end ? selection : getLineRange(doc.sql, selection.start)
      setContext({ source: doc.sql, range, documentId: activeId })
      setStage('ready')
    }
    setMode(nextMode); setContextMenu(null); setSettings(false); setSearch(null)
    if (nextCommand) { setCommand(nextCommand); setPrompt(SQL_COMMANDS.find(item => item.id === nextCommand)!.prompt); setProposal(null); setStage('ready') }
    setFocusKey(value => value + 1)
  }, [stage, context, selection, doc.sql, activeId])

  const submit = () => {
    if (!context || !prompt.trim() || prompt === '/' || stage === 'generating') return
    cancelGeneration(); setProposal(null); setStage('generating')
    const id = request.current
    const captured = { ...context, command: command ?? 'generate', prompt, scenario }
    aiTimer.current = setTimeout(() => {
      if (id !== request.current) return
      if (captured.scenario === 'network-error') { setStage('error'); setFocusKey(value => value + 1); return }
      setProposal(createProposal(captured.source, captured.range, captured.command, captured.prompt, captured.scenario === 'no-result'))
      setStage('review')
    }, 1800)
  }
  const stop = () => { cancelGeneration(); setStage('ready'); setProposal(null); setFocusKey(value => value + 1); notify('已终止生成，可以修改指令后重试') }
  const accept = () => {
    if (!proposal || context?.documentId !== activeId) return
    const result = applyProposal(doc.sql, proposal)
    if (result === null) { notify('SQL 已发生变化，请重新生成'); closeAssistant(); return }
    const position = proposal.range.start + proposal.after.length
    updateSql(result); closeAssistant(); setSelection({ start: position, end: position }); restoreEditor({ start: position, end: position }); notify('已接受修改')
  }
  const dismiss = () => { cancelGeneration(); setProposal(null); setStage('ready'); setFocusKey(value => value + 1); notify('已忽略结果，原 SQL 保持不变') }
  const undo = useCallback((redo = false) => {
    closeAssistant()
    setDocuments(current => current.map(item => {
      if (item.id !== activeId) return item
      const list = redo ? item.future : item.past
      if (!list.length) return item
      return { ...item, sql: list[list.length - 1], past: redo ? [...item.past, item.sql] : item.past.slice(0, -1), future: redo ? item.future.slice(0, -1) : [...item.future, item.sql] }
    }))
    setSelection({ start: 0, end: 0 }); setScroll({ top: 0, left: 0 })
  }, [activeId, closeAssistant])
  const runQuery = () => {
    if (!doc.sql.trim() || isOpen) return
    clearTimeout(queryTimer.current); setQueryState('running')
    queryTimer.current = setTimeout(() => setQueryState('result'), 700)
  }
  const reset = () => {
    closeAssistant(); clearTimeout(queryTimer.current); setQueryState('closed'); setDocuments([initialDocument()]); setActiveId(1); setSelection({ start: INITIAL_SQL.length - 1, end: INITIAL_SQL.length - 1 }); setScenario('success'); setContextMenu(null); setSearch(null); setSettings(false); notify('已恢复初始示例')
  }
  const changeDocument = (id: number) => { closeAssistant(); clearTimeout(queryTimer.current); setQueryState('closed'); setActiveId(id); setSelection({ start: 0, end: 0 }); setScroll({ top: 0, left: 0 }) }
  const addDocument = () => {
    const id = ++sequence.current
    setDocuments(current => [...current, { id, name: `query_${id}.sql`, sql: '\n', past: [], future: [] }]); changeDocument(id); restoreEditor({ start: 0, end: 0 })
  }
  const findNext = () => {
    if (!search) return
    const lower = doc.sql.toLowerCase()
    let index = lower.indexOf(search.toLowerCase(), selection.end)
    if (index < 0) index = lower.indexOf(search.toLowerCase())
    if (index < 0) { notify('没有找到匹配内容'); return }
    const range = { start: index, end: index + search.length }; setSelection(range); restoreEditor(range)
  }
  const formatDocument = () => { if (!isOpen) { updateSql(formatSql(doc.sql)); notify('已格式化 SQL') } }

  useEffect(() => {
    const title = document.title; document.title = 'Text2SQL · SQL 编辑器交互原型'
    return () => { document.title = title; clearTimeout(aiTimer.current); clearTimeout(queryTimer.current); clearTimeout(noticeTimer.current); request.current++ }
  }, [])
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey
      if (modifier && ['k', 'l'].includes(event.key.toLowerCase())) { event.preventDefault(); openAssistant(event.key.toLowerCase() === 'k' ? 'inline' : 'sidebar') }
      else if (modifier && event.key === 'Enter') { event.preventDefault(); if (stage === 'review') accept(); else if (!isOpen) runQuery() }
      else if (modifier && event.key === 'Backspace' && stage === 'review') { event.preventDefault(); dismiss() }
      else if (event.key === 'Escape') { if (contextMenu) setContextMenu(null); else if (settings) setSettings(false); else if (search !== null) setSearch(null); else if (isOpen) { closeAssistant(); restoreEditor() } }
      else if (modifier && event.key.toLowerCase() === 'f' && !isOpen) { event.preventDefault(); setSearch('') }
      else if (modifier && event.key.toLowerCase() === 'z' && document.activeElement === editor.current) { event.preventDefault(); undo(event.shiftKey) }
    }
    window.addEventListener('keydown', keyboard)
    return () => window.removeEventListener('keydown', keyboard)
  })
  useEffect(() => {
    if (!contextMenu && !settings) return
    const close = () => { setContextMenu(null); setSettings(false) }
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [contextMenu, settings])
  useEffect(() => {
    if (isOpen && mode === 'inline') panel.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
  }, [isOpen, mode])

  const composer = <AiComposer stage={stage} command={command} prompt={prompt} onCommand={value => { setCommand(value); if (stage === 'review' || stage === 'error') { setProposal(null); setStage('ready') } }} onPrompt={value => { setPrompt(value); if (stage === 'review' || stage === 'error') { setProposal(null); setStage('ready') } }} onSubmit={submit} onStop={stop} onClose={() => { closeAssistant(); restoreEditor() }} onAccept={accept} onDismiss={dismiss} focusKey={focusKey} />
  let lineNumber = 0
  return <main className="sql-prototype" data-prototype-theme={dark ? 'dark' : 'light'} style={{ '--sql-font-size': `${fontSize}px`, '--sql-line-height': `${lineHeight}px` } as CSSProperties}>
    <header className="sql-demo-header">
      <div className="sql-demo-title">{!embedded && <Link to="/project/text2sql" aria-label="返回 Text2SQL 项目详情" title="返回项目详情"><ArrowLeft size={18} /></Link>}<span>Text2SQL</span><span className="sql-header-divider" /><h1>SQL 编辑器</h1><span className="sql-prototype-badge">交互原型</span></div>
      <div className="sql-demo-controls"><label className="sql-scenario">响应场景<CaretDown size={12} /><select aria-label="模拟响应场景" value={scenario} onChange={event => setScenario(event.target.value as Scenario)} disabled={stage === 'generating'}><option value="success">正常生成</option><option value="no-result">无法生成</option><option value="network-error">网络异常</option></select></label><Tool label="重置演示" onClick={reset}><ArrowCounterClockwise size={17} /></Tool><Tool label={dark ? '切换浅色原型' : '切换深色原型'} onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</Tool></div>
    </header>
    <section className="sql-workbench" aria-label="SQL 工作台">
      <div className="sql-tabbar"><div className="sql-tabs" role="tablist" aria-label="SQL 文件">{documents.map(item => <button type="button" key={item.id} role="tab" aria-selected={activeId === item.id} className={activeId === item.id ? 'is-active' : ''} onClick={() => changeDocument(item.id)}><span className="sql-file-icon">SQL</span>{item.name}{item.past.length > 0 && <span className="sql-dirty-dot" title="已编辑" />}</button>)}</div><Tool label="新建 SQL 文件" onClick={addDocument}><Plus size={16} /></Tool><span className="sql-local-badge"><span />本地演示</span></div>
      <div className="sql-toolbar">
        <div className="sql-toolbar-group"><Tool label="运行 SQL · 模拟结果 ⌘Enter" disabled={isOpen || !doc.sql.trim() || queryState === 'running'} onClick={runQuery}><Play size={17} /></Tool><Tool label="停止运行" disabled={queryState !== 'running'} onClick={() => { clearTimeout(queryTimer.current); setQueryState('closed'); notify('已停止运行') }}><Square size={16} /></Tool><span className="sql-toolbar-separator" /><Tool label="撤销 ⌘Z" disabled={!doc.past.length} onClick={() => undo()}><ArrowUUpLeft size={17} /></Tool><Tool label="重做 ⇧⌘Z" disabled={!doc.future.length} onClick={() => undo(true)}><ArrowUUpRight size={17} /></Tool><span className="sql-toolbar-separator" /><Tool label="格式化 SQL" disabled={isOpen} onClick={formatDocument}><BracketsCurly size={18} /></Tool><Tool label="查找 ⌘F" disabled={isOpen} onClick={() => setSearch(search === null ? '' : null)}><MagnifyingGlass size={17} /></Tool><span className="sql-toolbar-separator" /><Tool label="AI 编辑 ⌘K" active={isOpen && mode === 'inline'} onClick={() => openAssistant('inline')}><Sparkle size={18} /></Tool><Tool label="AI 对话 ⌘L" active={isOpen && mode === 'sidebar'} onClick={() => openAssistant('sidebar')}><ChatTeardropText size={18} /></Tool></div>
        <div className="sql-settings"><Tool label="编辑器设置" active={settings} onPointerDown={event => event.stopPropagation()} onClick={() => setSettings(!settings)}><GearSix size={17} /></Tool>{settings && <div className="sql-settings-popover" onPointerDown={event => event.stopPropagation()}><span>代码字号</span><div>{[12, 13, 15].map(size => <button key={size} className={fontSize === size ? 'is-active' : ''} onClick={() => setFontSize(size)}>{size}px</button>)}</div></div>}</div>
      </div>
      <div className="sql-workspace-body">
        <div className="sql-editor-column">
          <div className="sql-database"><Database size={16} weight="duotone" /><select aria-label="当前示例数据库" defaultValue="demo_database"><option value="demo_database">demo_database</option><option value="analytics_demo">analytics_demo</option></select><span className="sql-database-separator">/</span><span>查询窗口</span><span className="sql-connection-dot" /><span className="sql-simulation-label">模拟连接</span></div>
          {search !== null && <div className="sql-search"><MagnifyingGlass size={14} /><input autoFocus aria-label="查找 SQL 文本" value={search} placeholder="查找" onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') findNext() }} /><button onClick={findNext}>下一个</button><Tool label="关闭查找" onClick={() => setSearch(null)}><X size={14} /></Tool></div>}
          {isOpen && mode === 'inline' ? <div className="sql-static-editor" aria-label="SQL 变更预览">
            {displayRows.map((row, index) => {
              const number = row.kind === 'removed' ? '' : ++lineNumber
              return <Fragment key={`${index}-${row.kind}`}>
                {index === targetLine && <div className="sql-inline-slot" ref={panel}>{composer}</div>}
                <div className={`sql-code-row is-${row.kind}${!proposal && context && index >= targetLine && index <= context.source.slice(0, context.range.end).split('\n').length - 1 && context.range.start !== context.range.end ? ' is-target' : ''}`}><span className="sql-line-number">{number}</span><span className="sql-diff-sign" aria-label={row.kind === 'added' ? '新增' : row.kind === 'removed' ? '删除' : undefined}>{row.kind === 'added' ? '+' : row.kind === 'removed' ? '−' : ''}</span><code><SqlSyntax code={row.text || ' '} /></code></div>
              </Fragment>
            })}
            {targetLine >= displayRows.length && <div className="sql-inline-slot" ref={panel}>{composer}</div>}
            {proposal && <div className="sql-diff-legend"><span className="is-removed">− 删除</span><span className="is-added">+ 新增</span><span>未变更的代码保持原样</span></div>}
          </div> : <div className="sql-code-area" onContextMenu={event => { event.preventDefault(); setContextMenu({ x: Math.max(8, Math.min(event.clientX, window.innerWidth - 240)), y: Math.max(8, Math.min(event.clientY, window.innerHeight - 280)) }) }}>
            <div className="sql-code-paint" aria-hidden="true" style={{ transform: `translate(${-scroll.left}px, ${-scroll.top}px)` }}><div className="sql-current-line" style={{ top: 12 + currentLine * lineHeight }} /><div className="sql-gutter">{lines.map((_, index) => <span key={index}>{index + 1}</span>)}</div><pre><SqlSyntax code={doc.sql + '\n'} /></pre></div>
            <textarea ref={editor} className="sql-code-input" aria-label="SQL 代码编辑器" value={doc.sql} spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off" wrap="off" readOnly={isOpen}
              onChange={event => updateSql(event.target.value)}
              onSelect={event => setSelection({ start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd })}
              onScroll={event => setScroll({ top: event.currentTarget.scrollTop, left: event.currentTarget.scrollLeft })}
              onKeyDown={event => { if (!isOpen && event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); const { selectionStart: start, selectionEnd: end } = event.currentTarget; updateSql(doc.sql.slice(0, start) + '  ' + doc.sql.slice(end)); requestAnimationFrame(() => editor.current?.setSelectionRange(start + 2, start + 2)) } }} />
            {!isOpen && selectedText.trim() && <div className="sql-selection-tools" style={{ top: Math.max(8, 12 + currentLine * lineHeight - scroll.top - 32) }} onMouseDown={event => event.preventDefault()}><button onClick={() => openAssistant('inline')}><Sparkle size={13} />编辑 <kbd>⌘K</kbd></button><button onClick={() => openAssistant('sidebar')}>添加到对话 <kbd>⌘L</kbd></button></div>}
            {!isOpen && !selectedText && !lines[currentLine]?.trim() && <button className="sql-empty-hint" style={{ top: 12 + currentLine * lineHeight - scroll.top }} onClick={() => openAssistant('inline')}><Sparkle size={13} /><span>⌘K 唤起 AI 编辑</span><span>·</span><span>⌘L 打开对话</span></button>}
          </div>}
          {queryState !== 'closed' && <section className="sql-results" aria-label="模拟查询结果"><div className="sql-results-heading"><span><Table size={15} />结果集 1 <small>模拟数据</small></span><Tool label="关闭结果集" onClick={() => { clearTimeout(queryTimer.current); setQueryState('closed') }}><X size={15} /></Tool></div>{queryState === 'running' ? <p className="sql-running"><span className="sql-pulse" />正在运行…</p> : <><div className="sql-result-table"><table><thead><tr>{['#', 'id', 'name', 'city', 'created_at'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{mockRows.map((row, index) => <tr key={row[0]}><td>{index + 1}</td>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div><p className="sql-result-foot">展示固定示例数据，用于体验编辑与执行流程。</p></>}</section>}
          <div className="sql-statusbar"><span><span className="sql-status-dot" />{stage === 'generating' ? 'AI 正在生成' : stage === 'review' ? '等待审阅' : '就绪'}</span><span>行 {currentLine + 1}，列 {currentColumn}{selectedText ? ` · 已选择 ${selectedText.length} 个字符` : ''}</span><span className="sql-status-right">UTF-8<span>MySQL</span></span></div>
        </div>
        {isOpen && mode === 'sidebar' && <aside className="sql-chat-sidebar" aria-label="AI 侧边对话"><div className="sql-chat-heading"><span><Sparkle size={17} />AI 对话</span><Tool label="关闭侧边对话" onClick={closeAssistant}><X size={16} /></Tool></div><div className="sql-chat-content"><span className="sql-chat-caption">当前上下文</span><pre><SqlSyntax code={context?.source.slice(context.range.start, context.range.end) || '当前光标位置 · 新建 SQL'} /></pre>{proposal ? <><div className="sql-chat-answer"><Sparkle size={16} /><span>已生成建议，请在编辑器中审阅后采用。</span></div><pre><SqlSyntax code={proposal.after} /></pre><button className="sql-outline-button" onClick={() => setMode('inline')}><Code size={15} />在编辑器中查看变更</button></> : <p className="sql-chat-empty">围绕当前 SQL 提问，或描述你想完成的修改。</p>}</div><div className="sql-chat-composer">{composer}</div></aside>}
      </div>
    </section>
    <div className="sql-demo-bottom"><span>选中代码后点击「编辑」，或在空行按 <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd></span><span>AI 与查询均为模拟响应</span></div>
    {contextMenu && <div className="sql-context-menu" role="menu" aria-label="SQL 编辑器右键菜单" style={{ left: contextMenu.x, top: contextMenu.y }} onPointerDown={event => event.stopPropagation()}><button role="menuitem" onClick={() => openAssistant('inline')}><Sparkle size={15} />AI Inline Chat <kbd>⌘K</kbd></button><button role="menuitem" onClick={() => openAssistant('inline', 'debug')}><Sparkle size={15} />SQL 纠错</button><button role="menuitem" onClick={() => openAssistant('inline', 'rewrite')}><Sparkle size={15} />SQL 改写</button><button role="menuitem" onClick={() => openAssistant('inline', 'format')}><Sparkle size={15} />AI 格式化</button><hr /><button role="menuitem" onClick={() => { formatDocument(); setContextMenu(null) }}><BracketsCurly size={15} />格式化文档</button><button role="menuitem" onClick={async () => { try { await navigator.clipboard.writeText(selectedText || doc.sql); notify('已复制 SQL') } catch { notify('请选中代码后按 ⌘C / Ctrl C 复制') } setContextMenu(null) }}><Copy size={15} />复制</button></div>}
    <div className={`sql-notice${notice ? ' is-visible' : ''}`} role="status" aria-live="polite">{notice && <><Check size={15} />{notice}</>}</div>
  </main>
}
