# 🌀 Border Waves

Inspired by Apple AI border waves animation on Siri speak.  
Bring smooth, animated, responsive wave borders to your web projects with full customization.

---

## 🔹 Features

- Full control over waves:
  - `amplitude` – height of the waves
  - `wavelength` – length of individual waves
  - `spawnInterval` – how often new waves appear
- Advanced options:
  - `gradientInterval`
  - `pointsPerEdge`
  - `radius`
  - ...and more
- Built with **TypeScript** for type safety
- Optimized for **high performance and large-scale animations**
- **Canvas-based**: smooth and lightweight rendering
- Fully **typed** and ready for modern front-end frameworks

---

## 🔹 Installation

```bash
# npm
npm install @border-waves/core

# yarn
yarn add @border-waves/core

# pnpm
pnpm add @border-waves/core

---

🔹 Basic Usage (React)

import React from 'react'
import { BorderWaves } from '@border-waves/core'

export default function App() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <BorderWaves
        amplitude={waveAmplitude}
        wavelength={waveLength}
        spawnInterval={waveSpawnInterval}
        gradientInterval={gradientInterval}
        pointsPerEdge={pointsPerEdge}
        radius={radius}
      />
    </div>
  )
}

---

## 🔹 Contributing

- Fork the repository: GitHub
- Install dependencies in core and playground workspaces
- Build library: npm run build --workspace=@border-waves/core
- Run playground to test changes: npm run dev --workspace=playground-react

---

## 🔹 License

MIT © 2026 Diamond Niam