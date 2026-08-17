import { parse } from 'yaml'

export type BlogPost = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  cover: string
  coverAlt: string
  featured: boolean
  readingMinutes: number
  content: string
}

type BlogFrontmatter = {
  slug?: string
  title?: string
  date?: string
  category?: string
  excerpt?: string
  cover?: string
  coverAlt?: string
  featured?: boolean
  readingMinutes?: number
  draft?: boolean
}

const markdownFiles = import.meta.glob('../content/blog/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

function estimateReadingMinutes(content: string) {
  const chineseCharacters = (content.match(/[\u3400-\u9fff]/g) ?? []).length
  const latinWords = content
    .replace(/[\u3400-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(chineseCharacters / 300 + latinWords / 200))
}

function toPost(path: string, source: string): BlogPost | null {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!frontmatter) {
    throw new Error(`Blog frontmatter is missing: ${path}`)
  }

  const meta = parse(frontmatter[1]) as BlogFrontmatter
  const content = source.slice(frontmatter[0].length)
  if (meta.draft) return null

  const filename = path.split('/').pop()?.replace(/\.md$/, '') ?? ''
  const slug = meta.slug || filename
  if (!meta.title || !slug) {
    throw new Error(`Blog frontmatter is incomplete: ${path}`)
  }

  const dateFromFilename = filename.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || ''
  const firstParagraph = content
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith('#') && !part.startsWith('```')) || ''
  const excerpt = meta.excerpt || firstParagraph.replace(/[*_`>\[\]]/g, '').slice(0, 180)

  return {
    slug,
    title: meta.title,
    date: meta.date || dateFromFilename,
    category: meta.category || 'Notes',
    excerpt,
    cover: meta.cover || '',
    coverAlt: meta.coverAlt || meta.title,
    featured: Boolean(meta.featured),
    readingMinutes: meta.readingMinutes || estimateReadingMinutes(content),
    content,
  }
}

const posts = Object.entries(markdownFiles)
  .map(([path, source]) => toPost(path, source))
  .filter((post): post is BlogPost => post !== null)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getBlogPosts() {
  return posts
}

export function getBlogPost(slug?: string) {
  return posts.find((post) => post.slug === slug)
}

export function formatBlogDate(date: string, locale: 'zh' | 'en') {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: locale === 'zh' ? 'long' : 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
