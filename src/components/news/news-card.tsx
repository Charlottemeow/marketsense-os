// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"

interface NewsCardProps {
  title: string
  summary: string
  source: string
  category: string
  timestamp: string
  importanceScore: number
  url?: string
}

const categoryColors: Record<string, string> = {
  Macro: "bg-accent/10 text-accent",
  "US Equity": "bg-positive/10 text-positive",
  "HK/China": "bg-negative/10 text-negative",
  FX: "bg-warning/10 text-warning",
  Rates: "bg-accent/10 text-accent",
  Commodity: "bg-warning/10 text-warning",
  Crypto: "bg-positive/10 text-positive",
  Company: "bg-muted/20 text-muted",
}

function ImportanceIndicator({ score }: { score: number }) {
  const bars = 5
  const filled = Math.min(Math.ceil((score / 100) * bars), bars)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm h-2.5 transition-colors",
            i < filled ? "bg-accent" : "bg-border"
          )}
        />
      ))}
    </div>
  )
}

export function NewsCard({
  title,
  summary,
  source,
  category,
  timestamp,
  importanceScore,
  url = "#",
}: NewsCardProps) {
  const catColor = categoryColors[category] || "bg-muted/20 text-muted"

  return (
    <div className="rounded-lg border border-border bg-card p-4 card-glow animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-data-xs text-muted">{source}</span>
            <span className="text-data-xs text-muted">&middot;</span>
            <span className={cn("text-data-xs px-1.5 py-0.5 rounded", catColor)}>
              {category}
            </span>
            <span className="text-data-xs text-muted">&middot;</span>
            <span className="text-data-xs text-muted">{timestamp}</span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5"
          >
            <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
              {title}
            </h4>
            <ExternalLink className="w-3 h-3 text-muted group-hover:text-accent transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
          </a>
          {summary && (
            <p className="text-xs text-muted mt-1.5 leading-relaxed line-clamp-2">
              {summary}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <ImportanceIndicator score={importanceScore} />
          <span className="text-data-xs text-muted">{importanceScore}</span>
        </div>
      </div>
    </div>
  )
}
