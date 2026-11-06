import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleChat } from '../api/chat'
import { sendDeepseekChatStream, type ChatTurn } from '../frontend/src/lib/deepseekChat'
import { CHAT_INPUT_TOKENS, CHAT_MAX_REQUEST_BYTES, CHAT_REPLY_TOKENS, estimateTextTokens, prepareChatContext } from '../frontend/src/lib/chat/context'

const user = (content: string): ChatTurn => ({ role: 'user', content })
const assistant = (content: string): ChatTurn => ({ role: 'assistant', content })

test('memory retains early facts beyond 99 messages and counts system, corpus, replies and draft', () => {
  const history = [user('请叫我小林，之后回答简短一点'), ...Array.from({ length: 65 }, (_, i) => [assistant(`回复${i}`), user(`问题${i}`)]).flat()]
  const before = prepareChatContext('system', '站点资料', history)
  assert.equal(before.turns.length, 131)
  assert.equal(before.turns[0].content, history[0].content)
  assert.equal(before.usage.omittedMessages, 0)
  const draft = prepareChatContext('system', '站点资料', [...history, user('草稿'.repeat(1000))])
  assert.ok(draft.usage.remainingPercent < before.usage.remainingPercent)
  assert.ok(prepareChatContext('system', '更多站点资料'.repeat(1000), history).usage.usedTokens > before.usage.usedTokens)
  assert.ok(prepareChatContext('system', '', []).usage.usedTokens > 0)
})

test('over-budget context drops whole oldest rounds without deleting UI history or orphaning replies', () => {
  const history = [user('old question'), assistant('中'.repeat(90_000)), user('recent question'), assistant('中'.repeat(15_000)), user('continue')]
  const result = prepareChatContext('system', 'corpus', history)
  assert.deepEqual(result.turns, history.slice(2))
  assert.equal(result.usage.omittedMessages, 2)
  assert.equal(result.usage.retainedMessages, 3)
  assert.ok(result.usage.usedTokens <= CHAT_INPUT_TOKENS)
  assert.equal(history.length, 5)
  assert.equal(history[1].content.length, 90_000)
})

test('byte budget includes JSON escaping, and oversized latest input is retained but never fetched', async (t) => {
  const result = prepareChatContext('system', '', [user('old'), assistant('\u0000'.repeat(90_000)), user('latest')])
  assert.deepEqual(result.turns, [user('latest')])
  assert.ok(new TextEncoder().encode(JSON.stringify({ messages: [result.system, ...result.turns], stream: true })).length < CHAT_MAX_REQUEST_BYTES)
  const huge = [user('中'.repeat(110_000))]
  const oversized = prepareChatContext('system', '', huge)
  assert.equal(oversized.usage.exceedsLimit, true)
  assert.equal(oversized.usage.remainingPercent, 0)
  assert.equal(oversized.turns[0].content, huge[0].content)
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('must not fetch') })
  await assert.rejects(sendDeepseekChatStream('system', '', huge, () => {}), /CONTEXT_LIMIT_EXCEEDED/)
  assert.equal(fetch.mock.callCount(), 0)
  assert.ok(estimateTextTokens('👋🏽'.repeat(100)) > estimateTextTokens('a'.repeat(100)))
})

test('context meter and transport select the same messages, excluding empty assistant placeholders', async (t) => {
  const history = [user('old'), assistant('中'.repeat(110_000)), user('follow-up'), assistant('')]
  const expected = prepareChatContext('system', 'corpus', history)
  t.mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    assert.deepEqual(JSON.parse(init.body as string).messages, [expected.system, ...expected.turns])
    return new Response('data: [DONE]\n\n')
  })
  await sendDeepseekChatStream('system', 'corpus', history, () => {})
  assert.equal(expected.usage.omittedMessages, 2)
})

function response() {
  return Object.assign(new EventEmitter(), { statusCode: 200, destroyed: false, headersSent: false,
    body: '', setHeader() {}, flushHeaders() { this.headersSent = true }, write() {},
    end(body?: string) { this.body = body ?? '' }, destroy() { this.destroyed = true } })
}

test('server accepts more than 100 messages within budget and reserves the same reply size', async (t) => {
  const history = Array.from({ length: 120 }, (_, i) => i % 2 ? assistant('answer') : user('question'))
  const fetch = t.mock.method(globalThis, 'fetch', async (_url: string, init: RequestInit) => {
    const body = JSON.parse(init.body as string)
    assert.equal(body.messages.length, 120)
    assert.equal(body.max_tokens, CHAT_REPLY_TOKENS)
    return new Response('data: [DONE]\n\n')
  })
  const res = response()
  await handleChat({ method: 'POST', body: { messages: history, stream: true } } as unknown as IncomingMessage, res as unknown as ServerResponse, 'test-key')
  assert.equal(res.statusCode, 200)
  assert.equal(fetch.mock.callCount(), 1)
})

test('server rejects oversized parsed requests and token overflow before calling the provider', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw new Error('must not fetch') })
  for (const text of ['中'.repeat(110_000), '\u0000'.repeat(90_000)]) {
    const res = response()
    await handleChat({ method: 'POST', body: { messages: [user(text)], stream: true } } as unknown as IncomingMessage, res as unknown as ServerResponse, 'test-key')
    assert.equal(res.statusCode, 413)
  }
  assert.equal(fetch.mock.callCount(), 0)
})
