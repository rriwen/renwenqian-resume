import { useState } from 'react'
import type { Project } from '../data/projects'
import { isGifSrc } from '../lib/isGifSrc'

type Props = {
  projects: Project[]
  activeIndex: number
  onOpenProject: (p: Project) => void
}

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** hover 轻投影，存在感弱 */
const GRID_SHADOW_HOVER = '0 10px 28px rgba(0,0,0,0.055), 0 2px 8px rgba(0,0,0,0.035)'

export function ProjectGrid({ projects, activeIndex, onOpenProject }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 'clamp(1rem, 2.5vw, 1.5rem)',
        width: '100%',
        maxWidth: 1120,
        margin: '0 auto',
        padding: '0 clamp(0.5rem, 2vw, 1rem)',
      }}
    >
      {projects.map((p, i) => {
        const isActive = i === activeIndex
        const isHover = hovered === i
        const gifCover = isGifSrc(p.image)

        return (
          <button
            key={p.id}
            type="button"
            className="project-grid-card"
            onClick={() => onOpenProject(p)}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
            style={{
              textAlign: 'left',
              borderRadius: 4,
              overflow: 'hidden',
              border: 'none',
              boxShadow: isHover ? GRID_SHADOW_HOVER : 'none',
              background: '#f6f6f6',
              transform: 'none',
              transition: `box-shadow 0.28s ${ease}`,
            }}
          >
            <div
              style={{
                aspectRatio: '16 / 10',
                overflow: 'hidden',
                background: '#0a0a0a',
              }}
            >
              <img
                src={p.image}
                alt=""
                draggable={false}
                loading={gifCover ? 'eager' : undefined}
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: 'none',
                  transformOrigin: 'center center',
                  transition: 'none',
                  filter: 'none',
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0.9rem',
                fontSize: '0.8rem',
                letterSpacing: 'normal',
                fontWeight: isActive ? 700 : isHover ? 600 : 400,
                color: isHover || isActive ? '#0a0a0a' : 'rgba(10,10,10,0.78)',
                transition: `color 0.3s ${ease}`,
              }}
            >
              {p.title}
            </p>
          </button>
        )
      })}
    </div>
  )
}
