import { lazy, Suspense, useEffect, useState } from 'react'
import { useHashOverlay } from '../hooks/useHashOverlay'

const ChatPanel = lazy(() => import('./chat/ChatPanel').then((module) => ({ default: module.ChatPanel })))

export function ChatbotOverlay(props: { dark: boolean; onToggleTheme: () => void }) {
  const { open, close } = useHashOverlay('#chat')
  const [activated, setActivated] = useState(open)
  useEffect(() => { if (open) setActivated(true) }, [open])
  if (!open && !activated) return null
  // Preserve active streams and local state when the panel is temporarily closed.
  return <Suspense fallback={null}><ChatPanel {...props} open={open} onClose={close} /></Suspense>
}
