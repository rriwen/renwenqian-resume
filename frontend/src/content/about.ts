import type { Locale } from '../i18n/translations'
import { parseAboutContent, type AboutContent } from './about/parseAboutContent'

export * from './about/parseAboutContent'

import aboutSource from './about/zh.md?raw'

const contentCache = new Map<Locale, AboutContent>()

export function getAboutContent(locale: Locale): AboutContent {
  const cached = contentCache.get(locale)
  if (cached) return cached
  const source = aboutSource
  if (typeof source !== 'string') {
    throw new Error(`Missing About markdown source for locale: ${locale}`)
  }
  const content = parseAboutContent(source)
  contentCache.set(locale, content)
  return content
}
