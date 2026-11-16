import { useId, useState } from 'react'
import { FileText, Table } from '@phosphor-icons/react'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ScreenshotCarousel } from './ScreenshotCarousel'
import { CaseStudyMediaFrame } from './CaseStudyMedia'

type QA = NonNullable<DataPilotSection['qaExperience']>

export function DataPilotQA({ section, content, locale }: { section: DataPilotSection; content: QA; locale: Locale }) {
  const { mockup: mock, decisions } = content
  const zh = locale === 'zh'
  const id = useId()
  const [scope, setScope] = useState<number | null>(2)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [conditions, setConditions] = useState(() => mock.analysisFields?.map(field => field.options[0]) ?? [])
  const [executionConfirmed, setExecutionConfirmed] = useState(false)
  const scenario = mock.scenarios?.[scenarioIndex]
  const [view, setView] = useState<'report' | 'records'>('report')
  const labels = zh ? { question: '编辑示例问题', details: '查看步骤详情', artifact: '报告预览', waiting: '报告生成后在此展示', scope: '范围已确认 · 昨天 / 全部产线', report: '报告', records: '明细', source: '查看口径与来源', sample: '模拟数据', metric: '产量完成率', sourceText: '来源：生产记录（模拟）。实际使用时保留数据来源与查询明细，不以图表直接推断原因。', status: { done: '已完成', active: '执行中', pending: '待完成' } }
    : { question: 'Edit the sample question', details: 'Inspect step details', artifact: 'Report preview', waiting: 'The generated report appears here', scope: 'Scope confirmed · yesterday / all lines', report: 'Report', records: 'Records', source: 'Inspect definitions and sources', sample: 'Sample data', metric: 'Production completion', sourceText: 'Source: sample production records. Actual results retain data sources and query details; charts alone do not establish causation.', status: { done: 'Done', active: 'Running', pending: 'Pending' } }
  return <section className="project-detail-section qa-case-section" id={section.id} aria-labelledby={`${section.id}-title`}>
    <CaseStudyMediaFrame animated index={mock.kind === 'start' ? 0 : mock.kind === 'progress' ? 1 : 2}>
    <div className="qa-case-layout">
    <div className="qa-case-copy">
        <h3 id={`${section.id}-title`}>{section.title.replace(/^[^：:]+[：:]\s*/, '')}</h3>

        <p className="qa-case-rationale">{section.body}</p>
        <div className="qa-case-rules">{decisions.map(item => <div key={item.title}><ul className="qa-design-points">{item.body.match(zh ? /[^。]+。?/g : /[^.!?]+[.!?]?/g)?.map((point, index) => <li key={index}>{point.trim().replace(/[。.]$/, '')}</li>)}</ul></div>)}</div>
    </div>
    <figure className={`qa-figure qa-figure--${mock.kind}`} aria-labelledby={mock.screenshotPlaceholder ? undefined : `${id}-caption`}>
        {mock.screenshotPlaceholder ? <ScreenshotCarousel titles={mock.screenshotPlaceholder} descriptions={section.screenshotBriefs} locale={locale} /> : <div className="qa-screen">
          <div className="qa-screen-header"><span>Data Agent</span><span>{mock.label}</span></div>
          {mock.kind === 'start' ? <div className="qa-start">
            <h4>{mock.title}</h4><p className="qa-subtitle">{mock.subtitle}</p>
            <p className="qa-example-request">{mock.prompt}</p>
            <div className="qa-metric-topology" role="group" aria-label={zh ? '指标计算关系' : 'Metric dependencies'}>
              <div className="qa-metric-inputs">{mock.items.slice(0, 2).map((item, index) => <button type="button" key={item.title} aria-pressed={scope === index} onClick={() => setScope(index)}>{item.title}</button>)}</div>
              <div className="qa-metric-connector" aria-hidden="true">↘　　↙</div>
              <button type="button" aria-pressed={scope === 2} onClick={() => setScope(2)}>{mock.items[2]?.title}</button>
            </div>
            {scope !== null && <div className="qa-state-feedback" aria-live="polite"><h4>{mock.items[scope]?.title}</h4><p>{mock.items[scope]?.detail}</p></div>}
            <p className="qa-footnote">{mock.footer}</p>
          </div> : mock.kind === 'progress' ? <div className="qa-execution qa-execution--states">
            <p className="qa-example-request">{mock.prompt}</p>
            <h4>{zh ? '确认本次分析条件' : 'Confirm analysis conditions'}</h4>
            <div className="qa-analysis-fields">{mock.analysisFields?.map((field, index) => <label key={field.label}><span>{field.label}</span><select value={conditions[index]} onChange={event => { setConditions(current => current.map((value, i) => i === index ? event.target.value : value)); setExecutionConfirmed(false); setScenarioIndex(0) }}>{field.options.map(option => <option key={option}>{option}</option>)}</select></label>)}</div>
            <button type="button" className="qa-confirm" onClick={() => setExecutionConfirmed(true)}>{zh ? '确认并开始分析' : 'Confirm and analyze'}</button>
            <p className="qa-footnote" role="status">{executionConfirmed ? (zh ? '已确认：' : 'Confirmed: ') + conditions.join(' / ') : (zh ? '可调整条件；确认后模拟执行，不连接真实数据库。' : 'Adjust conditions before simulating execution. No database is connected.')}</p>
            {executionConfirmed && <>
              <div className="qa-state-switch" role="group" aria-label={zh ? '模拟执行状态' : 'Simulated execution state'}>{mock.scenarios?.map((item,index) => <button type="button" key={item.title} aria-pressed={scenarioIndex === index} aria-controls={`${id}-execution`} onClick={() => setScenarioIndex(index)}>{item.title}</button>)}</div>
              {scenario && <div id={`${id}-execution`} className="qa-state-feedback" aria-live="polite"><span className="qa-subtitle">{zh ? '模拟执行反馈' : 'Simulated feedback'}</span><h4>{scenario.status}</h4><p>{scenario.detail}</p><div className="qa-next-action"><strong>{zh ? '下一步' : 'Next step'}</strong><span>{scenario.action}</span></div></div>}
            </>}

            <details className="qa-details"><summary>{labels.details}</summary><p>{zh ? '本示意仅切换状态与反馈，不执行真实查询或重试；实际状态由工程执行结果驱动。' : 'This demonstration switches feedback only; it does not run queries or retries. Production states are driven by execution results.'}</p></details>
          </div> : <div className="qa-result">
            <div className="qa-result-heading"><div><h4>{mock.title}</h4><p className="qa-subtitle">{mock.subtitle}</p></div><div className="qa-view-switch" role="group" aria-label={mock.subtitle}>
              <button type="button" aria-pressed={view === 'report'} aria-controls={`${id}-result`} onClick={() => setView('report')}><FileText size={16} aria-hidden="true" />{labels.report}</button>
              <button type="button" aria-pressed={view === 'records'} aria-controls={`${id}-result`} onClick={() => setView('records')}><Table size={16} aria-hidden="true" />{labels.records}</button>
            </div></div>
            <p className="qa-evidence-scope">{mock.footer}</p>
            <div id={`${id}-result`} className="qa-result-content">
              <div className="qa-chart-caption"><strong>{labels.metric}</strong><span>{labels.sample}</span></div>
              {view === 'report' ? <div className="qa-bars">{mock.items.map(item => <div className="qa-bar" key={item.title}><span>{item.title}</span><div><span style={{ width: `${item.value ?? 0}%` }} /></div><strong>{item.value}%</strong></div>)}</div>
                : <table className="qa-records"><thead><tr><th>{zh ? '产线' : 'Line'}</th><th>{zh ? '实际 / 计划' : 'Actual / planned'}</th><th>{labels.metric}</th></tr></thead><tbody>{mock.items.map(item => <tr key={item.title}><td>{item.title}</td><td>{(item.value ?? 0) * 10} / 1000</td><td>{item.value}%</td></tr>)}</tbody></table>}
            </div>
            <details className="qa-details"><summary>{labels.source}</summary><p className="qa-finding">{mock.prompt}</p><p>{mock.footer}</p><p>{mock.sourceText ?? labels.sourceText}</p></details>
          </div>}
        </div>}
      {!mock.screenshotPlaceholder && <figcaption id={`${id}-caption`}>{mock.caption}</figcaption>}
    </figure>

    </div>
    </CaseStudyMediaFrame>
    {content.bridge && <p className="qa-bridge">{content.bridge}</p>}
  </section>
}
