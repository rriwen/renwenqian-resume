import { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpIcon } from '@phosphor-icons/react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { ChatCommand } from '../../lib/chat/thread'
import { useChatThread } from './useChatThread'
import { ContextMeter } from './ContextMeter'
import { ChatMessageContent } from './ChatMessageContent'

export type ChatPanelProps = { open: boolean; commands: ChatCommand[]; onCommandsConsumed: (ids: string[]) => void }

export function ChatPanel({ open, commands, onCommandsConsumed }: ChatPanelProps) {
  const { m, locale } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const { current, contextUsage, storageError, submit, consume, setDraft, stop } = useChatThread(locale, m.chatbot)
  const { messages, draft: input } = current
  const loading = current.status === 'generating'
  const error = current.status === 'error' ? m.chatbot.errorGeneric : null
  const [toolbarScrolled, setToolbarScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (loading) sendRef.current?.focus()
    else inputRef.current?.focus()
    return () => { if (previousFocus?.isConnected) previousFocus.focus() }
  }, [open])

  useEffect(() => {
    if (!open) return
    if (loading) sendRef.current?.focus()
    else inputRef.current?.focus()
  }, [open, current.id, location.key])

  useEffect(() => {
    if (open && !loading && document.activeElement === sendRef.current) inputRef.current?.focus()
  }, [open, loading])

  useEffect(() => {
    if (!commands.length) return
    // Deferring one task lets StrictMode cancel its first mount without sending twice.
    const timer = window.setTimeout(() => {
      onCommandsConsumed(consume(commands))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [commands, consume, onCommandsConsumed])

  useEffect(() => {
    if (open && messages.length === 0 && commands.length === 0) navigate('/', { replace: true })
  }, [open, messages.length, commands.length, navigate])

  useEffect(() => {
    if (!open) return
    const scroller = listRef.current ?? scrollRef.current
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    setToolbarScrolled((scroller?.scrollTop ?? 0) > 0)
  }, [open, current.id, messages, loading])

  const send = (text: string) => {
    if (!loading && !contextUsage.exceedsLimit && text.trim()) {
      submit(text)
    }
  }
  const canSend = !loading && !contextUsage.exceedsLimit && input.trim().length > 0
  if (!open || messages.length === 0) return null

  const inputBlock = (
    <div className="chatbot-input-wrap prompt-composer">
      <textarea
        ref={inputRef}
        rows={2}
        value={input}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          // Enter confirms a composing character before it submits a message.
          if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (canSend) send(input)
          }
        }}
        placeholder={m.chatbot.placeholder}
        aria-label={m.chatbot.placeholder}
        disabled={loading}
        className="chatbot-input-field prompt-composer-input"
      />
      <div className="prompt-composer-tools">
        <ContextMeter key={current.id} usage={contextUsage} />
        <button
          ref={sendRef}
          type="button"
          aria-label={loading ? m.chatbot.stop : m.chatbot.sendAria}
          title={loading ? m.chatbot.stop : m.chatbot.sendAria}
          disabled={!loading && !canSend}
          onClick={() => loading ? stop() : send(input)}
          className="chatbot-send prompt-composer-action prompt-composer-submit"
        >
          {loading ? <span className="chatbot-stop-icon" aria-hidden="true" /> : <ArrowUpIcon size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )

  return (
    <main aria-label={m.chatbot.dialogAria} className="chatbot-view">
      <div aria-hidden="true" className={`chatbot-toolbar${toolbarScrolled ? ' is-scrolled' : ''}`} />
      {storageError && <p className="chatbot-storage-warning" role="status">{m.chatbot.storageError}</p>}

      <div
        ref={scrollRef}
        className="chatbot-scroll"
        onScroll={(event) => {
          if (event.target === event.currentTarget) setToolbarScrolled(event.currentTarget.scrollTop > 0)
        }}
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'var(--space-4)',
          overflowY: 'hidden',
        }}
      >
        <div className="chatbot-stack chatbot-stack--conversation">
          <div ref={listRef} className="chatbot-thread" onScroll={(event) => setToolbarScrolled(event.currentTarget.scrollTop > 0)}>
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
                <Fragment key={line.id}>
                  <div
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
                          <ChatMessageContent content={line.content} locale={locale} />
                          {streamThinking ? (
                            <span className="chatbot-thinking"> {m.chatbot.thinking}</span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </div>
                  {line.stopped && <p className="chatbot-thread-stopped" role="status">{m.chatbot.stopped}</p>}
                </Fragment>
              )
            })}
          </div>

          <div className="chatbot-composer">
            {contextUsage.exceedsLimit
              ? <p className="chatbot-context-notice" role="status">{m.chatbot.contextTooLong}</p>
              : contextUsage.omittedMessages > 0 && <p className="chatbot-context-notice" role="status">{m.chatbot.contextTrimmed}</p>}
            {current.status === 'interrupted' && <p className="chatbot-thread-hint" role="status">{m.chatbot.interrupted}</p>}
            {current.queued.length > 0 && <p className="chatbot-pending-question" role="status">{m.chatbot.queued}{current.queued.join(' · ')}</p>}
            {inputBlock}
          </div>
        </div>
      </div>
    </main>
  )
}
