export type AboutContactItem = {
  label: string
  value: string
}

export type AboutWorkEntry = {
  id: string
  title: string
  meta: string
  period: string
  bullets: string[]
}

export type AboutEducationEntry = {
  id: string
  title: string
  period: string
  items: string[]
}

export type AboutProjectEntry = {
  id: string
  title: string
  role: string
  period: string
  content: string
  goal: string
  responsibilities: string[]
  achievements: string[]
  responsibilitiesOrdered: boolean
  achievementsOrdered: boolean
}

export type AboutContactSection = {
  id: string
  title: string
  items: AboutContactItem[]
}

export type AboutContent = {
  heading: string
  introParagraphs: string[]
  work: AboutWorkEntry[]
  projects: AboutProjectEntry[]
  education: AboutEducationEntry
  contact: AboutContactSection
}

type RawBlock = {
  id: string
  title: string
  lines: string[]
}

// IDs stay the same in both locales and when headings or entry order change.
// Example: ## Experience <!-- id: work -->
function parseHeading(line: string): Pick<RawBlock, 'id' | 'title'> {
  const match = line.match(/^#{2,3} (.+?)\s+<!--\s*id:\s*([a-z][a-z0-9-]*)\s*-->\s*$/)
  if (!match) throw new Error(`About heading needs a stable id: ${line}`)
  return { id: match[2], title: match[1].trim() }
}

function validateHeadingIds(lines: string[]): void {
  const ids = new Set<string>()
  for (const line of lines) {
    if (!/^#{2,3} /.test(line)) continue
    const { id } = parseHeading(line)
    if (ids.has(id)) throw new Error(`Duplicate About id: ${id}`)
    ids.add(id)
  }
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

function splitBlocks(lines: string[], level: 2 | 3): RawBlock[] {
  const blocks: RawBlock[] = []
  let current: RawBlock | null = null
  const prefix = `${'#'.repeat(level)} `

  for (const line of lines) {
    if (line.startsWith(prefix)) {
      if (current) blocks.push(current)
      current = { ...parseHeading(line), lines: [] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) blocks.push(current)
  return blocks
}

function requireBlock(blocks: RawBlock[], id: string): RawBlock {
  const block = blocks.find((entry) => entry.id === id)
  if (!block) throw new Error(`Missing About section or article: ${id}`)
  return block
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

function parseProjectArticle(lines: string[]): Omit<AboutProjectEntry, 'id' | 'title'> {
  let role = ''
  let period = ''
  let readingContent = false
  let readingGoal = false
  let goal = ''
  const contentLines: string[] = []
  let section: 'responsibilities' | 'achievements' | null = null
  const responsibilities: string[] = []
  const achievements: string[] = []
  let responsibilitiesOrdered = false
  let achievementsOrdered = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) { if (readingContent) contentLines.push(''); if (readingGoal) goal += '\n'; continue }

    if (line.startsWith('>')) {
      const value = line.slice(1).trim()
      const metadata = value.split('|').map((item) => item.trim()).filter(Boolean)
      if (metadata.length > 1) {
        if (!role) role = metadata[0]
        if (!period) period = metadata[1]
      } else if (!role) role = value
      else if (!period) period = value
      continue
    }

    const contentMatch = line.match(/^(?:\*\*)?(?:内容|项目背景|背景|Content|Project background)[:：]?(?:\*\*)?\s*(.*)$/i)
    if (contentMatch) {
      contentLines.push(rawLine)
      readingContent = true
      readingGoal = false
      section = null
      continue
    }

    const goalMatch = line.match(/^(?:\*\*)?(?:目标|项目目标|Goal|Project goal)[:：]?(?:\*\*)?\s*(.*)$/i)
    if (goalMatch) {
      readingContent = false
      readingGoal = true
      goal = goalMatch[1].trim()
      section = null
      continue
    }

    if (/^(?:\*\*)?(?:我主要负责|主要负责|负责|Responsibilities)[:：]?(?:\*\*)?\s*$/.test(line)) {
      readingContent = false
      readingGoal = false
      section = 'responsibilities'
      continue
    }

    if (/^(?:\*\*)?(?:业绩|成果|Achievements)[:：]?(?:\*\*)?\s*$/.test(line)) {
      readingContent = false
      readingGoal = false
      section = 'achievements'
      continue
    }

    const bulletMatch = line.match(/^(?:-\s+|\d+[.)]\s+)(.*)$/)
    if (bulletMatch && section) {
      if (/^\d+[.)]\s+/.test(line)) {
        if (section === 'responsibilities') responsibilitiesOrdered = true
        else achievementsOrdered = true
      }
      if (section === 'responsibilities') responsibilities.push(bulletMatch[1].trim())
      else achievements.push(bulletMatch[1].trim())
      continue
    }

    if (readingContent) contentLines.push(rawLine)
    if (readingGoal) goal += '\n' + rawLine
  }

  return {
    role,
    period,
    content: contentLines.join('\n').trim(),
    goal,
    responsibilities,
    achievements,
    responsibilitiesOrdered,
    achievementsOrdered,
  }
}

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}

function parseContactSection(lines: string[]): AboutContactSection {
  const article = requireBlock(splitBlocks(lines, 3), 'get-in-touch')

  const { bullets } = parseArticle(article.lines)
  return {
    id: article.id,
    title: article.title,
    items: bullets.map(parseContactItem),
  }
}

export function parseAboutContent(source: string): AboutContent {
  const lines = source.replace(/\r\n/g, '\n').trim().split('\n')
  validateHeadingIds(lines)
  const headingLine = lines.find((line) => line.trim().startsWith('# '))
  if (!headingLine) {
    throw new Error('About markdown is missing a top-level heading')
  }

  const headingIndex = lines.indexOf(headingLine)
  const introLines = lines.slice(headingIndex + 1)
  const firstSectionIndex = introLines.findIndex((line) => line.startsWith('## '))
  const introParagraphs = splitParagraphs(firstSectionIndex >= 0 ? introLines.slice(0, firstSectionIndex) : introLines)
  const sections = splitBlocks(firstSectionIndex >= 0 ? introLines.slice(firstSectionIndex) : [], 2)

  const workSection = requireBlock(sections, 'work')
  const projectSection = requireBlock(sections, 'projects')
  const educationSection = requireBlock(sections, 'education')
  const contactSection = requireBlock(sections, 'contact')

  const workArticles = splitBlocks(workSection.lines, 3).map((article) => {
    const parsed = parseArticle(article.lines)
    return {
      id: article.id,
      title: article.title,
      meta: parsed.meta,
      period: parsed.period,
      bullets: parsed.bullets,
    }
  })

  const projects = splitBlocks(projectSection.lines, 3).map((article) => ({
    ...parseProjectArticle(article.lines),
    id: article.id,
    title: article.title,
  }))

  const educationArticle = requireBlock(splitBlocks(educationSection.lines, 3), 'njupt')
  const parsedEducation = parseArticle(educationArticle.lines)

  return {
    heading: stripMarkdownInline(headingLine.slice(2).trim()),
    introParagraphs,
    work: workArticles,
    projects,
    education: {
      id: educationArticle.id,
      title: educationArticle.title,
      period: parsedEducation.period,
      items: parsedEducation.bullets,
    },
    contact: parseContactSection(contactSection.lines),
  }
}

