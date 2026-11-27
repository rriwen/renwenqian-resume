import { MeshGradientBackground } from './MeshGradientBackground'
import { useCallback, useId, useRef, useState } from 'react'
import { ProjectLightbox } from './ProjectLightbox'
import type { DataPilotScenario as Scenario } from '../../data/projects/dataPilotScenario'

const scenarioBackgrounds = [
  { palette: 'dataagent', speed: 0.7 },
  { palette: 'text2sql', speed: 0.9 },
  { palette: 'agentops', speed: 0.6 },
  { palette: 'workflow-editor', speed: 0.8 },
] as const

export function DataPilotScenario({ scenario }: { scenario: Scenario }) {
  const [selectedStep, setSelected] = useState(0)
  const selected = Math.min(selectedStep, scenario.steps.length - 1)
  const id = useId()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const imageTrigger = useRef<HTMLButtonElement | null>(null)
  const [preview, setPreview] = useState<{ src: string; caption: string } | null>(null)
  const closePreview = useCallback(() => setPreview(null), [])
  const step = scenario.steps[selected]
  const background = scenarioBackgrounds[selected % scenarioBackgrounds.length]
  return <div className="datapilot-scenario">
    <div className="scenario-card">
    <div className="scenario-stepper" role="tablist" aria-label="生产晨会场景步骤">
      {scenario.steps.map((item, index) => <button type="button" key={item.id} role="tab"
        id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={selected === index}
        tabIndex={selected === index ? 0 : -1} ref={node => { buttons.current[index] = node }}
        onClick={() => setSelected(index)} onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % scenario.steps.length
            : event.key === 'ArrowLeft' ? (index + scenario.steps.length - 1) % scenario.steps.length
            : event.key === 'Home' ? 0 : event.key === 'End' ? scenario.steps.length - 1 : null
          if (next === null) return
          event.preventDefault()
          setSelected(next)
          buttons.current[next]?.focus()
        }}><span className="scenario-step-number">{index + 1}</span><span className="scenario-step-label">{item.label}</span>{index < scenario.steps.length - 1 && <svg className="scenario-tab-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>}</button>)}
    </div>
    <div className="scenario-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}>
      <div className="scenario-columns">
        <figure className="scenario-screenshot">
          <div className="scenario-screenshot-board" data-hero-palette={background.palette}><MeshGradientBackground key={step.id} speed={background.speed} />
          {step.screenshot.src ? <button type="button" className="scenario-screenshot-trigger" ref={imageTrigger} aria-label={`全屏查看图片: ${step.screenshot.title}`} onClick={() => setPreview({ src: step.screenshot.src!, caption: step.screenshot.title })}><img className="scenario-screenshot-image" src={step.screenshot.src} alt={step.screenshot.title} loading="lazy" /></button> : <div className="scenario-screenshot-slot"><span>截图待补 · {String(selected + 1).padStart(2, '0')}</span><strong>{step.screenshot.title}</strong><span className="scenario-placeholder-cross" aria-hidden="true">＋</span><small>此处放置真实产品截图</small>
            <div className="scenario-screenshot-hints"><span>建议截图内容</span><ul>{step.screenshot.requirements.map(item => <li key={item}>{item}</li>)}</ul></div>
          </div>}
          </div>
        </figure>
        <div className="scenario-story">
          <dl className="scenario-analysis">
            <div><dt>用户意图</dt><dd>{step.purpose}</dd></div>
            <div><dt>Agent 输出</dt><dd>{step.output}</dd></div>
            <div><dt>核心问题</dt><dd>{(step.risks ?? [step.risk]).map(risk => <p key={risk.title}><strong>{risk.title}</strong>{risk.body}</p>)}</dd></div>
          </dl>
        </div>
      </div>
    </div>
    </div>
    <dl className="scenario-design-focus">{scenario.designFocus.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.body}</dd></div>)}</dl>
    {preview && <ProjectLightbox items={[preview]} index={0} onChange={() => {}} onClose={closePreview} returnFocusTo={imageTrigger.current} />}
  </div>
}
