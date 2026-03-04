import { GradientState } from '@/types'
import { getRandomInt } from '@/utils/helpers/math'

export function rgbaToArray(rgba: string) {
  const [r, g, b, a] = rgba.replace('rgba(', '').replace(')', '').split(',')
  return [r, g, b, a]
}

export function hslToRgba(
  h: number,
  s: number,
  l: number,
  a: number,
): [number, number, number, number] {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a_ = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a_ * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4)), a]
}

export function generateGradient(): {
  gradient: GradientState
  mainColor: [number, number, number, number]
} {
  const baseHue = getRandomInt(0, 360)
  const scheme = getRandomInt(1, 2) // 0: analog, 1: triadic, 2: split-comp
  const hueOffsets =
    scheme === 0
      ? [0, 20, 40] // Analogous
      : scheme === 1
        ? [0, 120, 240] // Triadic
        : [0, 150, 210] // Split-Complementary

  const saturation = getRandomInt(80, 100) // more color-rich
  const lightness = getRandomInt(60, 80) // medium-bright

  const colorStops: GradientState = hueOffsets.map((hOffset, i) => ({
    offset: i / (hueOffsets.length - 1),
    color: hslToRgba(
      (baseHue + hOffset) % 360,
      saturation + getRandomInt(-5, 5),
      lightness + getRandomInt(-5, 5),
      getRandomInt(70, 100) / 100,
    ),
  }))

  const [r, g, b] = colorStops[1].color
  const mainColor: [number, number, number, number] = [
    Math.round(r),
    Math.round(g),
    Math.round(b),
    1,
  ]

  return {
    gradient: colorStops,
    mainColor,
  }
}
