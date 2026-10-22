import type { IncomingMessage, ServerResponse } from 'node:http'

export const config = { maxDuration: 60 }

type ChatRequest = IncomingMessage & { body?: unknown }

export async function handleChat(req: ChatRequest, res: ServerResponse, key: string | undefined) {
  res.setHeader('Cache-Control', 'no-store')
  const fail = (status: number, message: string) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: { message } }))
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return fail(405, 'Method not allowed')
  }
  if (!key?.trim()) return fail(503, 'Chat service is unavailable')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 55000)
  const onClose = () => controller.abort()
  res.on('close', onClose)
  try {
    let body = req.body
    if (body === undefined) {
      const chunks: Buffer[] = []
      let size = 0
      for await (const chunk of req) {
        size += Buffer.byteLength(chunk)
        if (size > 500000) return fail(413, 'Request too large')
        chunks.push(Buffer.from(chunk))
      }
      body = Buffer.concat(chunks).toString('utf8')
    }
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { return fail(400, 'Invalid JSON') }
    }
    const input = body as { messages?: unknown; stream?: unknown } | null
    if (!input || !Array.isArray(input.messages) || !input.messages.length || input.messages.length > 100 ||
      input.messages.some((m) => !m || !['system', 'user', 'assistant'].includes(m.role) || typeof m.content !== 'string') ||
      JSON.stringify(input.messages).length > 500000) return fail(400, 'Invalid messages')
    const stream = input.stream === true
    const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: input.messages.map((m) => ({ role: m.role, content: m.content })), temperature: 0.65, stream, max_tokens: 2048 }),
      signal: controller.signal,
    })
    if (!upstream.ok || !upstream.body) return fail(upstream.status === 429 ? 429 : 502, 'Chat service is temporarily unavailable')
    res.setHeader('Content-Type', stream ? 'text/event-stream; charset=utf-8' : 'application/json')
    res.flushHeaders()
    for await (const chunk of upstream.body as unknown as AsyncIterable<Uint8Array>) {
      if (res.destroyed) break
      res.write(chunk)
    }
    res.end()
  } catch {
    if (!res.destroyed) {
      if (!res.headersSent) fail(502, 'Chat request failed')
      else res.destroy()
    }
  } finally {
    clearTimeout(timer)
    res.off('close', onClose)
  }
}

export default async function handler(req: ChatRequest, res: ServerResponse) {
  return handleChat(req, res, process.env.DEEPSEEK_API_KEY)
}
