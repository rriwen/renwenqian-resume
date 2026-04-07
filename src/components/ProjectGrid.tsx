import { useState } from 'react'
import type { Project } from '../data/projects'

type Props = {
  projects: Project[]
  activeIndex: number
  onOpenProject: (p: Project) => void
}

const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

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
        const lift = isHover ? -7 : 0

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
              border:
                isActive && !isHover
                  ? '1px solid rgba(10,10,10,0.88)'
                  : isHover
                    ? '1px solid rgba(10,10,10,0.12)'
                    : '1px solid rgba(10,10,10,0.06)',
              boxShadow: isHover
                ? '0 20px 48px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.06)'
                : '0 10px 32px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
              transition: `transform 0.4s ${ease}, box-shadow 0.4s ${ease}, border-color 0.35s ${ease}`,
              background: '#f6f6f6',
              transform: `translateY(${lift}px)`,
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
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: isHover ? 'scale(1.06)' : 'scale(1)',
                  transformOrigin: 'center center',
                  transition: `transform 0.55s ${ease}`,
                  filter: isHover ? 'brightness(1.04)' : 'brightness(1)',
                }}
              />
            </div>
            <p
              style={{
                margin: 0,
                padding: '0.75rem 0.9rem',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: isHover ? '#0a0a0a' : 'rgba(10,10,10,0.78)',
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
