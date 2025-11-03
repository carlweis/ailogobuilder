import { type ReactNode, useEffect, useRef } from 'react'
import './CodexSplash.css'

const CHARACTERS = ' .:-=+*#%@▒▓█'
const CELL_SIZE = 14

interface CodexSplashProps {
  children?: ReactNode
  className?: string
}

const CodexSplash = ({ children, className = '' }: CodexSplashProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let animationFrame: number
    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      const bounds = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = Math.round(bounds.width * dpr)
      canvas.height = Math.round(bounds.height * dpr)
      canvas.style.width = `${bounds.width}px`
      canvas.style.height = `${bounds.height}px`

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)
      context.font = `${CELL_SIZE - 2}px "JetBrains Mono", "Fira Code", "DM Mono", monospace`
      context.textBaseline = 'middle'
      context.textAlign = 'center'
    }

    resize()

    let lastWidth = canvas.width
    let lastHeight = canvas.height

    const render = (time: number) => {
      const dpr = window.devicePixelRatio || 1
      if (canvas.width !== lastWidth || canvas.height !== lastHeight) {
        resize()
        lastWidth = canvas.width
        lastHeight = canvas.height
      }

      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const cols = Math.ceil(width / CELL_SIZE)
      const rows = Math.ceil(height / CELL_SIZE)
      const centerX = cols / 2
      const centerY = rows / 2
      const t = time * 0.0012

      context.save()
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)
      context.globalCompositeOperation = 'source-over'
      context.globalAlpha = 1
      context.fillStyle = '#050607'
      context.fillRect(0, 0, width, height)
      context.restore()

      context.save()
      context.globalCompositeOperation = 'lighter'

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dx = x - centerX
          const dy = y - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

          const wave = Math.sin(distance * 0.8 - t * 4) + Math.cos(angle * 6 + t * 3)
          let intensity = (wave + 2) / 4
          const falloff = Math.exp(-Math.pow(distance / (Math.max(cols, rows) * 0.32), 2.2))
          intensity = Math.min(1, Math.max(0, intensity * falloff))

          if (intensity < 0.08) continue

          const characterIndex = Math.floor(intensity * (CHARACTERS.length - 1))
          const char = CHARACTERS.charAt(characterIndex)

          const alpha = 0.15 + intensity * 0.85
          context.fillStyle = `rgba(180, 210, 255, ${alpha})`
          const offsetX = x * CELL_SIZE + CELL_SIZE / 2
          const offsetY = y * CELL_SIZE + CELL_SIZE / 2 + Math.sin(t * 2 + distance * 0.5)
          context.fillText(char, offsetX, offsetY)
        }
      }

      context.restore()

      context.save()
      const glow = context.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.05,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.6,
      )
      glow.addColorStop(0, 'rgba(90, 120, 255, 0.25)')
      glow.addColorStop(0.4, 'rgba(40, 60, 120, 0.18)')
      glow.addColorStop(1, 'rgba(10, 15, 20, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)
      context.restore()

      context.save()
      const vignette = context.createRadialGradient(
        width / 2,
        height / 2,
        Math.max(width, height) * 0.45,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85,
      )
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
      context.fillStyle = vignette
      context.fillRect(0, 0, width, height)
      context.restore()

      animationFrame = window.requestAnimationFrame(render)
    }

    animationFrame = window.requestAnimationFrame(render)

    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={`codex-splash ${className}`.trim()}>
      <canvas ref={canvasRef} className="codex-splash__canvas" aria-hidden="true" />
      <div className="codex-splash__glow" aria-hidden="true" />
      <div className="codex-splash__content">{children}</div>
    </div>
  )
}

export default CodexSplash
