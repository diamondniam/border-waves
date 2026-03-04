export type NumericRange = {
  min: number
  max: number
}

export type Wave = {
  index: number
  wavelength: number
  amplitude: number
  phase: number
  life: number
  duration: number
}

export type ColorStop = {
  offset: number // 0 to 1
  color: [number, number, number, number] // RGBA
}

export type GeneratedGradient = {
  gradient: GradientState
  mainColor: [number, number, number, number]
}

export type GradientState = ColorStop[]

export type Defaults = {
  waveLength: NumericRange
  waveAmplitude: NumericRange
  waveDuration: NumericRange
  gradientInterval: number
  waveSpawnInterval: number
}

export type Border = {
  x: number
  y: number
  nx: number
  ny: number
  px: number
  py: number
}

export type CanvasDefaults = {
  lineWidth: number
  radius: number
  pointsPerMaxEdge: number
  waveLength: NumericRange
  waveAmplitude: NumericRange
  waveDuration: NumericRange
  waveSpawnInterval: number
  gradientInterval: number
  setCanvasTimeoutDuration: number
}

export interface SetCanvasProps {
  blur?: string
  waveSpawnInterval?: number
  waveLength?: NumericRange
  waveAmplitude?: NumericRange
  waveDuration?: NumericRange
  gradientInterval?: number
  lineWidth?: number
  radius?: number
  pointsPerMaxEdge?: number
  width?: number
  height?: number
  setCanvasTimeoutDuration?: number
}

export interface CanvasProps extends SetCanvasProps {
  el: HTMLCanvasElement
}
