import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hasDeepseekClientKey, sendDeepseekChatStream, type ChatTurn } from '../lib/deepseekChat'

function isChatHash() {
  return window.location.hash === '#chat'
}

type Line = { id: string; role: 'user' | 'assistant'; content: string }

function lineId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Buffer API chunks and reveal a few characters per tick (slightly slower, smoother streaming UX). */
const STREAM_REVEAL_MS = 55
const STREAM_REVEAL_CHARS = 10

export function ChatbotOverlay() {
  const { m } = useLanguage()
  const navigate = useNavigate()
  const [open, setOpen] = useState(isChatHash)
  const [messages, setMessages] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quickOpen, setQuickOpen] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  const sync = useCallback(() => setOpen(isChatHash()), [])

  const close = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
  }, [])

  const backHome = useCallback(() => {
    close()
    navigate('/')
  }, [close, navigate])

  useEffect(() => {
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [sync])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open || !listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [open, messages, loading])

  useEffect(() => {
    if (messages.length > 0) setQuickOpen(false)
  }, [messages.length])

  const apiReady = hasDeepseekClientKey()
  const canSend = !loading && input.trim().length > 0 && apiReady

  const submit = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    if (!apiReady) return

    const userLine: Line = { id: lineId(), role: 'user', content: trimmed }
    const next = [...messages, userLine]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)

    const turns: ChatTurn[] = next.map(({ role, content }) => ({ role, content }))
    const assistantId = lineId()

    setMessages((curr) => [...curr, { id: assistantId, role: 'assistant', content: '' }])

    let receivedChunk = false
    let pending = ''
    let streamInboundDone = false
    let streamPumpId: ReturnType<typeof setInterval> | null = null

    const stopStreamPump = () => {
      if (streamPumpId !== null) {
        clearInterval(streamPumpId)
        streamPumpId = null
      }
    }

    const pumpTick = () => {
      if (pending.length > 0) {
        const take = Math.min(pending.length, STREAM_REVEAL_CHARS)
        const chunk = pending.slice(0, take)
        pending = pending.slice(take)
        setMessages((curr) =>
          curr.map((line) =>
            line.id === assistantId ? { ...line, content: line.content + chunk } : line,
          ),
        )
      }
      if (pending.length === 0 && streamInboundDone) {
        stopStreamPump()
      }
    }

    const ensureStreamPump = () => {
      if (streamPumpId === null) {
        streamPumpId = setInterval(pumpTick, STREAM_REVEAL_MS)
      }
    }

    const waitForRevealIdle = () =>
      new Promise<void>((resolve) => {
        if (streamPumpId === null) {
          resolve()
          return
        }
        const w = window.setInterval(() => {
          if (streamPumpId === null) {
            window.clearInterval(w)
            resolve()
          }
        }, 24)
      })

    try {
      await sendDeepseekChatStream(m.chatbot.systemPrompt, turns, (delta) => {
        receivedChunk = true
        pending += delta
        ensureStreamPump()
      })
      streamInboundDone = true
      pumpTick()
      if (pending.length === 0) {
        stopStreamPump()
      }
      await waitForRevealIdle()

      if (!receivedChunk) {
        setMessages((curr) => curr.filter((line) => line.id !== assistantId))
        setError(m.chatbot.errorGeneric)
      }
    } catch (e) {
      stopStreamPump()
      pending = ''
      const msg = e instanceof Error && e.message === 'MISSING_API_KEY' ? m.chatbot.noKeyHint : m.chatbot.errorGeneric
      setError(msg)
      setMessages((curr) => {
        const line = curr.find((l) => l.id === assistantId)
        if (line?.role === 'assistant' && !line.content.trim()) {
          return curr.filter((l) => l.id !== assistantId)
        }
        return curr
      })
    } finally {
      stopStreamPump()
      setLoading(false)
    }
  }

  if (!open) return null

  const showKeyHint = !apiReady

  const quickDisabled = !apiReady || loading

  const inWelcome = messages.length === 0

  const quickEntries: { key: string; label: string; prompt: string }[] = [
    { key: 'about', label: m.chatbot.quickServices, prompt: m.chatbot.quickPromptServices },
    { key: 'contact', label: m.chatbot.quickEnquiry, prompt: m.chatbot.quickPromptContact },
    { key: 'work', label: m.chatbot.quickTimeline, prompt: m.chatbot.quickPromptTimeline },
    { key: 'expert', label: m.chatbot.quickDesignDev, prompt: m.chatbot.quickPromptDesignDev },
  ]

  const renderQuickList = (listClassName: string) => (
    <ul className={listClassName}>
      {quickEntries.map((entry) => (
        <li key={entry.key}>
          <button
            type="button"
            className="chatbot-quick"
            disabled={quickDisabled}
            onClick={() => void submit(entry.prompt)}
          >
            <span className="chatbot-quick-icon" aria-hidden>
              [ ]
            </span>
            <span>{entry.label}</span>
          </button>
        </li>
      ))}
    </ul>
  )

  const inputBlock = (
    <div className="chatbot-input-wrap">
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (canSend) void submit(input)
          }
        }}
        placeholder={m.chatbot.placeholder}
        disabled={loading || showKeyHint}
        className="chatbot-input-field"
      />
      <button
        type="button"
        aria-label={m.chatbot.sendAria}
        disabled={!canSend}
        onClick={() => void submit(input)}
        className="chatbot-send chatbot-send--fab"
      >
        ↑
      </button>
    </div>
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={m.chatbot.dialogAria}
      className="chatbot-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 205,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <button
        type="button"
        onClick={backHome}
        className="chatbot-back"
        style={{
          position: 'absolute',
          top: 'max(1rem, env(safe-area-inset-top))',
          left: 'clamp(1rem, 4vw, 1.5rem)',
          zIndex: 2,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          padding: '0.35rem 0',
          opacity: 0.72,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
        }}
      >
        {m.chatbot.backHome}
      </button>

      <div
        className="chatbot-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'max(3.25rem, calc(env(safe-area-inset-top) + 2rem))',
          overflowY: inWelcome ? 'auto' : 'hidden',
        }}
      >
        {inWelcome ? (
          <>
            <div style={{ flex: 1, minHeight: 16 }} aria-hidden />
            <div className="chatbot-stack chatbot-stack--welcome">
              <h1 className="chatbot-welcome-headline">{m.chatbot.headline}</h1>
              <nav aria-label={m.chatbot.dialogAria} className="chatbot-welcome-nav">
                {renderQuickList('chatbot-welcome-quick-list')}
              </nav>
              {showKeyHint ? <p className="chatbot-thread-hint">{m.chatbot.noKeyHint}</p> : null}
              {error ? (
                <p role="alert" className="chatbot-thread-error">
                  {error}
                </p>
              ) : null}
              {inputBlock}
            </div>
            <div style={{ flex: 1, minHeight: 16 }} aria-hidden />
          </>
        ) : (
          <div className="chatbot-stack chatbot-stack--conversation">
            <div ref={listRef} className="chatbot-thread">
              {showKeyHint ? (
                <p className="chatbot-thread-hint">{m.chatbot.noKeyHint}</p>
              ) : null}
              {error ? (
                <p role="alert" className="chatbot-thread-error">
                  {error}
                </p>
              ) : null}
              {messages.map((line, idx) => {
                const isLast = idx === messages.length - 1
                const streamThinking =
                  loading && line.role === 'assistant' && isLast && line.content === ''
                return (
                  <div
                    key={line.id}
                    className={
                      line.role === 'user' ? 'chatbot-msg-row chatbot-msg-row--user' : 'chatbot-msg-row chatbot-msg-row--assistant'
                    }
                  >
                    {line.role === 'user' ? (
                      <div className="chatbot-msg-user">{line.content}</div>
                    ) : (
                      <div className="chatbot-msg-ai">
                        <span className="chatbot-msg-ai-branch" aria-hidden />
                        <div className="chatbot-msg-ai-text">
                          {line.content}
                          {streamThinking ? (
                            <span className="chatbot-thinking"> {m.chatbot.thinking}</span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="chatbot-composer">
              <button
                type="button"
                className="chatbot-composer-plus"
                aria-label={m.chatbot.quickToggleAria}
                aria-expanded={quickOpen}
                onClick={() => setQuickOpen((q) => !q)}
              >
                +
              </button>
              {quickOpen ? (
                <nav className="chatbot-quick-panel" aria-label={m.chatbot.dialogAria}>
                  {renderQuickList('chatbot-quick-panel-list')}
                </nav>
              ) : null}
              {inputBlock}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
