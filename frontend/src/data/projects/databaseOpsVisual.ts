import type { Locale } from '../../i18n/translations'

/** Presentation copy only. The case facts, tables and evidence remain in projectDetails. */
export function getDatabaseOpsVisualCopy(locale: Locale) {
  return locale === 'zh' ? {
    intro: '围绕新用户自助体验，重构核心任务链路的交互流程',
    coverCaption: '迁移对象选择设计方案，保留早期版本的步骤名称',
    background: '背景目标',
    journey: '从完整旅程，找到关键卡点',
    interaction: '① 把「准备、配置、帮助」放进同个流程',
    flowLabel: '优化后的任务创建链路',
    flow: ['连接数据源', '设置迁移类型', '选择迁移对象'],
    flowNotes: ['源端与目标端', '确定迁移方式', '明确迁移范围'],
    sourceCaption: '创建流程原型：新建数据源与帮助文档并置，保留早期版本的步骤名称',
    before: '卡点', after: '优化',
    sourceEvidence: '查看原流程界面',
    prototype: '体验交互原型', openPrototype: '单独打开原型',
    strengths: '优', limitations: '劣',
    objectTitle: '① 让选择对象，回到可见的操作',
    ruleTitle: '② 把复杂规则拆成可操作的条件',
    resultsTitle: '验证结果',
    baseline: '优化前 · 全量用户', observed: '优化后 · 新用户',
    metric: '任务创建完成率',
    resultsCaption: '按原始对比图重绘，转化率为相邻阶段转化率；优化前后两步数量为估算。原图优化后为 92 / 160（57.5%），与上方 75% 指标分别保留，统计口径待核对。',
    measurement: '两项数据来自不同时间、不同用户群的同类行为埋点，可观察任务完成情况。任务耗时受其他因素影响，未达到预期目标，但目标用户对交互重构给予正向反馈。',
    original: '阅读原版案例',
  } : {
    intro: 'Redesigning migration setup for a self-service experience.',
    coverCaption: 'Object-selection concept, with the original exploration’s step names',
    background: 'From assisted setup to self-service',
    journey: 'Find the friction across the whole journey',
    interaction: 'Keep preparation, configuration and help in one flow',
    flowLabel: 'The redesigned task creation flow',
    flow: ['Connect data sources', 'Set migration type', 'Select migration objects'],
    flowNotes: ['Source and destination', 'Choose the migration mode', 'Define the scope'],
    sourceCaption: 'Setup prototype: a new source beside contextual help, with early step names',
    before: 'Original friction', after: 'Design response',
    sourceEvidence: 'View the original workflow',
    prototype: 'Try the interactive prototype', openPrototype: 'Open prototype separately',
    strengths: 'Strengths', limitations: 'Limitations',
    objectTitle: 'Make object selection a visible interaction',
    ruleTitle: 'Turn complex rules into editable conditions',
    resultsTitle: 'Measure completion and acknowledge the remaining gaps',
    baseline: 'Before · All users', observed: 'After · New users',
    metric: 'Task creation completion',
    resultsCaption: 'Redrawn from the original comparison; rates are step-to-step. The last two baseline counts are estimated. The source shows 92 / 160 (57.5%) after optimization; its measurement scope needs reconciliation with the separate 75% metric.',
    measurement: 'The data comes from comparable behavioral events across different periods and user cohorts, showing task completion. Task duration was affected by other factors and missed the target, but target users gave positive feedback on the interaction redesign.',
    original: 'Read the original case',
  }
}

export const DATABASE_OPS_SETUP_IMAGE = '/images/databaseops-visual-source-setup.jpg'


