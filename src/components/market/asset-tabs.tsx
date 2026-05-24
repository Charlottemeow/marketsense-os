// MOCK DATA FOR DEVELOPMENT
"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import * as Tabs from "@radix-ui/react-tabs"

interface AssetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "equity", labelKey: "market.equity" },
  { id: "rates", labelKey: "market.rates" },
  { id: "fx", labelKey: "market.fx" },
  { id: "commodity", labelKey: "market.commodity" },
  { id: "crypto", labelKey: "market.crypto" },
  { id: "hk-china", labelKey: "market.hkChina" },
]

export function AssetTabs({ activeTab, onTabChange }: AssetTabsProps) {
  const { t } = useLanguage()

  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange}>
      <Tabs.List className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              "text-muted hover:text-foreground",
              "data-[state=active]:text-accent data-[state=active]:shadow-none",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
              "after:bg-accent after:scale-x-0 after:transition-transform",
              "data-[state=active]:after:scale-x-100"
            )}
          >
            {t(tab.labelKey)}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
