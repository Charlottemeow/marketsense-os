// MOCK DATA FOR DEVELOPMENT
"use client"

import { MacroCard } from "@/components/macro/macro-card"
import { YieldCurveChart } from "@/components/macro/yield-curve-chart"
import { MacroChart } from "@/components/macro/macro-chart"

const mockCpiData = [
  { date: "Jan", cpi: 3.1, coreCpi: 3.9 },
  { date: "Feb", cpi: 3.2, coreCpi: 3.8 },
  { date: "Mar", cpi: 3.5, coreCpi: 3.8 },
  { date: "Apr", cpi: 3.4, coreCpi: 3.6 },
  { date: "May", cpi: 3.3, coreCpi: 3.4 },
  { date: "Jun", cpi: 3.0, coreCpi: 3.3 },
  { date: "Jul", cpi: 2.9, coreCpi: 3.2 },
  { date: "Aug", cpi: 2.8, coreCpi: 3.1 },
  { date: "Sep", cpi: 2.7, coreCpi: 3.0 },
  { date: "Oct", cpi: 2.6, coreCpi: 2.8 },
  { date: "Nov", cpi: 2.7, coreCpi: 2.9 },
  { date: "Dec", cpi: 2.7, coreCpi: 2.8 },
]

const mockEmploymentData = [
  { date: "Jan", unemployment: 3.7, payrolls: 353 },
  { date: "Feb", unemployment: 3.9, payrolls: 275 },
  { date: "Mar", unemployment: 3.8, payrolls: 303 },
  { date: "Apr", unemployment: 3.9, payrolls: 175 },
  { date: "May", unemployment: 4.0, payrolls: 272 },
  { date: "Jun", unemployment: 4.1, payrolls: 206 },
  { date: "Jul", unemployment: 4.3, payrolls: 114 },
  { date: "Aug", unemployment: 4.2, payrolls: 142 },
  { date: "Sep", unemployment: 4.1, payrolls: 254 },
  { date: "Oct", unemployment: 4.1, payrolls: 12 },
  { date: "Nov", unemployment: 4.2, payrolls: 227 },
  { date: "Dec", unemployment: 4.1, payrolls: 256 },
]

const mockMacroCards = [
  { name: "CPI (YoY)", seriesId: "CPIAUCSL", latestValue: 2.7, unit: "%", change1M: -0.1, change3M: -0.8, change1Y: -3.8, lastUpdated: "2026-04-10" },
  { name: "Core CPI (YoY)", seriesId: "CPILFESL", latestValue: 2.8, unit: "%", change1M: -0.1, change3M: -1.0, change1Y: -2.8, lastUpdated: "2026-04-10" },
  { name: "Unemployment Rate", seriesId: "UNRATE", latestValue: 4.1, unit: "%", change1M: 0.0, change3M: 0.2, change1Y: 0.7, lastUpdated: "2026-04-05" },
  { name: "Nonfarm Payrolls", seriesId: "PAYEMS", latestValue: 256, unit: "K", change1M: 29, change3M: 115, change1Y: -67, lastUpdated: "2026-04-05" },
  { name: "Fed Funds Rate", seriesId: "FEDFUNDS", latestValue: 4.50, unit: "%", change1M: 0.0, change3M: -0.50, change1Y: -1.00, lastUpdated: "2026-03-20" },
  { name: "GDP (QoQ Annualized)", seriesId: "GDPC1", latestValue: 2.4, unit: "%", change1M: 0.0, change3M: -0.6, change1Y: -1.2, lastUpdated: "2026-03-27" },
  { name: "10Y Breakeven", seriesId: "T10YIE", latestValue: 2.35, unit: "%", change1M: 0.05, change3M: -0.12, change1Y: -0.08, lastUpdated: "2026-05-14" },
  { name: "ISM Manufacturing", seriesId: "NAPM", latestValue: 48.7, unit: "", change1M: -1.2, change3M: -2.1, change1Y: -1.5, lastUpdated: "2026-04-01" },
]

export default function MacroPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Macro Dashboard</h1>
        <p className="text-xs text-muted mt-0.5">
          FRED macro series, inflation &amp; employment trends
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {mockMacroCards.map((card) => (
          <MacroCard key={card.seriesId} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YieldCurveChart />
        <MacroChart
          title="CPI vs Core CPI (YoY %)"
          data={mockCpiData}
          dataKeys={[
            { key: "cpi", color: "#00D4FF", name: "CPI" },
            { key: "coreCpi", color: "#FFB347", name: "Core CPI" },
          ]}
        />
      </div>

      <MacroChart
        title="Unemployment Rate vs Nonfarm Payrolls"
        data={mockEmploymentData}
        dataKeys={[
          { key: "unemployment", color: "#EF4444", name: "Unemployment %" },
          { key: "payrolls", color: "#22C55E", name: "Payrolls (K)" },
        ]}
      />

      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
          Macro Regime Assessment
        </h3>
        <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
          <p>
            <strong className="text-accent">Disinflation trend intact:</strong> Core CPI has declined from 3.9% to 2.8% over the past 12 months,
            though progress has slowed in recent months. The Fed remains data-dependent with a bias toward easing.
          </p>
          <p>
            <strong className="text-accent">Labor market softening:</strong> Unemployment has risen from cycle lows of 3.4% to 4.1%.
            Payroll additions have trended lower, with the 3-month average now below 200K.
          </p>
          <p>
            <strong className="text-accent">Yield curve normalizing:</strong> The 2Y-10Y spread has turned positive after being inverted for
            over two years — historically a recession signal, though the curve has steepened on term premium repricing rather than growth fears.
          </p>
          <p>
            <strong className="text-accent">Growth decelerating but resilient:</strong> GDP is running at 2.4%, down from 3.6% a year ago.
            ISM Manufacturing remains in contraction territory, while services hold in expansion.
          </p>
        </div>
      </div>
    </div>
  )
}
