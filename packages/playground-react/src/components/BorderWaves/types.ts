import type { CanvasProps, NumericRange } from '@border-waves/core'

export interface Props extends Omit<CanvasProps, 'el'> {
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
  lineWidth?: number
  radius?: number
  waveLength?: NumericRange
  waveAmplitude?: NumericRange
  waveDuration?: NumericRange
  pointsPerMaxEdge?: number
  gradientInterval?: number
  waveSpawnInterval?: number
}
