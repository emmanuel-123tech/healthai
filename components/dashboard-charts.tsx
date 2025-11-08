"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AlertTriangle, Heart, Syringe, Users } from "lucide-react"

interface PHCData {
  LGA: string
  Month: string
  Month_Num: number
  Total_OPD: number
  Total_Services: number
  Malaria_Cases: number
  Typhoid_Cases: number
  Diarrhea_Cases: number
  ANC_Enrolments: number
  Deliveries: number
  Immunizations: number
  Predicted_Malaria: number
}

export function DashboardCharts() {
  const [data, setData] = useState<PHCData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/africare_ai_phc_summary-eWrsbvFY6QXBTsI0UBeUgJIFSEWn1F.csv",
        )
        const csvText = await response.text()
        const rows = csvText.split("\n").slice(1) // Skip header
        const parsedData: PHCData[] = rows
          .filter((row) => row.trim())
          .map((row) => {
            const cols = row.split(",")
            return {
              LGA: cols[0],
              Month: cols[1],
              Month_Num: Number.parseFloat(cols[2]),
              Total_OPD: Number.parseFloat(cols[3]) || 0,
              Total_Services: Number.parseFloat(cols[4]) || 0,
              Malaria_Cases: Number.parseFloat(cols[5]) || 0,
              Typhoid_Cases: Number.parseFloat(cols[6]) || 0,
              Diarrhea_Cases: Number.parseFloat(cols[7]) || 0,
              ANC_Enrolments: Number.parseFloat(cols[8]) || 0,
              Deliveries: Number.parseFloat(cols[9]) || 0,
              Immunizations: Number.parseFloat(cols[10]) || 0,
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading health data...</p>
        </div>
      </div>
    )
  }

  // Aggregate data by LGA
  const lgaData = data.reduce(
    (acc, curr) => {
      if (!acc[curr.LGA]) {
        acc[curr.LGA] = {
          LGA: curr.LGA,
          Total_OPD: 0,
          Total_Services: 0,
          Malaria_Cases: 0,
          ANC_Enrolments: 0,
          Deliveries: 0,
          Immunizations: 0,
        }
      }
      acc[curr.LGA].Total_OPD += curr.Total_OPD
      acc[curr.LGA].Total_Services += curr.Total_Services
      acc[curr.LGA].Malaria_Cases += curr.Malaria_Cases
      acc[curr.LGA].ANC_Enrolments += curr.ANC_Enrolments
      acc[curr.LGA].Deliveries += curr.Deliveries
      acc[curr.LGA].Immunizations += curr.Immunizations
      return acc
    },
    {} as Record<string, any>,
  )

  const lgaChartData = Object.values(lgaData).sort((a: any, b: any) => b.Total_Services - a.Total_Services)

  // Disease trends over time
  const diseaseData = data.reduce((acc, curr) => {
    const existing = acc.find((d) => d.Month === curr.Month)
    if (existing) {
      existing.Malaria += curr.Malaria_Cases
      existing.Typhoid += curr.Typhoid_Cases
      existing.Diarrhea += curr.Diarrhea_Cases
    } else {
      acc.push({
        Month: curr.Month,
        Month_Num: curr.Month_Num,
        Malaria: curr.Malaria_Cases,
        Typhoid: curr.Typhoid_Cases,
        Diarrhea: curr.Diarrhea_Cases,
      })
    }
    return acc
  }, [] as any[])
  diseaseData.sort((a, b) => a.Month_Num - b.Month_Num)

  // Calculate totals for KPI cards
  const totalOPD = data.reduce((sum, d) => sum + d.Total_OPD, 0)
  const totalMalaria = data.reduce((sum, d) => sum + d.Malaria_Cases, 0)
  const totalANC = data.reduce((sum, d) => sum + d.ANC_Enrolments, 0)
  const totalImmunizations = data.reduce((sum, d) => sum + d.Immunizations, 0)

  // Maternal health data
  const maternalData = data.reduce((acc, curr) => {
    const existing = acc.find((d) => d.LGA === curr.LGA)
    if (existing) {
      existing.ANC_Enrolments += curr.ANC_Enrolments
      existing.Deliveries += curr.Deliveries
      existing.Immunizations += curr.Immunizations
    } else {
      acc.push({
        LGA: curr.LGA,
        ANC_Enrolments: curr.ANC_Enrolments,
        Deliveries: curr.Deliveries,
        Immunizations: curr.Immunizations,
      })
    }
    return acc
  }, [] as any[])
  maternalData.sort((a, b) => b.ANC_Enrolments - a.ANC_Enrolments)

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OPD Visits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOPD.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Malaria Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMalaria.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">65% of all illnesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ANC Enrolments</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalANC.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Maternal care tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Immunizations</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImmunizations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Child health protection</p>
          </CardContent>
        </Card>
      </div>

      {/* PHC Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>PHC Utilization by LGA</CardTitle>
          <CardDescription>Total OPD visits and services delivered across Local Government Areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lgaChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="LGA" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="Total_OPD" fill="hsl(var(--chart-1))" name="OPD Visits" />
                <Bar dataKey="Total_Services" fill="hsl(var(--chart-2))" name="Services" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-lg bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Key Insight: Okitipupa and Akoko N.E lead PHC service utilization in Ondo State.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disease Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Disease Trends Over Time</CardTitle>
          <CardDescription>Monthly comparison of Malaria, Typhoid, and Diarrhea cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diseaseData}>
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
                <Line type="monotone" dataKey="Malaria" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Malaria" />
                <Line type="monotone" dataKey="Typhoid" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Typhoid" />
                <Line type="monotone" dataKey="Diarrhea" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Diarrhea" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-lg bg-destructive/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Key Insight: Malaria accounts for over 65% of all reported illnesses across the region.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maternal & Child Health */}
      <Card>
        <CardHeader>
          <CardTitle>Maternal & Child Health by LGA</CardTitle>
          <CardDescription>ANC enrolments, deliveries, and immunizations across facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maternalData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="LGA" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="ANC_Enrolments" fill="hsl(var(--chart-1))" name="ANC Enrolments" />
                <Bar dataKey="Deliveries" fill="hsl(var(--chart-2))" name="Deliveries" />
                <Bar dataKey="Immunizations" fill="hsl(var(--chart-5))" name="Immunizations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 rounded-lg bg-primary/5 p-4">
            <p className="text-sm font-medium text-foreground">
              Key Insight: ANC follow-up rates are highest in Okitipupa and Akoko S.W.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Facility Performance Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Performance Leaderboard</CardTitle>
          <CardDescription>Top performing LGAs by total service volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lgaChartData.slice(0, 5).map((lga: any, index: number) => (
              <div key={lga.LGA} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-accent text-accent-foreground"
                      : index === 1
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{lga.LGA}</p>
                    <p className="text-sm text-muted-foreground">{lga.Total_Services.toLocaleString()} services</p>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${(lga.Total_Services / lgaChartData[0].Total_Services) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
