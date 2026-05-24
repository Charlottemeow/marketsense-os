"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StaleBadgeProps {
  lastFetchTime?: string
}

export function StaleBadge({ lastFetchTime }: StaleBadgeProps) {
  const { t } = useLanguage()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full",
              "bg-warning/10 border border-warning/20 text-warning text-data-xs cursor-default"
            )}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning" />
            </span>
            {t("stale.title")}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {lastFetchTime ? (
            <span>{t("stale.description")} {lastFetchTime}</span>
          ) : (
            <span>{t("stale.noData")}</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
