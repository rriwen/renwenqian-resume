import { readChatEventStream } from './chat/readEventStream'
import { prepareChatContext } from './chat/context'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

/** The server owns provider configuration and credentials; the client sends conversation content. */
export async function sendDeepseekChatStream(
  systemPrompt: string,
  siteCorpus: string,
  history: ChatTurn[],
  onDelta: (delta: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const { system, turns, usage } = prepareChatContext(systemPrompt, siteCorpus, history)
  if (usage.exceedsLimit) throw new Error('CONTEXT_LIMIT_EXCEEDED')
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [system, ...turns], stream: true }),
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
