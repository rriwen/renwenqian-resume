import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { CONVERSATION_PREFIX, createConversationStorage } from '../../lib/chat/conversationStorage'
import { createChatStore } from '../../lib/chat/chatStore'

const ChatStoreContext = createContext<ReturnType<typeof createChatStore> | null>(null)

/** Keep one store alive across routes; the corpus and chat view still load on demand. */
export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createChatStore({
    storage: createConversationStorage(() => localStorage, () => sessionStorage),
  }))
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  useEffect(() => {
    store.flush()
    const onVisibility = () => { if (document.visibilityState === 'hidden') store.flush() }
    const onStorage = (event: StorageEvent) => {
      if (event.key?.startsWith(CONVERSATION_PREFIX) && event.newValue === null) {
        store.remove(event.key.slice(CONVERSATION_PREFIX.length))
      }
    }
    window.addEventListener('pagehide', store.dispose)
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', store.dispose)
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', onVisibility)
      store.dispose()
    }
  }, [store])
  const generating = state.conversations.some((conversation) => conversation.status === 'generating')
  useEffect(() => {
    if (!generating) return
    // Mark interrupted before navigation cancels fetch, rather than recording a network error.
    window.addEventListener('beforeunload', store.dispose)
    return () => window.removeEventListener('beforeunload', store.dispose)
  }, [store, generating])
  return <ChatStoreContext.Provider value={store}>{children}</ChatStoreContext.Provider>
}

export function useChatStore() {
  const store = useContext(ChatStoreContext)
  if (!store) throw new Error('ChatStoreProvider is required')
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  return { store, state }
}
