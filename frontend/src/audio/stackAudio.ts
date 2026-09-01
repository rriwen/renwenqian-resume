let ctx: AudioContext | null = null
let lastPlayAt = 0

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
  }
  return ctx
}

export async function unlockStackAudio() {
  const c = getCtx()
  if (c?.state === 'suspended') await c.resume()
}

function throttled(): boolean {
  const now = performance.now()
  if (now - lastPlayAt < 95) return true
  lastPlayAt = now
  return false
}

/** 纸张划过 + 轻微落地感，偏短、不刺耳 */
export function playCardStackAdvance() {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const c = getCtx()
  if (!c || c.state !== 'running') return
  if (throttled()) return

  const t = c.currentTime

  const master = c.createGain()
  master.gain.value = 0.55
  master.connect(c.destination)

  const noiseDur = 0.07
  const n = Math.floor(c.sampleRate * noiseDur)
  const buf = c.createBuffer(1, n, c.sampleRate)
  const ch = buf.getChannelData(0)
  for (let i = 0; i < n; i++) {
    ch[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 1.8
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(2200, t)
  bp.frequency.exponentialRampToValueAtTime(900, t + noiseDur)
  bp.Q.value = 1.2
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.0001, t)
  ng.gain.linearRampToValueAtTime(0.09, t + 0.012)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + noiseDur)
  src.connect(bp)
  bp.connect(ng)
  ng.connect(master)
  src.start(t)
  src.stop(t + noiseDur + 0.02)

  const osc = c.createOscillator()
  osc.type = 'sine'
  const og = c.createGain()
  osc.frequency.setValueAtTime(165, t + 0.02)
  osc.frequency.exponentialRampToValueAtTime(58, t + 0.11)
  og.gain.setValueAtTime(0.0001, t + 0.02)
  og.gain.linearRampToValueAtTime(0.07, t + 0.028)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
  osc.connect(og)
  og.connect(master)
  osc.start(t + 0.02)
  osc.stop(t + 0.14)
}

/** 拖拽到边缘即将翻页时的轻微刻度感（可选） */
export function playCardStackTick(strength = 0.35) {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const c = getCtx()
  if (!c || c.state !== 'running') return

  const t = c.currentTime
  const osc = c.createOscillator()
  osc.type = 'triangle'
  const g = c.createGain()
  osc.frequency.setValueAtTime(420, t)
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.04)
  const peak = 0.04 * strength
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.05)
}
