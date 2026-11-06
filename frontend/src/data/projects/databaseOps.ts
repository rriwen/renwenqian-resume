import type { Locale } from '../../i18n/translations'

export type FunnelStage = {
  id: string
  label: string
  value: number
  estimated: boolean
  tone?: 'danger'
  /** 原图标注的相邻阶段转化率，非整体完成率。 */
  conversionRate?: number
}

export type ProjectFunnelData = {
  title: string
  context: string
  legend: string
  note: string
  summary: { before: string; value: string; after: string }
  stages: FunnelStage[]
}

const precheckEstimate = Math.round(858 * 0.6597)
const savedEstimate = Math.round(precheckEstimate * 0.7208)

export function getDatabaseOpsFunnel(locale: Locale): ProjectFunnelData {
  const zh = locale === 'zh'
  return {
    title: zh ? '从创建到选择数据源，仅 35.34% 继续' : 'Only 35.34% continue to selecting data sources',
    context: zh ? '优化前 · 熟练用户 · 数据埋点' : 'Before optimization · Experienced users · Event instrumentation',
    legend: zh
      ? '各层顶部宽度表示阶段数量，底部衔接下一阶段数量；灰蓝强调色突出选中阶段。'
      : 'Each segment’s top width encodes its count and its bottom connects to the next count; blue-grey emphasis highlights the selected stage.',
    note: zh
      ? '来源：优化前的任务创建埋点图。前两步数量及转化率来自原图，后两步数量按转化率估算。各层顶部宽度与阶段数量成比例，相邻阶段间的收窄表示流失。'
      : 'Source: the original pre-optimization task-creation analytics chart. The first two counts and conversion rates are recorded; the last two counts are estimates. Segment top widths are proportional to counts; narrowing between stages shows drop-off.',
    summary: {
      before: zh ? '埋点数据显示，任务创建的整体完成率仅为 ' : 'Event data showed overall task-creation completion of only ',
      value: '16.8%',
      after: zh ? '。从创建迁移项目到选择数据源阶段，仅有 35.34% 的用户继续推进，是当前漏斗中的主要流失环节。' : '. Only 35.34% of users progressed from project creation to data-source selection, making this the main drop-off in the funnel.',
    },
    stages: [
      { id: 'create', label: zh ? '创建迁移项目' : 'Create migration project', value: 2428, estimated: false },
      { id: 'select', label: zh ? '选择数据源' : 'Select data sources', value: 858, estimated: false, conversionRate: 35.34, tone: 'danger' },
      { id: 'precheck', label: zh ? '预检查' : 'Pre-check', value: precheckEstimate, estimated: true, conversionRate: 65.97 },
      { id: 'save', label: zh ? '启动项目' : 'Start project', value: savedEstimate, estimated: true, conversionRate: 72.08 },
    ],
  }
}

export function getFunnelStageMetrics(stages: FunnelStage[], index: number) {
  const stage = stages[index]
  const previous = stages[index - 1]
  return {
    retainedRate: stage.value / stages[0].value * 100,
    dropOff: previous ? previous.value - stage.value : 0,
    estimated: stage.estimated || !!previous?.estimated,
  }
}
