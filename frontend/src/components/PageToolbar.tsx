import { useLocation } from 'react-router-dom'
import { ResumeDownload } from './about/ResumeDownload'
import { ChatHistory } from './chat/ChatHistory'
import { useChatStore } from './chat/ChatStoreProvider'
import { IconMail, IconMoon, IconSun } from './Icons'

type Props = {
  onSelectConversation: (id: string) => void
  showHistory: boolean
  dark: boolean
  onOpenContact: () => void
  onToggleTheme: () => void
}

export function PageToolbar({ onSelectConversation, showHistory, dark, onToggleTheme, onOpenContact }: Props) {
  const location = useLocation()
  const { store, state } = useChatStore()
  const hasHistory = state.conversations.some((conversation) => conversation.messages.length > 0)

  return (
    <header className="page-toolbar" aria-label="页面工具栏">
      <div className="page-toolbar-actions" role="group" aria-label="页面操作">
        {location.pathname === '/about' && location.hash !== '#chat' && <ResumeDownload />}
        {showHistory && hasHistory && <ChatHistory conversations={state.conversations} activeId={state.activeId} onSelect={onSelectConversation} onDelete={store.remove} />}
        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={dark ? '切换浅色模式' : '切换暗色模式'} title={dark ? '浅色模式' : '暗色模式'}>
          {dark ? <IconSun /> : <IconMoon />}
        </button>
        <button type="button" className="ui-button page-toolbar-contact" aria-haspopup="dialog" onClick={onOpenContact}><IconMail /><span>联系我</span></button>
      </div>
    </header>
  )
}
