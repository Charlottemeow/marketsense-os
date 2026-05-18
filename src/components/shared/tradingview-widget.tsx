"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TradingViewWidgetProps {
  widgetType: "ticker-tape" | "market-overview" | "advanced-chart" | "symbol-overview"
  symbol?: string
  width?: string | number
  height?: string | number
  className?: string
}

type TVWidget = {
  new (config: Record<string, unknown>): TVWidget
}

declare global {
  interface Window {
    TradingView?: {
      widget: TVWidget
      tickerTape?: TVWidget
    }
  }
}

export function TradingViewWidget({
  widgetType,
  symbol = "NASDAQ:AAPL",
  width = "100%",
  height = 400,
  className,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (scriptLoadedRef.current) return

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    script.onload = () => {
      scriptLoadedRef.current = true
      if (window.TradingView && containerRef.current) {
        const containerId = `tv-widget-${widgetType}-${Date.now()}`

        if (containerRef.current) {
          containerRef.current.id = containerId
        }

        const configs: Record<string, Record<string, unknown>> = {
          "ticker-tape": {
            symbols: [{ description: "", proName: symbol }],
            showIntervalTabs: true,
            colorTheme: "dark",
            isTransparent: false,
            locale: "en",
          },
          "market-overview": {
            container_id: containerId,
            symbols: {
              groups: [
                {
                  name: "Indices",
                  symbols: ["NASDAQ:AAPL", "NASDAQ:GOOGL", "NYSE:MSFT"],
                },
              ],
            },
            colorTheme: "dark",
            isTransparent: false,
            showChart: true,
            locale: "en",
            width: "100%",
            height: height,
          },
          "advanced-chart": {
            container_id: containerId,
            symbol: symbol,
            interval: "D",
            timezone: "Asia/Hong_Kong",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#0d1117",
            enable_publishing: false,
            allow_symbol_change: true,
            hide_top_toolbar: false,
            save_image: false,
            width: "100%",
            height: height,
          },
          "symbol-overview": {
            container_id: containerId,
            symbols: [[symbol]],
            colorTheme: "dark",
            isTransparent: false,
            showChart: true,
            locale: "en",
            width: "100%",
            height: height,
          },
        }

        const config = configs[widgetType]
        if (config) {
          if (widgetType === "ticker-tape") {
            new window.TradingView!.tickerTape!(config)
          } else {
            new window.TradingView!.widget(config)
          }
        }
      }
    }

    document.head.appendChild(script)

    return () => {
    }
  }, [widgetType, symbol, height])

  return (
    <div
      ref={containerRef}
      className={cn("tradingview-widget", className)}
      style={{ width, height }}
    />
  )
}
