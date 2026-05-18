import { useMemo } from "react"

interface MiniSparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function MiniSparkline({
  data,
  width = 80,
  height = 28,
  color = "#22C55E",
}: MiniSparklineProps) {
  const path = useMemo(() => {
    if (!data.length) return ""

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const xStep = width / (data.length - 1)

    const points = data.map((value, index) => {
      const x = index * xStep
      const y = height - ((value - min) / range) * (height - 4) - 2
      return `${x},${y}`
    })

    return `M${points[0]} L${points.slice(1).join(" L")}`
  }, [data, width, height])

  if (!data.length) return null

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
