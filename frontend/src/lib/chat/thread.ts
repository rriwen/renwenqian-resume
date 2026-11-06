import type { ChatTurn } from '../deepseekChat'

export type ChatLine = ChatTurn & { id: string; stopped?: true }
export type ChatCommand = { id: string; type: 'new' }
  | { id: string; type: 'ask'; text: string }
  | { id: string; type: 'select'; conversationId: string }
export const CHAT_THREAD_STORAGE_KEY = 'as4x-chat-thread-v1'

export function parseStoredLines(raw: string | null): ChatLine[] {
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter((item): item is ChatLine => item && typeof item === 'object'
      && typeof item.id === 'string' && ['user', 'assistant'].includes(item.role)
      && typeof item.content === 'string')
  } catch { return [] }
}

export function linesToChatTurns(lines: ChatLine[]): ChatTurn[] {
  // Keep session memory intact; the shared context budget selects complete rounds at transport time.
  return lines.filter((line) => line.content.trim()).map(({ role, content }) => ({ role, content }))
}
