import { projects } from '../data/projects'
import { getProjectDetail, type ProjectDetailBlock, type ProjectDetailParagraph } from '../data/projectDetails'
import { translations, type Locale, type Messages } from '../i18n/translations'

/** 与 About 页 body3 中硬编码数据一致 */
const ABOUT_BODY3_STATS = ['75%', '30%', '20%'] as const

function body1Plain(m: Messages): string {
  if (m.about.body1IntroBold) {
    const b = m.about.body1IntroBold
    return `${b.beforeName1}${b.name1}${b.betweenNames}${b.name2}${b.afterName2}`
  }
  return m.about.body1
}

function aboutBody3WithStats(m: Messages): string {
  const [a, b, c] = ABOUT_BODY3_STATS
  return `${m.about.body3a}${a}${m.about.body3b}${b}${m.about.body3c}${c}${m.about.body3d}`
}

function paragraphToText(p: ProjectDetailParagraph): string {
  if (typeof p === 'string') return p
  return p.map((r) => r.text).join('')
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

function serializeProjectBlock(block: ProjectDetailBlock): string {
  const parts: string[] = []
  if (block.tags.length) parts.push(`Tags: ${block.tags.join(', ')}`)
  for (const p of block.paragraphs) {
    parts.push(paragraphToText(p))
  }
  if (block.responsibilities) {
    parts.push(serializeResponsibilities(block.responsibilities))
  }
  if (block.afterResponsibilities?.length) {
    parts.push(block.afterResponsibilities.join('\n\n'))
  }
  if (block.highlightBullets?.length) {
    block.highlightBullets.forEach((h, i) => {
      const prefix = block.highlightBulletsOrdered ? `${i + 1}.` : '-'
      parts.push(`${prefix} ${h.keyword}: ${h.text}`)
    })
  }
  if (block.afterHighlightBullets) parts.push(block.afterHighlightBullets)
  if (block.externalUrl) parts.push(`Link: ${block.externalUrl}`)
  if (block.gallery?.length) {
    const caps = block.gallery.map((g) => g.caption).filter(Boolean)
    if (caps.length) parts.push(`Figure captions: ${caps.join(' | ')}`)
  }
  return parts.join('\n\n')
}

function section(locale: Locale, zh: string, en: string): string {
  return locale === 'zh' ? zh : en
}

function serializeAboutWork(m: Messages, locale: Locale): string {
  const w = m.about.work
  const lines: string[] = []

  lines.push(`### ${w.oceanbase.role}`)
  lines.push(w.oceanbase.meta)
  lines.push(`> ${w.oceanbase.period}`)
  for (const h of w.oceanbase.highlights) {
    lines.push(`- ${h.keyword}${h.detail}`)
  }
  lines.push('')

  lines.push(`### ${w.ecidi.role}`)
  lines.push(w.ecidi.meta)
  lines.push(`> ${w.ecidi.period}`)
  lines.push(`- ${w.ecidi.li1}`)
  lines.push(`- ${w.ecidi.li2}`)
  lines.push(`- ${w.ecidi.li3}`)
  lines.push('')

  lines.push(`### ${w.puhuai.role}`)
  lines.push(w.puhuai.meta)
  lines.push(`> ${w.puhuai.period}`)
  lines.push(`- ${w.puhuai.li1}`)
  lines.push(`- ${w.puhuai.li2}`)
  lines.push('')

  lines.push(`### ${section(locale, '教育', 'Education')}: ${m.about.education.njupt.role}`)
  lines.push(`> ${m.about.education.njupt.period}`)
  for (const item of m.about.education.njupt.items) {
    lines.push(`- ${item}`)
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
  lines.push(`### ${m.about.iDo}`)
  lines.push(body1Plain(m))
  lines.push(m.about.body2)
  lines.push(aboutBody3WithStats(m))
  lines.push('')
  lines.push(serializeAboutWork(m, locale))
  lines.push('')

  lines.push(`## ${section(locale, '作品与项目详情', 'Projects & case studies')}`)
  for (const p of projects) {
    const detail = getProjectDetail(p.slug, locale)
    lines.push(`### ${p.title} (slug: ${p.slug})`)
    if (detail) {
      lines.push(serializeProjectBlock(detail))
    } else {
      lines.push(section(locale, '（无详情文案）', '(No detail copy)'))
    }
    lines.push('')
  }

  return lines.join('\n').trim()
}
