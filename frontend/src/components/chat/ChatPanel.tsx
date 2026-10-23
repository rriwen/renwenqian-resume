import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { IconContrast } from '../Icons'
import { stripAssistantBoldMarkers } from '../../lib/chat/thread'
import { useChatThread } from './useChatThread'

type Props = { open: boolean; onClose: () => void; dark: boolean; onToggleTheme: () => void }

export function ChatPanel({ open, onClose, dark, onToggleTheme }: Props) {
  const { m, locale } = useLanguage()
  const navigate = useNavigate()
  const { messages, loading, error, submit } = useChatThread(locale, m.chatbot)
  const [input, setInput] = useState('')
  const [quickOpen, setQuickOpen] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [open, messages, loading])

  useEffect(() => {
    if (messages.length > 0) setQuickOpen(false)
  }, [messages.length])

  const send = (text: string) => {
    if (!loading && text.trim()) {
      setInput('')
      void submit(text)
    }
  }
  const backHome = () => { onClose(); navigate('/') }
  const canSend = !loading && input.trim().length > 0
  const quickDisabled = loading
  const inWelcome = messages.length === 0
  if (!open) return null

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
            onClick={() => send(entry.prompt)}
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
          // Enter confirms a composing character before it submits a message.
          if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (canSend) send(input)
          }
        }}
        placeholder={m.chatbot.placeholder}
        disabled={loading}
        className="chatbot-input-field"
      />
      <button
        type="button"
        aria-label={m.chatbot.sendAria}
        disabled={!canSend}
        onClick={() => send(input)}
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
        background: 'var(--page-bg)',
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
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          padding: '0.35rem 0',
          color: 'var(--muted)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {m.chatbot.backHome}
      </button>

      <div
        className="chatbot-overlay-actions"
        style={{
          position: 'absolute',
          top: 'max(1rem, env(safe-area-inset-top))',
          right: 'clamp(1rem, 4vw, 1.5rem)',
          zIndex: 2,
        }}
      >
        <LanguageSwitcher />
        <button type="button" className="chatbot-theme-toggle" onClick={onToggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}><IconContrast size={15} /></button>
      </div>

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
                          {stripAssistantBoldMarkers(line.content)}
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
