// MOCK DATA FOR DEVELOPMENT
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { NewsFilters } from "@/components/news/news-filters"
import { NewsCard } from "@/components/news/news-card"
import { EconomicCalendarTable } from "@/components/news/economic-calendar-table"
import { ArrowRight, Sparkles } from "lucide-react"

const mockNewsItems = [
  {
    title: "Fed Minutes Show Officials Split on Timing of Rate Cuts Amid Sticky Inflation",
    summary: "Several members noted they could support a rate cut if inflation continues to moderate, but others expressed concerns about lingering price pressures in services.",
    source: "Bloomberg",
    category: "Macro",
    timestamp: "2h ago",
    importanceScore: 92,
  },
  {
    title: "NVIDIA Earnings Beat Propels Nasdaq to Record Close, AI Trade Resumes",
    summary: "The chipmaker reported Q1 revenue of $36.8B, exceeding estimates by $2.1B, driven by continued strong demand for AI training infrastructure.",
    source: "Reuters",
    category: "US Equity",
    timestamp: "3h ago",
    importanceScore: 88,
  },
  {
    title: "China's Industrial Output Misses Estimates as Property Slump Deepens",
    summary: "April industrial production grew 4.8% YoY, below the 5.2% forecast, while real estate investment continued to contract at a double-digit pace.",
    source: "WSJ",
    category: "HK/China",
    timestamp: "4h ago",
    importanceScore: 85,
  },
  {
    title: "Oil Prices Extend Gains as Middle East Supply Concerns Intensify",
    summary: "Brent crude rose above $83/bbl as geopolitical tensions in the Middle East continued to threaten supply routes through the Strait of Hormuz.",
    source: "Financial Times",
    category: "Commodity",
    timestamp: "5h ago",
    importanceScore: 78,
  },
  {
    title: "Dollar Strengthens for Third Consecutive Day as Fed Rate Cut Bets Fade",
    summary: "The Bloomberg Dollar Spot Index rose 0.3% as traders pushed back expectations for the first Fed rate cut to September from July.",
    source: "Bloomberg",
    category: "FX",
    timestamp: "6h ago",
    importanceScore: 74,
  },
  {
    title: "Treasury Yield Curve Steepens on Supply Concerns, 10Y Hits 4.48%",
    summary: "Long-dated Treasury yields rose as the market absorbed $42B in new 10-year note supply, with dealers reporting below-average demand.",
    source: "Reuters",
    category: "Rates",
    timestamp: "7h ago",
    importanceScore: 71,
  },
  {
    title: "Bitcoin Surges Past $68K as Spot ETF Inflows Resume After 3-Week Slump",
    summary: "BTC rose 4.2% as net inflows into US spot Bitcoin ETFs reached $1.2B over the past three sessions, the strongest streak since March.",
    source: "CoinDesk",
    category: "Crypto",
    timestamp: "8h ago",
    importanceScore: 69,
  },
  {
    title: "Apple Reports In-Line Q2 Earnings, Announces $110B Buyback Authorization",
    summary: "Cupertino-based tech giant reported revenue of $90.8B, inline with estimates, while announcing a 4% dividend increase and expanded buyback.",
    source: "Bloomberg",
    category: "Company",
    timestamp: "10h ago",
    importanceScore: 82,
  },
]

const mockEarnings = [
  { ticker: "NVDA", date: "May 28", estimate: "$5.59", surprise: "—" },
  { ticker: "CRM", date: "May 29", estimate: "$2.38", surprise: "—" },
  { ticker: "DELL", date: "May 30", estimate: "$1.41", surprise: "—" },
  { ticker: "MRVL", date: "May 30", estimate: "$0.32", surprise: "—" },
  { ticker: "GME", date: "Jun 4", estimate: "-$0.08", surprise: "—" },
]

export default function NewsPage() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredNews = mockNewsItems.filter(
    (item) => activeFilter === "all" || item.category.toLowerCase().replace(/\s+/g, "-") === activeFilter
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{t('news.title')}</h1>
          <p className="text-xs text-muted mt-0.5">
            Economic calendar, earnings, and curated headlines
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
          <Sparkles className="w-4 h-4" />
          {t('news.convertToDeepDive')}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <NewsFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
              {t('news.economicCalendar')}
            </h2>
            <EconomicCalendarTable />
          </div>

          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
              {t('news.earningsCalendar')}
            </h3>
            <div className="space-y-2">
              <div className="grid grid-cols-4 text-data-xs text-muted font-medium px-2 pb-2 border-b border-border">
                <span>Ticker</span>
                <span>Date</span>
                <span className="text-right">Estimate</span>
                <span className="text-right">Surprise</span>
              </div>
              {mockEarnings.map((earn) => (
                <div
                  key={earn.ticker}
                  className="grid grid-cols-4 text-sm px-2 py-1.5 rounded hover:bg-card-hover transition-colors"
                >
                  <span className="text-accent font-medium">{earn.ticker}</span>
                  <span className="text-foreground">{earn.date}</span>
                  <span className="text-data-sm text-muted text-right">{earn.estimate}</span>
                  <span className="text-data-sm text-muted text-right">{earn.surprise}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
            {t('news.rssFeed')}
          </h2>
          <div className="space-y-3">
            {filteredNews.map((item, i) => (
              <NewsCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
