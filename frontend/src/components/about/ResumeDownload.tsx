import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function ResumeDownload() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const overflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return <>
    <button ref={triggerRef} className="icon-button" type="button" aria-label="下载简历" title="下载简历" onClick={() => setOpen(true)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m-4-4 4 4 4-4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </svg>
    </button>
    {open && createPortal(<dialog ref={dialogRef} className="resume-download-dialog" aria-labelledby="resume-download-title" onCancel={() => setOpen(false)} onClick={(event) => {
      if (event.target !== event.currentTarget) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false)
    }}>
      <h2 id="resume-download-title">下载简历</h2>
      <div className="resume-download-file">
        <span className="resume-download-file-icon" aria-hidden="true">
          <svg viewBox="0 0 32 40" fill="none">
            <path d="M6 0h14l12 12v22a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6Z" fill="#F45158" />
            <path d="M20 0v8a4 4 0 0 0 4 4h8L20 0Z" fill="#FF9A9E" />
            <text x="16" y="31" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">PDF</text>
          </svg>
        </span>
        <div className="resume-download-file-info">
          <span className="resume-download-file-name">任文倩_产品设计师简历.pdf</span>
          <span className="resume-download-file-type">PDF</span>
        </div>
      </div>
      <div className="resume-download-actions">
        <button className="ui-button" type="button" autoFocus onClick={() => setOpen(false)}>取 消</button>
        <a className="ui-button ui-button--primary" href="/任文倩_产品设计师简历.pdf" download="任文倩_产品设计师简历.pdf" onClick={() => setOpen(false)}>下 载</a>
      </div>
    </dialog>, document.body)}
  </>
}
