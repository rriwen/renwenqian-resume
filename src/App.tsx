import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ChatbotOverlay } from './components/ChatbotOverlay'
import { ContactOverlay } from './components/ContactOverlay'
import { Header } from './components/Header'
import { SiteFooter } from './components/SiteFooter'
import { LanguageProvider } from './i18n/LanguageContext'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'

const BlogIndex = lazy(() => import('./pages/BlogIndex').then((module) => ({ default: module.BlogIndex })))
const BlogPost = lazy(() => import('./pages/BlogPost').then((module) => ({ default: module.BlogPost })))
const Photography = lazy(() => import('./pages/Photography').then((module) => ({ default: module.Photography })))

type HomeViewMode = 'stack' | 'grid'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

export default function App() {
  const [viewMode, setViewMode] = useState<HomeViewMode>('stack')
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
        <div style={{ minHeight: '100dvh' }}>
          <ScrollToTop />
          <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} />
          <div className="site-content">
            <Suspense fallback={<main className="route-loading">Loading...</main>}>
              <Routes>
                <Route path="/" element={<Home viewMode={viewMode} onViewMode={setViewMode} />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/photography" element={<Photography />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </div>
          <SiteFooter />
          <ChatbotOverlay dark={dark} onToggleTheme={() => setDark((value) => !value)} />
          <ContactOverlay />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}
