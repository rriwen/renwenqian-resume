import test from 'node:test'
import assert from 'node:assert/strict'
import { conversationTitle } from '../frontend/src/lib/chat/conversationTitle'
import { createConversationStorage, CONVERSATION_PREFIX } from '../frontend/src/lib/chat/conversationStorage'
import { translations } from '../frontend/src/i18n/translations'

test('suggested questions become short subject labels instead of copied prompts', () => {
  for (const locale of ['zh', 'en'] as const) {
    const copy = translations[locale].chatbot
    assert.equal(conversationTitle(copy.quickPromptServices), '个人背景介绍')
    assert.equal(conversationTitle(copy.quickPromptDesignDev), '擅长领域与核心能力')
    assert.equal(conversationTitle(copy.quickPromptTimeline), '工作经历与职业亮点')
    assert.equal(conversationTitle(copy.quickPromptProjects), '代表项目与设计成果')
  }
  assert.equal(conversationTitle('请用一句话介绍你的工作。'), '职业背景简介')
})

test('project topics retain the project identity and requested focus', () => {
  assert.equal(conversationTitle('AI 智能问数的采纳率是怎么提升的？'), 'AI 智能问数 · 项目成果')
  assert.equal(conversationTitle('聊聊 DataPilot 的设计决策和最终成果'), 'AI 智能问数 · 项目复盘')
  assert.equal(conversationTitle('你在数据库运维平台中负责什么？'), '数据库运维平台 · 职责与贡献')
  assert.equal(conversationTitle('介绍一下 Agent 记忆插件'), 'Agent 记忆插件 · 项目概览')
  for (const name of ['AI 设计系统', 'Design Token、Design Skill']) {
    assert.equal(conversationTitle(`介绍一下 ${name}`), '设计工程化 · 项目概览')
  }
})

test('unrecognized topics keep their meaning, remove request framing and stay bounded', () => {
  assert.equal(conversationTitle('你好，请解释一下渐进式披露。'), '渐进式披露')
  assert.equal(conversationTitle('Please explain progressive disclosure?'), 'progressive disclosure')
  assert.equal(conversationTitle('legacy'), 'legacy')
  assert.equal(conversationTitle(''), '新对话')
  const long = conversationTitle('这是一个需要保留主题含义但长度超过历史标题展示范围的中文问题')
  assert.ok(Array.from(long).length <= 25)
  assert.ok(long.endsWith('…'))
})

test('saved prompt-based titles are summarized on load without changing conversation data', () => {
  const messages = [
    { id: 'question', role: 'user', content: '假设你是面试官，请用 60 秒做一段自我介绍，说明你为什么适合产品经理和产品设计师岗位。' },
    { id: 'answer', role: 'assistant', content: '原来的回复内容' },
  ]
  const key = CONVERSATION_PREFIX + 'saved'
  const raw = JSON.stringify({ version: 2, id: 'saved', title: messages[0].content,
    createdAt: 10, updatedAt: 20, messages, status: 'idle' })
  const storage = { length: 1, key: () => key, getItem: (name: string) => name === key ? raw : null,
    setItem: () => { throw new Error('Reading titles must not rewrite history') }, removeItem: () => {} }
  const result = createConversationStorage(() => storage, () => ({ ...storage, getItem: () => null })).load()
  assert.equal(result.failed, false)
  assert.deepEqual(result.conversations[0], { id: 'saved', title: '自我介绍与岗位匹配',
    createdAt: 10, updatedAt: 20, messages, status: 'idle' })
})
