import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: "positive" | "negative" | "neutral"
}

function buildPath(data: number[], width: number, height: number): string {
  if (data.length === 0) return ""

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((value, index) => {
    const x = index * stepX
    const y = height - ((value - min) / range) * (height - 2) - 1
    return `${x},${y}`
  })

  return `M${points.join(" L")}`
}

export function Sparkline({
  data,
  width = 60,
  height = 20,
  color = "neutral",
}: SparklineProps) {
  const path = useMemo(() => buildPath(data, width, height), [data, width, height])

  if (data.length < 2) {
    return null
  }

  const strokeColor =
    color === "positive"
      ? "#22C55E"
      : color === "negative"
      ? "#EF4444"
      : "#64748B"

  return (
    <div className={cn("inline-flex")}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
