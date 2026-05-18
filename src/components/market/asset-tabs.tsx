// MOCK DATA FOR DEVELOPMENT
import { cn } from "@/lib/utils"
import * as Tabs from "@radix-ui/react-tabs"

interface AssetTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "equity", label: "Equity" },
  { id: "rates", label: "Rates" },
  { id: "fx", label: "FX" },
  { id: "commodity", label: "Commodity" },
  { id: "crypto", label: "Crypto" },
  { id: "hk-china", label: "HK/China" },
]

export function AssetTabs({ activeTab, onTabChange }: AssetTabsProps) {
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
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
