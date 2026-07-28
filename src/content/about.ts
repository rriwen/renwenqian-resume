import { Fragment, createElement, type ReactNode } from 'react'
import type { Locale } from '../i18n/translations'

const aboutSources = import.meta.glob('./about/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const ABOUT_SOURCE_BY_LOCALE: Record<Locale, string> = {
  en: './about/en.md',
  zh: './about/zh.md',
}

export type AboutContactItem = {
  label: string
  value: string
}

export type AboutWorkEntry = {
  title: string
  meta: string
  period: string
  bullets: string[]
}

export type AboutEducationEntry = {
  title: string
  period: string
  items: string[]
}

export type AboutContactSection = {
  title: string
  items: AboutContactItem[]
}

export type AboutContent = {
  heading: string
  introParagraphs: string[]
  work: AboutWorkEntry[]
  education: AboutEducationEntry
  contact: AboutContactSection
}

type RawSection = {
  lines: string[]
}

type RawArticle = {
  title: string
  lines: string[]
}

function readSource(locale: Locale): string {
  const source = aboutSources[ABOUT_SOURCE_BY_LOCALE[locale]]
  if (typeof source !== 'string') {
    throw new Error(`Missing About markdown source for locale: ${locale}`)
  }
  return source.replace(/\r\n/g, '\n').trim()
}

function splitParagraphs(lines: string[]): string[] {
  const paragraphs: string[] = []
  let buffer: string[] = []

  const flush = () => {
    const paragraph = buffer.map((line) => line.trim()).join(' ').trim()
    if (paragraph) paragraphs.push(paragraph)
    buffer = []
  }

  for (const line of lines) {
    if (!line.trim()) {
      flush()
      continue
    }
    buffer.push(line)
  }

  flush()
  return paragraphs
}

function splitSections(lines: string[]): RawSection[] {
  const sections: RawSection[] = []
  let current: RawSection | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current)
      current = { lines: [] }
      continue
    }
    if (current) current.lines.push(line)
  }

  if (current) sections.push(current)
  return sections
}

function splitArticles(lines: string[]): RawArticle[] {
  const articles: RawArticle[] = []
  let current: RawArticle | null = null

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) articles.push(current)
      current = { title: line.slice(4).trim(), lines: [] }
      continue
    }
    if (current) current.lines.push(line)
  }

  if (current) articles.push(current)
  return articles
}

function parseArticle(lines: string[]): { meta: string; period: string; bullets: string[] } {
  const metaLines: string[] = []
  const bullets: string[] = []
  let period = ''
  let seenStructuredBlock = false

  const appendMetaLine = (line: string) => {
    if (seenStructuredBlock) return
    metaLines.push(line)
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      continue
    }
    if (line.startsWith('>')) {
      seenStructuredBlock = true
      if (!period) period = line.slice(1).trim()
      continue
    }
    if (line.startsWith('- ')) {
      seenStructuredBlock = true
      bullets.push(line.slice(2).trim())
      continue
    }
    appendMetaLine(line)
  }

  return {
    meta: metaLines.join(' ').trim(),
    period,
    bullets,
  }
}

function parseContactItem(line: string): AboutContactItem {
  const colonIndex = line.search(/[:：]/)
  if (colonIndex < 0) {
    return { label: line.trim(), value: '' }
  }

  return {
    label: line.slice(0, colonIndex).trim(),
    value: line.slice(colonIndex + 1).trim(),
  }
}

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}

function parseContactSection(lines: string[]): AboutContactSection {
  const articles = splitArticles(lines)
  const article = articles[0]
  if (!article) {
    throw new Error('Missing About contact section')
  }

  const { bullets } = parseArticle(article.lines)
  return {
    title: article.title,
    items: bullets.map(parseContactItem),
  }
}

export function getAboutContent(locale: Locale): AboutContent {
  const source = readSource(locale)
  const lines = source.split('\n')
  const headingLine = lines.find((line) => line.trim().startsWith('# '))
  if (!headingLine) {
    throw new Error(`About markdown is missing a top-level heading for locale: ${locale}`)
  }

  const headingIndex = lines.indexOf(headingLine)
  const introLines = lines.slice(headingIndex + 1)
  const firstSectionIndex = introLines.findIndex((line) => line.startsWith('## '))
  const introParagraphs = splitParagraphs(firstSectionIndex >= 0 ? introLines.slice(0, firstSectionIndex) : introLines)
  const sections = splitSections(firstSectionIndex >= 0 ? introLines.slice(firstSectionIndex) : [])

  const workSection = sections[0]
  const educationSection = sections[1]
  const contactSection = sections[2]

  if (!workSection || !educationSection || !contactSection) {
    throw new Error(`About markdown is missing one or more sections for locale: ${locale}`)
  }

  const workArticles = splitArticles(workSection.lines).map((article) => {
    const parsed = parseArticle(article.lines)
    return {
      title: article.title,
      meta: parsed.meta,
      period: parsed.period,
      bullets: parsed.bullets,
    }
  })

  const educationArticles = splitArticles(educationSection.lines)
  const educationArticle = educationArticles[0]
  if (!educationArticle) {
    throw new Error(`About markdown is missing the education article for locale: ${locale}`)
  }
  const parsedEducation = parseArticle(educationArticle.lines)

  return {
    heading: stripMarkdownInline(headingLine.slice(2).trim()),
    introParagraphs,
    work: workArticles,
    education: {
      title: educationArticle.title,
      period: parsedEducation.period,
      items: parsedEducation.bullets,
    },
    contact: parseContactSection(contactSection.lines),
  }
}

export function renderMarkdownInline(text: string): ReactNode {
  const nodes: ReactNode[] = []
  let index = 0
  let key = 0

  const pushText = (value: string) => {
    if (!value) return
    nodes.push(value)
  }

  while (index < text.length) {
    const boldStart = text.indexOf('**', index)
    const linkStart = text.indexOf('[', index)

    let nextIndex = -1
    let nextKind: 'bold' | 'link' | null = null

    if (boldStart >= 0 && (linkStart < 0 || boldStart < linkStart)) {
      nextIndex = boldStart
      nextKind = 'bold'
    } else if (linkStart >= 0) {
      nextIndex = linkStart
      nextKind = 'link'
    }

    if (nextIndex < 0) {
      pushText(text.slice(index))
      break
    }

    if (nextIndex > index) {
      pushText(text.slice(index, nextIndex))
    }

    if (nextKind === 'bold') {
      const endIndex = text.indexOf('**', nextIndex + 2)
      if (endIndex < 0) {
        pushText(text.slice(nextIndex))
        break
      }
      nodes.push(createElement('strong', { key: `strong-${key++}` }, text.slice(nextIndex + 2, endIndex)))
      index = endIndex + 2
      continue
    }

    if (nextKind === 'link') {
      const labelEnd = text.indexOf(']', nextIndex + 1)
      const urlStart = labelEnd >= 0 ? text.indexOf('(', labelEnd + 1) : -1
      const urlEnd = urlStart >= 0 ? text.indexOf(')', urlStart + 1) : -1
      if (labelEnd < 0 || urlStart !== labelEnd + 1 || urlEnd < 0) {
        pushText(text.slice(nextIndex))
        break
      }

      const label = text.slice(nextIndex + 1, labelEnd)
      const href = text.slice(urlStart + 1, urlEnd)
      nodes.push(createElement('a', { key: `link-${key++}`, href }, label))
      index = urlEnd + 1
    }
  }

  return createElement(Fragment, null, ...nodes)
}
