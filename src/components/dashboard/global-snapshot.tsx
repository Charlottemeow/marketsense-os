// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"
import { MiniSparkline } from "@/components/market/mini-sparkline"

interface IndexData {
  name: string
  ticker: string
  price: number
  change: number
  changePercent: number
  sparklineData: number[]
}

const mockIndices: IndexData[] = [
  { name: "S&P 500", ticker: "SPX", price: 5874.32, change: 23.45, changePercent: 0.40, sparklineData: [5780, 5800, 5820, 5810, 5830, 5850, 5874] },
  { name: "Nasdaq 100", ticker: "NDX", price: 20456.78, change: 156.22, changePercent: 0.77, sparklineData: [20000, 20100, 20250, 20180, 20300, 20400, 20457] },
  { name: "Dow Jones", ticker: "DJI", price: 42156.90, change: -34.12, changePercent: -0.08, sparklineData: [42200, 42180, 42150, 42120, 42100, 42130, 42157] },
  { name: "FTSE 100", ticker: "UKX", price: 8321.45, change: -12.78, changePercent: -0.15, sparklineData: [8350, 8340, 8330, 8320, 8310, 8315, 8321] },
  { name: "Nikkei 225", ticker: "NKY", price: 38920.50, change: 210.30, changePercent: 0.54, sparklineData: [38500, 38600, 38700, 38650, 38800, 38850, 38921] },
  { name: "Hang Seng", ticker: "HSI", price: 20134.80, change: -89.45, changePercent: -0.44, sparklineData: [20300, 20250, 20200, 20150, 20100, 20120, 20135] },
  { name: "Shanghai Composite", ticker: "SHCOMP", price: 3156.78, change: 8.23, changePercent: 0.26, sparklineData: [3140, 3145, 3150, 3148, 3152, 3155, 3157] },
  { name: "Euro Stoxx 50", ticker: "SX5E", price: 4987.60, change: 15.30, changePercent: 0.31, sparklineData: [4950, 4960, 4970, 4965, 4975, 4980, 4988] },
]

function IndexCard({ index }: { index: IndexData }) {
  const isPositive = index.change >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-4 card-glow animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted font-medium">{index.name}</span>
        <span className="text-data-xs text-muted">{index.ticker}</span>
      </div>
      <div className="text-data-xl text-foreground font-medium mb-1.5">
        {index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-data-sm font-medium",
            isPositive ? "text-positive" : "text-negative"
          )}
        >
          {isPositive ? "+" : ""}
          {index.change.toFixed(2)} ({isPositive ? "+" : ""}
          {index.changePercent.toFixed(2)}%)
        </span>
      </div>
      <div className="mt-2 h-8">
        <MiniSparkline data={index.sparklineData} color={isPositive ? "#22C55E" : "#EF4444"} />
      </div>
    </div>
  )
}

export function GlobalSnapshot() {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        Global Market Snapshot
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {mockIndices.map((index) => (
          <IndexCard key={index.ticker} index={index} />
        ))}
      </div>
    </div>
  )
}
