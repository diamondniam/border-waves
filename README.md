# 🌀 Border Waves

Inspired by Apple AI border waves animation on Siri speak.  
Bring smooth, animated, responsive wave borders to your web projects with full customization.

---

## 🔹 Features

- Full control over waves:
  - `waveAmplitude` – height of the waves
  - `wavelength` – length of individual waves
  - `spawnInterval` – how often new waves appear
- Methods: 
  - `setCanvas`
  - `destroy`
  - ...and more
- Built with **TypeScript** for type safety
- Optimized for **high performance and large-scale animations**
- **Canvas-based**: smooth and lightweight rendering
- Fully **typed** and ready for modern front-end frameworks

## 🔹 Installation

```bash
# npm
npm install @border-waves/core

# yarn
yarn add @border-waves/core

# pnpm
pnpm add @border-waves/core
```

## 🔹 Basic Usage (React)

```js
import Canvas from '@border-waves/core'

export default function App() {
  const canvasRef = useRef<Canvas>(null)
  const canvasElRef = useRef<HTMLCanvasElement>(null)

  // INITIATING
  useEffect(() => {
    if (!canvasElRef.current) return

    canvasRef.current = new Canvas({
      el: canvasElRef.current,
      // here can be your initial options: 
      // blur, waveSpawnInterval and etc.
    })
  }, [])

  // SETTING CANVAS OPTIONS
  useEffect(() => {
    if (!canvasRef.current) return

    canvasRef.current.setCanvas({
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
    })
  }, []) // here can be your triggers

  return <canvas ref={canvasElRef}></canvas>
}
```

## 🔹 Contributing

- Fork the repository: GitHub
- Install dependencies in core and playground workspaces
- Build library: npm run build --workspace=@border-waves/core
- Run playground to test changes: npm run dev --workspace=playground-react

## 🔹 License

ISC © 2026 Diamond Niam
