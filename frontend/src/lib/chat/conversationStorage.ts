import { CHAT_THREAD_STORAGE_KEY, parseStoredLines, type ChatLine } from './thread'
import { conversationTitle } from './conversationTitle'
export { conversationTitle } from './conversationTitle'

export type ConversationStatus = 'idle' | 'generating' | 'stopped' | 'error' | 'interrupted'
export type Conversation = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatLine[]
  status: ConversationStatus
}
export type StorageAccess = () => Pick<Storage, 'length' | 'key' | 'getItem' | 'setItem' | 'removeItem'>
export const CONVERSATION_PREFIX = 'as4x-chat-conversation-v2:'
export const CHAT_SELECTION_KEY = 'as4x-chat-selection-v2'

function parseConversation(raw: string | null): Conversation | null {
  try {
    const value = JSON.parse(raw || 'null')
    if (!value || value.version !== 2 || typeof value.id !== 'string' || !value.id
      || typeof value.createdAt !== 'number' || !Number.isFinite(new Date(value.createdAt).getTime())
      || typeof value.updatedAt !== 'number' || !Number.isFinite(new Date(value.updatedAt).getTime())) return null
    const seen = new Set<string>()
    const messages: ChatLine[] = parseStoredLines(JSON.stringify(value.messages)).filter((line) => {
      if (!line.id || !line.content.trim() || seen.has(line.id)) return false
      seen.add(line.id)
      return true
    }).map(({ id, role, content, stopped }) => ({ id, role, content, ...(stopped === true ? { stopped: true as const } : {}) }))
    const firstQuestion = messages.find((line) => line.role === 'user')
    if (!firstQuestion) return null
    const status: ConversationStatus = value.status === 'generating' ? 'interrupted'
      : ['stopped', 'error', 'interrupted'].includes(value.status) ? value.status : 'idle'
    // Older saved conversations only recorded the final stop at conversation level.
    if (status === 'stopped' && messages.length) messages[messages.length - 1].stopped = true
    return { id: value.id, title: conversationTitle(firstQuestion.content), createdAt: value.createdAt,
      updatedAt: value.updatedAt, messages, status }
  } catch { return null }
}

/** Each conversation has its own key, so another tab cannot overwrite unrelated history. */
export function createConversationStorage(local: StorageAccess, legacy: StorageAccess) {
  return {
    load() {
      const conversations: Conversation[] = []
      let activeId: string | null = null
      let failed = false
      let migrationId: string | null = null
      try {
        const storage = local()
        for (let index = 0; index < storage.length; index++) {
          const key = storage.key(index)
          if (!key?.startsWith(CONVERSATION_PREFIX)) continue
          const conversation = parseConversation(storage.getItem(key))
          if (conversation && key === CONVERSATION_PREFIX + conversation.id) conversations.push(conversation)
        }
        activeId = storage.getItem(CHAT_SELECTION_KEY)
      } catch { failed = true }
      try {
        const messages = parseStoredLines(legacy().getItem(CHAT_THREAD_STORAGE_KEY)).filter((line) => line.content.trim())
        const firstQuestion = messages.find((line) => line.role === 'user')
        if (firstQuestion) {
          // Stable across StrictMode initializers and retries after a failed storage write.
          migrationId = `legacy-${firstQuestion.id}`
          if (!conversations.some((conversation) => conversation.id === migrationId)) {
            const now = Date.now()
            conversations.push({ id: migrationId, title: conversationTitle(firstQuestion.content),
              createdAt: now, updatedAt: now, messages, status: 'idle' })
            if (activeId === null) activeId = migrationId
          }
        }
      } catch { /* Legacy storage may be unavailable even when local storage works. */ }
      return { conversations, activeId, failed, migrationId }
    },
    save(conversation: Conversation) {
      try {
        const { id, title, createdAt, updatedAt, messages, status } = conversation
        local().setItem(CONVERSATION_PREFIX + id, JSON.stringify({ version: 2, id, title, createdAt, updatedAt, messages, status }))
        return true
      } catch { return false }
    },
    select(id: string | null) {
      try { local().setItem(CHAT_SELECTION_KEY, id ?? ''); return true } catch { return false }
    },
    remove(id: string) {
      try { local().removeItem(CONVERSATION_PREFIX + id); return true } catch { return false }
    },
    finishMigration() {
      try { legacy().removeItem(CHAT_THREAD_STORAGE_KEY); return true } catch { return false }
    },
  }
}
