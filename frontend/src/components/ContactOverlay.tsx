import { useCallback, useEffect, useState } from 'react'
import { IconClose } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

function isContactHash() {
  return window.location.hash === '#contact'
}

export function ContactOverlay() {
  const { m } = useLanguage()
  const [open, setOpen] = useState(isContactHash)

  const sync = useCallback(() => setOpen(isContactHash()), [])

  const close = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname + window.location.search)
    setOpen(false)
  }, [])

  const openChat = useCallback(() => {
    window.location.hash = '#chat'
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [sync])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={m.contact.dialogAria} className="contact-overlay" onClick={close}>
      <div className="contact-panel" onClick={(event) => event.stopPropagation()}>
        <div className="contact-heading">
          <h2>{m.contact.title}</h2>
          <button type="button" className="icon-button" aria-label={m.contact.closeAria} onClick={close}><IconClose /></button>
        </div>
        <p>{m.contact.intro}</p>
        <div className="contact-details">
          <a href="mailto:rriwen@gmail.com">rriwen@gmail.com</a>
          <span aria-label={m.contact.wechatAria}>18362976211</span>
        </div>
        <button type="button" className="ui-button ui-button--primary" onClick={openChat}>{m.footer.botLink}</button>
      </div>
    </div>
  )
}
