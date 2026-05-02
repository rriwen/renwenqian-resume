import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { playCardStackAdvance, playCardStackTick, unlockStackAudio } from '../audio/stackAudio'
import { useLanguage } from '../i18n/LanguageContext'

type Props = {
  projects: Project[]
  activeIndex: number
  onActiveChange: (i: number) => void
  onOpenProject: (p: Project) => void
}

const WHEEL_COOLDOWN_MS = 520
const DRAG_COMMIT = 72
const VELOCITY_COMMIT = 0.45

const SKEW_Y = 16

/** Hover / 选中态共用：以水平位移为主，并带少量右下分量（与 isPopped 布局无关）。 */
function hoverOffset(isMobile: boolean) {
  return isMobile ? { x: 78, y: 14 } : { x: 118, y: 20 }
}

/**
 * 斜向 skew 堆叠：相邻张按 L/M 台阶错开；D/R 把整摞中心对齐到容器中心（50%/50% 锚点）。
 */
function useStackLayout(cardCount: number) {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1200 : window.innerWidth))

  useEffect(() => {
    const ro = () => setW(window.innerWidth)
    ro()
    window.addEventListener('resize', ro)
    return () => window.removeEventListener('resize', ro)
  }, [])

  const isMobile = w < 640
  const cardW =
    isMobile ? 228 : w >= 640 && w < 1024 ? 272 : w >= 1280 && w < 1536 ? 292 : 312
  const L = isMobile ? 52 : 74
  const M = isMobile ? -24 : -34
  const n1 = Math.max(0, cardCount - 1)
  const D = -(n1 * L) / 2
  const R = -(n1 * M) / 2
  const popX = isMobile ? 110 : 160
  const popY = isMobile ? 24 : 36
  const zStep = isMobile ? 5 : 7

  return { isMobile, cardW, L, M, D, R, popX, popY, zStep }
}

export function CardStack({ projects, activeIndex, onActiveChange, onOpenProject }: Props) {
  const { m } = useLanguage()
  const n = projects.length
  const layout = useStackLayout(n)

  const [dragPx, setDragPx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragPxRef = useRef(0)
  const wheelLock = useRef(0)
  const dragStartX = useRef(0)
  const dragPointerId = useRef<number | null>(null)
  const lastMove = useRef({ x: 0, t: 0 })
  const velocity = useRef(0)
  const tickSign = useRef(0)
  const prevIndex = useRef<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const suppressDetailClickRef = useRef(false)

  useEffect(() => {
    if (prevIndex.current === null) {
      prevIndex.current = activeIndex
      return
    }
    if (prevIndex.current !== activeIndex) {
      playCardStackAdvance()
      prevIndex.current = activeIndex
    }
  }, [activeIndex])

  const bumpIndex = useCallback(
    (delta: number) => {
      if (delta === 0) return
      if (activeIndex < 0) {
        onActiveChange(delta > 0 ? 0 : n - 1)
        return
      }
      const next = (activeIndex + delta + n * 100) % n
      onActiveChange(next)
    },
    [activeIndex, n, onActiveChange],
  )

  const endDrag = useCallback(() => {
    const v = velocity.current
    const x = dragPxRef.current
    let delta = 0
    if (x < -DRAG_COMMIT || v < -VELOCITY_COMMIT) delta = 1
    else if (x > DRAG_COMMIT || v > VELOCITY_COMMIT) delta = -1

    const peakDrag = Math.abs(x)
    suppressDetailClickRef.current = delta !== 0 || peakDrag > 16

    setIsDragging(false)
    dragPxRef.current = 0
    setDragPx(0)
    dragPointerId.current = null
    tickSign.current = 0

    if (delta !== 0) bumpIndex(delta)
  }, [bumpIndex])

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (Math.abs(e.deltaY) < 6 && Math.abs(e.deltaX) < 6) return
      e.preventDefault()
      const now = performance.now()
      if (now - wheelLock.current < WHEEL_COOLDOWN_MS) return
      wheelLock.current = now
      void unlockStackAudio()
      const dir = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1
      bumpIndex(dir)
    },
    [bumpIndex],
  )

  const onActivePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    void unlockStackAudio()
    setHoveredIndex(null)
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragPointerId.current = e.pointerId
    dragStartX.current = e.clientX
    lastMove.current = { x: e.clientX, t: performance.now() }
    velocity.current = 0
    dragPxRef.current = 0
    setDragPx(0)
    setIsDragging(true)
    tickSign.current = 0
  }, [])

  const onActivePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || dragPointerId.current !== e.pointerId) return
      e.stopPropagation()
      const raw = e.clientX - dragStartX.current
      const damped = Math.tanh(raw / 140) * 110
      dragPxRef.current = damped
      setDragPx(damped)

      const now = performance.now()
      const dt = Math.max(8, now - lastMove.current.t)
      const inst = (e.clientX - lastMove.current.x) / dt
      velocity.current = velocity.current * 0.65 + inst * 0.35
      lastMove.current = { x: e.clientX, t: now }

      const threshold = 48
      const sign = damped < -threshold ? -1 : damped > threshold ? 1 : 0
      if (sign !== 0 && sign !== tickSign.current) {
        playCardStackTick(0.55)
        tickSign.current = sign
      } else if (sign === 0) {
        tickSign.current = 0
      }
    },
    [isDragging],
  )

  const onActivePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragPointerId.current !== e.pointerId) return
      e.stopPropagation()
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      endDrag()
    },
    [endDrag],
  )

  const onActivePointerCancel = useCallback(() => {
    setIsDragging(false)
    dragPxRef.current = 0
    setDragPx(0)
    dragPointerId.current = null
    tickSign.current = 0
  }, [])

  const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <div
      role="region"
      aria-label={m.cardStack.stackAria}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault()
          void unlockStackAudio()
          bumpIndex(1)
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault()
          void unlockStackAudio()
          bumpIndex(-1)
        }
      }}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1100,
        flex: '1 1 auto',
        minHeight: 0,
        height: '100%',
        margin: '0 auto',
        outline: 'none',
        touchAction: 'pan-y',
        zIndex: 0,
        alignSelf: 'stretch',
      }}
      onWheel={onWheel}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 0,
          perspective: layout.isMobile ? 1000 : 1400,
          perspectiveOrigin: '50% 50%',
        }}
        onPointerLeave={(e) => {
          const next = e.relatedTarget as Node | null
          if (!next || !e.currentTarget.contains(next)) setHoveredIndex(null)
        }}
      >
        {projects.map((p, i) => {
          const isActive = i === activeIndex
          const isPopped = isActive
          const isHovered = hoveredIndex === i && !isDragging
          const showHoverLike = isHovered || (isActive && !isDragging)
          const dragExtra = i === activeIndex ? dragPx : 0
          const ho = showHoverLike ? hoverOffset(layout.isMobile) : { x: 0, y: 0 }
          /** 命中区不含 hover 偏移，避免边缘处指针与卡片相对位移导致 hover 在相邻卡之间振荡 */
          const hitX = layout.D + i * layout.L + (isPopped ? layout.popX : 0) + dragExtra
          const hitY = layout.R + i * layout.M + (isPopped ? layout.popY : 0)
          const dragWobble = isDragging && i === activeIndex ? Math.sin((dragPx / 140) * 0.4) * 4 : 0

          const zBase = n - i + 20
          const z = isPopped ? zBase + 55 : zBase

          const tz = -i * layout.zStep
          const hitTransform = `translate(-50%, -50%) translate(${hitX}px, ${hitY + dragWobble}px) translateZ(${tz}px) skewY(${SKEW_Y}deg) scale(1)`
          /** hover 位移放在 skew 之前，与原先单节点 transform 等价 */
          const visualTransform = `translate(-50%, -50%) translate(${hitX}px, ${hitY + dragWobble}px) translateZ(${tz}px) translate(${ho.x}px, ${ho.y}px) skewY(${SKEW_Y}deg) scale(1)`

          const layerStyleBase = {
            position: 'absolute' as const,
            left: '50%',
            top: '50%',
            width: layout.cardW,
            maxWidth: 'min(88vw, 312px)' as const,
            aspectRatio: '16 / 9' as const,
            borderRadius: 4,
            transformStyle: 'preserve-3d' as const,
            backfaceVisibility: 'hidden' as const,
            WebkitBackfaceVisibility: 'hidden' as const,
            zIndex: z,
          }

          const transitionMs = isDragging ? '0s' : showHoverLike ? '0.38s' : '0.42s'
          const transitionEasing = showHoverLike
            ? 'cubic-bezier(0.2, 0.85, 0.15, 1)'
            : easeOut

          return (
            <Fragment key={p.id}>
              <div
                aria-hidden
                className="card-stack-project-visual"
                style={{
                  ...layerStyleBase,
                  overflow: 'hidden',
                  boxShadow: 'none',
                  pointerEvents: 'none',
                  transform: visualTransform,
                  transitionProperty: 'transform',
                  transitionDuration: transitionMs,
                  transitionTimingFunction: transitionEasing,
                  background: '#111',
                  willChange: isDragging && isActive ? 'transform' : 'auto',
                }}
              >
                <img
                  src={p.image}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    transform: 'none',
                    transformOrigin: 'center center',
                    filter: 'none',
                    transition: 'none',
                  }}
                />
              </div>
              <div
                style={{
                  ...layerStyleBase,
                  pointerEvents: 'auto',
                  transform: hitTransform,
                  transitionProperty: 'transform',
                  transitionDuration: transitionMs,
                  transitionTimingFunction: transitionEasing,
                  background: 'transparent',
                  willChange: isDragging && isActive ? 'transform' : 'auto',
                }}
              >
                <button
                  type="button"
                  className="card-stack-project"
                  aria-label={`${p.title} ${m.cardStack.cardSuffix}`}
                  aria-current={isActive ? true : undefined}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    if (isActive) {
                      if (suppressDetailClickRef.current) {
                        suppressDetailClickRef.current = false
                        return
                      }
                      void unlockStackAudio()
                      onOpenProject(p)
                      return
                    }
                    void unlockStackAudio()
                    onOpenProject(p)
                  }}
                  onPointerEnter={() => {
                    if (!isDragging) setHoveredIndex(i)
                  }}
                  onPointerDown={isActive ? onActivePointerDown : undefined}
                  onPointerMove={isActive ? onActivePointerMove : undefined}
                  onPointerUp={isActive ? onActivePointerUp : undefined}
                  onPointerCancel={isActive ? onActivePointerCancel : undefined}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    padding: 0,
                    borderRadius: 'inherit',
                    cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                    background: 'transparent',
                    touchAction: isActive ? 'none' : 'manipulation',
                  }}
                />
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
