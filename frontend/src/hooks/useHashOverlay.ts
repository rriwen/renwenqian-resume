import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Support direct hashes, native history and React Router navigation alike. */
export function useHashOverlay(hash: string, { closeOnEscape = true } = {}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(() => window.location.hash === hash)
  useEffect(() => {
    const sync = () => setOpen(window.location.hash === hash)
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [hash, location.key])
  const close = useCallback(() => {
    setOpen(false)
    navigate({ pathname: window.location.pathname, search: window.location.search, hash: '' })
  }, [navigate])
  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, closeOnEscape])
  return { open, close }
}
