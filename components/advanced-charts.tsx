"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { PieLabelRenderProps } from "recharts"

interface ChartProps {
  stateData: any[]
  lgaData: any[]
  facilityData: any[]
  focusDisease?: boolean
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--warning))"]

const renderPieLabel = ({ name, percent }: PieLabelRenderProps) => {
  const ratio = typeof percent === "number" ? percent : Number(percent ?? 0)
  return `${name ?? "Unknown"}: ${Math.round(ratio * 100)}%`
}

export function AdvancedCharts({ stateData, lgaData, facilityData, focusDisease }: ChartProps) {
  // Format data for charts
  const timeSeriesData = stateData.map((d) => ({
    month: new Date(d.YEAR_MONTH).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    OPD: d.OPD,
    Services: d.TOTAL_SERVICE,
    Referrals: d.REFERRALS,
  }))

  const diseaseData = stateData.map((d) => ({
    month: new Date(d.YEAR_MONTH).toLocaleDateString("en-US", { month: "short" }),
    RTI: d.RTI,
    Diarrhea: d.DIARRHEA,
    UTI: d.UTI,
    GIT: d.GIT,
  }))

  // Aggregate disease totals for pie chart
  const diseaseTotals = stateData.reduce(
    (acc, d) => ({
      RTI: acc.RTI + (d.RTI || 0),
      Diarrhea: acc.DIARRHEA + (d.DIARRHEA || 0),
      UTI: acc.UTI + (d.UTI || 0),
      GIT: acc.GIT + (d.GIT || 0),
    }),
    { RTI: 0, Diarrhea: 0, UTI: 0, GIT: 0 },
  )

  const pieData = [
    { name: "RTI", value: diseaseTotals.RTI },
    { name: "Diarrhea", value: diseaseTotals.Diarrhea },
    { name: "UTI", value: diseaseTotals.UTI },
    { name: "GIT", value: diseaseTotals.GIT },
  ]

  // LGA comparison
  const lgaComparison = Object.values(
    lgaData.reduce((acc: any, d) => {
      if (!acc[d.LGA]) {
        acc[d.LGA] = { LGA: d.LGA, OPD: 0, Services: 0 }
      }
      acc[d.LGA].OPD += d.OPD
      acc[d.LGA].Services += d.TOTAL_SERVICE
      return acc
    }, {}),
  )
    .sort((a: any, b: any) => b.OPD - a.OPD)
    .slice(0, 10)

  if (focusDisease) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4">Disease Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={diseaseData}>
              <defs>
                <linearGradient id="colorRTI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDiarrhea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="RTI" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRTI)" />
              <Area
                type="monotone"
                dataKey="Diarrhea"
                stroke="hsl(var(--accent))"
                fillOpacity={1}
                fill="url(#colorDiarrhea)"
              />
              <Area
                type="monotone"
                dataKey="UTI"
                stroke="hsl(var(--secondary))"
                fillOpacity={0.6}
                fill="hsl(var(--secondary))"
              />
              <Area
                type="monotone"
                dataKey="GIT"
                stroke="hsl(var(--warning))"
                fillOpacity={0.6}
                fill="hsl(var(--warning))"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-lg font-semibold mb-4">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">OPD Visits & Services Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="OPD"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Services"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--accent))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
        <h3 className="text-lg font-semibold mb-4">Top 10 LGAs by OPD Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lgaComparison} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="LGA" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="OPD" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 col-span-1 lg:col-span-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <h3 className="text-lg font-semibold mb-4">Disease Cases Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={diseaseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="RTI" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Diarrhea" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="UTI" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="GIT" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
