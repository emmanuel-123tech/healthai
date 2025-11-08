"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface PHCData {
  LGA: string
  Month: string
  Month_Num: number
  Malaria_Cases: number
  Predicted_Malaria: number
}

export function PredictiveIntelligence() {
  const [data, setData] = useState<PHCData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/africare_ai_phc_summary-eWrsbvFY6QXBTsI0UBeUgJIFSEWn1F.csv",
        )
        const csvText = await response.text()
        const rows = csvText.split("\n").slice(1)
        const parsedData: PHCData[] = rows
          .filter((row) => row.trim())
          .map((row) => {
            const cols = row.split(",")
            return {
              LGA: cols[0],
              Month: cols[1],
              Month_Num: Number.parseFloat(cols[2]),
              Malaria_Cases: Number.parseFloat(cols[5]) || 0,
              Predicted_Malaria: Number.parseFloat(cols[11]) || 0,
            }
          })
        setData(parsedData)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading predictive intelligence...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Aggregate predictions by LGA
  const lgaPredictions = data.reduce(
    (acc, curr) => {
      if (!acc[curr.LGA]) {
        acc[curr.LGA] = {
          LGA: curr.LGA,
          totalActual: 0,
          totalPredicted: 0,
          count: 0,
        }
      }
      acc[curr.LGA].totalActual += curr.Malaria_Cases
      acc[curr.LGA].totalPredicted += curr.Predicted_Malaria
      acc[curr.LGA].count += 1
      return acc
    },
    {} as Record<string, any>,
  )

  // Calculate risk levels
  const riskAnalysis = Object.values(lgaPredictions).map((lga: any) => {
    const avgActual = lga.totalActual / lga.count
    const avgPredicted = lga.totalPredicted / lga.count
    const changePercent = ((avgPredicted - avgActual) / avgActual) * 100
    return {
      LGA: lga.LGA,
      avgActual,
      avgPredicted,
      changePercent,
      risk: changePercent > 15 ? "high" : changePercent > 5 ? "medium" : "stable",
    }
  })

  // Sort by risk
  const highRisk = riskAnalysis.filter((r) => r.risk === "high").sort((a, b) => b.changePercent - a.changePercent)
  const stable = riskAnalysis.filter((r) => r.risk === "stable")

  // Prepare chart data - aggregate by month
  const monthlyData = data.reduce((acc, curr) => {
    const existing = acc.find((d) => d.Month === curr.Month)
    if (existing) {
      existing.Actual += curr.Malaria_Cases
      existing.Predicted += curr.Predicted_Malaria
    } else {
      acc.push({
        Month: curr.Month,
        Month_Num: curr.Month_Num,
        Actual: curr.Malaria_Cases,
        Predicted: curr.Predicted_Malaria,
      })
    }
    return acc
  }, [] as any[])
  monthlyData.sort((a, b) => a.Month_Num - b.Month_Num)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Malaria Surveillance</CardTitle>
          <CardDescription>AI-powered forecasting of malaria trends across Ondo State</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="Month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Actual Cases"
                />
                <Line
                  type="monotone"
                  dataKey="Predicted"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Cases"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Risk Alerts</h3>

        {highRisk.length > 0 ? (
          highRisk.map((risk) => (
            <Alert key={risk.LGA} variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">High Risk: {risk.LGA}</AlertTitle>
              <AlertDescription>
                Malaria risk rising by +{risk.changePercent.toFixed(0)}% — deploy RDT kits and increase preventive
                measures.
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <Alert className="border-primary/50 bg-primary/5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold text-primary">Monitoring Active</AlertTitle>
            <AlertDescription>No high-risk areas detected. Continue routine surveillance.</AlertDescription>
          </Alert>
        )}

        {stable.length > 0 && (
          <Alert className="border-primary/30 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold text-primary">Stable Outlook</AlertTitle>
            <AlertDescription>
              {stable.map((s) => s.LGA).join(", ")} showing stable trends — maintain existing strategy.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
