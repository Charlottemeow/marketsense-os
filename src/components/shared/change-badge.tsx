"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ChangeBadgeProps {
  value: number
  size?: "sm" | "md"
  showIcon?: boolean
}

export function ChangeBadge({ value, size = "md", showIcon = true }: ChangeBadgeProps) {
  const { t } = useLanguage()
  const isPositive = value > 0
  const isNegative = value < 0
  const isZero = value === 0

  const colorClass = isPositive
    ? "text-positive"
    : isNegative
    ? "text-negative"
    : "text-muted"

  const bgClass = isPositive
    ? "bg-positive/10"
    : isNegative
    ? "bg-negative/10"
    : "bg-card"

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  const sizeClasses = size === "sm"
    ? "px-1.5 py-0.5 text-data-xs gap-1"
    : "px-2 py-1 text-data-sm gap-1.5"

  const directionLabel = isPositive ? t("change.up") : isNegative ? t("change.down") : t("change.flat")

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border border-border font-mono tabular-nums",
        bgClass,
        colorClass,
        sizeClasses
      )}
      aria-label={`${directionLabel} ${Math.abs(value).toFixed(2)}%`}
    >
      {showIcon && <Icon className={cn("shrink-0", size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")} />}
      <span>{isPositive ? "+" : ""}{value.toFixed(2)}%</span>
    </span>
  )
}
