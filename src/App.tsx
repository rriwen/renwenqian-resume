import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChatbotOverlay } from './components/ChatbotOverlay'
import { ContactOverlay } from './components/ContactOverlay'
import { Header } from './components/Header'
import { LanguageProvider } from './i18n/LanguageContext'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'

type HomeViewMode = 'stack' | 'grid'

export default function App() {
  const [viewMode, setViewMode] = useState<HomeViewMode>('stack')

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100dvh' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home viewMode={viewMode} onViewMode={setViewMode} />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <ChatbotOverlay />
          <ContactOverlay />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}
