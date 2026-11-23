import { useLayoutEffect, useRef, useState } from 'react'
import { CaseStudyMediaFrame } from './CaseStudyMedia'
import { designCliCommands } from '../../data/projects/designEngineering'

function runCommand(command: string): string {
  const normalized = command.replace(/^obdesign(?:\/|\s+)/, '').trim()
  if (!/^obdesign(?:\/|\s+)/.test(command)) return `zsh: command not found: ${command.split(/\s+/)[0]}`
  if (['help', '--help'].includes(normalized)) return 'Usage: obdesign/<command> [options]\n\nCommands:\n' + designCliCommands.map(([name]) => `  ${name}`).join('\n')
  const name = normalized.split(/\s+/)[0]
  const entry = designCliCommands.find(([key]) => key === name)
  if (!entry) return `obdesign: unknown command '${name}'\nRun obdesign/help for available commands.`
  if (normalized.includes('--json')) return JSON.stringify({ demo: true, command: name }, null, 2)
  const examples: Record<string, string> = {
    search: 'Button\nIconButton',
    component: 'Button\n  variant   primary | secondary\n  disabled  boolean\n  loading   boolean',
    docs: 'Design guidelines\n  tokens\n  layout\n  components',
    theme: 'Themes\n  light (default)\n  dark',
    build: 'Workflow\n  1. Select a template\n  2. Read component rules\n  3. Compose the page',
    upgrade: 'Migration preview\n  No files changed.',
  }
  return `Usage: obdesign/${entry[2]}\n\n${examples[name]}\n\n[demo]`
}

type Entry = { command: string; output: string }
export function DesignCliDemo() {
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<Entry[]>([])
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(0)
  const [mode, setMode] = useState<'open' | 'minimized' | 'closed'>('open')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const draft = useRef('')
  useLayoutEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [entries])
  const submit = () => {
    const value = input.trim()
    if (!value) return
    setEntries(previous => value === 'clear' || value === 'obdesign/clear' ? [] : [...previous, { command: value, output: runCommand(value) }].slice(-50))
    setHistory(previous => [...previous, value].slice(-50))
    setCursor(Math.min(history.length + 1, 50))
    setInput('')
    draft.current = ''
  }
  return <CaseStudyMediaFrame animated><div className={`design-cli-stage${expanded ? ' design-cli-stage--expanded' : ''}`}>
    {mode === 'closed' ? <button className="design-cli-reopen" onClick={() => { setMode('open'); requestAnimationFrame(() => inputRef.current?.focus()) }}>Open Terminal</button> :
      <section className="design-cli" aria-label="OBDesign CLI 交互模拟">
        <header className="design-cli-header" onDoubleClick={() => setExpanded(value => !value)}>
          <div className="design-cli-controls">
            <button className="design-cli-close" aria-label="关闭模拟终端" onClick={() => setMode('closed')}><span>×</span></button>
            <button className="design-cli-minimize" aria-label={mode === 'minimized' ? '恢复模拟终端' : '最小化模拟终端'} onClick={() => setMode(value => value === 'open' ? 'minimized' : 'open')}><span>−</span></button>
            <button className="design-cli-zoom" aria-label="切换终端窗口大小" aria-pressed={expanded} onClick={() => { setExpanded(value => !value); setMode('open') }}><span>+</span></button>
          </div>
          <strong>obdesign — zsh</strong><span className="design-cli-demo">demo</span>
        </header>
        {mode === 'open' && <div ref={outputRef} className="design-cli-output" onClick={event => {
          if (event.target === event.currentTarget && !window.getSelection()?.toString()) inputRef.current?.focus()
        }}>
          <div className="design-cli-session">Type obdesign/help to get started.</div>
          <div role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions">
            {entries.map((entry, index) => <div className="design-cli-entry" key={index}>
              <div className="design-cli-echo"><span>designer@Mac ~ % </span>{entry.command}</div>
              {entry.output && <pre>{entry.output}</pre>}
            </div>)}
          </div>
          <form className="design-cli-form" onSubmit={event => { event.preventDefault(); submit() }}>
            <label htmlFor="design-cli-input">designer@Mac ~ %</label>
            <input id="design-cli-input" ref={inputRef} aria-label="CLI 指令" value={input} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={event => setInput(event.target.value)} onKeyDown={event => {
              if ((event.ctrlKey && event.key.toLowerCase() === 'l') || (event.metaKey && event.key.toLowerCase() === 'k')) { event.preventDefault(); setEntries([]); return }
              if (event.ctrlKey && event.key.toLowerCase() === 'c') { event.preventDefault(); setEntries(previous => [...previous, { command: `${input}^C`, output: '' }].slice(-50)); setInput(''); setCursor(history.length); return }
              if (event.key === 'Tab' && input.startsWith('obdesign/')) {
                const matches = ['help', ...designCliCommands.map(([name]) => name)].filter(name => `obdesign/${name}`.startsWith(input))
                if (matches.length === 1) { event.preventDefault(); setInput(`obdesign/${matches[0]}`) }
                return
              }
              if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
              event.preventDefault()
              if (cursor === history.length) draft.current = input
              const next = Math.max(0, Math.min(history.length, cursor + (event.key === 'ArrowUp' ? -1 : 1)))
              setCursor(next); setInput(history[next] ?? draft.current)
            }} />
          </form>
        </div>}
      </section>}
  </div></CaseStudyMediaFrame>
}
