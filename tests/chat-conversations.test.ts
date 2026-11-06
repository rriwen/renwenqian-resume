import test from 'node:test'
import assert from 'node:assert/strict'
import { createChatStore } from '../frontend/src/lib/chat/chatStore'
import { createConversationStorage, CONVERSATION_PREFIX, CHAT_SELECTION_KEY } from '../frontend/src/lib/chat/conversationStorage'
import { CHAT_THREAD_STORAGE_KEY } from '../frontend/src/lib/chat/thread'
import { createTextReveal } from '../frontend/src/lib/chat/textReveal'
import type { ChatTurn } from '../frontend/src/lib/deepseekChat'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleChat } from '../api/chat'

const context = { systemPrompt: 'system', siteCorpus: 'corpus' }
const tick = () => new Promise<void>((resolve) => setImmediate(resolve))
let fixtureSequence = 0

function memoryStorage() {
  const records = new Map<string, string>()
  return { records, get length() { return records.size }, key: (index: number) => [...records.keys()][index] ?? null,
    getItem: (key: string) => records.get(key) ?? null,
    setItem(key: string, value: string) { records.set(key, value) },
    removeItem(key: string) { records.delete(key) } }
}

function fixture(options: { buffered?: boolean; reveal?: typeof createTextReveal; local?: ReturnType<typeof memoryStorage>; legacy?: ReturnType<typeof memoryStorage> } = {}) {
  const local = options.local ?? memoryStorage()
  const legacy = options.legacy ?? memoryStorage()
  const storage = createConversationStorage(() => local, () => legacy)
  const requests: { history: ChatTurn[]; emit: (text: string) => void; signal: AbortSignal; finish: () => void; fail: (error?: Error) => void }[] = []
  const buffers: { flush: () => void }[] = []
  let sequence = 0
  const prefix = ++fixtureSequence
  const store = createChatStore({ storage, id: () => `id-${prefix}-${++sequence}`, now: () => ++sequence,
    send: async (_system, _corpus, history, emit, signal) => new Promise<void>((resolve, reject) => {
      // Deliberately ignore abort, to exercise late callbacks from obsolete requests.
      requests.push({ history, emit, signal: signal!, finish: resolve, fail: (error = new Error('network failed')) => reject(error) })
    }),
    reveal: options.reveal ?? ((onText) => {
      let pending = ''
      let cancelled = false
      let finish: (() => void) | undefined
      const flush = () => { if (!cancelled && pending) { onText(pending); pending = '' }; finish?.() }
      buffers.push({ flush })
      return { append(text) { if (!cancelled) { pending += text; if (!options.buffered) flush() } },
        finish: () => options.buffered ? new Promise<void>((resolve) => { finish = resolve }) : Promise.resolve(),
        cancel() { cancelled = true; pending = ''; finish?.() } }
    }),
  })
  const current = () => store.getSnapshot().conversations.find((conversation) => conversation.id === store.getSnapshot().activeId)!
  return { store, requests, buffers, current, local, legacy, storage }
}

test('new chats stay out of history until sent; drafts and request context remain isolated', async () => {
  const f = fixture()
  f.store.newConversation()
  f.store.newConversation()
  assert.equal([...f.local.records.keys()].filter((key) => key.startsWith(CONVERSATION_PREFIX)).length, 0)
  f.store.submit('first question', context)
  const firstId = f.current().id
  f.requests[0].emit('first answer')
  f.requests[0].finish()
  await tick()
  f.store.setDraft('unsent follow-up')
  f.store.newConversation()
  f.store.submit('second question', context)
  assert.deepEqual(f.requests[1].history, [{ role: 'user', content: 'second question' }])
  f.store.select(firstId)
  assert.equal(f.current().draft, 'unsent follow-up')
  f.store.submit('follow-up', context)
  assert.deepEqual(f.requests[2].history.map((line) => line.content), ['first question', 'first answer', 'follow-up'])
  assert.equal(f.current().draft, '')
  f.store.dispose()
})

test('resuming persisted memory includes both user facts and replies in the next request', async () => {
  const f = fixture()
  f.store.submit('请叫我小林，回答请简短', context)
  f.requests[0].emit('好的，小林。')
  f.requests[0].finish()
  await tick()
  f.store.dispose()
  const restored = fixture({ local: f.local })
  restored.store.submit('你还记得我的称呼和偏好吗？', context)
  assert.deepEqual(restored.requests[0].history.map((message) => message.content), [
    '请叫我小林，回答请简短', '好的，小林。', '你还记得我的称呼和偏好吗？',
  ])
  restored.store.dispose()
})

test('parallel streams and background failures never change the selected chat', async () => {
  const f = fixture()
  f.store.submit('A', context)
  const a = f.current().id
  f.store.newConversation()
  f.store.submit('B', context)
  const b = f.current().id
  f.requests[0].emit('answer A')
  f.requests[1].emit('answer B')
  f.requests[0].fail()
  await tick()
  assert.equal(f.current().id, b)
  assert.equal(f.current().status, 'generating')
  assert.deepEqual(f.current().messages.map((line) => line.content), ['B', 'answer B'])
  f.store.select(a)
  assert.equal(f.current().status, 'error')
  assert.deepEqual(f.current().messages.map((line) => line.content), ['A', 'answer A'])
  assert.equal(f.requests[1].signal.aborted, false)
  f.store.dispose()
})

test('stop before the first token removes the empty reply and stale completion cannot stop a new request', async () => {
  const f = fixture()
  f.store.submit('one', context)
  f.store.stop()
  assert.equal(f.requests[0].signal.aborted, true)
  assert.equal(f.current().status, 'stopped')
  assert.deepEqual(f.current().messages.map((line) => line.content), ['one'])
  f.store.submit('two', context)
  f.requests[0].emit('late text')
  f.requests[0].finish()
  await tick()
  assert.equal(f.current().status, 'generating')
  f.requests[1].emit('fresh')
  f.requests[1].finish()
  await tick()
  assert.equal(f.current().status, 'idle')
  assert.deepEqual(f.current().messages.map((line) => line.content), ['one', 'two', 'fresh'])
  f.store.dispose()
})

test('stop keeps displayed text, drops reveal buffers and affects only the current request', async () => {
  const f = fixture({ buffered: true })
  f.store.submit('A', context)
  const a = f.current().id
  f.requests[0].emit('visible')
  f.buffers[0].flush()
  f.requests[0].emit('buffered')
  f.store.newConversation()
  f.store.submit('B', context)
  f.store.select(a)
  f.store.stop()
  f.buffers[0].flush()
  f.requests[0].finish()
  await tick()
  assert.deepEqual(f.current().messages.map((line) => line.content), ['A', 'visible'])
  assert.equal(f.current().messages[1].stopped, true)
  assert.equal(f.requests[0].signal.aborted, true)
  assert.equal(f.requests[1].signal.aborted, false)
  assert.equal(f.storage.load().conversations.find((conversation) => conversation.id === a)?.status, 'stopped')
  f.store.dispose()
})

test('stop markers survive continuation and reload without entering model messages', async () => {
  for (const partial of ['', 'partial reply']) {
    const f = fixture()
    f.store.submit('question', context)
    if (partial) f.requests[0].emit(partial)
    f.store.stop()
    const stoppedLine = f.current().messages.slice(-1)[0]
    assert.equal(stoppedLine.stopped, true)
    f.store.submit('follow-up', context)
    assert.deepEqual(f.requests[1].history, [
      { role: 'user', content: 'question' },
      ...(partial ? [{ role: 'assistant', content: partial }] : []),
      { role: 'user', content: 'follow-up' },
    ])
    f.requests[1].emit('answer')
    f.requests[1].finish()
    await tick()
    f.store.dispose()
    const restored = fixture({ local: f.local })
    assert.equal(restored.current().status, 'idle')
    assert.equal(restored.current().messages.find((line) => line.id === stoppedLine.id)?.stopped, true)
    assert.equal(restored.current().messages.filter((line) => line.stopped).length, 1)
    restored.store.dispose()
  }
})

test('older stopped conversations recover their inline marker', () => {
  const local = memoryStorage()
  local.setItem(CONVERSATION_PREFIX + 'old', JSON.stringify({ version: 2, id: 'old', createdAt: 1, updatedAt: 2,
    status: 'stopped', messages: [{ id: 'question', role: 'user', content: 'hello' }] }))
  const storage = createConversationStorage(() => local, () => memoryStorage())
  assert.equal(storage.load().conversations[0].messages[0].stopped, true)
})

test('stop also cancels the real reveal after the network has already finished', async () => {
  const f = fixture({ reveal: createTextReveal })
  f.store.submit('question', context)
  f.requests[0].emit('abcdefghijklmnopqrstuvwxyz')
  f.requests[0].finish()
  await tick()
  assert.equal(f.current().status, 'generating')
  const visible = f.current().messages.slice(-1)[0]?.content
  assert.equal(visible, 'abcdefghij')
  f.store.stop()
  await tick()
  assert.equal(f.current().status, 'stopped')
  assert.equal(f.current().messages.slice(-1)[0]?.content, visible)
  f.store.dispose()
})

test('ordered commands are consumed once and queued questions stay with their original chat', async () => {
  const f = fixture()
  const commands = [
    { id: 'ask-a', type: 'ask' as const, text: 'A' },
    { id: 'follow-a', type: 'ask' as const, text: 'A follow-up' },
    { id: 'new-b', type: 'new' as const },
    { id: 'ask-b', type: 'ask' as const, text: 'B' },
  ]
  f.store.consume(commands, context)
  const b = f.current().id
  f.store.consume(commands, context) // StrictMode/reopening must not replay commands.
  assert.equal(f.requests.length, 2)
  f.requests[0].emit('answer A')
  f.requests[0].finish()
  await tick()
  assert.equal(f.requests.length, 3)
  assert.deepEqual(f.requests[2].history.map((line) => line.content), ['A', 'answer A', 'A follow-up'])
  assert.equal(f.current().id, b)
  assert.equal(f.current().messages[0].content, 'B')
  f.store.dispose()
})

test('history selection follows pending new-chat commands without replaying replies', async () => {
  const f = fixture()
  f.store.submit('saved question', context)
  const savedId = f.current().id
  f.requests[0].emit('partial answer')
  const commands = [
    { id: 'new-from-home', type: 'new' as const },
    { id: 'select-history', type: 'select' as const, conversationId: savedId },
  ]
  f.store.consume(commands, context)
  f.store.consume(commands, context)
  assert.equal(f.current().id, savedId)
  assert.equal(f.requests.length, 1)
  assert.equal(f.requests[0].signal.aborted, false)
  assert.deepEqual(f.current().messages.map((line) => line.content), ['saved question', 'partial answer'])
  f.store.consume([{ id: 'follow-up', type: 'ask', text: 'continue' }], context)
  f.requests[0].finish()
  await tick()
  assert.deepEqual(f.requests[1].history.map((line) => line.content), ['saved question', 'partial answer', 'continue'])
  f.store.dispose()
})

test('selection and partial replies survive reload without restarting a request', () => {
  const f = fixture()
  f.store.submit('saved question', context)
  f.requests[0].emit('saved partial')
  f.store.flush() // pagehide/visibilitychange
  const restored = fixture({ local: f.local })
  assert.equal(restored.current().id, f.current().id)
  assert.equal(restored.current().status, 'interrupted')
  assert.deepEqual(restored.current().messages.map((line) => line.content), ['saved question', 'saved partial'])
  assert.equal(restored.requests.length, 0)
  restored.store.newConversation()
  const blank = fixture({ local: f.local })
  assert.equal(blank.current().messages.length, 0)
  assert.equal(blank.store.getSnapshot().conversations.filter((conversation) => conversation.messages.length).length, 1)
  f.store.dispose(); restored.store.dispose(); blank.store.dispose()
})

test('leaving the document interrupts active requests before fetch rejection and saves partial text', async () => {
  const f = fixture()
  f.store.submit('leaving', context)
  f.requests[0].emit('partial reply')
  f.store.dispose()
  f.requests[0].fail()
  await tick()
  assert.equal(f.requests[0].signal.aborted, true)
  assert.equal(f.current().status, 'interrupted')
  assert.equal(f.storage.load().conversations[0].status, 'interrupted')
  assert.equal(f.storage.load().conversations[0].messages.slice(-1)[0].content, 'partial reply')
})

test('a browser-originated AbortError is interrupted even when the controller was not aborted', async () => {
  const f = fixture()
  f.store.submit('reload', context)
  f.requests[0].emit('saved')
  f.requests[0].fail(new DOMException('The operation was aborted.', 'AbortError'))
  await tick()
  assert.equal(f.requests[0].signal.aborted, false)
  assert.equal(f.current().status, 'interrupted')
  assert.equal(f.storage.load().conversations[0].status, 'interrupted')
  assert.equal(f.current().messages.slice(-1)[0].content, 'saved')
  f.store.dispose()
})

test('legacy migration is idempotent and only removes the old copy after a successful save', () => {
  const local = memoryStorage()
  const legacy = memoryStorage()
  legacy.setItem(CHAT_THREAD_STORAGE_KEY, JSON.stringify([{ id: 'old-user', role: 'user', content: 'legacy' }]))
  const write = local.setItem
  local.setItem = () => { throw new Error('quota') }
  const f = fixture({ local, legacy })
  f.store.flush()
  assert.equal(f.current().title, 'legacy')
  assert.equal(f.store.getSnapshot().storageError, true)
  assert.ok(legacy.getItem(CHAT_THREAD_STORAGE_KEY))
  local.setItem = write
  f.store.flush()
  assert.equal(f.store.getSnapshot().storageError, false)
  assert.equal(legacy.getItem(CHAT_THREAD_STORAGE_KEY), null)
  assert.equal(f.storage.load().conversations.length, 1)
  // A second initializer with an old copy present must reuse the stable migrated ID.
  legacy.setItem(CHAT_THREAD_STORAGE_KEY, JSON.stringify([{ id: 'old-user', role: 'user', content: 'legacy' }]))
  assert.equal(f.storage.load().conversations.length, 1)
  f.store.dispose()
})

test('malformed records are skipped and full storage preserves existing history and in-memory chat', () => {
  const f = fixture()
  f.store.submit('keep me', context)
  f.requests[0].emit('partial')
  f.store.stop()
  const saved = new Map(f.local.records)
  f.local.setItem(CONVERSATION_PREFIX + 'broken', '{bad')
  f.local.setItem(CONVERSATION_PREFIX + 'bad-shape', JSON.stringify({ version: 2, id: 'bad-shape', createdAt: 1, updatedAt: 2, messages: [{ role: 'system', content: 'invalid' }] }))
  assert.equal(f.storage.load().conversations.length, 1)
  f.local.setItem = () => { throw new Error('quota exceeded') }
  f.store.newConversation()
  f.store.submit('still works', context)
  f.requests[1].emit('in memory')
  f.store.stop()
  assert.equal(f.store.getSnapshot().storageError, true)
  assert.equal(f.current().messages.slice(-1)[0]?.content, 'in memory')
  for (const [key, value] of saved) assert.equal(f.local.getItem(key), value)
  f.store.dispose()
})

test('unavailable browser storage is reported without preventing initialization', () => {
  const storage = createConversationStorage(() => { throw new Error('denied') }, () => { throw new Error('denied') })
  const store = createChatStore({ storage })
  store.flush()
  assert.equal(store.getSnapshot().storageError, true)
  assert.equal(store.getSnapshot().conversations.length, 1)
  store.dispose()
})

test('deleting a background conversation cancels its request and queue without affecting the current chat', async () => {
  const f = fixture({ buffered: true })
  f.store.submit('delete this conversation', context)
  const removedId = f.current().id
  f.requests[0].emit('buffered response')
  f.store.consume([{ id: 'queued-for-deletion', type: 'ask', text: 'queued follow-up' }], context)
  f.store.newConversation()
  f.store.submit('keep this conversation', context)
  const keptId = f.current().id
  assert.equal(f.store.remove(removedId), true)
  f.buffers[0].flush()
  f.requests[0].emit('late text')
  f.requests[0].finish()
  await tick()
  f.store.flush()
  assert.equal(f.current().id, keptId)
  assert.equal(f.requests[0].signal.aborted, true)
  assert.equal(f.requests[1].signal.aborted, false)
  assert.equal(f.requests.length, 2)
  assert.equal(f.local.getItem(CONVERSATION_PREFIX + removedId), null)
  assert.deepEqual(f.storage.load().conversations.map((item) => item.id), [keptId])
  f.store.dispose()
  assert.equal(f.local.getItem(CONVERSATION_PREFIX + removedId), null)
})

test('deleting the active chat creates an empty selection and does not restore it on reload', () => {
  const f = fixture()
  f.store.submit('remove me', context)
  const removedId = f.current().id
  assert.equal(f.store.remove(removedId), true)
  assert.notEqual(f.current().id, removedId)
  assert.equal(f.current().messages.length, 0)
  assert.equal(f.storage.load().activeId, '')
  const restored = fixture({ local: f.local })
  assert.equal(restored.current().messages.length, 0)
  assert.equal(restored.store.getSnapshot().conversations.filter((item) => item.messages.length).length, 0)
  f.store.dispose(); restored.store.dispose()
})

test('failed deletion keeps the stored conversation and running reply available for retry', () => {
  const f = fixture()
  f.store.submit('keep until deletion succeeds', context)
  const conversationId = f.current().id
  const removeItem = f.local.removeItem
  f.local.removeItem = () => { throw new Error('storage unavailable') }
  assert.equal(f.store.remove(conversationId), false)
  assert.equal(f.current().id, conversationId)
  assert.equal(f.requests[0].signal.aborted, false)
  assert.ok(f.local.getItem(CONVERSATION_PREFIX + conversationId))
  f.local.removeItem = removeItem
  assert.equal(f.store.remove(conversationId), true)
  f.store.dispose()
})

test('deleting a migrated legacy conversation removes both copies without resurrection', () => {
  const legacy = memoryStorage()
  legacy.setItem(CHAT_THREAD_STORAGE_KEY, JSON.stringify([{ id: 'legacy-question', role: 'user', content: 'old conversation' }]))
  const f = fixture({ legacy })
  assert.equal(f.store.remove(f.current().id), true)
  assert.equal(legacy.getItem(CHAT_THREAD_STORAGE_KEY), null)
  assert.equal(f.storage.load().conversations.length, 0)
  f.store.dispose()
})

test('only current conversation data is persisted, without drafts, prompts or queues', () => {
  const f = fixture()
  f.store.submit('question', context)
  f.store.setDraft('private unsent draft')
  f.store.consume([{ id: 'queued', type: 'ask', text: 'waiting question' }], context)
  f.store.flush()
  const raw = f.local.getItem(CONVERSATION_PREFIX + f.current().id)!
  const saved = JSON.parse(raw)
  assert.equal(saved.version, 2)
  assert.equal(saved.draft, undefined)
  assert.equal(saved.queued, undefined)
  assert.equal(raw.includes('corpus'), false)
  assert.equal(f.local.getItem(CHAT_SELECTION_KEY), f.current().id)
  f.store.dispose()
})

test('server cancels its provider request when the client disconnects', async (t) => {
  let signal: AbortSignal | undefined
  const response = Object.assign(new EventEmitter(), {
    destroyed: false, headersSent: false,
    setHeader() {}, flushHeaders() { this.headersSent = true }, write() {}, end() {},
    destroy() { this.destroyed = true },
  })
  t.mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    signal = init.signal as AbortSignal
    return new Response(new ReadableStream<Uint8Array>({ start(controller) {
      signal!.addEventListener('abort', () => controller.error(new Error('aborted')), { once: true })
    } }))
  })
  const request = { method: 'POST', body: { messages: [{ role: 'user', content: 'hello' }], stream: true } }
  const pending = handleChat(request as unknown as IncomingMessage, response as unknown as ServerResponse, 'test-key')
  await tick()
  assert.equal(signal?.aborted, false)
  response.destroyed = true
  response.emit('close')
  await pending
  assert.equal(signal?.aborted, true)
  assert.equal(response.listenerCount('close'), 0)
})
