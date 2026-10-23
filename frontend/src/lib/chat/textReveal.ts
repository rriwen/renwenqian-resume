/** Reveal buffered model output at the existing reading pace, without polling. */
export function createTextReveal(onText: (text: string) => void) {
  let pending = ''
  let timer: ReturnType<typeof setInterval> | undefined
  let finished = false
  let resolveIdle: (() => void) | undefined
  const idle = new Promise<void>((resolve) => { resolveIdle = resolve })
  const stop = () => { clearInterval(timer); timer = undefined }
  const tick = () => {
    if (pending) {
      const chunk = pending.slice(0, 10)
      pending = pending.slice(10)
      onText(chunk)
    }
    if (!pending) {
      stop()
      if (finished) resolveIdle?.()
    }
  }
  return {
    append(text: string) {
      if (finished) return
      pending += text
      if (!timer) timer = setInterval(tick, 55)
    },
    finish() { finished = true; tick(); return idle },
    cancel() { finished = true; pending = ''; stop(); resolveIdle?.() },
  }
}
