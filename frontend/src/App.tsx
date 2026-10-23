import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ChatbotOverlay } from './components/ChatbotOverlay'
import { ContactOverlay } from './components/ContactOverlay'
import { Header } from './components/Header'
import { SiteFooter } from './components/SiteFooter'
import { LanguageProvider } from './i18n/LanguageContext'
import { Home } from './pages/Home'

const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then((module) => ({ default: module.ProjectDetail })))
const Photography = lazy(() => import('./pages/Photography').then((module) => ({ default: module.Photography })))

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function AppFrame({ dark, onToggleTheme }: { dark: boolean; onToggleTheme: () => void }) {
  return <div style={{ minHeight: '100dvh' }}>
    <ScrollToTop />
    <Header dark={dark} onToggleTheme={onToggleTheme} />
    <div className="site-content">
      <Suspense fallback={<main className="route-loading">Loading...</main>}>
        <Routes>
          <Route path="/" element={<Home dark={dark} />} />
          <Route path="/photography" element={<Photography />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
    <SiteFooter /><ChatbotOverlay dark={dark} onToggleTheme={onToggleTheme} /><ContactOverlay />
  </div>
}

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('as4x-theme')
      return savedTheme ? savedTheme === 'dark' : false
    } catch { return false }
  })

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('as4x-theme', dark ? 'dark' : 'light') } catch { /* private mode */ }
  }, [dark])

  return (
    <LanguageProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppFrame dark={dark} onToggleTheme={() => setDark((value) => !value)} />
      </BrowserRouter>
    </LanguageProvider>
  )
}
