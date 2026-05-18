// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"

interface RateFxItem {
  label: string
  value: number
  change: number
}

const mockRatesFx: RateFxItem[] = [
  { label: "US 2Y", value: 4.12, change: -0.03 },
  { label: "US 10Y", value: 4.48, change: 0.02 },
  { label: "DXY", value: 105.32, change: 0.18 },
  { label: "USD/JPY", value: 151.75, change: 0.38 },
  { label: "EUR/USD", value: 1.0825, change: -0.0013 },
  { label: "GBP/USD", value: 1.2698, change: -0.0010 },
  { label: "USD/CNH", value: 7.2450, change: 0.0085 },
]

function RateFxCard({ item }: { item: RateFxItem }) {
  const isPositive = item.change >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-3 card-glow">
      <div className="text-xs text-muted mb-1">{item.label}</div>
      <div className="text-data-lg text-foreground font-medium">
        {item.value.toFixed(item.value < 10 ? 4 : 2)}
      </div>
      <div className={cn(
        "text-data-xs font-medium mt-0.5",
        isPositive ? "text-positive" : "text-negative"
      )}>
        {isPositive ? "+" : ""}{item.change.toFixed(item.value < 10 ? 4 : 2)}
      </div>
    </div>
  )
}

export function RatesFxPanel() {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        Rates &amp; FX
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {mockRatesFx.map((item) => (
          <RateFxCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  )
}
