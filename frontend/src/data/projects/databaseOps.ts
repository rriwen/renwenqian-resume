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

export function getDatabaseOpsFunnel(_locale: Locale): ProjectFunnelData {
  return {
    title: '从创建到选择数据源，仅 35.34% 继续',
    context: '优化前 · 全量用户 · 数据埋点',
    legend: '各层顶部宽度表示阶段数量，底部衔接下一阶段数量；灰蓝强调色突出选中阶段。',
    note: '来源：优化前的任务创建埋点图。前两步数量及转化率来自原图，后两步数量按转化率估算。各层顶部宽度与阶段数量成比例，相邻阶段间的收窄表示流失。',
    summary: {
      before: '埋点数据显示，任务创建的整体完成率仅为 ',
      value: '16.8%',
      after: '。从创建迁移项目到选择数据源阶段，仅有 35.34% 的用户继续推进，是当前漏斗中的主要流失环节。',
    },
    stages: [
      { id: 'create', label: '创建迁移项目', value: 2428, estimated: false },
      { id: 'select', label: '选择数据源', value: 858, estimated: false, conversionRate: 35.34, tone: 'danger' },
      { id: 'precheck', label: '预检查', value: precheckEstimate, estimated: true, conversionRate: 65.97 },
      { id: 'save', label: '启动项目', value: savedEstimate, estimated: true, conversionRate: 72.08 },
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

/** Visual comparison: baseline evidence and an explicitly simulated 75% completion distribution. */
export function getDatabaseOpsResultFunnels(locale: Locale) {
  return [
    { title: '优化前 · 全量用户', simulated: false, stages: getDatabaseOpsFunnel(locale).stages },
    { title: '优化后 · 新用户', simulated: true, stages: [
      { id: 'create', label: '创建迁移项目', value: 160, estimated: false },
      { id: 'source', label: '选择数据源', value: 143, estimated: false },
      { id: 'objects', label: '选择迁移对象', value: 136, estimated: false },
      { id: 'start', label: '预检查 / 启动', value: 120, estimated: false },
    ] as FunnelStage[] },
  ]
}
