import type { ChatTurn } from '../deepseekChat'

// Application budget, deliberately independent of a provider's advertised maximum.
export const CHAT_CONTEXT_TOKENS = 64_000
export const CHAT_REPLY_TOKENS = 2048
export const CHAT_INPUT_TOKENS = CHAT_CONTEXT_TOKENS - CHAT_REPLY_TOKENS
export const CHAT_MAX_REQUEST_BYTES = 500_000

type ContextMessage = { role: 'system' | ChatTurn['role']; content: string }
export type ContextUsage = {
  remainingPercent: number
  remainingTokens: number
  usedTokens: number
  retainedMessages: number
  omittedMessages: number
  exceedsLimit: boolean
}

const encoder = new TextEncoder()
const han = /\p{Script=Han}/u

/** Approximation, not provider billing usage: https://api-docs.deepseek.com/quick_start/token_usage/ */
export function estimateTextTokens(text: string): number {
  let tenths = 0
  for (const character of text) {
    if (character.charCodeAt(0) <= 0x7f) tenths += 3
    else if (han.test(character)) tenths += 6
    else tenths += encoder.encode(character).length * 10
  }
  return Math.ceil(tenths / 10)
}

export function estimateMessagesTokens(messages: ContextMessage[]): number {
  return 3 + messages.reduce((total, message) => total + estimateTextTokens(message.content) + 6, 0)
}

export function buildChatSystemPrompt(systemPrompt: string, siteCorpus: string): string {
  return siteCorpus.trim() ? `${systemPrompt}\n\n---\n\n${siteCorpus.trim()}` : systemPrompt
}

/** Shared by the composer and transport so the meter describes the context actually sent. */
export function prepareChatContext(systemPrompt: string, siteCorpus: string, history: ChatTurn[]) {
  const system: ContextMessage = { role: 'system', content: buildChatSystemPrompt(systemPrompt, siteCorpus) }
  const messages = history.filter((message) => message.content.trim())
  const rounds: ChatTurn[][] = []
  for (const message of messages) {
    if (message.role === 'user') rounds.push([message])
    else rounds[rounds.length - 1]?.push(message)
  }
  let usedTokens = estimateMessagesTokens([system])
  let usedBytes = encoder.encode(JSON.stringify({ messages: [system], stream: true })).length
  const selected: ChatTurn[][] = []
  for (let index = rounds.length - 1; index >= 0; index--) {
    const round = rounds[index]
    const tokens = estimateMessagesTokens(round) - 3
    const bytes = encoder.encode(JSON.stringify(round)).length - 1 // Array brackets become separating commas.
    if (selected.length && (usedTokens + tokens > CHAT_INPUT_TOKENS || usedBytes + bytes > CHAT_MAX_REQUEST_BYTES)) break
    // Never silently shorten the latest question. An oversized last round is rejected before fetch.
    selected.push(round)
    usedTokens += tokens
    usedBytes += bytes
  }
  const turns = selected.reverse().flat()
  const remainingTokens = Math.max(0, CHAT_INPUT_TOKENS - usedTokens)
  const remainingRatio = Math.max(0, Math.min(remainingTokens / CHAT_INPUT_TOKENS, 1 - usedBytes / CHAT_MAX_REQUEST_BYTES))
  const usage: ContextUsage = {
    remainingPercent: Math.floor(remainingRatio * 100), remainingTokens, usedTokens,
    retainedMessages: turns.length, omittedMessages: messages.length - turns.length,
    exceedsLimit: usedTokens > CHAT_INPUT_TOKENS || usedBytes > CHAT_MAX_REQUEST_BYTES,
  }
  return { system, turns, usage }
}
