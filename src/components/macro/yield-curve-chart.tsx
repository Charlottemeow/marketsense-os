// MOCK DATA FOR DEVELOPMENT
"use client"

import { useLanguage } from "@/lib/i18n/context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const mockYieldData = [
  { date: "Jan", yield2y: 4.38, yield10y: 4.02 },
  { date: "Feb", yield2y: 4.52, yield10y: 4.15 },
  { date: "Mar", yield2y: 4.42, yield10y: 4.08 },
  { date: "Apr", yield2y: 4.28, yield10y: 4.28 },
  { date: "May", yield2y: 4.12, yield10y: 4.48 },
  { date: "Jun", yield2y: 4.18, yield10y: 4.42 },
  { date: "Jul", yield2y: 4.08, yield10y: 4.35 },
  { date: "Aug", yield2y: 3.95, yield10y: 4.22 },
  { date: "Sep", yield2y: 3.88, yield10y: 4.18 },
  { date: "Oct", yield2y: 4.05, yield10y: 4.32 },
  { date: "Nov", yield2y: 4.10, yield10y: 4.45 },
  { date: "Dec", yield2y: 4.12, yield10y: 4.48 },
]

export function YieldCurveChart() {
  const { t } = useLanguage()

  return (
    <div className="rounded-lg border border-border bg-card p-4 card-glow">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        {t('macro.yieldCurve')} — {t('macro.2y')} vs {t('macro.10y')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockYieldData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => `${v.toFixed(2)}%`}
            />
            <Tooltip
              contentStyle={{
                background: "#131A2B",
                border: "1px solid #1E293B",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              itemStyle={{ color: "#e2e8f0" }}
              formatter={(value: number) => `${value.toFixed(2)}%`}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#64748B" }}
            />
            <Line
              type="monotone"
              dataKey="yield2y"
              stroke="#00D4FF"
              name={t('macro.2y')}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="yield10y"
              stroke="#FFB347"
              name={t('macro.10y')}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
