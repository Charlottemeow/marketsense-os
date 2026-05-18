// MOCK DATA FOR DEVELOPMENT
"use client"

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

interface MacroChartProps {
  data: Record<string, number | string>[]
  dataKeys: { key: string; color: string; name: string }[]
  title: string
  xAxisKey?: string
}

export function MacroChart({ data, dataKeys, title, xAxisKey = "date" }: MacroChartProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 card-glow">
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "#1E293B" }}
              domain={["auto", "auto"]}
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
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", color: "#64748B" }}
            />
            {dataKeys.map((dk) => (
              <Line
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={dk.color}
                name={dk.name}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
