import {
  Border,
  CanvasProps,
  GeneratedGradient,
  GradientState,
  NumericRange,
  SetCanvasProps,
  Wave,
} from '@/types'
import {
  getRandomInt,
  lerp,
  canvasDefaults,
  lerpGradient,
  generateGradient,
} from '@/utils/helpers'

export class Canvas {
  private canvas: HTMLCanvasElement | null = null
  private animationFrameId: number = 0
  private ctx: CanvasRenderingContext2D | null = null
  private lastTime: number = performance.now()
  private waves: Wave[] = []
  private tGlobal: number = 0
  private waveSpawnTimer = 0
  private waveSpawnInterval: number = 0
  private waveLength: NumericRange = { min: 0, max: 0 }
  private waveAmplitude: NumericRange = { min: 0, max: 0 }
  private waveDuration: NumericRange = { min: 0, max: 0 }
  private blurTimer = 0
  private blurInterval = 2
  private gradientTimer = 0
  private gradientInterval: number = 0
  private maxBlurSize = 60

  private lineWidth: number = 0
  private radius: number = 0
  private pointsPerMaxEdge: number = 0

  private width: number = 0
  private height: number = 0

  private border: Border[] = []
  private blurs: [number, number] = [0, 0]
  private gradients: GeneratedGradient[] = []

  private setCanvasTimeout: number = 0
  private setCanvasTimeoutDuration: number = 0

  constructor({
    el,
    blur,
    waveSpawnInterval,
    waveLength,
    waveAmplitude,
    waveDuration,
    gradientInterval,
    lineWidth,
    radius,
    pointsPerMaxEdge,
    width,
    height,
    setCanvasTimeoutDuration,
  }: CanvasProps) {
    if (!el) throw new Error('Element is not defined')

    this.canvas = el
    this.ctx = this.canvas.getContext('2d')!

    this.setCanvas({
      blur,
      waveSpawnInterval: waveSpawnInterval || canvasDefaults.waveSpawnInterval,
      waveLength: waveLength || canvasDefaults.waveLength,
      waveAmplitude: waveAmplitude || canvasDefaults.waveAmplitude,
      waveDuration: waveDuration || canvasDefaults.waveDuration,
      gradientInterval: gradientInterval || canvasDefaults.gradientInterval,
      lineWidth: lineWidth || canvasDefaults.lineWidth,
      radius: radius || canvasDefaults.radius,
      pointsPerMaxEdge: pointsPerMaxEdge || canvasDefaults.pointsPerMaxEdge,
      width: width || window.innerWidth,
      height: height || window.innerHeight,
      setCanvasTimeoutDuration: 0,
    })

    this.setCanvasTimeoutDuration =
      setCanvasTimeoutDuration || canvasDefaults.setCanvasTimeoutDuration

    this.canvas.width = this.width
    this.canvas.height = this.height

    const rawBorder = this.getRoundedRectPath(
      0,
      0,
      this.width,
      this.height,
      this.radius,
      this.pointsPerMaxEdge,
    )

    this.border = rawBorder.map((p) => ({ ...p, px: p.x, py: p.y }))
    this.blurs = [0, getRandomInt(0, this.maxBlurSize)]
    this.gradients = [generateGradient(), generateGradient()]

    this.animate(0)
  }

  applyGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    gradientState: GradientState,
    A?: number,
  ) {
    if (!this.ctx) throw new Error('Context is not defined')

    const grad = this.ctx.createLinearGradient(x0, y0, x1, y1)
    for (const stop of gradientState) {
      const [r, g, b, a] = stop.color
      grad.addColorStop(stop.offset, `rgba(${r}, ${g}, ${b}, ${A !== undefined ? A : a})`)
    }
    return grad
  }

  getRoundedRectPath(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    pointsPerMaxEdge: number,
  ) {
    w = w - this.lineWidth * 2
    h = h - this.lineWidth * 2
    x = x + this.lineWidth
    y = y + this.lineWidth
    const maxEdge = Math.max(w, h)

    const pointsHorizontal = Math.round((w / maxEdge) * pointsPerMaxEdge)
    const pointsVertical = Math.round((h / maxEdge) * pointsPerMaxEdge)
    const arcLength = (Math.PI / 2) * r
    const pointsArc = Math.max(3, Math.round((arcLength / maxEdge) * pointsPerMaxEdge))

    const path: { x: number; y: number; nx: number; ny: number }[] = []

    const corners = [
      { cx: x + r, cy: y + r, startAngle: Math.PI, endAngle: 1.5 * Math.PI },
      {
        cx: x + w - r,
        cy: y + r,
        startAngle: 1.5 * Math.PI,
        endAngle: 2 * Math.PI,
      },
      {
        cx: x + w - r,
        cy: y + h - r,
        startAngle: 0,
        endAngle: 0.5 * Math.PI,
      },
      {
        cx: x + r,
        cy: y + h - r,
        startAngle: 0.5 * Math.PI,
        endAngle: Math.PI,
      },
    ]

    const linearSegments = [
      { from: [x + r, y], to: [x + w - r, y], nx: 0, ny: -1 },
      { from: [x + w, y + r], to: [x + w, y + h - r], nx: 1, ny: 0 },
      { from: [x + w - r, y + h], to: [x + r, y + h], nx: 0, ny: 1 },
      { from: [x, y + h - r], to: [x, y + r], nx: -1, ny: 0 },
    ]

    for (let i = 0; i < 4; i++) {
      const { cx, cy, startAngle, endAngle } = corners[i]
      for (let j = 0; j < pointsArc; j++) {
        const t = j / pointsArc
        const angle = lerp(startAngle, endAngle, t)
        const px = cx + Math.cos(angle) * r
        const py = cy + Math.sin(angle) * r
        const nx = Math.cos(angle)
        const ny = Math.sin(angle)
        path.push({ x: px, y: py, nx, ny })
      }

      const { from, to, nx, ny } = linearSegments[i]
      const points = (i + 1) % 2 === 0 ? pointsVertical : pointsHorizontal
      for (let j = 0; j < points; j++) {
        const t = j / points
        const px = lerp(from[0], to[0], t)
        const py = lerp(from[1], to[1], t)
        path.push({ x: px, y: py, nx, ny })
      }
    }

    return path
  }
  computeAnimatedNormals(points: { px: number; py: number }[]) {
    const result = []
    const count = points.length

    for (let i = 0; i < count; i++) {
      const prev = points[(i - 1 + count) % count]
      const next = points[(i + 1) % count]

      const dx = next.px - prev.px
      const dy = next.py - prev.py

      const length = Math.hypot(dx, dy) || 1 // avoid division by zero
      const nx = -dy / length
      const ny = dx / length

      result.push({ px: prev.px, py: prev.py, nx, ny })
    }

    return result
  }

  draw() {
    if (!this.ctx) throw new Error('Context is not defined')

    this.ctx.clearRect(0, 0, this.width, this.height)

    this.ctx.beginPath()

    this.ctx.rect(0, 0, this.width, this.height)

    const newBorder = []

    for (let i = 0; i < this.border.length; i++) {
      const point = this.border[i]
      let totalWave = 0

      for (const wave of this.waves) {
        const dist = Math.abs(i - wave.index)
        const decay = Math.exp(-dist / wave.wavelength)
        const phase = wave.phase + this.tGlobal * 3
        const pulse = Math.sin((dist / wave.wavelength) * Math.PI * 2 + phase)
        const fade = 1 - wave.life / wave.duration
        totalWave += pulse * decay * wave.amplitude * fade
      }

      const targetX = point.x - point.nx * Math.abs(totalWave)
      const targetY = point.y - point.ny * Math.abs(totalWave)

      point.px = lerp(point.px, targetX, 0.1)
      point.py = lerp(point.py, targetY, 0.1)

      if (i === 0) this.ctx.moveTo(point.px, point.py)
      else this.ctx.lineTo(point.px, point.py)

      newBorder.push({ px: point.px, py: point.py })
    }
    this.ctx.closePath()

    this.ctx.lineWidth = 1
    const gradient = lerpGradient(
      this.gradients[0],
      this.gradients[1],
      this.gradientTimer / this.gradientInterval,
    )
    const ctxGradient = this.applyGradient(
      0,
      0,
      this.width,
      this.height,
      gradient.gradient,
    )

    this.ctx.fillStyle = ctxGradient
    this.ctx.fill('evenodd')

    this.ctx.strokeStyle = ctxGradient
    this.ctx.shadowBlur = lerp(
      this.blurs[0],
      this.blurs[1],
      this.blurTimer / this.blurInterval,
    )
    this.ctx.shadowColor = `rgba(${gradient.mainColor[0]}, ${gradient.mainColor[1]}, ${gradient.mainColor[2]}, ${gradient.mainColor[3]})`
    this.ctx.stroke()
  }

  isLeftOrRightEdge(point: { x: number; y: number }, height: number): boolean {
    return point.y > this.radius && point.y < height - this.radius
  }

  spawnWave() {
    const index = Math.floor(Math.random() * this.border.length)
    let wavelength = getRandomInt(this.waveLength.min, this.waveLength.max)
    let amplitude = getRandomInt(this.waveAmplitude.min, this.waveAmplitude.max)
    const duration = getRandomInt(this.waveDuration.min, this.waveDuration.max)

    if (!this.isLeftOrRightEdge(this.border[index], this.height)) {
      wavelength = getRandomInt(5, 10)
      amplitude = getRandomInt(5, 10)
    }

    this.waves.push({
      index,
      wavelength,
      amplitude,
      phase: Math.random() * Math.PI * 2,
      life: 0,
      duration,
    })
  }

  setCanvas({
    blur,
    waveSpawnInterval,
    waveLength,
    waveAmplitude,
    waveDuration,
    gradientInterval,
    lineWidth,
    radius,
    pointsPerMaxEdge,
    width,
    height,
    setCanvasTimeoutDuration,
  }: SetCanvasProps) {
    if (!window || !document) throw new Error('Window is not defined')

    const setCanvasFn = () => {
      if (waveSpawnInterval) {
        this.waveSpawnInterval = waveSpawnInterval
      }
      if (waveLength) {
        this.waveLength = waveLength
      }
      if (waveAmplitude) {
        this.waveAmplitude = waveAmplitude
      }
      if (waveDuration) {
        this.waveDuration = waveDuration
      }
      if (gradientInterval) {
        this.gradientInterval = gradientInterval
      }
      if (lineWidth) {
        this.lineWidth = lineWidth
      }
      if (radius) {
        this.radius = radius
      }
      if (pointsPerMaxEdge) {
        this.pointsPerMaxEdge = pointsPerMaxEdge
      }
      if (width) {
        this.width = width
      }
      if (height) {
        this.height = height
      }
      if (setCanvasTimeoutDuration) {
        this.setCanvasTimeoutDuration = setCanvasTimeoutDuration
      }

      if (!this.canvas) {
        throw new Error(`Canvas element not found`)
      }

      this.canvas.style.filter = `blur(${blur || '2px'})`
    }

    if (this.setCanvasTimeout) {
      window.clearTimeout(this.setCanvasTimeout)
    }

    if (setCanvasTimeoutDuration === 0) {
      setCanvasFn()
    } else {
      this.setCanvasTimeout = window.setTimeout(
        () => {
          setCanvasFn()
        },
        setCanvasTimeoutDuration !== undefined
          ? setCanvasTimeoutDuration
          : this.setCanvasTimeoutDuration,
      )
    }
  }

  animate(time: number) {
    const dt = (time - this.lastTime) / 1000
    this.lastTime = time
    this.tGlobal += dt

    this.waveSpawnTimer += dt
    if (this.waveSpawnTimer >= this.waveSpawnInterval) {
      this.waveSpawnTimer = 0
      for (let i = 0; i < 5; i++) this.spawnWave()
    }

    this.blurTimer += dt
    if (this.blurTimer >= this.blurInterval) {
      this.blurTimer = 0
      this.blurs = [this.blurs[1], getRandomInt(0, this.maxBlurSize)]
    }

    this.gradientTimer += dt
    if (this.gradientTimer >= this.gradientInterval) {
      this.gradientTimer = 0
      this.gradients = [this.gradients[1], generateGradient()]
    }

    for (const wave of this.waves) wave.life += dt
    this.waves = this.waves.filter((wave) => wave.life < wave.duration)

    this.draw()
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this))
  }

  destroy() {
    if (!this.ctx || !this.canvas) throw new Error('Context is not defined')

    cancelAnimationFrame(this.animationFrameId)

    this.waves = []
    this.gradients = []
    this.blurs = [0, 0]

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
