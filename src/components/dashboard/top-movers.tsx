// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Mover {
  ticker: string
  name: string
  price: number
  changePercent: number
}

const mockGainers: Mover[] = [
  { ticker: "NVDA", name: "NVIDIA Corp", price: 142.53, changePercent: 3.85 },
  { ticker: "MSTR", name: "MicroStrategy", price: 187.20, changePercent: 2.94 },
  { ticker: "PLTR", name: "Palantir Tech", price: 38.45, changePercent: 2.41 },
  { ticker: "TSLA", name: "Tesla Inc", price: 245.30, changePercent: 1.88 },
  { ticker: "AMD", name: "AMD Inc", price: 167.80, changePercent: 1.65 },
]

const mockLosers: Mover[] = [
  { ticker: "INTC", name: "Intel Corp", price: 19.84, changePercent: -3.12 },
  { ticker: "BA", name: "Boeing Co", price: 151.20, changePercent: -2.45 },
  { ticker: "DIS", name: "Walt Disney", price: 96.50, changePercent: -1.78 },
  { ticker: "KO", name: "Coca-Cola Co", price: 68.30, changePercent: -1.22 },
  { ticker: "JPM", name: "JPMorgan Chase", price: 212.40, changePercent: -0.95 },
]

function MoverRow({ mover, isGainer }: { mover: Mover; isGainer: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-card-hover transition-colors">
      <div className="flex items-center gap-2.5">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          isGainer ? "bg-positive" : "bg-negative"
        )} />
        <div>
          <div className="text-sm font-medium text-foreground">{mover.ticker}</div>
          <div className="text-data-xs text-muted">{mover.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-data-sm text-foreground">
          ${mover.price.toFixed(2)}
        </div>
        <div className={cn(
          "text-data-xs font-medium",
          isGainer ? "text-positive" : "text-negative"
        )}>
          {isGainer ? "+" : ""}{mover.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  )
}

export function TopMovers() {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        Top Movers
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-card p-3 card-glow">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <TrendingUp className="w-3.5 h-3.5 text-positive" />
            <span className="text-xs font-semibold text-positive">Top Gainers</span>
          </div>
          {mockGainers.map((mover) => (
            <MoverRow key={mover.ticker} mover={mover} isGainer />
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-3 card-glow">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <TrendingDown className="w-3.5 h-3.5 text-negative" />
            <span className="text-xs font-semibold text-negative">Top Losers</span>
          </div>
          {mockLosers.map((mover) => (
            <MoverRow key={mover.ticker} mover={mover} isGainer={false} />
          ))}
        </div>
      </div>
    </div>
  )
}
