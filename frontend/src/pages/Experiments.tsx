import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import '../styles/components/playground.css'

export function Experiments() {
  const { locale, m } = useLanguage()

  useEffect(() => {
    document.title = `${m.experiments.title} | ${'泗澄'}`
  }, [locale, m.experiments.title])

  return (
    <main className="page-shell">
      <h1 className="page-title">{m.experiments.title}</h1>
      <div className="playground-grid">
        <article className="playground-card">
          <div className="playground-card-image">
            <img src="/images/tokenhub-preview.png" alt="TokenHub 的 AI Token 消耗统计与年度热力图" />
          </div>
          <h2>TokenHub</h2>
          <p>看看你每天烧了多少算力，哪天用量冲顶、哪天让 AI 放了假</p>
        </article>
        <div className="playground-card playground-card--placeholder">
          <p>🚧 To Be Continue...</p>
        </div>
      </div>
    </main>
  )
}
