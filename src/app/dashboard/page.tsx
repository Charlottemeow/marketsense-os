// MOCK DATA FOR DEVELOPMENT
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { AssetTabs } from "@/components/market/asset-tabs"
import { PriceTable } from "@/components/market/price-table"
import { Search, AlertTriangle, X } from "lucide-react"

const periodFilters = ["1D", "1W", "1M", "YTD"] as const

const staleAssets = ["EFA", "EEM"]

export default function MarketDashboardPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("equity")
  const [activePeriod, setActivePeriod] = useState<string>("1D")
  const [searchInput, setSearchInput] = useState("")

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{t('market.title')}</h1>
        <p className="text-xs text-muted mt-0.5">
          Real-time and historical prices across asset classes
        </p>
      </div>

      <div className="rounded-lg border border-border bg-warning/5 border-warning/20 p-3 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
        <div className="flex-1">
          <span className="text-xs text-warning">
            {t('market.staleWarning')} — {staleAssets.join(", ")} has not updated in over 5 minutes.
            Last refresh: {new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })} ET
          </span>
        </div>
        <button className="text-warning/60 hover:text-warning transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AssetTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-card border border-border rounded-md p-0.5">
            {periodFilters.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                  activePeriod === period
                    ? "bg-accent text-accent-foreground"
                    : "text-muted hover:text-foreground"
                )}
              >
                {period}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
            <input
              type="text"
              placeholder={t('market.search')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-48 h-8 rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <PriceTable />

      <div className="text-data-xs text-muted text-right">
        {t('market.staleWarning')}. Updated: {new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })} ET
      </div>
    </div>
  )
}
