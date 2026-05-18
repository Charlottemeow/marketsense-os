"use client"

import { cn } from "@/lib/utils"
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
            Data may be delayed
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {lastFetchTime ? (
            <span>Last fetched: {lastFetchTime}</span>
          ) : (
            <span>Last fetch time unavailable</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
