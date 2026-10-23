import { readChatEventStream } from './chat/readEventStream'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

/** The server owns provider configuration and credentials; the client sends conversation content. */
export async function sendDeepseekChatStream(
  systemPrompt: string,
  siteCorpus: string,
  history: ChatTurn[],
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const systemBody = siteCorpus.trim() ? `${systemPrompt}\n\n---\n\n${siteCorpus.trim()}` : systemPrompt
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'system', content: systemBody }, ...history], stream: true }),
    signal,
  })
  if (!response.ok) {
    let message = 'REQUEST_FAILED'
    try {
      const data = await response.json() as { error?: { message?: string } }
      message = data.error?.message || message
    } catch { /* non-JSON server errors use the generic message */ }
    throw new Error(message)
  }
  if (!response.body) throw new Error('NO_RESPONSE_BODY')
  await readChatEventStream(response.body, onDelta)
}
