import { useState } from 'react'
import type { ProjectFunnelData } from '../../data/projects/databaseOps'

import FunnelGraphic from './FunnelGraphic'

export function ProjectFunnel({ data }: { data: ProjectFunnelData }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const count = (value: number) => value.toLocaleString('zh-CN')

  return (
    <>
      <p>{data.summary.before}<strong style={{ color: 'var(--danger)' }}>{data.summary.value}</strong>{data.summary.after}</p>
    <figure className="project-funnel" aria-label={`${data.context} · ${data.title}`} aria-description={data.note}>
      <div className="project-funnel-body">
        <div className="project-funnel-plot" aria-hidden="true">
          <FunnelGraphic data={data} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />
        </div>
        <div className="project-funnel-stages" role="group" aria-label={'选择漏斗阶段'}>
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
              <span className="project-funnel-stage-count" title={item.estimated ? ('根据转化率估算') : undefined}>{count(item.value)}</span>
              <span className="project-funnel-stage-rate" data-tone={item.tone}>
                <span>{item.conversionRate === undefined ? ('起始阶段') : ('转化率')}</span>
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
