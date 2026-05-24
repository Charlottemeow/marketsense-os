// MOCK DATA FOR DEVELOPMENT
"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"

interface NewsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: "all", labelKey: "news.all" },
  { id: "macro", labelKey: "news.macro" },
  { id: "us-equity", labelKey: "news.usEquity" },
  { id: "hk-china", labelKey: "news.hkChina" },
  { id: "fx", labelKey: "news.fx" },
  { id: "rates", labelKey: "news.rates" },
  { id: "commodity", labelKey: "news.commodity" },
  { id: "crypto", labelKey: "news.crypto" },
  { id: "company", labelKey: "news.company" },
]

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            activeFilter === filter.id
              ? "bg-accent text-accent-foreground"
              : "bg-card border border-border text-muted hover:text-foreground hover:border-foreground/30"
          )}
        >
          {t(filter.labelKey)}
        </button>
      ))}
    </div>
  )
}
