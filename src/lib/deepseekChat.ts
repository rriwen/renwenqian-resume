export type ChatTurn = { role: 'user' | 'assistant'; content: string }

type DeepSeekResponse = {
  choices?: { message?: { content?: string } }[]
  error?: { message?: string }
}

type StreamChunk = {
  choices?: { delta?: { content?: string | null } }[]
  error?: { message?: string }
}

function apiBase(): string {
  return import.meta.env.DEV ? '/deepseek' : 'https://api.deepseek.com'
}

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (!import.meta.env.DEV) {
    const key = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (key) headers.Authorization = `Bearer ${key}`
  }
  return headers
}

export function hasDeepseekClientKey(): boolean {
  return Boolean(import.meta.env.VITE_DEEPSEEK_API_KEY?.trim())
}

function processSseDataLine(payload: string, onDelta: (delta: string) => void): void {
  if (payload === '[DONE]') return
  let json: StreamChunk
  try {
    json = JSON.parse(payload) as StreamChunk
  } catch {
    return
  }
  if (json.error?.message) {
    throw new Error(json.error.message)
  }
  const delta = json.choices?.[0]?.delta?.content
  if (typeof delta === 'string' && delta.length > 0) {
    onDelta(delta)
  }
}

/**
 * Streaming chat completion (OpenAI-compatible DeepSeek SSE).
 * Calls `onDelta` for each content chunk; resolves when the stream ends.
 */
export async function sendDeepseekChatStream(
  systemPrompt: string,
  history: ChatTurn[],
  onDelta: (delta: string) => void,
): Promise<void> {
  if (!hasDeepseekClientKey()) {
    throw new Error('MISSING_API_KEY')
  }

  const url = `${apiBase()}/v1/chat/completions`
  const messages = [{ role: 'system' as const, content: systemPrompt }, ...history]

  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.65,
      stream: true,
    }),
  })

  if (!res.ok) {
    const t = await res.text()
    try {
      const data = JSON.parse(t) as DeepSeekResponse
      throw new Error(data.error?.message ?? (t || 'REQUEST_FAILED'))
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(t || 'REQUEST_FAILED')
      throw e
    }
  }

  const body = res.body
  if (!body) throw new Error('NO_RESPONSE_BODY')

  const reader = body.getReader()
  const decoder = new TextDecoder()
  let carry = ''

  while (true) {
    const { done, value } = await reader.read()
    carry += decoder.decode(value ?? new Uint8Array(), { stream: !done })
    const lines = carry.split('\n')
    carry = lines.pop() ?? ''

    for (const raw of lines) {
      const line = raw.replace(/\r$/, '').trim()
      if (!line || line.startsWith(':')) continue
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trimStart()
      processSseDataLine(payload, onDelta)
    }

    if (done) break
  }

  if (carry.trim()) {
    const line = carry.replace(/\r$/, '').trim()
    if (line.startsWith('data:')) {
      processSseDataLine(line.slice(5).trimStart(), onDelta)
    }
  }
}

/**
 * Non-streaming chat completion (OpenAI-compatible DeepSeek API).
 * In dev, Vite proxies `/deepseek` and attaches the key from env on the server side.
 */
export async function sendDeepseekChat(
  systemPrompt: string,
  history: ChatTurn[],
): Promise<string> {
  if (!hasDeepseekClientKey()) {
    throw new Error('MISSING_API_KEY')
  }

  const url = `${apiBase()}/v1/chat/completions`
  const messages = [{ role: 'system' as const, content: systemPrompt }, ...history]

  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.65,
      stream: false,
    }),
  })

  const data = (await res.json()) as DeepSeekResponse
  if (!res.ok) {
    const msg = data.error?.message ?? res.statusText
    throw new Error(msg || 'REQUEST_FAILED')
  }

  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('EMPTY_RESPONSE')
  return text
}
