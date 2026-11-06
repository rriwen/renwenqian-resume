import { lazy, Suspense, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const Lanyard = lazy(() => import('./Lanyard/Lanyard'))

export function ContactOverlay({ dark, open, close }: { dark: boolean; open: boolean; close: () => void }) {
  const { m } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = Array.from(document.querySelectorAll<HTMLElement>('#site-main, #site-sidebar, .navigation-launcher, .page-toolbar, .lanyard-viewport'))
    const previousInert = background.map((element) => element.inert)
    const previousOverflow = document.body.style.overflow
    background.forEach((element) => { element.inert = true })
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const elements = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', trapFocus)
    return () => {
      document.removeEventListener('keydown', trapFocus)
      background.forEach((element, index) => { element.inert = previousInert[index] })
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected && previousFocus.getClientRects().length) previousFocus.focus({ preventScroll: true })
      else Array.from(document.querySelectorAll<HTMLElement>('.sidebar-contact-button, .mobile-menu-button'))
        .find((element) => element.getClientRects().length && !element.closest('[inert]'))?.focus({ preventScroll: true })
    }
  }, [open, close])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" aria-label={m.contact.dialogAria} className="contact-overlay" onClick={close}>
      <div ref={panelRef} className="contact-panel" onClick={(event) => event.stopPropagation()}>
        <div className="contact-copy">
          <h2>{m.contact.title}</h2>
          <div className="contact-details">
            <a href="mailto:rriwen@gmail.com">rriwen@gmail.com</a>
            <span aria-label={m.contact.wechatAria}>18362976211</span>
          </div>
          <button ref={closeRef} type="button" className="ui-button contact-dismiss" onClick={close}>{m.contact.dismiss}</button>
        </div>
        <div className="contact-lanyard" aria-hidden="true">
          <Suspense fallback={null}>
            <Lanyard
              renderContainerRef={panelRef}
              frontImage={`/images/lanyard/front${dark ? '-dark' : ''}.svg`}
              backImage={`/images/lanyard/back${dark ? '-dark' : ''}.svg`}
              orientation="landscape"
              cardColor={dark ? '#191b1e' : '#f4f4f5'}
              finish="matte"
              size={0.88}
              strapLength={0.12}
              strapWidth={0.5}
              breeze={0.25}
              damping={0.65}
              interactive
              intro={false}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
