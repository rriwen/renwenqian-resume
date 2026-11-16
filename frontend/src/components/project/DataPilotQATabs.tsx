import { useRef } from 'react'
import { SlidersHorizontal, ListChecks, MagnifyingGlass } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { DataPilotSection } from '../../data/projects/dataPilot'
import type { Locale } from '../../i18n/translations'
import { DataPilotQA } from './DataPilotQA'

/** Manual tabs retain the original section hashes for direct links and history. */
export function DataPilotQATabs({ sections, locale }: { sections: DataPilotSection[]; locale: Locale }) {
  const location = useLocation()
  const navigate = useNavigate()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const stages = sections.filter(section => section.qaExperience)
  const selected = Math.max(0, stages.findIndex(section => `#${section.id}` === location.hash))
  const labels = locale === 'zh' ? ['问答前', '问答中', '问答后'] : ['Before asking', 'During execution', 'After answering']
  const icons = [SlidersHorizontal, ListChecks, MagnifyingGlass]
  function select(index: number) {
    navigate({ pathname: location.pathname, search: location.search, hash: `#${stages[index].id}` }, {
      preventScrollReset: true, state: { preserveDataPilotTabScroll: true },
    })
  }
  return <div className="qa-capabilities">
    <div className="qa-capability-tabs" role="tablist" aria-label={locale === 'zh' ? '问答体验阶段' : 'Question-answer stages'}>
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
      <DataPilotQA section={section} content={section.qaExperience!} locale={locale} />
    </div>)}
  </div>
}
