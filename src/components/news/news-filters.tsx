// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"

interface NewsFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: "all", label: "All" },
  { id: "macro", label: "Macro" },
  { id: "us-equity", label: "US Equity" },
  { id: "hk-china", label: "HK/China" },
  { id: "fx", label: "FX" },
  { id: "rates", label: "Rates" },
  { id: "commodity", label: "Commodity" },
  { id: "crypto", label: "Crypto" },
  { id: "company", label: "Company" },
]

export function NewsFilters({ activeFilter, onFilterChange }: NewsFiltersProps) {
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
          {filter.label}
        </button>
      ))}
    </div>
  )
}
