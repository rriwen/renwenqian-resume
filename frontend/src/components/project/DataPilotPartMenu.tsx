import { useEffect, useId, useRef, useState } from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import type { DataPilotPart } from '../../data/projects/dataPilot'

type Props = {
  label: string
  value: DataPilotPart
  options: { value: DataPilotPart; label: string }[]
  onSelect: (value: DataPilotPart) => void
}

export function DataPilotPartMenu({ label, value, options, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const selected = options.find((option) => option.value === value)!
  const openMenu = () => {
    setFocusedIndex(options.findIndex((option) => option.value === value))
    setOpen(true)
  }
  const closeAndFocus = () => {
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (open) itemRefs.current[focusedIndex]?.focus({ preventScroll: true })
  }, [open, focusedIndex])

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open])

  return <div ref={rootRef} className="datapilot-header-switcher"
    onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}
    onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        event.stopPropagation()
        closeAndFocus()
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!open) openMenu()
        else setFocusedIndex((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
      } else if (open && (event.key === 'Home' || event.key === 'End')) {
        event.preventDefault()
        setFocusedIndex(event.key === 'Home' ? 0 : options.length - 1)
      }
    }}>
    <button ref={triggerRef} type="button" className="datapilot-header-switcher-trigger"
      aria-label={`${label}：${selected.label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId}
      onClick={() => open ? setOpen(false) : openMenu()}>
      <span>{selected.label}</span>
      <CaretDownIcon size={14} aria-hidden="true" />
    </button>
    {open && <div id={menuId} className="datapilot-header-menu" role="menu" aria-label={label}>
      {options.map((option, index) => <button key={option.value} ref={(element) => { itemRefs.current[index] = element }}
        type="button" role="menuitemradio" aria-checked={value === option.value} tabIndex={focusedIndex === index ? 0 : -1}
        onFocus={() => setFocusedIndex(index)}
        onClick={() => { closeAndFocus(); onSelect(option.value) }}>
        <span>{option.label}</span>
        <CheckIcon size={16} aria-hidden="true" style={{ visibility: value === option.value ? 'visible' : 'hidden' }} />
      </button>)}
    </div>}
  </div>
}
