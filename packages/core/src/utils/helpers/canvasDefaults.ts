import { CanvasDefaults } from '@/types'

export const canvasDefaults: CanvasDefaults = {
  lineWidth: 7,
  radius: 40,
  pointsPerMaxEdge: 60,
  waveLength: { min: 10, max: 20 },
  waveAmplitude: { min: 10, max: 20 },
  waveDuration: { min: 1, max: 2 },
  waveSpawnInterval: 0.5,
  gradientInterval: 1,
  setCanvasTimeoutDuration: 200,
}
