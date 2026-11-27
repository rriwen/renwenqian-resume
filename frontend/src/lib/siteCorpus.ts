import { WRITING_URL } from '../data/siteLinks'
import { projectDescriptions } from '../data/homeProjects'
import { getProjectTitle, projects } from '../data/projects'
import { getProjectDetail, type ProjectDetailBlock, type ProjectDetailParagraph, type ProjectDetailTable } from '../data/projectDetails'
import { DATA_PILOT_VISIBLE_PARTS, getDataPilotContent } from '../data/projects/dataPilot'
import { getAboutContent, stripMarkdownInline } from '../content/about'
import { translations, type Locale } from '../i18n/translations'
import { getCaseStudyIntroduction, getCaseStudyMethods } from '../data/projects/caseStudyPresentation'
import { getChatProjectImages } from './chat/projectImages'
import resumeSupplement from '../content/resume.md?raw'

function paragraphToText(p: ProjectDetailParagraph): string {
  if (typeof p === 'string') return p
  return p.map((r) => r.href ? `${r.text} (${r.href})` : r.text).join('')
}

function serializeResponsibilities(r: NonNullable<ProjectDetailBlock['responsibilities']>): string {
  const lines: string[] = [r.intro]
  for (const item of r.items) {
    lines.push(`- ${item.title}`)
    if (item.body) lines.push(`  ${item.body}`)
    if (item.nested) {
      for (const n of item.nested) {
        lines.push(`  · ${n.title}: ${n.body}`)
      }
    }
  }
  return lines.join('\n')
}

function serializeTable(table: ProjectDetailTable): string[] {
  const hasDecisions = table.rows.some(row => row.decision)
  const lines = [[...table.columns, ...(hasDecisions ? ['设计取舍'] : [])].join(' | ')]
  const columnText: string[] = Array(table.columns.length).fill('')
  for (const row of table.rows) {
    row.cells.forEach((cell, index) => {
      if (cell !== null) columnText[index] = typeof cell === 'string' ? cell : cell.text
    })
    const decision = row.decision === 'selected' ? '采用' : row.decision === 'excluded' ? '不采用' : '未标注'
    lines.push([...columnText, ...(hasDecisions ? [decision] : [])].join(' | '))
  }
  return lines
}

function serializeProjectBlock(block: ProjectDetailBlock): string {
  const parts: string[] = []
  if (block.tags.length) parts.push(`Tags: ${block.tags.join(', ')}`)
  for (const fact of block.overviewFacts ?? []) parts.push(`${fact.label}: ${fact.value}`)
  if (block.demoUrl) parts.push(`Demo: ${block.demoUrl}`)
  for (const p of block.paragraphs) {
    parts.push(paragraphToText(p))
  }
  if (block.responsibilities) {
    parts.push(serializeResponsibilities(block.responsibilities))
  }
  if (block.afterResponsibilities?.length) {
    parts.push(block.afterResponsibilities.join('\n\n'))
  }
  if (block.highlightBulletsIntro) parts.push(block.highlightBulletsIntro)
  if (block.highlightBullets?.length) {
    block.highlightBullets.forEach((h, i) => {
      const prefix = block.highlightBulletsOrdered ? `${i + 1}.` : '-'
      parts.push(`${prefix} ${h.keyword}: ${h.text}`)
    })
  }
  if (block.afterHighlightBullets) parts.push(block.afterHighlightBullets)
  for (const section of block.sections ?? []) {
    parts.push(`#### ${section.title}`)
    parts.push(...section.paragraphs.map(paragraphToText))
    if (section.table) parts.push(...serializeTable(section.table))
    if (section.workflow) {
      parts.push(section.workflow.title)
      section.workflow.steps.forEach((step, index) => {
        parts.push(`${index + 1}. ${step.title}：${step.body}`)
        if (step.branch) parts.push(`分支：${step.branch.title}。 ${step.branch.body}`)
      })
      if (section.workflow.limitation) parts.push(section.workflow.limitation.title + section.workflow.limitation.body)
    }
    if (section.architecture) {
      const architecture = section.architecture
      parts.push(architecture.title)
      if (architecture.sharedPractices) parts.push(architecture.sharedPractices)
      if (architecture.feedback) parts.push(architecture.feedback)
      for (const layer of architecture.layers) {
        parts.push(layer.description ? `${layer.title}: ${layer.description}` : layer.title)
        parts.push(...layer.nodes.map((node) => node.description ? `${node.title}: ${node.description}` : node.title))
      }
    }
    for (const subsection of section.subsections ?? []) {
      parts.push(`##### ${subsection.title}`)
      parts.push(...subsection.paragraphs.map(paragraphToText))
      if (subsection.prototypeEmbed) parts.push(`${subsection.prototypeEmbed.title}: ${subsection.prototypeEmbed.url}`)
      parts.push(...(subsection.listItems ?? []).map((item) => `- ${paragraphToText(item)}`))
      if (subsection.table) parts.push(...serializeTable(subsection.table))
      parts.push(...(subsection.closingParagraphs ?? []).map(paragraphToText))
      parts.push(...(subsection.afterImagesParagraphs ?? []).map(paragraphToText))
      if (subsection.comparison) {
        const comparison = subsection.comparison
        parts.push(`###### ${comparison.title}`, ...comparison.paragraphs.map(paragraphToText))
        if (comparison.description) parts.push(comparison.description)
        for (const option of comparison.options) {
          parts.push(option.title, ...option.paragraphs.map(paragraphToText))
          parts.push(...option.listItems.map((item) => `- ${paragraphToText(item)}`))
          parts.push(...option.images.map((image) => image.caption).filter(Boolean))
        }
      }
      if (subsection.funnel) {
        const funnel = subsection.funnel
        parts.push(funnel.title, funnel.context, funnel.legend, funnel.note)
        parts.push(`${funnel.summary.before}${funnel.summary.value}${funnel.summary.after}`)
        parts.push(...funnel.stages.map((stage) => `${stage.label}: ${stage.estimated ? '≈ ' : ''}${stage.value}${stage.conversionRate === undefined ? '' : ` | ${stage.conversionRate}%`}`))
      }
      parts.push(...(subsection.images ?? []).map((image) => image.caption).filter(Boolean))
    }
    parts.push(...section.images.map((image) => image.caption).filter(Boolean))
  }
  if (block.externalUrl) parts.push(`Link: ${block.externalUrl}`)
  if (block.gallery?.length) {
    const caps = block.gallery.map((g) => g.caption).filter(Boolean)
    if (caps.length) parts.push(`Figure captions: ${caps.join(' | ')}`)
  }
  return parts.join('\n\n')
}

/** Serialize the same content that the case-study tabs render. */
function serializeDataPilot(locale: Locale): string {
  const content = getDataPilotContent(locale)
  const lines = [content.lead, `Link: ${content.demoUrl}`]
  for (const key of DATA_PILOT_VISIBLE_PARTS) {
    const part = content.parts[key]
    lines.push(`#### ${part.title}`)
    let previousGroup: string | undefined
    for (const section of part.sections) {
      if (section.group && section.group.id !== previousGroup) lines.push(`##### ${section.group.title}`)
      previousGroup = section.group?.id
      if (!section.continuationOf && !section.groupIntro) lines.push(`${section.group ? '######' : '#####'} ${section.title}`)
      if (section.intro) lines.push(section.intro)
      lines.push(section.body)
      if (section.workflow) {
        lines.push(section.workflow.summary, section.workflow.caption)
        for (const stage of section.workflow.stages) lines.push(`${stage.title}: ${stage.steps.join(' → ')}。${stage.branch}`)
      }
      if (section.bodyLink) lines.push(`${section.bodyLink.label} (${section.bodyLink.href})`)
      for (const reference of section.references ?? []) lines.push(`${reference.label} (${reference.href})`)
      if (section.qaExperience) {
        for (const decision of section.qaExperience.decisions) lines.push(`${decision.title}: ${decision.body}`)
        if (section.qaExperience.bridge) lines.push(section.qaExperience.bridge)
      }
      if (section.dialogue) {
        if (section.dialogue.tradeoff) lines.push(section.dialogue.tradeoff)
        for (const decision of section.dialogue.decisions) lines.push(`${decision.title}: ${decision.body}`)
        const { visual } = section.dialogue
        lines.push(visual.caption, visual.note)
        for (const frame of visual.frames) {
          lines.push(frame.title, frame.prompt, frame.response)
          lines.push(...frame.fields.map(field => `${field.label}: ${field.value}`))
        }
      }
      if (section.beforeTable) lines.push(section.beforeTable)
      if (section.table && section.id !== 'overview') lines.push(...serializeTable(section.table))
      if (section.afterTable) lines.push(section.afterTable)
      for (const step of section.steps ?? []) lines.push(`${step.title}: ${step.detail}`)
      if (section.diagram) {
        lines.push(section.diagram.caption)
        for (const lane of section.diagram.lanes) {
          lines.push(lane.title)
          if (lane.summary) lines.push(lane.summary)
          if (lane.processingLabel) lines.push(lane.processingLabel)
          for (const step of lane.steps) lines.push([step.actorLabel, step.title, step.detail, step.response].filter(Boolean).join('：'))
        }
      }
      lines.push(...(section.afterDiagram ?? []))
      if (section.table && section.id === 'overview') lines.push(...serializeTable(section.table))
      for (const application of section.applicationTypes ?? []) {
        lines.push(application.title)
        lines.push(`${content.labels.scene}: ${application.scene}`)
        lines.push(`${content.labels.problem}: ${application.problem}`)
        lines.push(`${content.labels.solution}: ${application.solution}`)
      }
      if (section.related) lines.push(`${content.labels.relatedIntro} ${content.labels.relatedProject} (/project/agentops)`)
      if (section.adoptionResult) {
        const result = section.adoptionResult
        lines.push(`${result.label}：${result.beforeLabel} ${result.before}% → ${result.afterLabel} ${result.after}%；${result.changeLabel}`)
      }
      lines.push(...(section.stats ?? []))
      if (section.evolutionMedia?.some(item => item.description)) {
        for (const item of section.evolutionMedia) {
          lines.push(item.title ?? item.caption, item.description ?? '')
          lines.push(...(item.tradeoffs ?? []).map(point => `${point.kind === 'advantage' ? '优势' : '问题'}：${point.text}`))
        }
      } else lines.push(...(section.bullets ?? []).map((bullet) => `- ${bullet}`))
      lines.push(...(section.evolutionRationale ?? []))
      lines.push(...section.images.filter(image => image.display === 'image').map(image => image.caption).filter(Boolean))
    }
  }
  return lines.join('\n\n')
}

function serializeAbout(locale: Locale): string {
  const about = getAboutContent(locale)
  const lines: string[] = []

  lines.push(`### ${about.heading}`)
  for (const paragraph of about.introParagraphs) {
    lines.push(stripMarkdownInline(paragraph))
  }
  lines.push('')

  lines.push(`#### ${'工作经历'}`)
  for (const entry of about.work) {
    lines.push(`### ${entry.title}`)
    lines.push(stripMarkdownInline(entry.meta))
    lines.push(`> ${stripMarkdownInline(entry.period)}`)
    if (entry.summary) lines.push(stripMarkdownInline(entry.summary))
    for (const bullet of entry.bullets) {
      lines.push(`- ${stripMarkdownInline(bullet)}`)
    }
    lines.push('')
  }
  lines.push('')

  lines.push('#### 项目经历')
  for (const project of about.projects) {
    lines.push(`### ${project.title}`)
    lines.push(stripMarkdownInline(project.role))
    lines.push(`> ${stripMarkdownInline(project.period)}`)
    lines.push(stripMarkdownInline(project.content))
    if (project.goal) lines.push(`项目目标：${stripMarkdownInline(project.goal)}`)
    lines.push('我的职责：')
    lines.push(...project.responsibilities.map((item) => `- ${stripMarkdownInline(item)}`))
    lines.push('业绩成果：')
    lines.push(...project.achievements.map((item) => `- ${stripMarkdownInline(item)}`))
    lines.push('')
  }

  lines.push(`#### ${'教育'}`)
  lines.push(`### ${about.education.title}`)
  lines.push(`> ${stripMarkdownInline(about.education.period)}`)
  if (about.education.summary) lines.push(stripMarkdownInline(about.education.summary))
  for (const item of about.education.items) {
    lines.push(`- ${stripMarkdownInline(item)}`)
  }
  lines.push('')

  lines.push(`#### ${'联系'}`)
  lines.push(`### ${about.contact.title}`)
  for (const item of about.contact.items) {
    lines.push(`- ${item.label}: ${item.value}`)
  }

  return lines.join('\n')
}

/**
 * 将当前语言下站内展示文案汇总为纯文本，供对话 API 作为事实来源注入。
 */
export function buildSiteCorpus(locale: Locale): string {
  const m = translations[locale]
  const lines: string[] = []

  lines.push('# 本站正文（回答须以此为据）')
  lines.push('')

  lines.push(`## ${'站点概览'}`)
  lines.push(`${m.header.name} — ${m.header.role}`)
  lines.push(m.home.title)
  lines.push(m.home.greeting, m.home.description)
  lines.push(`随便写写：外部 Notion 页面（新页签打开）。${WRITING_URL}`)
  for (const [slug, description] of Object.entries(projectDescriptions)) {
    const project = projects.find(project => project.slug === slug)!
    lines.push(`${getProjectTitle(project, locale)}：${description} (/project/${slug})`)
  }
  lines.push('')

  lines.push(`## ${'联系'}`)
  lines.push(m.contact.intro)
  lines.push(`${m.about.contactCta.title}`)
  lines.push(`${m.about.contactCta.wechatPhoneLabel}: ${m.about.contactCta.phone}`)
  lines.push(`${m.about.contactCta.emailLabel}: ${m.about.contactCta.email}`)
  lines.push('')

  lines.push('## 关于页与 PDF 简历完整履历')
  lines.push(resumeSupplement.trim())
  lines.push(serializeAbout(locale))
  lines.push('')

  lines.push(`## ${'作品与项目详情'}`)
  for (const p of projects) {
    const detail = getProjectDetail(p.slug, locale)
    lines.push(`### ${getProjectTitle(p, locale)} (slug: ${p.slug})`)
    if (p.slug === 'dataagent') {
      lines.push(serializeDataPilot(locale))
    } else if (detail) {
      const introduction = getCaseStudyIntroduction(p.slug, locale)
      if (introduction) lines.push(introduction)
      const methods = getCaseStudyMethods(p.slug, locale)
      lines.push(serializeProjectBlock({ ...detail, tags: methods.length ? methods : detail.tags }))
    } else {
      lines.push('（无详情文案）')
    }
    lines.push('')
  }

  lines.push(`## ${'可用项目配图（按相关性选择，保留原稿、探索或示意图的说明）'}`)
  for (const image of getChatProjectImages(locale)) {
    lines.push(`- ${image.projectTitle} | ${image.caption} | ${image.src} | ${image.projectPath}`)
  }

  return lines.join('\n').trim()
}
