// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"

interface CommodityItem {
  label: string
  price: number
  change: number
  changePercent: number
}

const mockCommodities: CommodityItem[] = [
  { label: "WTI Crude", price: 78.45, change: 0.67, changePercent: 0.86 },
  { label: "Brent Crude", price: 82.90, change: 0.59, changePercent: 0.72 },
  { label: "Gold", price: 2389.50, change: -8.20, changePercent: -0.34 },
  { label: "Copper", price: 4.58, change: 0.025, changePercent: 0.55 },
]

function CommodityCard({ item }: { item: CommodityItem }) {
  const isPositive = item.change >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-3 card-glow">
      <div className="text-xs text-muted mb-1">{item.label}</div>
      <div className="text-data-lg text-foreground font-medium">
        ${item.price.toFixed(2)}
      </div>
      <div className={cn(
        "text-data-xs font-medium mt-0.5",
        isPositive ? "text-positive" : "text-negative"
      )}>
        {isPositive ? "+" : ""}{item.change.toFixed(2)} ({isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%)
      </div>
    </div>
  )
}

export function CommoditiesPanel() {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        Commodities
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {mockCommodities.map((item) => (
          <CommodityCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  )
}
