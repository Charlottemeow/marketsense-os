// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"

interface CryptoItem {
  label: string
  ticker: string
  price: number
  changePercent: number
}

const mockCrypto: CryptoItem[] = [
  { label: "Bitcoin", ticker: "BTC", price: 67890, changePercent: 1.20 },
  { label: "Ethereum", ticker: "ETH", price: 3456, changePercent: 0.95 },
]

function CryptoCard({ item }: { item: CryptoItem }) {
  const isPositive = item.changePercent >= 0

  return (
    <div className="rounded-lg border border-border bg-card p-3 card-glow">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted">{item.label}</span>
        <span className="text-data-xs text-muted">{item.ticker}</span>
      </div>
      <div className="text-data-lg text-foreground font-medium">
        ${item.price.toLocaleString()}
      </div>
      <div className={cn(
        "text-data-xs font-medium mt-0.5",
        isPositive ? "text-positive" : "text-negative"
      )}>
        {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
      </div>
    </div>
  )
}

export function CryptoPanel() {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        Crypto
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {mockCrypto.map((item) => (
          <CryptoCard key={item.ticker} item={item} />
        ))}
      </div>
    </div>
  )
}
