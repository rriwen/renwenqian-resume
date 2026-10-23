import type { Locale } from '../i18n/translations'
import { parseAboutContent, type AboutContent } from './about/parseAboutContent'

export * from './about/parseAboutContent'

const aboutSources = import.meta.glob('./about/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const contentCache = new Map<Locale, AboutContent>()

export function getAboutContent(locale: Locale): AboutContent {
  const cached = contentCache.get(locale)
  if (cached) return cached
  const source = aboutSources[`./about/${locale}.md`]
  if (typeof source !== 'string') {
    throw new Error(`Missing About markdown source for locale: ${locale}`)
  }
  const content = parseAboutContent(source)
  contentCache.set(locale, content)
  return content
}
