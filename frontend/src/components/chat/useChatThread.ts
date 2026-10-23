import { useEffect, useMemo, useRef, useState } from 'react'
import type { Locale, Messages } from '../../i18n/translations'
import { sendDeepseekChatStream } from '../../lib/deepseekChat'
import { buildSiteCorpus } from '../../lib/siteCorpus'
import { CHAT_THREAD_STORAGE_KEY, linesToChatTurns, loadThread, type ChatLine } from '../../lib/chat/thread'
import { createTextReveal } from '../../lib/chat/textReveal'

export function useChatThread(locale: Locale, copy: Messages['chatbot']) {
  const siteCorpus = useMemo(() => buildSiteCorpus(locale), [locale])
  const [messages, setMessages] = useState<ChatLine[]>(loadThread)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages
  const active = useRef<{ controller: AbortController; reveal: ReturnType<typeof createTextReveal> }>()

  useEffect(() => () => {
    active.current?.controller.abort()
    active.current?.reveal.cancel()
  }, [])
  useEffect(() => {
    try { sessionStorage.setItem(CHAT_THREAD_STORAGE_KEY, JSON.stringify(messages)) } catch { /* storage unavailable */ }
  }, [messages])

  const submit = async (text: string) => {
    const content = text.trim()
    if (!content || active.current) return
    const userLine: ChatLine = { id: crypto.randomUUID(), role: 'user', content }
    const next = [...messagesRef.current, userLine]
    const assistantId = crypto.randomUUID()
    const controller = new AbortController()
    const reveal = createTextReveal((chunk) => {
      if (!controller.signal.aborted) setMessages((lines) => lines.map((line) =>
        line.id === assistantId ? { ...line, content: line.content + chunk } : line))
    })
    active.current = { controller, reveal }
    setMessages([...next, { id: assistantId, role: 'assistant', content: '' }])
    setLoading(true)
    setError(null)
    let receivedChunk = false
    try {
      await sendDeepseekChatStream(copy.systemPrompt, siteCorpus, linesToChatTurns(next), (delta) => {
        receivedChunk = true
        reveal.append(delta)
      }, controller.signal)
      await reveal.finish()
      if (!receivedChunk) throw new Error('EMPTY_RESPONSE')
    } catch {
      if (!controller.signal.aborted) {
        setError(copy.errorGeneric)
        setMessages((lines) => lines.filter((line) => line.id !== assistantId || line.content.trim()))
      }
    } finally {
      reveal.cancel()
      active.current = undefined
      if (!controller.signal.aborted) setLoading(false)
    }
  }
  return { messages, loading, error, submit }
}
