"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

function getHongKongDateTime(): { date: string; time: string } {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  }
  const date = now.toLocaleDateString("en-US", options)
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }
  const time = now.toLocaleTimeString("en-US", timeOptions)
  return { date, time }
}

export function Topbar() {
  const { t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)
  const [now, setNow] = React.useState({ date: "", time: "" })
  const [lastUpdated, setLastUpdated] = React.useState("--")

  React.useEffect(() => {
    const hk = getHongKongDateTime()
    setNow(hk)
    setLastUpdated(hk.time)
    setMounted(true)

    const interval = setInterval(() => {
      const t = getHongKongDateTime()
      setNow(t)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    const hk = getHongKongDateTime()
    setLastUpdated(hk.time)
  }

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-56 h-12 bg-topbar border-b border-border flex items-center justify-between px-6 z-30 transition-all duration-200"
      )}
    >
      <div className="flex items-center gap-3">
        {mounted ? (
          <>
            <span className="text-sm text-foreground font-medium">
              {now.date}
            </span>
            <span className="text-xs text-muted font-mono bg-card px-2 py-0.5 rounded border border-border">
              {t("app.hkt")} {now.time}
            </span>
          </>
        ) : (
          <span className="text-sm text-muted">{t("app.loading")}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted">
          {t("app.updated")}: {lastUpdated}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="h-7 w-7 text-muted hover:text-accent"
          title={t("app.refresh")}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  )
}
