// MOCK DATA FOR DEVELOPMENT
"use client"

import Link from "next/link"
import { PenSquare } from "lucide-react"
import { MarketThemeCard } from "@/components/dashboard/market-theme-card"
import { GlobalSnapshot } from "@/components/dashboard/global-snapshot"
import { HeatmapGrid } from "@/components/dashboard/heatmap-grid"
import { TopMovers } from "@/components/dashboard/top-movers"
import { RatesFxPanel } from "@/components/dashboard/rates-fx-panel"
import { CommoditiesPanel } from "@/components/dashboard/commodities-panel"
import { CryptoPanel } from "@/components/dashboard/crypto-panel"
import { cn } from "@/lib/utils"

const mockEventsToday = [
  { time: "08:30 ET", event: "Initial Jobless Claims", actual: "212K", forecast: "215K", previous: "218K", importance: "high" as const },
  { time: "08:30 ET", event: "Core PPI (MoM Apr)", actual: "0.2%", forecast: "0.3%", previous: "0.2%", importance: "high" as const },
  { time: "09:15 ET", event: "Industrial Production (MoM Apr)", actual: "0.1%", forecast: "0.0%", previous: "0.3%", importance: "medium" as const },
  { time: "10:00 ET", event: "NAHB Housing Market Index (May)", actual: "45", forecast: "46", previous: "44", importance: "low" as const },
  { time: "10:30 ET", event: "EIA Natural Gas Storage", actual: "—", forecast: "—", previous: "+79B", importance: "low" as const },
]

const mockNewsFeed = [
  { source: "Bloomberg", title: "Fed Minutes Show Officials Split on Timing of Rate Cuts", category: "Macro", time: "2h ago", score: 92 },
  { source: "Reuters", title: "NVIDIA Earnings Beat Propels Nasdaq to Record Close", category: "US Equity", time: "3h ago", score: 88 },
  { source: "WSJ", title: "China's Industrial Output Misses Estimates, Property Slump Deepens", category: "HK/China", time: "4h ago", score: 85 },
  { source: "FT", title: "Oil Prices Extend Gains on Middle East Supply Concerns", category: "Commodity", time: "5h ago", score: 78 },
  { source: "Bloomberg", title: "Dollar Strengthens for Third Day as Fed Rate Cut Bets Fade", category: "FX", time: "6h ago", score: 74 },
]

function ImportanceBadge({ importance }: { importance: "high" | "medium" | "low" }) {
  const colors = { high: "bg-negative/20 text-negative", medium: "bg-warning/20 text-warning", low: "bg-muted/20 text-muted" }
  return (
    <span className={cn("text-data-xs px-1.5 py-0.5 rounded", colors[importance])}>
      {importance}
    </span>
  )
}

export default function HomePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Daily Dashboard</h1>
          <p className="text-xs text-muted mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          href="/notes"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PenSquare className="w-4 h-4" />
          Write Today&apos;s Market Sense Note
        </Link>
      </div>

      <MarketThemeCard />

      <GlobalSnapshot />

      <HeatmapGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMovers />
        <div className="space-y-6">
          <RatesFxPanel />
          <CommoditiesPanel />
          <CryptoPanel />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
            Economic Events Today
          </h3>
          <div className="space-y-2">
            {mockEventsToday.map((evt, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <ImportanceBadge importance={evt.importance} />
                  <span className="text-data-xs text-muted w-20 shrink-0">{evt.time}</span>
                  <span className="text-sm text-foreground truncate">{evt.event}</span>
                </div>
                <div className="flex items-center gap-3 text-data-xs shrink-0 ml-3">
                  <span className="text-foreground">{evt.actual}</span>
                  <span className="text-muted">f: {evt.forecast}</span>
                  <span className="text-muted">p: {evt.previous}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
            News Feed
          </h3>
          <div className="space-y-2">
            {mockNewsFeed.map((news, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-data-xs text-muted">{news.source}</span>
                    <span className="text-data-xs text-muted">&middot;</span>
                    <span className="text-data-xs text-muted">{news.time}</span>
                    <span className={cn(
                      "text-data-xs px-1 py-0.5 rounded",
                      "bg-accent/10 text-accent"
                    )}>
                      {news.category}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-snug">{news.title}</p>
                </div>
                <div className="flex items-center gap-1 text-data-xs text-muted shrink-0">
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    news.score >= 85 ? "bg-positive" : news.score >= 75 ? "bg-warning" : "bg-muted"
                  )} />
                  {news.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
