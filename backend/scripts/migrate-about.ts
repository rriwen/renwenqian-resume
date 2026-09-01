import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'

const root = resolve(import.meta.dirname, '../..')
const env = readFileSync(resolve(root, '.env.local'), 'utf8').split(/\r?\n/).reduce<Record<string, string>>((result, line) => {
  const match = line.match(/^([^#=]+)=(.*)$/); if (match) result[match[1]] = match[2].replace(/^"|"$/g, ''); return result
}, {})
const databaseUrl = env.POSTGRES_URL || env.DATABASE_URL
if (!databaseUrl) throw new Error('POSTGRES_URL is missing from .env.local')
const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inline = (value: string) => esc(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
function markdownToHtml(source: string) {
  const lines = source.split(/\r?\n/); const html: string[] = []; let list = false; let paragraph: string[] = []
  const flush = () => { if (paragraph.length) html.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = [] }
  const closeList = () => { if (list) html.push('</ul>'); list = false }
  for (const line of lines) {
    const heading = line.match(/^(#{1,4})\s+(.+)/); const bullet = line.match(/^[-*]\s+(.+)/)
    if (heading) { flush(); closeList(); const level = Math.min(3, heading[1].length + 1); html.push(`<h${level}>${inline(heading[2])}</h${level}>`); continue }
    if (bullet) { flush(); if (!list) { html.push('<ul>'); list = true } html.push(`<li>${inline(bullet[1])}</li>`); continue }
    if (line.startsWith('> ')) { flush(); closeList(); html.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); continue }
    if (!line.trim()) { flush(); closeList(); continue }
    paragraph.push(line.trim())
  }
  flush(); closeList(); return html.join('')
}
const sql = postgres(databaseUrl, { ssl: 'require', max: 1 })
const content = markdownToHtml(readFileSync(resolve(root, 'frontend/src/content/about/zh.md'), 'utf8'))
await sql`ALTER TABLE content_items DROP CONSTRAINT IF EXISTS content_items_kind_check`
await sql`INSERT INTO content_items (id,kind,status,title,slug,category,excerpt,cover,content,created_at,updated_at) VALUES ('seed-about-zh','about','published','关于我','about-zh','关于我','个人简介、工作经历、项目经历、教育经历与联系方式。','',${content},NOW(),NOW()) ON CONFLICT (id) DO UPDATE SET content=EXCLUDED.content, updated_at=EXCLUDED.updated_at`
console.log('Migrated About content.')
await sql.end()
