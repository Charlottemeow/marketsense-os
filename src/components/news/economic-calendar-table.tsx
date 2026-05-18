// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"

interface CalendarEvent {
  date: string
  time: string
  country: string
  event: string
  importance: "high" | "medium" | "low"
  actual: string
  forecast: string
  previous: string
}

const mockEvents: CalendarEvent[] = [
  { date: "2026-05-15", time: "08:30 ET", country: "US", event: "Initial Jobless Claims", importance: "high", actual: "212K", forecast: "215K", previous: "218K" },
  { date: "2026-05-15", time: "08:30 ET", country: "US", event: "Core PPI (MoM Apr)", importance: "high", actual: "0.2%", forecast: "0.3%", previous: "0.2%" },
  { date: "2026-05-15", time: "09:15 ET", country: "US", event: "Industrial Production (MoM Apr)", importance: "medium", actual: "0.1%", forecast: "0.0%", previous: "0.3%" },
  { date: "2026-05-15", time: "10:00 ET", country: "US", event: "NAHB Housing Market Index (May)", importance: "low", actual: "45", forecast: "46", previous: "44" },
  { date: "2026-05-16", time: "02:00 ET", country: "CN", event: "China Industrial Production (YoY Apr)", importance: "high", actual: "—", forecast: "4.8%", previous: "5.2%" },
  { date: "2026-05-16", time: "02:00 ET", country: "CN", event: "China GDP (QoQ Q1)", importance: "high", actual: "—", forecast: "1.2%", previous: "1.5%" },
  { date: "2026-05-16", time: "04:00 ET", country: "EU", event: "Eurozone CPI (YoY Apr Final)", importance: "high", actual: "—", forecast: "2.4%", previous: "2.4%" },
  { date: "2026-05-16", time: "08:30 ET", country: "US", event: "Housing Starts (Apr)", importance: "medium", actual: "—", forecast: "1.42M", previous: "1.38M" },
  { date: "2026-05-19", time: "08:30 ET", country: "US", event: "FOMC Minutes", importance: "high", actual: "—", forecast: "—", previous: "—" },
  { date: "2026-05-20", time: "04:00 ET", country: "UK", event: "UK CPI (YoY Apr)", importance: "high", actual: "—", forecast: "2.1%", previous: "2.3%" },
]

const importanceStyles = {
  high: "bg-negative/20 text-negative border-negative/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  low: "bg-muted/20 text-muted border-muted/20",
}

function getCountryFlag(country: string): string {
  const flags: Record<string, string> = { US: "🇺🇸", CN: "🇨🇳", EU: "🇪🇺", UK: "🇬🇧", JP: "🇯🇵" }
  return flags[country] || country
}

export function EconomicCalendarTable() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-left w-24">Date</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-left w-20">Time</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-left w-12">Ctry</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-left">Event</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-center w-20">Imp</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-right w-24">Actual</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-right w-24">Forecast</th>
              <th className="px-3 py-3 text-data-xs text-muted font-medium uppercase tracking-wider text-right w-24">Previous</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents.map((evt, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-card-hover transition-colors last:border-0"
              >
                <td className="px-3 py-3 text-data-sm text-foreground tabular-nums">
                  {evt.date.slice(5)}
                </td>
                <td className="px-3 py-3 text-data-xs text-muted">{evt.time}</td>
                <td className="px-3 py-3 text-sm">{getCountryFlag(evt.country)}</td>
                <td className="px-3 py-3 text-sm text-foreground">{evt.event}</td>
                <td className="px-3 py-3 text-center">
                  <span
                    className={cn(
                      "text-data-xs px-1.5 py-0.5 rounded border",
                      importanceStyles[evt.importance]
                    )}
                  >
                    {evt.importance}
                  </span>
                </td>
                <td className="px-3 py-3 text-data-sm text-foreground text-right tabular-nums">
                  {evt.actual}
                </td>
                <td className="px-3 py-3 text-data-sm text-muted text-right tabular-nums">
                  {evt.forecast}
                </td>
                <td className="px-3 py-3 text-data-sm text-muted text-right tabular-nums">
                  {evt.previous}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
