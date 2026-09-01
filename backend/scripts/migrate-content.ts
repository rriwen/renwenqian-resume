import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { parse } from 'yaml'
import { projects } from '../../frontend/src/data/projects'
import { getProjectDetail, type ProjectDetailParagraph } from '../../frontend/src/data/projectDetails'

const root = resolve(import.meta.dirname, '../..')
const env = readFileSync(resolve(root, '.env.local'), 'utf8').split(/\r?\n/).reduce<Record<string, string>>((result, line) => {
  const match = line.match(/^([^#=]+)=(.*)$/); if (match) result[match[1]] = match[2].replace(/^"|"$/g, ''); return result
}, {})
const databaseUrl = env.POSTGRES_URL || env.DATABASE_URL
if (!databaseUrl) throw new Error('POSTGRES_URL is missing from .env.local')
const sql = postgres(databaseUrl, { ssl: 'require', max: 1 })
const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const inline = (value: string) => esc(value).replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
function markdownToHtml(source: string) {
  const blocks = source.split(/\r?\n\s*\r?\n/)
  return blocks.map((block) => {
    const heading = block.match(/^(#{1,5})\s+([\s\S]+)/); if (heading) return `<h${Math.min(3, heading[1].length + 1)}>${inline(heading[2])}</h${Math.min(3, heading[1].length + 1)}>`
    if (block.split('\n').every((line) => /^[-*]\s+/.test(line))) return `<ul>${block.split('\n').map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`
    return `<p>${inline(block.replace(/\r?\n/g, ' '))}</p>`
  }).join('')
}
function paragraphHtml(value: ProjectDetailParagraph) { return `<p>${typeof value === 'string' ? esc(value) : value.map((run) => run.bold ? `<strong>${esc(run.text)}</strong>` : esc(run.text)).join('')}</p>` }
function projectContent(slug: string) {
  const detail = getProjectDetail(slug, 'zh'); if (!detail) return ''
  const parts = detail.paragraphs.map(paragraphHtml)
  if (detail.highlightBullets?.length) parts.push(`<ul>${detail.highlightBullets.map((item) => `<li><strong>${esc(item.keyword)}</strong>：${esc(item.text)}</li>`).join('')}</ul>`)
  if (detail.afterHighlightBullets) parts.push(`<p>${esc(detail.afterHighlightBullets)}</p>`)
  if (detail.externalUrl) parts.push(`<p><a href="${esc(detail.externalUrl)}">查看项目站点</a></p>`)
  detail.gallery.forEach((image) => parts.push(`<figure><img src="${esc(image.src)}" alt="${esc(image.caption)}"><figcaption>${esc(image.caption)}</figcaption></figure>`))
  return parts.join('')
}
await sql`CREATE TABLE IF NOT EXISTS content_items (id TEXT PRIMARY KEY, kind TEXT NOT NULL, status TEXT NOT NULL, title TEXT NOT NULL, slug TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', excerpt TEXT NOT NULL DEFAULT '', cover TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(kind, slug))`
const now = new Date().toISOString()
const items = projects.map((project) => {
  const detail = getProjectDetail(project.slug, 'zh'); const excerpt = detail?.paragraphs.map((p) => typeof p === 'string' ? p : p.map((r) => r.text).join('')).join(' ').slice(0, 180) || ''
  return { id: `seed-project-${project.slug}`, kind: 'project', status: 'published', title: project.title, slug: project.slug, category: detail?.tags.join(' · ') || '项目经历', excerpt, cover: project.image, content: projectContent(project.slug), createdAt: now, updatedAt: now }
})
for (const filename of readdirSync(resolve(root, 'frontend/src/content/blog')).filter((name) => name.endsWith('.md'))) {
  const source = readFileSync(resolve(root, 'frontend/src/content/blog', filename), 'utf8'); const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/) ; if (!match) continue
  const meta = parse(match[1]) as Record<string, string>; const slug = meta.slug || filename.replace(/\.md$/, ''); if (meta.draft) continue
  items.push({ id: `seed-blog-${slug}`, kind: 'blog', status: 'published', title: meta.title, slug, category: meta.category || 'Notes', excerpt: meta.excerpt || '', cover: meta.cover || '', content: markdownToHtml(source.slice(match[0].length)), createdAt: meta.date ? `${meta.date}T00:00:00.000Z` : now, updatedAt: meta.date ? `${meta.date}T00:00:00.000Z` : now })
}
const aboutSource = readFileSync(resolve(root, 'frontend/src/content/about/zh.md'), 'utf8')
items.push({ id: 'seed-about-zh', kind: 'about', status: 'published', title: '关于我', slug: 'about-zh', category: '关于我', excerpt: '个人简介、工作经历、项目经历、教育经历与联系方式。', cover: '', content: markdownToHtml(aboutSource), createdAt: now, updatedAt: now })
await sql.begin(async (tx) => { for (const item of items) await tx`INSERT INTO content_items (id,kind,status,title,slug,category,excerpt,cover,content,created_at,updated_at) VALUES (${item.id},${item.kind},${item.status},${item.title},${item.slug},${item.category},${item.excerpt},${item.cover},${item.content},${item.createdAt},${item.updatedAt}) ON CONFLICT (kind,slug) DO UPDATE SET title=EXCLUDED.title,category=EXCLUDED.category,excerpt=EXCLUDED.excerpt,cover=EXCLUDED.cover,content=EXCLUDED.content,updated_at=EXCLUDED.updated_at` })
console.log(`Migrated ${items.length} content items.`)
await sql.end()
