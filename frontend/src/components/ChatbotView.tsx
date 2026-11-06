import { lazy, Suspense, useEffect, useState } from 'react'
import type { ChatPanelProps } from './chat/ChatPanel'

const ChatPanel = lazy(() => import('./chat/ChatPanel').then((module) => ({ default: module.ChatPanel })))

export function ChatbotView(props: ChatPanelProps) {
  const { open } = props
  const [activated, setActivated] = useState(open)
  useEffect(() => { if (open) setActivated(true) }, [open])
  if (!open && !activated) return null
  // Preserve active streams and local state when the panel is temporarily closed.
  return <Suspense fallback={null}><ChatPanel {...props} /></Suspense>
}
