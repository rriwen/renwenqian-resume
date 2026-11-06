import { useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ClockCounterClockwiseIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { ChatConversation } from '../../lib/chat/chatStore'
import { Popconfirm } from '../Popconfirm'

type Props = { conversations: ChatConversation[]; activeId: string; onSelect: (id: string) => void; onDelete: (id: string) => boolean }

export function ChatHistory({ conversations, activeId, onSelect, onDelete }: Props) {
  const { m, locale } = useLanguage()
  const [open, setOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [deleteFailed, setDeleteFailed] = useState(false)
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.key])
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const confirmId = useId()
  const history = conversations.filter((conversation) => conversation.messages.length)
    .sort((a, b) => b.updatedAt - a.updatedAt || b.createdAt - a.createdAt)
  const generating = history.filter((conversation) => conversation.status === 'generating').length
  const dateFormat = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  useEffect(() => { if (!open) { setPendingDelete(null); setDeleteFailed(false) } }, [open])
  const cancelDelete = () => {
    setPendingDelete(null)
    setDeleteFailed(false)
    requestAnimationFrame(() => deleteTriggerRef.current?.focus())
  }
  const deleteConversation = (id: string) => {
    if (!onDelete(id)) { setDeleteFailed(true); return }
    setPendingDelete(null)
    setDeleteFailed(false)
    requestAnimationFrame(() => (panelRef.current?.querySelector<HTMLButtonElement>('button') ?? triggerRef.current)?.focus())
  }

  useEffect(() => {
    if (!open) return
    const selected = panelRef.current?.querySelector<HTMLButtonElement>('button[aria-current="true"]')
    ;(selected ?? panelRef.current?.querySelector('button'))?.focus()
    const onPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (event.target instanceof Element && event.target.closest('.popconfirm')) return
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    rootRef.current?.addEventListener('keydown', onKey)
    const root = rootRef.current
    return () => { document.removeEventListener('pointerdown', onPointer); root?.removeEventListener('keydown', onKey) }
  }, [open])

  return <div className="chatbot-history" ref={rootRef} onBlur={(event) => {
    if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <button ref={triggerRef} className="icon-button chatbot-history-trigger" type="button" aria-label={m.chatbot.history} title={m.chatbot.history} aria-haspopup="dialog" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((value) => !value)}>
      <ClockCounterClockwiseIcon size={18} aria-hidden="true" />
      {generating > 0 && <span className="chatbot-history-count" aria-label={`${m.chatbot.generating}: ${generating}`}>{generating}</span>}
    </button>
    {open && <div ref={panelRef} id={panelId} className="chatbot-history-panel" role="dialog" aria-label={m.chatbot.history}>
      <div className="chatbot-history-heading">
        <span>{m.chatbot.history}</span>
        <button className="icon-button" type="button" aria-label={m.chatbot.closeHistory} onClick={() => { setOpen(false); triggerRef.current?.focus() }}><XIcon size={16} aria-hidden="true" /></button>
      </div>
      {history.length === 0 ? <p className="chatbot-history-empty">{m.chatbot.historyEmpty}</p> :
        <ul className="chatbot-history-list" onScroll={() => setPendingDelete(null)}>
          {history.map((conversation) => <li key={conversation.id} className="chatbot-history-row">
            <button type="button" className="chatbot-history-item" aria-current={conversation.id === activeId ? 'true' : undefined}
              onClick={() => { setOpen(false); onSelect(conversation.id) }}>
              <span className="chatbot-history-title">{conversation.title}</span>
              <span className="chatbot-history-meta">
                <time dateTime={new Date(conversation.updatedAt).toISOString()}>{dateFormat.format(conversation.updatedAt)}</time>
                {conversation.status === 'generating' && <span className="chatbot-history-generating">{m.chatbot.generating}</span>}
              </span>
            </button>
            <button type="button" className="icon-button chatbot-history-delete" title={m.chatbot.deleteConversation}
              aria-label={`${m.chatbot.deleteConversation}：${conversation.title}`} aria-expanded={pendingDelete === conversation.id}
              aria-haspopup="dialog" aria-controls={pendingDelete === conversation.id ? confirmId : undefined}
              onClick={(event) => { deleteTriggerRef.current = event.currentTarget; setDeleteFailed(false); setPendingDelete((current) => current === conversation.id ? null : conversation.id) }}>
              <TrashIcon size={18} aria-hidden="true" />
            </button>
          </li>)}
        </ul>}
      {pendingDelete && deleteTriggerRef.current && history.some((conversation) => conversation.id === pendingDelete) &&
        <Popconfirm key={pendingDelete} id={confirmId} anchor={deleteTriggerRef.current}
          title={m.chatbot.deleteConversationConfirm} error={deleteFailed ? m.chatbot.deleteConversationError : undefined}
          cancelLabel={m.chatbot.cancelDelete} confirmLabel={m.chatbot.deleteAction}
          onCancel={cancelDelete} onConfirm={() => deleteConversation(pendingDelete)} onDismiss={() => setPendingDelete(null)} />}
    </div>}
  </div>
}
