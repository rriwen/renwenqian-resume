import { useLanguage } from '../i18n/LanguageContext'

export function LanguageSwitcher() {
  const { locale, setLocale, m } = useLanguage()
  const nextLocale = locale === 'zh' ? 'en' : 'zh'
  return (
    <button
      type="button"
      className="language-switch-control"
      aria-label={`${m.language.switcherAria}: ${nextLocale === 'zh' ? m.language.chinese : m.language.english}`}
      title={nextLocale === 'zh' ? m.language.chinese : m.language.english}
      onClick={() => setLocale(nextLocale)}
    >
      {locale === 'zh' ? '中' : 'EN'}
    </button>
  )
}
