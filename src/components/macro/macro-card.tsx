// MOCK DATA FOR DEVELOPMENT
"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { AlertTriangle } from "lucide-react"

interface MacroCardProps {
  name: string
  seriesId: string
  latestValue: number
  unit?: string
  change1M: number
  change3M: number
  change1Y: number
  lastUpdated: string
}

function isStale(lastUpdated: string): boolean {
  const date = new Date(lastUpdated)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > 30
}

function ChangeBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-data-xs text-muted">{label}</span>
      <span
        className={cn(
          "text-data-xs font-medium tabular-nums",
          value >= 0 ? "text-positive" : "text-negative"
        )}
      >
        {value >= 0 ? "+" : ""}{value.toFixed(1)}%
      </span>
    </div>
  )
}

export function MacroCard({
  name,
  seriesId,
  latestValue,
  unit = "",
  change1M,
  change3M,
  change1Y,
  lastUpdated,
}: MacroCardProps) {
  const { t } = useLanguage()
  const stale = isStale(lastUpdated)

  return (
    <div className={cn(
      "rounded-lg border border-border bg-card p-4 card-glow relative",
      stale && "stale-data"
    )}>
      {stale && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-data-xs text-warning">
          <AlertTriangle className="w-3 h-3" />
          {t('macro.stale')}
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted font-medium">{name}</span>
        <span className="text-data-xs text-muted/50">{seriesId}</span>
      </div>
      <div className="text-data-2xl text-foreground font-medium mb-3">
        {latestValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        {unit && <span className="text-data-sm text-muted ml-1">{unit}</span>}
      </div>
      <div className="space-y-1 pt-3 border-t border-border">
        <ChangeBadge value={change1M} label={t('macro.1mChange')} />
        <ChangeBadge value={change3M} label={t('macro.3mChange')} />
        <ChangeBadge value={change1Y} label={t('macro.1yChange')} />
      </div>
      <div className="text-data-xs text-muted/50 mt-3 pt-2 border-t border-border">
        {t('macro.lastUpdated')}: {lastUpdated}
      </div>
    </div>
  )
}
