// MOCK DATA FOR DEVELOPMENT
"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/i18n/context"
import { Shield, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"

type Regime = "risk-on" | "risk-off" | "mixed" | "crisis"

interface RegimeData {
  regime: Regime
  confidence: number
  supporting_indicators: string[]
  conflicting_indicators: string[]
  explanation: string
}

const regimeConfig: Record<Regime, { icon: React.ElementType; color: string; bg: string }> = {
  "risk-on": {
    icon: TrendingUp,
    color: "text-positive",
    bg: "bg-positive/10",
  },
  "risk-off": {
    icon: TrendingDown,
    color: "text-negative",
    bg: "bg-negative/10",
  },
  mixed: {
    icon: Minus,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  crisis: {
    icon: AlertTriangle,
    color: "text-negative",
    bg: "bg-negative/10",
  },
}

const mockRegimeData: RegimeData = {
  regime: "mixed",
  confidence: 72,
  supporting_indicators: [
    "Equity momentum positive across DM indices",
    "Credit spreads tightening — HY OAS -12bp this week",
    "DM 10Y real yields trending lower",
  ],
  conflicting_indicators: [
    "DXY breaking above 105 resistance — EM FX under pressure",
    "Oil prices rising on geopolitics — stagflation risk",
    "Yield curve steepening on supply concerns",
  ],
  explanation:
    "Markets are pricing a 'no landing' scenario where growth remains resilient but inflation stays sticky. Equities are supported by AI exuberance, but the FX and commodity signals suggest caution. The regime is best characterized as mixed — partial de-risking advised.",
}

function getRegimeLabel(regime: Regime, t: (key: string) => string): string {
  const map: Record<Regime, string> = {
    "risk-on": t('regime.risk_on'),
    "risk-off": t('regime.risk_off'),
    "mixed": t('regime.mixed'),
    "crisis": "Crisis",
  }
  return map[regime]
}

export function MarketThemeCard() {
  const { t } = useLanguage()
  const data = mockRegimeData
  const cfg = regimeConfig[data.regime]
  const Icon = cfg.icon

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted">
          {t('home.marketTheme')}
        </h3>
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            cfg.bg,
            cfg.color
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {getRegimeLabel(data.regime, t)}
          <span className="ml-1 opacity-70">{data.confidence}%</span>
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-4">
        {data.explanation}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-data-xs text-positive mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3" />
            {t('theme.supporting')}
          </h4>
          <ul className="space-y-1.5">
            {data.supporting_indicators.map((s, i) => (
              <li key={i} className="text-xs text-foreground/60 leading-relaxed pl-3 border-l border-positive/30">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-data-xs text-negative mb-2 flex items-center gap-1.5">
            <TrendingDown className="w-3 h-3" />
            {t('theme.conflicting')}
          </h4>
          <ul className="space-y-1.5">
            {data.conflicting_indicators.map((s, i) => (
              <li key={i} className="text-xs text-foreground/60 leading-relaxed pl-3 border-l border-negative/30">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
