import { ChatHistory } from './chat/ChatHistory'
import { useChatStore } from './chat/ChatStoreProvider'
import { IconLightbulb } from './Icons'

type Props = {
  onSelectConversation: (id: string) => void
  showHistory: boolean
  dark: boolean
  onToggleTheme: () => void
}

export function PageToolbar({ onSelectConversation, showHistory, dark, onToggleTheme }: Props) {
  const { store, state } = useChatStore()
  const hasHistory = state.conversations.some((conversation) => conversation.messages.length > 0)

  return (
    <header className="page-toolbar" aria-label="页面工具栏">
      <div className="page-toolbar-actions" role="group" aria-label="页面操作">
        {showHistory && hasHistory && <ChatHistory conversations={state.conversations} activeId={state.activeId} onSelect={onSelectConversation} onDelete={store.remove} />}
        <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={dark ? '开灯（切换浅色模式）' : '关灯（切换暗色模式）'} title={dark ? '开灯' : '关灯'}>
          <IconLightbulb lit={!dark} />
        </button>
      </div>
    </header>
  )
}
