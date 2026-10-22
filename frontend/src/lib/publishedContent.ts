export type ContentKind = 'blog' | 'project' | 'about'
export type ContentStatus = 'draft' | 'published'
export type ManagedContent = { id: string; kind: ContentKind; status: ContentStatus; title: string; slug: string; category: string; excerpt: string; cover: string; content: string; sortOrder: number; createdAt: string; updatedAt: string }

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(`数据库请求失败 (${response.status})`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) throw new Error('数据库 API 暂时不可用，请重启本地开发服务后重试')
  return response.json() as Promise<T>
}

export function getPublishedContent(kind?: ContentKind) {
  return request<ManagedContent[]>(`/api/content?status=published${kind ? `&kind=${kind}` : ''}`)
}
