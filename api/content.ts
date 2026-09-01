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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(kind, slug)
  )`
  await sql`ALTER TABLE content_items DROP CONSTRAINT IF EXISTS content_items_kind_check`
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    await ensureTable()
    if (req.method === 'GET') {
      const kind = typeof req.query.kind === 'string' ? req.query.kind : ''
      const status = typeof req.query.status === 'string' ? req.query.status : ''
      if (status !== 'published' && (!process.env.ADMIN_TOKEN || req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN)) { res.status(401).json({ error: 'Unauthorized' }); return }
      const rows = await sql!`SELECT id, kind, status, title, slug, category, excerpt, cover, content, created_at AS "createdAt", updated_at AS "updatedAt" FROM content_items WHERE (${kind} = '' OR kind = ${kind}) AND (${status} = '' OR status = ${status}) ORDER BY updated_at DESC`
      res.status(200).json(rows); return
    }
    const token = req.headers['x-admin-token']
    if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) { res.status(401).json({ error: 'Unauthorized' }); return }
    if (req.method === 'PUT') {
      const body = req.body as { items?: Array<Record<string, string>> }
      const items = body.items ?? []
      await sql!.begin(async (transaction) => {
        for (const item of items) await transaction`INSERT INTO content_items (id, kind, status, title, slug, category, excerpt, cover, content, created_at, updated_at) VALUES (${item.id}, ${item.kind}, ${item.status}, ${item.title}, ${item.slug}, ${item.category}, ${item.excerpt}, ${item.cover}, ${item.content}, ${item.createdAt}, ${item.updatedAt}) ON CONFLICT (id) DO UPDATE SET kind=EXCLUDED.kind, status=EXCLUDED.status, title=EXCLUDED.title, slug=EXCLUDED.slug, category=EXCLUDED.category, excerpt=EXCLUDED.excerpt, cover=EXCLUDED.cover, content=EXCLUDED.content, updated_at=EXCLUDED.updated_at`
      })
      res.status(200).json(items); return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Database error' }) }
}
