import { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export function Experiments() {
  const { locale, m } = useLanguage()

  useEffect(() => {
    document.title = `${m.experiments.title} | ${locale === 'zh' ? '泗澄' : 'SICHENG'}`
  }, [locale, m.experiments.title])

  return (
    <main className="page-shell">
      <h1 className="page-title">{m.experiments.title}</h1>
      <p className="empty-state">{m.experiments.placeholder}</p>
    </main>
  )
}
