import { useEffect, useRef } from 'react'
import Canvas from '@border-waves/core'
import type { Props } from '@/components/BorderWaves/types'

export default function BorderWaves(props: Props) {
  const { className, style, ...rest } = props

  const canvasClass = useRef<Canvas>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (canvasClass.current) {
      canvasClass.current.setCanvas(rest)
    } else {
      canvasClass.current = new Canvas({
        el: canvasRef.current,
        ...rest,
      })
    }
  }, [rest])

  return <canvas ref={canvasRef} className={className} style={style}></canvas>
}
