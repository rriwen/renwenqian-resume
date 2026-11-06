import { useState } from 'react'
import type { ProjectFunnelData } from '../../data/projects/databaseOps'
import { useLanguage } from '../../i18n/LanguageContext'

import FunnelGraphic from './FunnelGraphic'

export function ProjectFunnel({ data }: { data: ProjectFunnelData }) {
  const { locale } = useLanguage()
  const zh = locale === 'zh'
  const [activeIndex, setActiveIndex] = useState(1)
  const count = (value: number) => value.toLocaleString(zh ? 'zh-CN' : 'en-US')

  return (
    <>
      <p>{data.summary.before}<strong style={{ color: 'var(--danger)' }}>{data.summary.value}</strong>{data.summary.after}</p>
    <figure className="project-funnel" aria-label={`${data.context} · ${data.title}`} aria-description={data.note}>
      <div className="project-funnel-body">
        <div className="project-funnel-plot" aria-hidden="true">
          <FunnelGraphic data={data} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
        </div>
        <div className="project-funnel-stages" role="group" aria-label={zh ? '选择漏斗阶段' : 'Select a funnel stage'}>
          {data.stages.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={activeIndex === index}
              className="project-funnel-stage"
              onPointerEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              <span className="project-funnel-stage-name">{item.label}</span>
              <span className="project-funnel-stage-count" title={item.estimated ? (zh ? '根据转化率估算' : 'Estimated from conversion rates') : undefined}>{count(item.value)}</span>
              <span className="project-funnel-stage-rate" data-tone={item.tone}>
                <span>{item.conversionRate === undefined ? (zh ? '起始阶段' : 'Starting stage') : (zh ? '转化率' : 'Conversion rate')}</span>
                {item.conversionRate !== undefined && <strong>{item.conversionRate.toFixed(2)}%</strong>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </figure>
    </>
  )
}
