// MOCK DATA FOR DEVELOPMENT
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { MiniSparkline } from "@/components/market/mini-sparkline"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

interface AssetRow {
  ticker: string
  name: string
  price: number
  dailyChg: number
  week1Chg: number
  month1Chg: number
  ytdChg: number
  high52wDistance: number
  sparklineData: number[]
  lastUpdated: string
}

type SortKey = "ticker" | "price" | "dailyChg" | "week1Chg" | "month1Chg" | "ytdChg" | "high52wDistance"
type SortDir = "asc" | "desc"

const mockData: AssetRow[] = [
  { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 587.43, dailyChg: 0.40, week1Chg: 0.85, month1Chg: 1.20, ytdChg: 12.45, high52wDistance: 1.2, sparklineData: [578, 580, 582, 581, 583, 585, 587], lastUpdated: "2 min ago" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", price: 498.76, dailyChg: 0.77, week1Chg: 1.45, month1Chg: 2.10, ytdChg: 15.80, high52wDistance: 0.8, sparklineData: [490, 492, 494, 493, 495, 497, 499], lastUpdated: "2 min ago" },
  { ticker: "IWM", name: "iShares Russell 2000", price: 212.34, dailyChg: -0.15, week1Chg: 0.32, month1Chg: -0.45, ytdChg: 5.20, high52wDistance: 4.5, sparklineData: [213, 212.5, 212, 211.5, 212, 212.5, 212.3], lastUpdated: "3 min ago" },
  { ticker: "EFA", name: "iShares MSCI EAFE", price: 78.90, dailyChg: 0.25, week1Chg: 0.55, month1Chg: 1.80, ytdChg: 8.30, high52wDistance: 2.1, sparklineData: [78, 78.2, 78.5, 78.3, 78.6, 78.8, 78.9], lastUpdated: "3 min ago" },
  { ticker: "EEM", name: "iShares MSCI Emerging", price: 42.15, dailyChg: -0.44, week1Chg: -0.90, month1Chg: -2.10, ytdChg: -1.50, high52wDistance: 8.2, sparklineData: [42.8, 42.6, 42.4, 42.3, 42.2, 42.1, 42.15], lastUpdated: "4 min ago" },
  { ticker: "TLT", name: "iShares 20+ Year Treasury", price: 94.80, dailyChg: 0.12, week1Chg: -0.30, month1Chg: 1.50, ytdChg: -3.20, high52wDistance: 6.5, sparklineData: [94.5, 94.6, 94.7, 94.6, 94.7, 94.8, 94.8], lastUpdated: "5 min ago" },
  { ticker: "HYG", name: "iShares High Yield Corp", price: 76.50, dailyChg: 0.22, week1Chg: 0.40, month1Chg: 0.85, ytdChg: 3.10, high52wDistance: 1.5, sparklineData: [76, 76.1, 76.3, 76.2, 76.3, 76.4, 76.5], lastUpdated: "5 min ago" },
]

const columns: { key: SortKey; labelKey: string; className?: string }[] = [
  { key: "ticker", labelKey: "market.ticker", className: "w-20" },
  { key: "ticker", labelKey: "market.name", className: "min-w-[180px]" },
  { key: "price", labelKey: "market.price", className: "w-24 text-right" },
  { key: "dailyChg", labelKey: "market.dailyChg", className: "w-24 text-right" },
  { key: "week1Chg", labelKey: "market.weeklyChg", className: "w-20 text-right" },
  { key: "month1Chg", labelKey: "market.monthlyChg", className: "w-20 text-right" },
  { key: "ytdChg", labelKey: "market.ytdChg", className: "w-20 text-right" },
  { key: "high52wDistance", labelKey: "market.52wHigh", className: "w-24 text-right" },
]

function ChangeCell({ value }: { value: number }) {
  return (
    <span className={cn(
      "text-data-sm font-medium tabular-nums",
      value >= 0 ? "text-positive" : "text-negative"
    )}>
      {value >= 0 ? "+" : ""}{value.toFixed(2)}%
    </span>
  )
}

function SortIcon({ sortKey, currentKey, direction }: { sortKey: SortKey; currentKey: SortKey | null; direction: SortDir }) {
  if (sortKey !== currentKey) return <ArrowUpDown className="w-3 h-3 text-muted" />
  return direction === "asc"
    ? <ArrowUp className="w-3 h-3 text-accent" />
    : <ArrowDown className="w-3 h-3 text-accent" />
}

export function PriceTable() {
  const { t } = useLanguage()
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...mockData].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const mult = sortDir === "asc" ? 1 : -1
    return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * mult
  })

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.labelKey}
                  className={cn(
                    "px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider",
                    "cursor-pointer select-none hover:text-foreground transition-colors",
                    col.className
                  )}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1 justify-end">
                    {t(col.labelKey)}
                    <SortIcon sortKey={col.key} currentKey={sortKey} direction={sortDir} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider w-24">
                Chart
              </th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider w-28 text-right">
                {t('market.lastUpdated')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.ticker}
                className="border-b border-border/50 hover:bg-card-hover transition-colors last:border-0"
              >
                <td className="px-3 py-3 text-sm font-medium text-accent">{row.ticker}</td>
                <td className="px-3 py-3 text-sm text-foreground">{row.name}</td>
                <td className="px-3 py-3 text-data-sm text-foreground text-right tabular-nums">
                  ${row.price.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-right">
                  <ChangeCell value={row.dailyChg} />
                </td>
                <td className="px-3 py-3 text-right">
                  <ChangeCell value={row.week1Chg} />
                </td>
                <td className="px-3 py-3 text-right">
                  <ChangeCell value={row.month1Chg} />
                </td>
                <td className="px-3 py-3 text-right">
                  <ChangeCell value={row.ytdChg} />
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-16 bg-background rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          row.high52wDistance > 5 ? "bg-negative" : row.high52wDistance > 2 ? "bg-warning" : "bg-positive"
                        )}
                        style={{ width: `${Math.min(100 - row.high52wDistance * 2, 100)}%` }}
                      />
                    </div>
                    <span className="text-data-xs text-muted tabular-nums">{row.high52wDistance.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <MiniSparkline data={row.sparklineData} color={row.dailyChg >= 0 ? "#22C55E" : "#EF4444"} width={64} height={24} />
                </td>
                <td className="px-3 py-3 text-data-xs text-muted text-right tabular-nums">{row.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
