import { useNavigate } from 'react-router-dom'
import { IconClose } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'
import { useHashOverlay } from '../hooks/useHashOverlay'

export function ContactOverlay() {
  const { m } = useLanguage()
  const { open, close } = useHashOverlay('#contact')
  const navigate = useNavigate()
  const openChat = () => navigate({ pathname: window.location.pathname, search: window.location.search, hash: '#chat' })

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
