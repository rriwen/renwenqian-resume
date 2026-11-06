import { sendDeepseekChatStream } from '../deepseekChat'
import { createTextReveal } from './textReveal'
import { linesToChatTurns, type ChatCommand } from './thread'
import { conversationTitle, type Conversation, type ConversationStatus, type createConversationStorage } from './conversationStorage'

type RequestContext = { systemPrompt: string; siteCorpus: string }
type Question = RequestContext & { text: string }
export type ChatConversation = Conversation & { draft: string; queued: string[] }
type Snapshot = { conversations: ChatConversation[]; activeId: string; storageError: boolean }
type Options = {
  storage: ReturnType<typeof createConversationStorage>
  send?: typeof sendDeepseekChatStream
  reveal?: typeof createTextReveal
  id?: () => string
  now?: () => number
}

/** Framework-independent session/request lifecycle; the React adapter only subscribes. */
export function createChatStore({ storage, send = sendDeepseekChatStream, reveal = createTextReveal,
  id = () => crypto.randomUUID(), now = Date.now }: Options) {
  const loaded = storage.load()
  const empty = (): ChatConversation => ({ id: id(), title: '', createdAt: now(), updatedAt: now(),
    messages: [], status: 'idle', draft: '', queued: [] })
  const conversations: ChatConversation[] = loaded.conversations.map((conversation) => ({ ...conversation, draft: '', queued: [] }))
  let selected = conversations.find((conversation) => conversation.id === loaded.activeId)
  if (!selected) { selected = empty(); conversations.push(selected) }
  let snapshot: Snapshot = { conversations, activeId: selected.id, storageError: loaded.failed }
  const listeners = new Set<() => void>()
  const consumedCommands = new Set<string>()
  const queues = new Map<string, Question[]>()
  const requests = new Map<string, { id: string; assistantId: string; controller: AbortController; reveal: ReturnType<typeof createTextReveal> }>()
  const dirty = new Set<string>(loaded.migrationId ? [loaded.migrationId] : [])
  let migrationId = loaded.migrationId
  let selectionDirty = !!migrationId
  let saveTimer: ReturnType<typeof setTimeout> | undefined

  const publish = (next: Snapshot) => { snapshot = next; listeners.forEach((listener) => listener()) }
  const find = (conversationId: string) => snapshot.conversations.find((conversation) => conversation.id === conversationId)
  const update = (conversationId: string, change: (conversation: ChatConversation) => ChatConversation) => {
    publish({ ...snapshot, conversations: snapshot.conversations.map((conversation) => conversation.id === conversationId ? change(conversation) : conversation) })
  }
  const flush = () => {
    clearTimeout(saveTimer)
    saveTimer = undefined
    let failed = false
    let attempted = false
    for (const conversationId of dirty) {
      const conversation = find(conversationId)
      attempted = true
      if (!conversation?.messages.length || storage.save(conversation)) dirty.delete(conversationId)
      else failed = true
    }
    if (selectionDirty) {
      attempted = true
      const conversation = find(snapshot.activeId)
      if (storage.select(conversation?.messages.length ? conversation.id : null)) selectionDirty = false
      else failed = true
    }
    if (migrationId && !dirty.has(migrationId) && storage.finishMigration()) migrationId = null
    if (attempted && snapshot.storageError !== failed) publish({ ...snapshot, storageError: failed })
  }
  const persist = (conversationId: string, immediate = false) => {
    dirty.add(conversationId)
    if (immediate) flush()
    else if (!saveTimer) saveTimer = setTimeout(flush, 500)
  }
  const refreshQueue = (conversationId: string) => update(conversationId, (conversation) => ({
    ...conversation, queued: (queues.get(conversationId) ?? []).map((question) => question.text),
  }))
  const drain = (conversationId: string) => {
    if (requests.has(conversationId)) return
    const question = queues.get(conversationId)?.shift()
    if (question) { refreshQueue(conversationId); start(conversationId, question) }
  }
  const settle = (conversationId: string, assistantId: string, status: ConversationStatus) => {
    update(conversationId, (conversation) => {
      const messages = conversation.messages.filter((line) => line.id !== assistantId || line.content.trim())
      return { ...conversation, status, updatedAt: now(), messages: status === 'stopped'
        ? messages.map((line, index) => index === messages.length - 1 ? { ...line, stopped: true as const } : line)
        : messages }
    })
    persist(conversationId, true)
    drain(conversationId)
  }
  const start = (conversationId: string, question: Question) => {
    const conversation = find(conversationId)
    if (!conversation || requests.has(conversationId)) return
    const requestId = id()
    const assistantId = id()
    const controller = new AbortController()
    const isCurrent = () => requests.get(conversationId)?.id === requestId && !controller.signal.aborted
    const output = reveal((chunk) => {
      if (!isCurrent()) return
      update(conversationId, (current) => ({ ...current, messages: current.messages.map((line) =>
        line.id === assistantId ? { ...line, content: line.content + chunk } : line) }))
      persist(conversationId)
    })
    requests.set(conversationId, { id: requestId, assistantId, controller, reveal: output })
    const history = [...conversation.messages, { id: id(), role: 'user' as const, content: question.text }]
    update(conversationId, (current) => ({ ...current, title: current.title || conversationTitle(question.text),
      messages: [...history, { id: assistantId, role: 'assistant', content: '' }], status: 'generating', updatedAt: now() }))
    if (snapshot.activeId === conversationId) selectionDirty = true
    persist(conversationId, true)
    void (async () => {
      let received = false
      let status: ConversationStatus = 'idle'
      try {
        await send(question.systemPrompt, question.siteCorpus, linesToChatTurns(history), (delta) => {
          if (!isCurrent()) return
          received = true
          output.append(delta)
        }, controller.signal)
        if (!isCurrent()) return
        await output.finish()
        if (!received) throw new Error('EMPTY_RESPONSE')
      } catch (error) {
        // The browser can abort a stream on reload without aborting our controller.
        status = error instanceof Error && error.name === 'AbortError' ? 'interrupted' : 'error'
      }
      finally {
        output.cancel()
        if (isCurrent()) {
          requests.delete(conversationId)
          settle(conversationId, assistantId, status)
        }
      }
    })()
  }
  const enqueue = (text: string, context: RequestContext) => {
    const content = text.trim()
    if (!content) return
    const conversationId = snapshot.activeId
    const question = { ...context, text: content }
    if (requests.has(conversationId)) {
      queues.set(conversationId, [...(queues.get(conversationId) ?? []), question])
      refreshQueue(conversationId)
    } else start(conversationId, question)
  }
  const newConversation = () => {
    const conversation = empty()
    publish({ ...snapshot, activeId: conversation.id,
      conversations: [...snapshot.conversations.filter((item) => item.messages.length), conversation] })
    selectionDirty = true
    flush()
  }
  const select = (conversationId: string) => {
    if (!find(conversationId)) return
    publish({ ...snapshot, activeId: conversationId })
    selectionDirty = true
    flush()
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    flush,
    select,
    newConversation,
    remove(conversationId: string) {
      const conversation = find(conversationId)
      if (!conversation) return true
      // Finish an interrupted migration first so a legacy copy cannot restore deleted history.
      if (migrationId === conversationId) {
        if (!storage.save(conversation) || !storage.finishMigration()) return false
        migrationId = null
      }
      if (!storage.remove(conversationId)) return false
      const request = requests.get(conversationId)
      requests.delete(conversationId)
      queues.delete(conversationId)
      dirty.delete(conversationId)
      request?.controller.abort()
      request?.reveal.cancel()
      const remaining = snapshot.conversations.filter((item) => item.id !== conversationId)
      if (snapshot.activeId === conversationId) {
        const blank = empty()
        publish({ ...snapshot, conversations: [...remaining.filter((item) => item.messages.length), blank], activeId: blank.id })
        selectionDirty = true
      } else publish({ ...snapshot, conversations: remaining })
      flush()
      return true
    },
    setDraft(text: string) { update(snapshot.activeId, (conversation) => ({ ...conversation, draft: text })) },
    submit(text: string, context: RequestContext) {
      if (!text.trim() || requests.has(snapshot.activeId)) return
      update(snapshot.activeId, (conversation) => ({ ...conversation, draft: '' }))
      enqueue(text, context)
    },
    consume(commands: ChatCommand[], context: RequestContext) {
      for (const command of commands) {
        if (consumedCommands.has(command.id)) continue
        consumedCommands.add(command.id)
        if (command.type === 'new') newConversation()
        else if (command.type === 'select') select(command.conversationId)
        else enqueue(command.text, context)
      }
      return commands.map((command) => command.id)
    },
    stop() {
      const conversationId = snapshot.activeId
      const request = requests.get(conversationId)
      if (!request) return
      requests.delete(conversationId)
      request.controller.abort()
      request.reveal.cancel()
      settle(conversationId, request.assistantId, 'stopped')
    },
    dispose() {
      queues.clear()
      for (const [conversationId, request] of requests) {
        requests.delete(conversationId)
        request.controller.abort()
        request.reveal.cancel()
        update(conversationId, (conversation) => ({ ...conversation, queued: [], status: 'interrupted',
          messages: conversation.messages.filter((line) => line.id !== request.assistantId || line.content.trim()) }))
        dirty.add(conversationId)
      }
      flush()
    },
  }
}
