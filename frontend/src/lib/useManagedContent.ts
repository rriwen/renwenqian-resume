import { useEffect, useState } from 'react'
import { getPublishedContent, type ContentKind, type ManagedContent } from './adminContent'

export function usePublishedContent(kind: ContentKind) {
  const [items, setItems] = useState<ManagedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    setLoading(true); setFailed(false)
    getPublishedContent(kind)
      .then(setItems)
      .catch(() => { setItems([]); setFailed(true) })
      .finally(() => setLoading(false))
  }, [kind])
  return { items, loading, failed }
}
