import type { ChatTurn } from '../deepseekChat'

export type ChatLine = ChatTurn & { id: string }
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

export function loadThread(): ChatLine[] {
  try { return parseStoredLines(sessionStorage.getItem(CHAT_THREAD_STORAGE_KEY)) } catch { return [] }
}

export function linesToChatTurns(lines: ChatLine[]): ChatTurn[] {
  // The API allows 100 messages including the system message. Keep full UI history.
  return lines.filter((line) => line.content.trim()).slice(-99).map(({ role, content }) => ({ role, content }))
}

export function stripAssistantBoldMarkers(text: string): string {
  let previous = ''
  while (text !== previous) {
    previous = text
    text = text.replace(/\*\*([\s\S]+?)\*\*/g, '$1')
  }
  return text.replace(/\*\*/g, '')
}
