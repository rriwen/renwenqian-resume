import { getProjectDetail, type ProjectDetailParagraph } from '../data/projectDetails'
import { projects } from '../data/projects'
import { getStaticBlogPosts } from './blog'
import type { ManagedContent } from './adminContent'
import aboutZhSource from '../content/about/zh.md?raw'

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

function paragraphHtml(paragraph: ProjectDetailParagraph) {
  if (typeof paragraph === 'string') return `<p>${escapeHtml(paragraph)}</p>`
  return `<p>${paragraph.map((run) => run.bold ? `<strong>${escapeHtml(run.text)}</strong>` : escapeHtml(run.text)).join('')}</p>`
}

function projectHtml(slug: string) {
  const detail = getProjectDetail(slug, 'zh')
  if (!detail) return ''
  const parts = detail.paragraphs.map(paragraphHtml)
  if (detail.responsibilities) {
    parts.push(`<p>${escapeHtml(detail.responsibilities.intro)}</p><ul>${detail.responsibilities.items.map((item) => `<li><strong>${escapeHtml(item.title)}</strong>${item.body ? `：${escapeHtml(item.body)}` : ''}${item.nested ? `<ul>${item.nested.map((nested) => `<li><strong>${escapeHtml(nested.title)}</strong>：${escapeHtml(nested.body)}</li>`).join('')}</ul>` : ''}</li>`).join('')}</ul>`)
  }
  detail.afterResponsibilities?.forEach((text) => parts.push(`<p>${escapeHtml(text)}</p>`))
  if (detail.highlightBulletsIntro) parts.push(`<h2>${escapeHtml(detail.highlightBulletsIntro)}</h2>`)
  if (detail.highlightBullets?.length) parts.push(`<${detail.highlightBulletsOrdered ? 'ol' : 'ul'}>${detail.highlightBullets.map((item) => `<li><strong>${escapeHtml(item.keyword)}</strong>：${escapeHtml(item.text)}</li>`).join('')}</${detail.highlightBulletsOrdered ? 'ol' : 'ul'}>`)
  if (detail.afterHighlightBullets) parts.push(`<p>${escapeHtml(detail.afterHighlightBullets)}</p>`)
  if (detail.externalUrl) parts.push(`<p><a href="${escapeHtml(detail.externalUrl)}">查看项目站点</a></p>`)
  detail.gallery.forEach((image) => parts.push(`<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.caption)}"><figcaption>${escapeHtml(image.caption)}</figcaption></figure>`))
  return parts.join('')
}

export function getInitialManagedContent(existing: ManagedContent[]) {
  const now = new Date().toISOString()
  const slugs = new Set(existing.map((item) => `${item.kind}:${item.slug}`))
  const blogs: ManagedContent[] = getStaticBlogPosts().filter((post) => !slugs.has(`blog:${post.slug}`)).map((post) => ({
    id: `seed-blog-${post.slug}`, kind: 'blog', status: 'published', title: post.title, slug: post.slug,
    category: post.category, excerpt: post.excerpt, cover: post.cover, content: markdownToHtml(post.content),
    createdAt: post.date ? `${post.date}T00:00:00.000Z` : now, updatedAt: post.date ? `${post.date}T00:00:00.000Z` : now,
  }))
  const projectItems: ManagedContent[] = projects.filter((project) => !slugs.has(`project:${project.slug}`)).map((project) => {
    const detail = getProjectDetail(project.slug, 'zh')
    const plain = detail?.paragraphs.map((paragraph) => typeof paragraph === 'string' ? paragraph : paragraph.map((run) => run.text).join('')).join(' ') || ''
    return { id: `seed-project-${project.slug}`, kind: 'project', status: 'published', title: project.title, slug: project.slug, category: detail?.tags.join(' · ') || '项目经历', excerpt: plain.slice(0, 160), cover: project.image, content: projectHtml(project.slug), createdAt: now, updatedAt: now }
  })
  const aboutItems: ManagedContent[] = slugs.has('about:about-zh') ? [] : [{ id: 'seed-about-zh', kind: 'about', status: 'published', title: '关于我', slug: 'about-zh', category: '关于我', excerpt: '个人简介、工作经历、项目经历、教育经历与联系方式。', cover: '', content: markdownToHtml(aboutZhSource), createdAt: now, updatedAt: now }]
  return [...existing, ...projectItems, ...aboutItems, ...blogs]
}
