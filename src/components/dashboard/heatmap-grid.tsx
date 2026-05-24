// MOCK DATA FOR DEVELOPMENT
"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"

interface HeatmapCell {
  category: string
  changePercent: number
}

const mockHeatmapData: HeatmapCell[] = [
  { category: "US Equities", changePercent: 0.40 },
  { category: "EU Equities", changePercent: 0.31 },
  { category: "Asia Equities", changePercent: -0.15 },
  { category: "EM Equities", changePercent: -0.44 },
  { category: "US Treasuries", changePercent: 0.12 },
  { category: "EU Sovereigns", changePercent: -0.08 },
  { category: "IG Credit", changePercent: 0.05 },
  { category: "HY Credit", changePercent: 0.22 },
  { category: "DXY", changePercent: 0.18 },
  { category: "EUR/USD", changePercent: -0.12 },
  { category: "USD/JPY", changePercent: 0.25 },
  { category: "GBP/USD", changePercent: -0.08 },
  { category: "WTI Crude", changePercent: 0.85 },
  { category: "Brent Crude", changePercent: 0.72 },
  { category: "Gold", changePercent: -0.34 },
  { category: "Copper", changePercent: 0.55 },
  { category: "Bitcoin", changePercent: 1.20 },
  { category: "Ethereum", changePercent: 0.95 },
  { category: "VIX", changePercent: -2.10 },
  { category: "10Y UST Yield", changePercent: 0.30 },
]

function getColorClasses(value: number): string {
  const abs = Math.abs(value)
  const intensity = Math.min(Math.floor(abs * 30), 80)
  if (value > 0) {
    return `bg-positive/${Math.max(intensity, 10)} text-positive`
  }
  return `bg-negative/${Math.max(intensity, 10)} text-negative`
}

function HeatmapCell({ cell }: { cell: HeatmapCell }) {
  return (
    <div
      className={cn(
        "rounded-md px-3 py-2.5 text-center transition-opacity hover:opacity-80 cursor-default",
        getColorClasses(cell.changePercent)
      )}
    >
      <div className="text-xs font-medium">{cell.category}</div>
      <div className="text-data-sm font-semibold mt-0.5">
        {cell.changePercent >= 0 ? "+" : ""}
        {cell.changePercent.toFixed(2)}%
      </div>
    </div>
  )
}

export function HeatmapGrid() {
  const { t } = useLanguage()

  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        {t('home.crossAssetHeatmap')}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
        {mockHeatmapData.map((cell) => (
          <HeatmapCell key={cell.category} cell={cell} />
        ))}
      </div>
    </div>
  )
}
