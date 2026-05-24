"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Newspaper,
  FileEdit,
  Search,
  Briefcase,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Languages,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { key: "nav.home", href: "/", icon: LayoutDashboard },
  { key: "nav.dashboard", href: "/dashboard", icon: BarChart3 },
  { key: "nav.macro", href: "/macro", icon: Globe },
  { key: "nav.news", href: "/news", icon: Newspaper },
  { key: "nav.notes", href: "/notes", icon: FileEdit },
  { key: "nav.deepDives", href: "/deep-dives", icon: Search },
  { key: "nav.pitches", href: "/pitches", icon: Briefcase },
  { key: "nav.admin", href: "/admin", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const { t, lang, setLang } = useLanguage()

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar h-screen fixed left-0 top-0 z-40 transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div
        className={cn(
          "flex items-center h-12 px-4 border-b border-border",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-display text-accent tracking-tight">Market Sense OS</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/">
            <span className="text-lg font-display text-accent font-bold">M</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-6 w-6 text-muted hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-accent")} />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-2 border-t border-border">
        <button
          onClick={() => setLang(lang === "en" ? "zh-CN" : "en")}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full",
            collapsed && "justify-center px-2",
            "text-muted hover:text-foreground hover:bg-card-hover"
          )}
        >
          <Languages className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{t("lang.switch")}</span>}
        </button>
      </div>

      <div className="p-3 border-t border-border">
        {!collapsed ? (
          <Link
            href="/disclaimer"
            className="block text-xs text-muted hover:text-foreground transition-colors text-center"
          >
            {t("app.disclaimer")}
          </Link>
        ) : (
          <div className="flex justify-center">
            <Link
              href="/disclaimer"
              className="text-xs text-muted hover:text-foreground transition-colors"
              title={t("app.disclaimer")}
            >
              ⚖
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
