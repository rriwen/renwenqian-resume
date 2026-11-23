import test from 'node:test'
import assert from 'node:assert/strict'
import { followUpQuestions } from '../frontend/src/lib/chat/followUpQuestions'
import type { ChatLine } from '../frontend/src/lib/chat/thread'

test('recommendations follow the question topic before other projects mentioned in the answer', () => {
  const history: ChatLine[] = [
    { id: 'u', role: 'user', content: '介绍一下 DataPilot' },
    { id: 'a', role: 'assistant', content: '还做过数据库运维平台。' },
  ]
  const suggestions = followUpQuestions(history)
  assert.equal(suggestions.length, 2)
  assert.ok(suggestions.every((question) => question.includes('Data Agent')))
  const next = followUpQuestions([...history,
    { id: 'u2', role: 'user', content: suggestions[0] },
    { id: 'a2', role: 'assistant', content: '负责产品与设计工作。' },
  ])
  assert.equal(next.length, 2)
  assert.ok(!next.includes(suggestions[0]))
})

test('general replies get two distinct recommendations without modifying history', () => {
  const history: ChatLine[] = [{ id: 'a', role: 'assistant', content: '嗯！你好。' }]
  const original = JSON.stringify(history)
  assert.equal(new Set(followUpQuestions(history)).size, 2)
  assert.equal(JSON.stringify(history), original)
})
