import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ChatbotView } from './components/ChatbotView'
import { ChatStoreProvider } from './components/chat/ChatStoreProvider'
import { useHashOverlay } from './hooks/useHashOverlay'
import { ContactOverlay } from './components/ContactOverlay'
import { Header } from './components/Header'
import { LanguageProvider } from './i18n/LanguageContext'
import { Home } from './pages/Home'
import type { ChatCommand } from './lib/chat/thread'

const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then((module) => ({ default: module.ProjectDetail })))
const Photography = lazy(() => import('./pages/Photography').then((module) => ({ default: module.Photography })))
const Experiments = lazy(() => import('./pages/Experiments').then((module) => ({ default: module.Experiments })))
const SqlEditorPrototype = lazy(() => import('./pages/SqlEditorPrototype').then((module) => ({ default: module.SqlEditorPrototype })))

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function AppFrame({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  const chat = useHashOverlay('#chat', { closeOnEscape: false })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatCommands, setChatCommands] = useState<ChatCommand[]>([])
  const [homeVersion, setHomeVersion] = useState(0)
  const [contactOpen, setContactOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])
  useEffect(closeContact, [location.key, closeContact])
  const askQuestion = useCallback((text: string) => {
    if (!text.trim()) return
    setChatCommands((current) => [...current, { id: crypto.randomUUID(), type: 'ask', text: text.trim() }])
    navigate({ pathname: window.location.pathname, search: window.location.search, hash: '#chat' })
  }, [navigate])
  const newChat = useCallback(() => {
    setChatCommands((current) => [...current, { id: crypto.randomUUID(), type: 'new' }])
    setHomeVersion((value) => value + 1)
    navigate('/')
  }, [navigate])
  const consumeCommands = useCallback((ids: string[]) => {
    setChatCommands((current) => current.filter((command) => !ids.includes(command.id)))
  }, [])
  const selectConversation = useCallback((conversationId: string) => {
    // Keep selection after any new-chat/ask commands waiting for the lazy panel.
    setChatCommands((current) => [...current, { id: crypto.randomUUID(), type: 'select', conversationId }])
    navigate({ pathname: window.location.pathname, search: window.location.search, hash: '#chat' })
  }, [navigate])
  return <div className={`app-frame${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
    <ScrollToTop />
    <Header onNewChat={newChat} onSelectConversation={selectConversation} onOpenContact={openContact} dark={dark} onToggleTheme={onToggleTheme} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />
    <div className="site-main" id="site-main">
      <div className="site-content" hidden={chat.open}>
      <Suspense fallback={<main className="route-loading" aria-busy="true" aria-label="页面加载中" />}>
        <Routes>
          <Route path="/" element={<Home key={homeVersion} onAsk={askQuestion} dark={dark} onToggleTheme={onToggleTheme} />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </div>
      <ChatbotView open={chat.open} commands={chatCommands} onCommandsConsumed={consumeCommands} />
    </div>
    <ContactOverlay dark={dark} open={contactOpen} close={closeContact} />
  </div>
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('as4x-theme')
      return savedTheme !== 'light'
    } catch { return true }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('as4x-theme', dark ? 'dark' : 'light') } catch { /* private mode */ }
  }, [dark])

  return (
    <LanguageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ChatStoreProvider>
          <Routes>
            <Route path="/prototype/text2sql" element={
              <Suspense fallback={<main className="route-loading" aria-busy="true" aria-label="页面加载中" />}>
                <SqlEditorPrototype />
              </Suspense>
            } />
            <Route path="*" element={<AppFrame dark={dark} onToggleTheme={() => setDark((value) => !value)} />} />
          </Routes>
        </ChatStoreProvider>
      </BrowserRouter>
    </LanguageProvider>
  )
}
