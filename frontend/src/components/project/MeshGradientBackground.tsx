import { useEffect, useRef, useState } from 'react'
import { ShaderMount, ShaderFitOptions, getShaderColorFromString, meshGradientFragmentShader } from '@paper-design/shaders'

const paletteTokens = ['--showcase-ice', '--showcase-sky', '--showcase-blue', '--showcase-lavender']

/** Matches the mesh gradient and motion settings on oceanbase.com/product/datapilot. */
export function MeshGradientBackground() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [generation, setGeneration] = useState(0)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let mount: ShaderMount | undefined
    let contextLost = false
    const readColors = () => {
      const style = getComputedStyle(host)
      const colors = paletteTokens.map(token => style.getPropertyValue(token).trim())
      return colors.every(color => /^#[\da-f]{6}$/i.test(color)) ? colors.map(getShaderColorFromString) : null
    }
    const sync = () => {
      if (contextLost) return
      if (!mount) initialize()
      if (!mount) return
      const colors = readColors()
      if (colors) mount.setUniforms({ u_colors: colors })
      mount.setSpeed(motion.matches ? 0 : 1)
    }
    const onLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      mount?.setSpeed(0)
      if (mount) mount.canvasElement.style.opacity = '0'
    }
    const onRestored = () => setGeneration(value => value + 1)
    const initialize = () => {
      if (mount) return
      const colors = readColors()
      if (!colors) return // The CSS gradient is the fallback.
      try {
        mount = new ShaderMount(host, meshGradientFragmentShader, {
          u_colors: colors,
          u_colorsCount: colors.length,
          u_distortion: 0.15,
          u_swirl: 0.27,
          u_grainMixer: 0,
          u_grainOverlay: 0,
          u_fit: ShaderFitOptions.cover,
          u_scale: 1.2,
          u_rotation: 136,
          u_offsetX: -0.02,
          u_offsetY: 0.04,
          u_originX: 0.5,
          u_originY: 0.5,
          u_worldWidth: 1280,
          u_worldHeight: 720,
        }, { powerPreference: 'low-power' }, motion.matches ? 0 : 1, 0, 1, 1920 * 1080)
        mount.canvasElement.addEventListener('webglcontextlost', onLost)
        mount.canvasElement.addEventListener('webglcontextrestored', onRestored)
      } catch {
        host.replaceChildren()
      }
    }
    // Let the page's scoped CSS settle before reading its palette, including HMR.
    const frame = requestAnimationFrame(initialize)
    // ShaderMount owns resize, offscreen/background pausing, and WebGL cleanup.
    motion.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    document.addEventListener('visibilitychange', sync)
    if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', sync)
    return () => {
      cancelAnimationFrame(frame)
      motion.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
      document.removeEventListener('visibilitychange', sync)
      if (import.meta.hot) import.meta.hot.off('vite:afterUpdate', sync)
      if (mount) {
        mount.canvasElement.removeEventListener('webglcontextlost', onLost)
        mount.canvasElement.removeEventListener('webglcontextrestored', onRestored)
        mount.dispose()
      }
    }
  }, [generation])

  return <div ref={hostRef} className="dbv-mesh-gradient" aria-hidden="true" />
}
