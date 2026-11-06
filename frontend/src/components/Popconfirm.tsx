import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Props = {
  id: string
  anchor: HTMLButtonElement
  title: string
  error?: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  onDismiss: () => void
}

// React 18's DOM typings predate the native popover attribute.
const popoverAttributes = { popover: 'manual' } as const

export function Popconfirm({ id, anchor, title, error, cancelLabel, confirmLabel, onCancel, onConfirm, onDismiss }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ left: 0, top: 0, arrow: 0, side: 'bottom' })

  useLayoutEffect(() => {
    const popup = rootRef.current!
    // The native top layer avoids clipping inside scrolling lists without moving the DOM or focus boundary.
    popup.showPopover()
    const place = () => {
      const target = anchor.getBoundingClientRect()
      const { width, height } = popup.getBoundingClientRect()
      const edge = 12
      const gap = 8
      const below = window.innerHeight - target.bottom - edge
      const above = target.top - edge
      const side = below >= height + gap || below >= above ? 'bottom' : 'top'
      const left = Math.max(edge, Math.min(target.right - width, window.innerWidth - width - edge))
      const top = Math.max(edge, Math.min(side === 'bottom' ? target.bottom + gap : target.top - height - gap,
        window.innerHeight - height - edge))
      const arrow = Math.max(16, Math.min(target.left + target.width / 2 - left, width - 16))
      setPosition({ left, top, arrow, side })
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(popup)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    cancelRef.current?.focus({ preventScroll: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
      if (popup.matches(':popover-open')) popup.hidePopover()
    }
  }, [anchor])

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !anchor.contains(event.target)) onDismiss()
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [anchor, onDismiss])

  return <div {...popoverAttributes} ref={rootRef} id={id} role="alertdialog" className="popconfirm"
    aria-labelledby={`${id}-title`} aria-describedby={error ? `${id}-error` : undefined}
    data-side={position.side}
    style={{ left: position.left, top: position.top }}
    onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)
        && !anchor.contains(event.relatedTarget)) onDismiss()
    }}
    onKeyDown={(event) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel() }
    }}>
    <span className="popconfirm-arrow" aria-hidden="true" style={{ left: position.arrow }} />
    <p id={`${id}-title`} className="popconfirm-title">{title}</p>
    {error && <p id={`${id}-error`} className="popconfirm-error" role="alert">{error}</p>}
    <div className="popconfirm-actions">
      <button ref={cancelRef} type="button" className="ui-button" onClick={onCancel}>{cancelLabel}</button>
      <button type="button" className="ui-button popconfirm-danger" onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </div>
}
