import { type ReactNode, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ArrowRight, CaretDown, Check, X } from '@phosphor-icons/react'
import type { ProjectDetailBlock, ProjectDetailParagraph, ProjectDetailTable, ProjectGalleryItem } from '../../data/projectDetails'
import { getProjectTitle, type Project } from '../../data/projects'
import { DATABASE_OPS_SETUP_IMAGE, getDatabaseOpsVisualCopy } from '../../data/projects/databaseOpsVisual'
import { useLanguage } from '../../i18n/LanguageContext'
import { ReadingPageHeader } from '../ReadingPageHeader'
import { ProjectAnchorNav } from './ProjectAnchorNav'
import { ProjectGallery } from './ProjectGallery'
import { getDatabaseOpsResultFunnels } from '../../data/projects/databaseOps'
import { ProjectFunnel } from './ProjectFunnel'
import { MeshGradientBackground } from './MeshGradientBackground'
import '../../styles/components/databaseops-visual.css'

function Paragraph({ value }: { value: ProjectDetailParagraph }) {
  return <>{typeof value === 'string' ? value : value.map((run, index) => {
    const content = run.bold ? <strong>{run.text}</strong> : run.text
    return run.href
      ? <a key={index} href={run.href} target="_blank" rel="noreferrer">{content}</a>
      : <span key={index} style={run.tone === 'danger' ? { color: 'var(--danger)' } : undefined}>{content}</span>
  })}</>
}

function Copy({ paragraphs }: { paragraphs?: ProjectDetailParagraph[] }) {
  return <>{paragraphs?.map((value, index) => <p key={index}><Paragraph value={value} /></p>)}</>
}

function GradientImageFrame({ children, item, index }: { children: ReactNode; item: ProjectGalleryItem; index: number }) {
  // Stable, scattered assignment: a refresh never changes a picture's palette.
  const seed = Array.from(item.src).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, index)
  return <div className={`dbv-image-frame dbv-palette-${(seed >>> 8) % 2 === 0 ? 'blue' : 'violet'}`}>
    <MeshGradientBackground />
    {children}
  </div>
}

function Evidence({ items, title }: { items: ProjectGalleryItem[]; title?: string }) {
  const gallery = <ProjectGallery items={items.map(item => ({ ...item, transparentBackground: true }))} layout="stacked" imageFrame={GradientImageFrame} />
  return title ? <details className="dbv-disclosure"><summary>{title}<CaretDown size={18} /></summary>{gallery}</details> : gallery
}

function ObjectSelectionSwitcher({ table, image, action }: { table: ProjectDetailTable; image: string; action?: ReactNode }) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .25 })
    if (root.current) observer.observe(root.current)
    return () => { observer.disconnect(); media.removeEventListener('change', update) }
  }, [])
  const running = visible && !hovered && !focused && !reduced
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => { if (!document.hidden) setActive(value => (value + 1) % table.rows.length) }, 10000)
    return () => clearInterval(timer)
  }, [running, active, table.rows.length])
  const row = table.rows[active]
  return <div ref={root} className="dbv-selection-switcher" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="dbv-selection-menu">
      <div role="tablist" aria-label="对象选择方式" aria-orientation="vertical">
        {table.rows.map((item, index) => <button key={item.id} ref={node => { buttons.current[index] = node }} type="button" role="tab" id={`selection-tab-${item.id}`} aria-controls="selection-panel" aria-selected={active === index} tabIndex={active === index ? 0 : -1} className="dbv-selection-tab" onClick={() => setActive(index)} onKeyDown={event => {
          let next = index
          if (event.key === 'ArrowDown') next = (index + 1) % table.rows.length
          else if (event.key === 'ArrowUp') next = (index + table.rows.length - 1) % table.rows.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = table.rows.length - 1
          else return
          event.preventDefault(); setActive(next); buttons.current[next]?.focus()
        }}><span className="dbv-selection-name">{cellText(item.cells[0])}<CaretDown size={18} /></span>
          {active === index && <span className="dbv-selection-description">{cellText(item.cells[1])}{cellText(item.cells[2])}</span>}
          {active === index && running && <span key={active} className="dbv-selection-progress" aria-hidden="true" />}
        </button>)}
      </div>
      {action}
    </div>
    <div id="selection-panel" role="tabpanel" aria-labelledby={`selection-tab-${row.id}`} tabIndex={0} className="dbv-selection-panel">
      <div key={row.id} className="dbv-selection-slide" data-selection={row.id}>
        <Evidence items={[{ src: active === 0 ? image : active === 1 ? "/images/databaseops-visual-rule-matching.jpg" : "/images/databaseops-visual-file-import.png", caption: cellText(row.cells[0]), hideCaption: true }]} />
      </div>
    </div>
  </div>
}

function cellText(cell: ProjectDetailTable['rows'][number]['cells'][number]) {
  return typeof cell === 'string' ? cell : cell?.text ?? ''
}

type Props = { project: Project; detail: ProjectDetailBlock }

export function DatabaseOpsVisualCaseStudy({ project, detail }: Props) {
  const { locale } = useLanguage()
  const copy = getDatabaseOpsVisualCopy(locale)
  const title = getProjectTitle(project, locale)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sections = detail.sections ?? []
  // Section IDs are stable across locales; the visual edition reads the canonical case.
  const section = (id: string) => sections.find(item => item.id === id)!
  const goals = section('design-goals')
  const diagnosis = section('diagnosis')
  const analysis = section('migration-analysis')
  const opportunities = section('design-opportunities')
  const interaction = section('interaction')
  const setup = interaction.subsections![0]
  const stepper = setup.comparison!
  const objects = section('object-selection')
  const selection = objects.subsections![0]
  const rules = objects.subsections![1]
  const outcomes = section('outcomes')
  const instrumentation = analysis.subsections![0]
  const journey = diagnosis.subsections!.find(sub => sub.id === 'journey-map')!
  const opportunityTargets: Record<string, string> = { 'shorten-creation': 'interaction', 'object-selection': 'object-selection' }
  const anchors = [
    { id: 'project-overview', title: locale === 'zh' ? '项目概述' : 'Overview' },
    ...sections.map(({ id, title }) => ({ id, title })),
  ]

  return <main className="dbv-page">
    <ReadingPageHeader title={title} titleRef={titleRef} />
    <div className="dbv-shell">
      <header id="project-overview" className="dbv-hero">
        <div className="dbv-showcase dbv-hero-media">
          <MeshGradientBackground />
          <ProjectGallery items={[{ src: project.image, caption: copy.coverCaption, hideCaption: true, transparentBackground: true, previewCrop: { aspectRatio: 1.88, objectPosition: 'top' } }]} layout="stacked" />
        </div>
        <h1 ref={titleRef}>{title}</h1>
        <p className="dbv-lead">{copy.intro}</p>
        <div className="datapilot-meta project-case-tags project-case-tags--filled">{detail.tags.map(tag => <span className="project-case-tag" key={tag}>{tag}</span>)}</div>
      </header>

      <section id="design-goals" className="dbv-section dbv-background" aria-labelledby="design-goals-title">
        <h2 id="design-goals-title">{copy.background}</h2>
        <div className="dbv-copy"><Copy paragraphs={goals.paragraphs} /></div>
        <dl className="dbv-facts">{goals.table?.rows.map(row => <div key={row.id}><dt>{cellText(row.cells[0])}</dt><dd>{cellText(row.cells[1])}</dd></div>)}</dl>
      </section>

      <section id="diagnosis" className="dbv-section" aria-labelledby="diagnosis-title">
        <div className="dbv-copy"><h2 id="diagnosis-title">{copy.journey}</h2><Copy paragraphs={diagnosis.subsections![0].paragraphs} /></div>
        <div className="dbv-journey-map"><Evidence items={journey.images!} /></div>
        <ul className="dbv-journey-notes">{journey.listItems?.map((item, index) => <li key={index}><Paragraph value={item} /></li>)}</ul>
      </section>

      <section id="migration-analysis" className="dbv-section" aria-labelledby="migration-analysis-title">
        <div className="dbv-copy"><h2 id="migration-analysis-title">{analysis.title}</h2><div className="dbv-analysis-intro"><Copy paragraphs={analysis.paragraphs} /></div></div>
        {instrumentation.funnel && <div className="dbv-funnel"><ProjectFunnel data={instrumentation.funnel} /></div>}
        <div className="dbv-copy"><Copy paragraphs={instrumentation.paragraphs} /></div>
        <ul className="dbv-findings">{instrumentation.listItems?.map((item, index) => <li key={index}>
          <div><Paragraph value={item} /></div>
          {instrumentation.images?.[index] && <div className="dbv-finding-image"><Evidence items={[instrumentation.images[index]]} /></div>}
        </li>)}</ul>
      </section>

      <section id="design-opportunities" className="dbv-section" aria-labelledby="design-opportunities-title">
        <div className="dbv-copy"><h2 id="design-opportunities-title">{opportunities.title}</h2><Copy paragraphs={opportunities.paragraphs} /></div>
        <div className="dbv-strategies">{opportunities.table?.rows.map(row => <a key={row.id} href={`#${opportunityTargets[row.id]}`}>
          <h3>{cellText(row.cells[0])}</h3><p>{cellText(row.cells[1])}</p><span>{cellText(row.cells[2])}<ArrowRight size={20} /></span>
        </a>)}</div>
      </section>

      <section id="interaction" className="dbv-section dbv-interaction" aria-labelledby="interaction-title">
        <div className="dbv-editorial dbv-editorial--stacked">
          <div className="dbv-copy"><h2 id="interaction-title">{interaction.title}</h2><p className="dbv-statement">{copy.interaction}</p><Copy paragraphs={setup.paragraphs} /></div>
          <div className="dbv-showcase"><Evidence items={[{ src: DATABASE_OPS_SETUP_IMAGE, caption: copy.sourceCaption, hideCaption: true }]} /></div>
        </div>
        <ol className="dbv-flow" aria-label={copy.flowLabel}>{copy.flow.map((name, index) => <li key={name}><div><strong>{name}</strong><span>{copy.flowNotes[index]}</span></div>{index < copy.flow.length - 1 && <ArrowRight className="dbv-flow-arrow" size={20} aria-hidden="true" />}</li>)}</ol>
        <div className="dbv-decisions">{setup.table?.rows.map(row => <div className="dbv-decision" key={row.id}>
          <h3>{cellText(row.cells[0])}</h3><dl><div><dt>{copy.before}</dt><dd>{cellText(row.cells[1])}</dd></div><div><dt>{copy.after}</dt><dd>{cellText(row.cells[2])}</dd></div></dl>
        </div>)}</div>
        {setup.prototypeEmbed && <a className="ui-button dbv-prototype-button" href={setup.prototypeEmbed.url} target="_blank" rel="noopener noreferrer">{copy.prototype}<ArrowUpRight size={18} aria-hidden="true" /></a>}

        <div id={stepper.id} className="dbv-stepper">
          <div className="dbv-copy"><h3>② {stepper.title}</h3><Copy paragraphs={setup.closingParagraphs} /><Copy paragraphs={stepper.paragraphs} /></div>
          <div className="dbv-stepper-options">{stepper.options.map(option => <div key={option.id} className="dbv-stepper-option">
            <h4>{option.title}</h4><div className="dbv-showcase"><Evidence items={option.images.map(item => ({ ...item, caption: option.title, hideCaption: true }))} /></div>
            <Copy paragraphs={option.paragraphs} />
            <dl>{option.listItems.map((item, index) => <div key={index}><dt>{index === 0 ? <Check className="dbv-pro-icon" size={14} weight="bold" aria-hidden="true" /> : <X className="dbv-con-icon" size={14} weight="bold" aria-hidden="true" />}{index === 0 ? copy.strengths : copy.limitations}</dt><dd><Paragraph value={item} /></dd></div>)}</dl>
          </div>)}</div>
        </div>
      </section>

      <section id="object-selection" className="dbv-section" aria-labelledby="object-selection-title">
        <div className="dbv-copy"><h2 id="object-selection-title">{objects.title}</h2><p className="dbv-statement">{copy.objectTitle}</p><Copy paragraphs={objects.paragraphs} /></div>
        {selection.table && <ObjectSelectionSwitcher table={selection.table} image={project.image} action={selection.prototypeEmbed && <a className="ui-button dbv-prototype-button" href={selection.prototypeEmbed.url} target="_blank" rel="noopener noreferrer">{copy.prototype}<ArrowUpRight size={18} aria-hidden="true" /></a>} />}
        <div className="dbv-rule-detail"><div className="dbv-copy"><h3>{copy.ruleTitle}</h3><Copy paragraphs={rules.paragraphs} /></div><Evidence items={rules.images!} title={rules.imagesDisclosure} /></div>
      </section>

      <section id="outcomes" className="dbv-section dbv-outcomes" aria-labelledby="outcomes-title">
        <div className="dbv-copy"><h2 id="outcomes-title">{copy.resultsTitle}</h2><Copy paragraphs={outcomes.paragraphs} /></div>
        <p className="dbv-measurement">{copy.measurement}</p>
        <div className="dbv-result-funnels">{getDatabaseOpsResultFunnels(locale).map((funnel, panel) => {
          const stages = funnel.stages.filter(stage => stage.id !== 'type')
          return <div className="dbv-result-pair" key={funnel.title}>
            <dl><dt>{funnel.title}</dt><dd className="dbv-metric-value">{panel ? '75' : '16.8'}<span>%</span></dd></dl>
            <figure aria-label={funnel.title}>
            <ol>{stages.map((stage, index) => {
              const half = stage.value / stages[0].value * 95
              const next = (stages[index + 1]?.value ?? stage.value) / stages[0].value * 95
              const rate = funnel.simulated && index > 0 ? stage.value / stages[index - 1].value * 100 : stage.conversionRate
              const info = `${funnel.simulated ? (locale === 'zh' ? '模拟数据 · ' : 'Simulated · ') : ''}${stage.label} · ${stage.value.toLocaleString(locale)}${stage.estimated ? (locale === 'zh' ? '（估算）' : ' (estimated)') : ''}${rate !== undefined ? ` · ${locale === 'zh' ? '转化率' : 'Conversion'} ${rate.toFixed(2)}%` : ''}`
              const path = `M ${104-half} 3 H ${96+half} Q ${100+half} 3 ${100+half-1} 7 L ${100+next+1} 49 Q ${100+next} 53 ${96+next} 53 H ${104-next} Q ${100-next} 53 ${100-next-1} 49 L ${100-half+1} 7 Q ${100-half} 3 ${104-half} 3 Z`
              return <li key={stage.id}>
                <button className="dbv-result-stage" type="button" aria-label={info}>
                  <svg viewBox="0 0 200 56" preserveAspectRatio="none" aria-hidden="true"><path d={path} fill={panel ? 'var(--accent)' : 'var(--muted)'} opacity={1-index*.12} /></svg>
                  <span className="dbv-result-tooltip" aria-hidden="true">{info.replace(/（估算）| \(estimated\)|^模拟数据 · |^Simulated · /g, '')}</span>
                </button>
              </li>
            })}</ol>
          </figure></div>
        })}</div>
      </section>
    </div>
    <ProjectAnchorNav sections={anchors} label={locale === 'zh' ? '项目目录' : 'Project contents'} />
  </main>
}
