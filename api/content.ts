import postgres from 'postgres'

type ApiRequest = { method?: string; query: Record<string, string | string[]>; headers: Record<string, string | string[] | undefined>; body?: unknown }
type ApiResponse = { status(code: number): ApiResponse; json(value: unknown): void; setHeader(name: string, value: string): void }

const connectionString = process.env.POSTGRES_URL
const sql = connectionString ? postgres(connectionString, { ssl: 'require', max: 1 }) : null

async function ensureTable() {
  if (!sql) throw new Error('POSTGRES_URL is not configured')
  await sql`CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK (kind IN ('blog','project','about')),
    status TEXT NOT NULL CHECK (status IN ('draft','published')), title TEXT NOT NULL,
    slug TEXT NOT NULL, category TEXT NOT NULL DEFAULT '', excerpt TEXT NOT NULL DEFAULT '',
    cover TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(kind, slug)
  )`
  await sql`ALTER TABLE content_items DROP CONSTRAINT IF EXISTS content_items_kind_check`
  await sql`ALTER TABLE content_items ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  if (req.query.status && req.query.status !== 'published') {
    res.status(400).json({ error: 'Only published content is available' })
    return
  }
  try {
    await ensureTable()
    const kind = typeof req.query.kind === 'string' ? req.query.kind : ''
    const rows = await sql!`SELECT id, kind, status, title, slug, category, excerpt, cover, content, sort_order AS "sortOrder", created_at AS "createdAt", updated_at AS "updatedAt" FROM content_items WHERE (${kind} = '' OR kind = ${kind}) AND status = 'published' ORDER BY sort_order ASC, updated_at DESC`
    res.status(200).json(rows)
  } catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Database error' }) }
}
