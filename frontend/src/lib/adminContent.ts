export type ContentKind = 'blog' | 'project' | 'about'
export type ContentStatus = 'draft' | 'published'
export type ManagedContent = { id: string; kind: ContentKind; status: ContentStatus; title: string; slug: string; category: string; excerpt: string; cover: string; content: string; createdAt: string; updatedAt: string }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(response.status === 401 ? '管理密钥不正确' : `数据库请求失败 (${response.status})`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) throw new Error('数据库 API 暂时不可用，请重启本地开发服务后重试')
  return response.json() as Promise<T>
}

export function getManagedContent(adminToken: string, kind?: ContentKind) {
  return request<ManagedContent[]>(`/api/content${kind ? `?kind=${kind}` : ''}`, { headers: { 'x-admin-token': adminToken } })
}
export function saveManagedContent(items: ManagedContent[], adminToken: string) {
  return request<ManagedContent[]>('/api/content', { method: 'PUT', headers: { 'content-type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ items }) })
}
export function deleteManagedContent(id: string, adminToken: string) {
  return request<{ deleted: boolean }>(`/api/content?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-admin-token': adminToken } })
}
export function getPublishedContent(kind?: ContentKind) {
  return request<ManagedContent[]>(`/api/content?status=published${kind ? `&kind=${kind}` : ''}`)
}
export function createManagedContent(kind: ContentKind): ManagedContent {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), kind, status: 'draft', title: '', slug: '', category: kind === 'blog' ? '设计思考' : kind === 'about' ? '关于我' : '项目经历', excerpt: '', cover: '', content: '<h2>从这里开始</h2><p>写下你的内容…</p>', createdAt: now, updatedAt: now }
}
export function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '') || `content-${Date.now()}` }
