import { useRef } from 'react'
import { ChatCenteredDots, PencilSimple, ListMagnifyingGlass, MagnifyingGlass, ArrowClockwise } from '@phosphor-icons/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ScreenshotCarousel } from './ScreenshotCarousel'
import { CaseStudyMediaFrame } from './CaseStudyMedia'

/** Manual tabs retain the original section hashes for direct links and history. */
export function DataPilotDialogueTabs({ sections, locale }: { sections: DataPilotSection[]; locale: Locale }) {
  const location = useLocation()
  const navigate = useNavigate()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const stages = sections.filter(section => section.dialogue && !section.groupIntro && !section.dialogueExtension)
  const extensions = sections.filter(section => section.dialogueExtension)
  const selected = Math.max(0, stages.findIndex(section => [section.id, ...(section.legacyIds ?? [])].some(id => `#${id}` === location.hash)))
  const troubleshooting = sections[0]?.group?.id === 'agent-troubleshooting'
  const labels = stages.map((section, index) => section.tabLabel ?? ['找到步骤', '核对依据', '修正复测'][index])
  const icons = troubleshooting ? [ListMagnifyingGlass, MagnifyingGlass, ArrowClockwise] : [ChatCenteredDots, PencilSimple, ArrowClockwise]
  function select(index: number) {
    navigate({ pathname: location.pathname, search: location.search, hash: `#${stages[index].id}` }, {
      preventScrollReset: true, state: { preserveDataPilotTabScroll: true },
    })
  }
  return <div className="qa-capabilities dialogue-capabilities">
    <div className="qa-capability-tabs" role="tablist" aria-label={troubleshooting ? '问题排查设计' : '多轮对话与持续使用设计'}>
      {stages.map((section, index) => {
        const Icon = icons[index]
        return <button key={section.id} ref={node => { buttons.current[index] = node }}
        type="button" role="tab" id={`${section.id}-tab`} aria-controls={`${section.id}-panel`}
        aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        onClick={() => select(index)} onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % stages.length
            : event.key === 'ArrowLeft' ? (index + stages.length - 1) % stages.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1 : null
          if (next === null) return
          event.preventDefault()
          select(next)
          buttons.current[next]?.focus()
        }}><Icon size={16} weight="regular" aria-hidden="true" /><span>{labels[index]}</span></button>
      })}
    </div>
    {stages.map((section, index) => <div key={section.id} role="tabpanel" id={`${section.id}-panel`}
      aria-labelledby={`${section.id}-tab`} hidden={selected !== index} tabIndex={0}>
      <DialoguePanel section={section} index={(index + (troubleshooting ? 2 : 1)) % 3} locale={locale} />
    </div>)}
    {extensions.map(section => <section key={section.id} id={section.id} className="dialogue-extension" aria-label={section.title}>
      <p>{section.related ? section.body.split('AgentOps').map((text, index) => <span key={index}>{index > 0 && <Link to="/project/agentops">AgentOps</Link>}{text}</span>) : section.body}</p>
    </section>)}
  </div>
}

function DialoguePanel({ section, index, locale }: { section: DataPilotSection; index: number; locale: Locale }) {
  const { decisions, visual, tradeoff, hideMedia, status } = section.dialogue!
  const continuous = ['continuous-dialogue', 'agent-troubleshooting'].includes(section.group?.id ?? '')
  return <section id={section.id} className={continuous ? 'project-detail-section qa-case-section' : 'dialogue-feature-section'} aria-labelledby={`${section.id}-title`}>
    {section.legacyIds?.map(id => <span key={id} id={id} aria-hidden="true" />)}
    <CaseStudyMediaFrame animated index={index}>
      <div className={`${continuous ? 'qa-case-layout' : 'dialogue-feature'}${hideMedia ? ' dialogue-text-only' : ''}`}>
        <div className={continuous ? 'qa-case-copy' : 'dialogue-feature-copy'}>
          <h3 id={`${section.id}-title`}>{section.title}{status && <span className="dialogue-status-tag">{status}</span>}</h3>
          <p className={continuous ? 'qa-case-rationale' : undefined}>{section.body}</p>
          {tradeoff && <p className="dialogue-decision">{tradeoff}</p>}
          {continuous ? <ul className="qa-design-decisions">{decisions.map(item => <li key={item.title}><p><strong>{item.title}{item.body ? '：' : ''}</strong>{item.body}</p></li>)}</ul>
            : <ul>{decisions.map(item => <li key={item.title}>{item.body}</li>)}</ul>}
        </div>
        {!hideMedia && <figure className={continuous ? 'qa-figure' : 'dialogue-feature-media'}>
          <ScreenshotCarousel
            key={section.images.map(image => image.src).join('|') || section.id}
            titles={section.images.length ? section.images.map(image => image.caption) : visual.frames.map(frame => frame.title)}
            images={section.images.length ? section.images.map(image => image.src) : undefined}
            descriptions={section.images.length ? undefined : section.screenshotBriefs}
            locale={locale} />
        </figure>}
      </div>
    </CaseStudyMediaFrame>
    {section.related && <p className="datapilot-related-link"><Link to="/project/agentops">查看 AgentOps 案例与 Demo ↗</Link></p>}
  </section>
}
