import { getProjectTitle, projects } from '../data/projects'
import { getProjectDetail, type ProjectDetailBlock, type ProjectDetailParagraph, type ProjectDetailTable } from '../data/projectDetails'
import { getDataPilotContent } from '../data/projects/dataPilot'
import { getAboutContent, stripMarkdownInline } from '../content/about'
import { translations, type Locale } from '../i18n/translations'
import { getChatProjectImages } from './chat/projectImages'

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
  const lines = [table.columns.join(' | ')]
  const columnText: string[] = Array(table.columns.length).fill('')
  for (const row of table.rows) {
    row.cells.forEach((cell, index) => {
      if (cell !== null) columnText[index] = typeof cell === 'string' ? cell : cell.text
    })
    lines.push(columnText.join(' | '))
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
    if (section.architecture) {
      const architecture = section.architecture
      parts.push(architecture.title)
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

/** Serialize the same content that the three case-study tabs render. */
function serializeDataPilot(locale: Locale): string {
  const content = getDataPilotContent(locale)
  const lines = [...content.paragraphs, ...content.metadata, `Link: ${content.demoUrl}`]
  for (const part of Object.values(content.parts)) {
    lines.push(`#### ${part.title}`)
    for (const section of part.sections) {
      lines.push(`##### ${section.title}`)
      if (section.intro) lines.push(section.intro)
      lines.push(section.body)
      if (section.table) lines.push(...serializeTable(section.table))
      for (const step of section.steps ?? []) lines.push(`${step.title}: ${step.detail}`)
      for (const application of section.applicationTypes ?? []) {
        lines.push(application.title)
        lines.push(`${content.labels.scene}: ${application.scene}`)
        lines.push(`${content.labels.problem}: ${application.problem}`)
        lines.push(`${content.labels.solution}: ${application.solution}`)
      }
      if (section.related) lines.push(`${content.labels.relatedIntro} ${content.labels.relatedProject} (/project/agentops)`)
      lines.push(...(section.stats ?? []))
      lines.push(...(section.bullets ?? []).map((bullet) => `- ${bullet}`))
      lines.push(...section.images.map((image) => image.caption).filter(Boolean))
    }
  }
  return lines.join('\n\n')
}

function section(locale: Locale, zh: string, en: string): string {
  return locale === 'zh' ? zh : en
}

function serializeAbout(locale: Locale): string {
  const about = getAboutContent(locale)
  const lines: string[] = []

  lines.push(`### ${about.heading}`)
  for (const paragraph of about.introParagraphs) {
    lines.push(stripMarkdownInline(paragraph))
  }
  lines.push('')

  lines.push(`#### ${section(locale, '工作经历', 'Experience')}`)
  for (const entry of about.work) {
    lines.push(`### ${entry.title}`)
    lines.push(stripMarkdownInline(entry.meta))
    lines.push(`> ${stripMarkdownInline(entry.period)}`)
    for (const bullet of entry.bullets) {
      lines.push(`- ${stripMarkdownInline(bullet)}`)
    }
    lines.push('')
  }
  lines.push('')

  lines.push(`#### ${section(locale, '教育', 'Education')}`)
  lines.push(`### ${about.education.title}`)
  lines.push(`> ${stripMarkdownInline(about.education.period)}`)
  for (const item of about.education.items) {
    lines.push(`- ${stripMarkdownInline(item)}`)
  }
  lines.push('')

  lines.push(`#### ${section(locale, '联系', 'Contact')}`)
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

  lines.push(section(locale, '# 本站正文（回答须以此为据）', '# Site copy (ground truth for answers)'))
  lines.push('')

  lines.push(`## ${section(locale, '站点概览', 'Overview')}`)
  lines.push(`${m.header.name} — ${m.header.role}`)
  lines.push(m.home.title)
  lines.push(m.home.greeting, m.home.description)
  lines.push('')

  lines.push(`## ${section(locale, '页脚', 'Footer')}`)
  lines.push(m.footer.bioLines.join('\n'))
  lines.push('')

  lines.push(`## ${section(locale, '联系', 'Contact')}`)
  lines.push(m.contact.intro)
  lines.push(`${m.about.contactCta.title}`)
  lines.push(`${m.about.contactCta.wechatPhoneLabel}: ${m.about.contactCta.phone}`)
  lines.push(`${m.about.contactCta.emailLabel}: ${m.about.contactCta.email}`)
  lines.push('')

  lines.push(`## ${section(locale, '关于页', 'About page')}`)
  lines.push(serializeAbout(locale))
  lines.push('')

  lines.push(`## ${section(locale, '作品与项目详情', 'Projects & case studies')}`)
  for (const p of projects) {
    const detail = getProjectDetail(p.slug, locale)
    lines.push(`### ${getProjectTitle(p, locale)} (slug: ${p.slug})`)
    if (p.slug === 'dataagent') {
      lines.push(serializeDataPilot(locale))
    } else if (detail) {
      lines.push(serializeProjectBlock(detail))
    } else {
      lines.push(section(locale, '（无详情文案）', '(No detail copy)'))
    }
    lines.push('')
  }

  lines.push(`## ${section(locale, '可用项目配图（按相关性选择，保留原稿、探索或示意图的说明）', 'Available project figures (select relevant images and preserve draft/exploration/diagram context)')}`)
  for (const image of getChatProjectImages(locale)) {
    lines.push(`- ${image.projectTitle} | ${image.caption} | ${image.src} | ${image.projectPath}`)
  }

  return lines.join('\n').trim()
}
