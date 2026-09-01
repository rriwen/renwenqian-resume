import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'

const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

type Props = {
  text: string
  baseWght?: number
  maxWght?: number
  radiusPx?: number
  style?: CSSProperties
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function VariableProximityName({
  text,
  baseWght = 600,
  maxWght = 820,
  radiusPx = 76,
  style,
}: Props) {
  const reduced = usePrefersReducedMotion()
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([])

  const applyVariation = useCallback(
    (clientX: number, clientY: number) => {
      const rMax = Math.max(radiusPx, 1)
      itemRefs.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(clientX - cx, clientY - cy)
        let t = Math.max(0, 1 - d / rMax)
        t = Math.pow(t, 0.5)
        const w = Math.round(baseWght + t * (maxWght - baseWght))
        el.style.fontVariationSettings = `'opsz' 9, 'wght' ${w}`
        el.style.transform = `translateY(${(-t * 1.25).toFixed(2)}px)`
      })
    },
    [baseWght, maxWght, radiusPx],
  )

  const reset = useCallback(() => {
    itemRefs.current.forEach((el) => {
      if (!el) return
      el.style.fontVariationSettings = `'opsz' 9, 'wght' ${baseWght}`
      el.style.transform = 'translateY(0)'
    })
  }, [baseWght])

  const onMove = useCallback(
    (e: MouseEvent<HTMLSpanElement>) => {
      applyVariation(e.clientX, e.clientY)
    },
    [applyVariation],
  )

  useEffect(() => {
    reset()
  }, [reset, text])

  if (reduced) {
    return (
      <span style={{ margin: 0, fontWeight: baseWght, ...style }}>
        {text}
      </span>
    )
  }

  const chars = text.split('')

  return (
    <span style={{ position: 'relative', margin: 0, ...style }}>
      <span style={srOnly}>{text}</span>
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          fontWeight: baseWght,
          fontVariationSettings: `'opsz' 9, 'wght' ${baseWght}`,
          cursor: 'default',
        }}
        onMouseMove={onMove}
        onMouseLeave={reset}
      >
        {chars.map((ch, i) => (
          <span
            key={`${i}-${ch}`}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            style={{
              display: 'inline-block',
              willChange: 'transform',
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  )
}
