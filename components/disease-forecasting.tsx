"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, AlertTriangle, Activity } from "lucide-react"

interface ForecastingProps {
  stateData: any[]
  lgaData: any[]
}

type ForecastChartPoint = {
  month: string
  RTIActual: number | null
  RTIForecast: number | null
  DiarrheaActual: number | null
  DiarrheaForecast: number | null
  UTIActual: number | null
  UTIForecast: number | null
}

export function DiseaseForecasting({ stateData, lgaData }: ForecastingProps) {
  // Simple forecasting using moving average
  const forecastNextMonth = (data: number[]) => {
    const recent = data.slice(-3)
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const trend = (recent[recent.length - 1] - recent[0]) / recent.length
    return Math.round(avg + trend)
  }

  // Prepare historical data
  const historicalRTI = stateData.map((d) => d.RTI || 0)
  const historicalDiarrhea = stateData.map((d) => d.DIARRHEA || 0)
  const historicalUTI = stateData.map((d) => d.UTI || 0)

  // Generate forecasts
  const forecastRTI = forecastNextMonth(historicalRTI)
  const forecastDiarrhea = forecastNextMonth(historicalDiarrhea)
  const forecastUTI = forecastNextMonth(historicalUTI)

  // Calculate trends
  const rtiTrend =
    historicalRTI.length > 1
      ? (
          ((historicalRTI[historicalRTI.length - 1] - historicalRTI[historicalRTI.length - 2]) /
            historicalRTI[historicalRTI.length - 2]) *
          100
        ).toFixed(1)
      : 0

  // Prepare chart data with forecast
  const historicalChartData: ForecastChartPoint[] = stateData.map((d, index) => {
    const isLastActual = index === stateData.length - 1
    const month = new Date(d.YEAR_MONTH).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    })

    const rti = typeof d.RTI === "number" ? d.RTI : Number(d.RTI ?? 0)
    const diarrhea = typeof d.DIARRHEA === "number" ? d.DIARRHEA : Number(d.DIARRHEA ?? 0)
    const uti = typeof d.UTI === "number" ? d.UTI : Number(d.UTI ?? 0)

    return {
      month,
      RTIActual: rti,
      RTIForecast: isLastActual ? rti : null,
      DiarrheaActual: diarrhea,
      DiarrheaForecast: isLastActual ? diarrhea : null,
      UTIActual: uti,
      UTIForecast: isLastActual ? uti : null,
    }
  })

  const chartData: ForecastChartPoint[] = [
    ...historicalChartData,
    {
      month: "Forecast",
      RTIActual: null,
      RTIForecast: forecastRTI,
      DiarrheaActual: null,
      DiarrheaForecast: forecastDiarrhea,
      UTIActual: null,
      UTIForecast: forecastUTI,
    },
  ]

  // Identify high-risk LGAs
  const lgaRiskScores = Object.values(
    lgaData.reduce((acc: any, d) => {
      if (!acc[d.LGA]) {
        acc[d.LGA] = { lga: d.LGA, totalCases: 0, referrals: 0, opd: 0 }
      }
      acc[d.LGA].totalCases += (d.RTI || 0) + (d.DIARRHEA || 0) + (d.UTI || 0) + (d.GIT || 0)
      acc[d.LGA].referrals += d.REFERRALS || 0
      acc[d.LGA].opd += d.OPD || 0
      return acc
    }, {}),
  )
    .map((lga: any) => ({
      ...lga,
      riskScore: lga.opd > 0 ? ((lga.totalCases / lga.opd) * 100).toFixed(1) : 0,
    }))
    .sort((a: any, b: any) => b.riskScore - a.riskScore)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Forecast Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 animate-slide-up border-l-4 border-l-primary">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">RTI Forecast</p>
              <p className="text-3xl font-bold mt-2">{forecastRTI}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">{rtiTrend}% vs last month</span>
          </div>
        </Card>

        <Card className="p-6 animate-slide-up border-l-4 border-l-accent" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diarrhea Forecast</p>
              <p className="text-3xl font-bold mt-2">{forecastDiarrhea}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Activity className="h-6 w-6 text-accent" />
            </div>
          </div>
          <Badge variant="outline">Next month prediction</Badge>
        </Card>

        <Card className="p-6 animate-slide-up border-l-4 border-l-secondary" style={{ animationDelay: "200ms" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">UTI Forecast</p>
              <p className="text-3xl font-bold mt-2">{forecastUTI}</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Activity className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <Badge variant="outline">AI-powered estimate</Badge>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
        <h3 className="text-lg font-semibold mb-4">Disease Trends with Forecast</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
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
              dataKey="RTIActual"
              name="RTI (Actual)"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="RTIForecast"
              name="RTI (Forecast)"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              strokeDasharray="5 5"
              connectNulls
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="DiarrheaActual"
              name="Diarrhea (Actual)"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--accent))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="DiarrheaForecast"
              name="Diarrhea (Forecast)"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              strokeDasharray="5 5"
              connectNulls
              dot={{ fill: "hsl(var(--accent))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="UTIActual"
              name="UTI (Actual)"
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--secondary))", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="UTIForecast"
              name="UTI (Forecast)"
              stroke="hsl(var(--secondary))"
              strokeWidth={3}
              strokeDasharray="5 5"
              connectNulls
              dot={{ fill: "hsl(var(--secondary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* High-Risk LGAs */}
      <Card className="p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          High-Risk LGAs Requiring Attention
        </h3>
        <div className="space-y-3">
          {lgaRiskScores.map((lga: any, index: number) => (
            <Alert key={lga.lga} className="animate-slide-up" style={{ animationDelay: `${(index + 5) * 50}ms` }}>
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{lga.lga}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {lga.totalCases} total cases • {lga.referrals} referrals
                  </span>
                </div>
                <Badge variant={Number(lga.riskScore) > 30 ? "destructive" : "secondary"}>
                  {lga.riskScore}% disease rate
                </Badge>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </Card>
    </div>
  )
}
