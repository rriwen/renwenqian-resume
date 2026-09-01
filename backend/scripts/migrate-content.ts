import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { parse } from 'yaml'

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
    const tableLines = block.split(/\r?\n/).filter(Boolean)
    if (tableLines.length >= 2 && /^\|(?:\s*:?-+:?\s*\|)+$/.test(tableLines[1])) {
      const cells = (line: string) => line.slice(1, -1).split('|').map((cell) => inline(cell.trim()))
      const header = cells(tableLines[0]).map((cell) => `<th>${cell}</th>`).join('')
      const body = tableLines.slice(2).map((line) => `<tr>${cells(line).map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')
      return `<div class="blog-markdown-table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>`
    }
    const heading = block.match(/^(#{1,5})\s+([\s\S]+)/); if (heading) { const level = Math.min(3, Math.max(2, heading[1].length)); return `<h${level}>${inline(heading[2])}</h${level}>` }
    if (block.split('\n').every((line) => /^[-*]\s+/.test(line))) return `<ul>${block.split('\n').map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`
    if (block.split('\n').every((line) => /^\d+\.\s+/.test(line))) return `<ol>${block.split('\n').map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`).join('')}</ol>`
    return `<p>${inline(block.replace(/\r?\n/g, ' '))}</p>`
  }).join('')
}
await sql`CREATE TABLE IF NOT EXISTS content_items (id TEXT PRIMARY KEY, kind TEXT NOT NULL, status TEXT NOT NULL, title TEXT NOT NULL, slug TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', excerpt TEXT NOT NULL DEFAULT '', cover TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(kind, slug))`
const now = new Date().toISOString()
const requestedSlug = process.argv.find((argument) => argument.startsWith('--slug='))?.slice('--slug='.length)
const items: Array<{ id: string; kind: string; status: string; title: string; slug: string; category: string; excerpt: string; cover: string; content: string; createdAt: string; updatedAt: string }> = []
for (const filename of readdirSync(resolve(root, 'frontend/src/content/blog')).filter((name) => name.endsWith('.md'))) {
  const source = readFileSync(resolve(root, 'frontend/src/content/blog', filename), 'utf8'); const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/) ; if (!match) continue
  const meta = parse(match[1]) as Record<string, string>; const slug = meta.slug || filename.replace(/\.md$/, ''); if (meta.draft) continue
  if (requestedSlug && slug !== requestedSlug) continue
  items.push({ id: `seed-blog-${slug}`, kind: 'blog', status: 'published', title: meta.title, slug, category: meta.category || 'Notes', excerpt: meta.excerpt || '', cover: meta.cover || '', content: markdownToHtml(source.slice(match[0].length)), createdAt: meta.date ? `${meta.date}T00:00:00.000Z` : now, updatedAt: meta.date ? `${meta.date}T00:00:00.000Z` : now })
}
await sql.begin(async (tx) => { for (const item of items) await tx`INSERT INTO content_items (id,kind,status,title,slug,category,excerpt,cover,content,created_at,updated_at) VALUES (${item.id},${item.kind},${item.status},${item.title},${item.slug},${item.category},${item.excerpt},${item.cover},${item.content},${item.createdAt},${item.updatedAt}) ON CONFLICT (id) DO UPDATE SET kind=EXCLUDED.kind,status=EXCLUDED.status,title=EXCLUDED.title,slug=EXCLUDED.slug,category=EXCLUDED.category,excerpt=EXCLUDED.excerpt,cover=EXCLUDED.cover,content=EXCLUDED.content,updated_at=EXCLUDED.updated_at` })
console.log(`Migrated ${items.length} blog items.`)
await sql.end()
