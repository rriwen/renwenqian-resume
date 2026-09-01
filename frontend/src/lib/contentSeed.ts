import { getStaticBlogPosts } from './blog'
import type { ManagedContent } from './adminContent'

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inlineMarkdown = (value: string) => escapeHtml(value)
  .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')

function markdownToHtml(markdown: string) {
  const lines = markdown.split(/\r?\n/)
  const html: string[] = []
  let paragraph: string[] = []
  let list: 'ul' | 'ol' | null = null
  let code = false
  const flushParagraph = () => { if (paragraph.length) html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`); paragraph = [] }
  const closeList = () => { if (list) html.push(`</${list}>`); list = null }
  for (const line of lines) {
    if (line.startsWith('```')) { flushParagraph(); closeList(); if (code) html.push('</code></pre>'); else html.push('<pre><code>'); code = !code; continue }
    if (code) { html.push(`${escapeHtml(line)}\n`); continue }
    const heading = line.match(/^(#{1,4})\s+(.+)/)
    const bullet = line.match(/^[-*]\s+(.+)/)
    const ordered = line.match(/^\d+\.\s+(.+)/)
    if (heading) { flushParagraph(); closeList(); const level = Math.min(3, heading[1].length + 1); html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue }
    if (bullet || ordered) { flushParagraph(); const nextList = bullet ? 'ul' : 'ol'; if (list !== nextList) { closeList(); list = nextList; html.push(`<${list}>`) } html.push(`<li>${inlineMarkdown((bullet || ordered)![1])}</li>`); continue }
    if (line.startsWith('> ')) { flushParagraph(); closeList(); html.push(`<blockquote><p>${inlineMarkdown(line.slice(2))}</p></blockquote>`); continue }
    if (/^\|.*\|$/.test(line)) { flushParagraph(); closeList(); html.push(`<p>${inlineMarkdown(line)}</p>`); continue }
    if (!line.trim()) { flushParagraph(); closeList(); continue }
    paragraph.push(line.trim())
  }
  flushParagraph(); closeList(); if (code) html.push('</code></pre>')
  return html.join('')
}

export function getInitialManagedContent(existing: ManagedContent[]) {
  const now = new Date().toISOString()
  const slugs = new Set(existing.map((item) => `${item.kind}:${item.slug}`))
  const blogs: ManagedContent[] = getStaticBlogPosts().filter((post) => !slugs.has(`blog:${post.slug}`)).map((post, index) => ({
    id: `seed-blog-${post.slug}`, kind: 'blog', status: 'published', title: post.title, slug: post.slug,
    category: post.category, excerpt: post.excerpt, cover: post.cover, content: markdownToHtml(post.content),
    sortOrder: existing.filter((item) => item.kind === 'blog').length + index,
    createdAt: post.date ? `${post.date}T00:00:00.000Z` : now, updatedAt: post.date ? `${post.date}T00:00:00.000Z` : now,
  }))
  return [...existing, ...blogs]
}
