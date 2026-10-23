import test from 'node:test'
import assert from 'node:assert/strict'
import { readChatEventStream } from '../frontend/src/lib/chat/readEventStream'
import { sendDeepseekChatStream } from '../frontend/src/lib/deepseekChat'
import { parseStoredLines, linesToChatTurns, type ChatLine } from '../frontend/src/lib/chat/thread'
import { createTextReveal } from '../frontend/src/lib/chat/textReveal'

const event = (text: string) => `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\r\n\r\n`
function byteStream(text: string, onCancel = () => {}) {
  const bytes = new TextEncoder().encode(text)
  let cursor = 0
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (cursor === bytes.length) controller.close()
      else controller.enqueue(bytes.slice(cursor, ++cursor))
    },
    cancel: onCancel,
  })
}

test('SSE preserves split UTF-8/CRLF, ignores keepalives and stops at DONE', async () => {
  let cancelled = false
  const stream = byteStream(': ping\r\n\r\n' + event('你好👋') + event(' world') + 'data: [DONE]\r\n\r\n' + event('ignored'), () => { cancelled = true })
  let result = ''
  await readChatEventStream(stream, (delta) => { result += delta })
  assert.equal(result, '你好👋 world')
  assert.equal(cancelled, true)
  assert.equal(stream.locked, false)
})

test('SSE accepts the last record without a trailing newline and skips malformed records', async () => {
  let result = ''
  const source = 'data: not-json\n\n' + event('prefix') + event('suffix').trimEnd()
  await readChatEventStream(byteStream(source), (text) => { result += text })
  assert.equal(result, 'prefixsuffix')
})

test('SSE reports provider errors and always releases the reader', async () => {
  const stream = byteStream('data: {"error":{"message":"rate limit"}}\n\n')
  await assert.rejects(readChatEventStream(stream, () => {}), /rate limit/)
  assert.equal(stream.locked, false)
})

test('chat transport passes cancellation and sends only server-supported fields', async (t) => {
  const controller = new AbortController()
  let requestBody: Record<string, unknown> | undefined
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, '/api/chat')
    assert.equal(init.signal, controller.signal)
    requestBody = JSON.parse(init.body as string)
    return new Response(byteStream(event('ok') + 'data: [DONE]\n\n'))
  })
  let text = ''
  await sendDeepseekChatStream('system', ' facts ', [{role:'user',content:'hi'}], (delta) => { text += delta }, controller.signal)
  assert.equal(text, 'ok')
  assert.deepEqual(requestBody, {stream:true, messages:[{role:'system',content:'system\n\n---\n\nfacts'}, {role:'user',content:'hi'}]})
})

test('invalid persisted history is rejected and outbound history fits the API limit', () => {
  assert.deepEqual(parseStoredLines('{broken'), [])
  assert.deepEqual(parseStoredLines('{"id":"not-an-array"}'), [])
  assert.deepEqual(parseStoredLines('[null,{"id":"1","role":"system","content":"bad"},{"id":"2","role":"user","content":"ok"}]'), [{id:'2',role:'user',content:'ok'}])
  const history: ChatLine[] = Array.from({length:120}, (_,index) => ({id:String(index),role:'user',content:String(index)}))
  history.push({id:'empty',role:'assistant',content:''})
  const turns = linesToChatTurns(history)
  assert.equal(turns.length, 99)
  assert.equal(turns[0].content, '21')
  assert.equal(history.length, 121)
})

test('reveal drains pending output in order and cancellation resolves pending completion', async () => {
  let text = ''
  const reveal = createTextReveal((chunk) => { text += chunk })
  reveal.append('abcdefghijklm')
  await reveal.finish()
  assert.equal(text, 'abcdefghijklm')
  const cancelled = createTextReveal(() => { throw new Error('cancelled output must not be emitted') })
  cancelled.append('discard')
  cancelled.cancel()
  await cancelled.finish()
})
