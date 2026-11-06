import { createContext, useContext, type ReactNode } from 'react'
import { translations, type Locale, type Messages } from './translations'

type LanguageContextValue = {
  locale: Locale
  m: Messages
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const language: LanguageContextValue = { locale: 'zh', m: translations.zh }

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <LanguageContext.Provider value={language}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
