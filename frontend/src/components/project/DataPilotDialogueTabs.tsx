import { useRef } from 'react'
import { Brain, ChatCenteredDots, ClockClockwise, ListMagnifyingGlass, MagnifyingGlass, ArrowClockwise } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { ScreenshotCarousel } from './ScreenshotCarousel'
import { CaseStudyMediaFrame } from './CaseStudyMedia'

/** Manual tabs retain the original section hashes for direct links and history. */
export function DataPilotDialogueTabs({ sections, locale }: { sections: DataPilotSection[]; locale: Locale }) {
  const location = useLocation()
  const navigate = useNavigate()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const stages = sections.filter(section => section.dialogue && !section.groupIntro)
  const selected = Math.max(0, stages.findIndex(section => `#${section.id}` === location.hash))
  const troubleshooting = sections[0]?.group?.id === 'agent-troubleshooting'
  const labels = troubleshooting ? (locale === 'zh' ? ['找到步骤', '核对依据', '修正复测'] : ['Locate steps', 'Check evidence', 'Correct and retest']) : locale === 'zh' ? ['结果追问', '上下文与记忆', '定时任务'] : ['Result follow-ups', 'Context and memory', 'Scheduled tasks']
  const icons = troubleshooting ? [ListMagnifyingGlass, MagnifyingGlass, ArrowClockwise] : [ChatCenteredDots, Brain, ClockClockwise]
  function select(index: number) {
    navigate({ pathname: location.pathname, search: location.search, hash: `#${stages[index].id}` }, {
      preventScrollReset: true, state: { preserveDataPilotTabScroll: true },
    })
  }
  return <div className="qa-capabilities dialogue-capabilities">
    <div className="qa-capability-tabs" role="tablist" aria-label={troubleshooting ? (locale === 'zh' ? '问题排查设计' : 'Troubleshooting design') : (locale === 'zh' ? '持续对话设计' : 'Continuous dialogue design')}>
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
  </div>
}

function DialoguePanel({ section, index, locale }: { section: DataPilotSection; index: number; locale: Locale }) {
  const { decisions, visual } = section.dialogue!
  return <section id={section.id} className="dialogue-feature-section" aria-labelledby={`${section.id}-title`}>
    <CaseStudyMediaFrame animated index={index}>
    <div className="dialogue-feature">
    <div className="dialogue-feature-copy">
      <h3 id={`${section.id}-title`}>{section.title}</h3>
      <p>{section.body}</p>
      <ul>{decisions.map(item => <li key={item.title}>{item.body}</li>)}</ul>
    </div>
    <figure className="dialogue-feature-media">
        <ScreenshotCarousel titles={visual.frames.map(frame => frame.title)} descriptions={section.screenshotBriefs} locale={locale} />
    </figure>
    </div>
    </CaseStudyMediaFrame>
  </section>
}
