import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

type InstagramMedia = {
  id: string
  caption: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  permalink: string
  timestamp: string
  image: string
  alt: string
}

type InstagramFeed = {
  profile: {
    username: string
    url: string
  }
  syncedAt: string | null
  items: InstagramMedia[]
}

const EMPTY_FEED: InstagramFeed = {
  profile: {
    username: 'design.4x',
    url: 'https://www.instagram.com/design.4x/',
  },
  syncedAt: null,
  items: [],
}

export function Photography() {
  const { locale } = useLanguage()
  const [feed, setFeed] = useState<InstagramFeed | null>(null)

  useEffect(() => {
    document.title = `${locale === 'zh' ? '摄影' : 'Photography'} | REN WENQIAN`
  }, [locale])

  useEffect(() => {
    const controller = new AbortController()

    fetch('/data/instagram.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Instagram feed returned ${response.status}`)
        return response.json() as Promise<InstagramFeed>
      })
      .then((data) => setFeed(data))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setFeed(EMPTY_FEED)
      })

    return () => controller.abort()
  }, [])

  const profile = feed?.profile ?? EMPTY_FEED.profile
  const items = feed?.items ?? []

  return (
    <main className="photography-page">
      <header className="photography-heading">
        <div>
          <h1>Life is a Party 🎆</h1>
        </div>
        <a href={profile.url} target="_blank" rel="noreferrer" className="photography-profile-link">
          @{profile.username} <span aria-hidden="true">↗</span>
        </a>
      </header>

      {feed === null ? (
        <section className="photography-loading" aria-label={locale === 'zh' ? '正在载入照片' : 'Loading photographs'}>
          <span />
          <span />
          <span />
        </section>
      ) : items.length === 0 ? null : (
        <section className="photography-grid" aria-label={locale === 'zh' ? '照片' : 'Photographs'}>
          {items.map((item, index) => (
            <a
              className="photography-item"
              href={item.permalink}
              target="_blank"
              rel="noreferrer"
              key={item.id}
              aria-label={item.caption || item.alt || (locale === 'zh' ? '在 Instagram 查看照片' : 'View photograph on Instagram')}
            >
              <img src={item.image} alt={item.alt} loading={index < 6 ? 'eager' : 'lazy'} />
              {item.mediaType === 'VIDEO' ? <span className="photography-video-mark" aria-hidden="true">▶</span> : null}
              {item.caption || item.alt ? <span className="photography-caption">{item.caption || item.alt}</span> : null}
            </a>
          ))}
        </section>
      )}
    </main>
  )
}
