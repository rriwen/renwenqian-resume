import { useCallback, useMemo } from 'react'
import type { Locale, Messages } from '../../i18n/translations'
import { buildSiteCorpus } from '../../lib/siteCorpus'
import { linesToChatTurns, type ChatCommand } from '../../lib/chat/thread'
import { prepareChatContext } from '../../lib/chat/context'
import { useChatStore } from './ChatStoreProvider'

export function useChatThread(locale: Locale, copy: Messages['chatbot']) {
  const context = useMemo(() => ({ systemPrompt: copy.systemPrompt, siteCorpus: buildSiteCorpus(locale) }), [locale, copy.systemPrompt])
  const { store, state } = useChatStore()
  const submit = useCallback((text: string) => store.submit(text, context), [store, context])
  const consume = useCallback((commands: ChatCommand[]) => store.consume(commands, context), [store, context])
  const current = state.conversations.find((conversation) => conversation.id === state.activeId)!
  const contextUsage = useMemo(() => {
    const history = linesToChatTurns(current.messages)
    if (current.draft.trim()) history.push({ role: 'user', content: current.draft.trim() })
    return prepareChatContext(context.systemPrompt, context.siteCorpus, history).usage
  }, [context, current.messages, current.draft])
  return { current, contextUsage, conversations: state.conversations, storageError: state.storageError, submit, consume,
    setDraft: store.setDraft, select: store.select, stop: store.stop }
}
