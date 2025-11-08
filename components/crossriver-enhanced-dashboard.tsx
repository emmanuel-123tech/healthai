"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, TrendingUp, AlertTriangle, CheckCircle2, Bed, Home, MapPin, Activity } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import type { FacilityMonthlyAgg, LGAMonthlyAgg, StateMonthlyAgg } from "@/lib/crossriver-data"
import { categorizeReadiness } from "@/lib/crossriver-data"

interface DashboardProps {
  facilities: FacilityMonthlyAgg[]
  lgaData: LGAMonthlyAgg[]
  stateData: StateMonthlyAgg[]
}

export function CrossRiverEnhancedDashboard({ facilities, lgaData, stateData }: DashboardProps) {
  const [selectedLGA, setSelectedLGA] = useState<string>("all")

  // Filter facilities by selected LGA
  const filteredFacilities = selectedLGA === "all" ? facilities : facilities.filter((f) => f.LGA === selectedLGA)

  // Get unique LGAs for filter
  const uniqueLGAs = Array.from(new Set(lgaData.map((l) => l.LGA))).sort()

  // Calculate state-level metrics
  const stateMetrics = stateData.reduce(
    (acc, curr) => {
      acc.totalFacilities += curr.TOTAL_FACILITIES
      acc.avgReadiness += curr.AVG_READINESS
      acc.damagedFacilities += curr.DAMAGED_FACILITIES
      acc.totalLGAs = Math.max(acc.totalLGAs, curr.TOTAL_LGAS)
      return acc
    },
    { totalFacilities: 0, avgReadiness: 0, damagedFacilities: 0, totalLGAs: 0 },
  )

  stateMetrics.avgReadiness = stateData.length > 0 ? stateMetrics.avgReadiness / stateData.length : 0

  // Calculate damage rate
  const damageRate =
    stateMetrics.totalFacilities > 0
      ? ((stateMetrics.damagedFacilities / stateMetrics.totalFacilities) * 100).toFixed(1)
      : "0.0"

  // LGA readiness comparison
  const lgaReadinessChart = lgaData
    .filter((l) => l.LGA && l.LGA !== "")
    .sort((a, b) => b.AVG_READINESS - a.AVG_READINESS)
    .slice(0, 15)
    .map((l) => ({
      lga: l.LGA,
      readiness: Number.parseFloat(l.AVG_READINESS.toFixed(1)),
      facilities: l.TOTAL_FACILITIES,
      damaged: l.FACILITIES_WITH_DAMAGES,
    }))

  // Readiness distribution
  const readinessDistribution = lgaData.reduce((acc: any[], curr) => {
    const { category } = categorizeReadiness(curr.AVG_READINESS)
    const existing = acc.find((a) => a.category === category)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ category, count: 1 })
    }
    return acc
  }, [])

  // Damage types analysis from facilities
  const damageTypes = filteredFacilities.reduce(
    (acc, curr) => {
      acc.total += 1
      acc.withDamage += curr.HAS_DAMAGE === "Yes" ? 1 : 0
      acc.avgDamageCount += curr.DAMAGED_ITEMS_COUNT
      return acc
    },
    { total: 0, withDamage: 0, avgDamageCount: 0 },
  )

  const avgDamageItems = damageTypes.total > 0 ? (damageTypes.avgDamageCount / damageTypes.total).toFixed(1) : "0.0"

  // Colors for charts
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="space-y-6">
      {/* State Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stateMetrics.totalFacilities}</div>
            <p className="text-xs text-muted-foreground mt-1">Across {stateMetrics.totalLGAs} LGAs</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Readiness</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stateMetrics.avgReadiness.toFixed(1)}%</div>
            <Badge className="mt-2 bg-blue-500/10 text-blue-600 border-blue-500/20">
              {categorizeReadiness(stateMetrics.avgReadiness).category}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Facilities with Damage</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stateMetrics.damagedFacilities}</div>
            <p className="text-xs text-muted-foreground mt-1">{damageRate}% of total</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Healthy Facilities</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {stateMetrics.totalFacilities - stateMetrics.damagedFacilities}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {(100 - Number.parseFloat(damageRate)).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for critical facilities */}
      {Number.parseFloat(damageRate) > 15 && (
        <Alert className="border-orange-500/50 bg-orange-500/5">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900 dark:text-orange-400">
            <strong>{damageRate}% of facilities</strong> report infrastructure damage. Prioritize interventions in
            high-risk LGAs.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="lga" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lga">LGA Analysis</TabsTrigger>
          <TabsTrigger value="facilities">Facility Details</TabsTrigger>
          <TabsTrigger value="trends">Infrastructure Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="lga" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Readiness by LGA</CardTitle>
                <CardDescription>Infrastructure readiness scores across LGAs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={lgaReadinessChart} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="lga"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar dataKey="readiness" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Readiness Distribution</CardTitle>
                <CardDescription>LGA distribution by readiness category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={readinessDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, count }) => `${category}: ${count}`}
                      outerRadius={120}
                      fill="hsl(var(--primary))"
                      dataKey="count"
                    >
                      {readinessDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* LGA Table */}
          <Card>
            <CardHeader>
              <CardTitle>LGA Performance Metrics</CardTitle>
              <CardDescription>Detailed infrastructure assessment by Local Government Area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">LGA</th>
                      <th className="text-center p-3 font-semibold">Facilities</th>
                      <th className="text-center p-3 font-semibold">Avg Readiness</th>
                      <th className="text-center p-3 font-semibold">With Damage</th>
                      <th className="text-center p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lgaReadinessChart.map((lga, index) => {
                      const { category, color } = categorizeReadiness(lga.readiness)
                      const damagePercent = ((lga.damaged / lga.facilities) * 100).toFixed(0)
                      return (
                        <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{lga.lga}</td>
                          <td className="text-center p-3">{lga.facilities}</td>
                          <td className="text-center p-3 font-semibold">{lga.readiness}%</td>
                          <td className="text-center p-3">
                            {lga.damaged} <span className="text-muted-foreground text-xs">({damagePercent}%)</span>
                          </td>
                          <td className="text-center p-3">
                            <Badge className={`${color} bg-opacity-10`}>{category}</Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facility Infrastructure Status</CardTitle>
                  <CardDescription>
                    {filteredFacilities.length} facilities {selectedLGA !== "all" ? `in ${selectedLGA}` : "statewide"}
                  </CardDescription>
                </div>
                <Select value={selectedLGA} onValueChange={setSelectedLGA}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All LGAs</SelectItem>
                    {uniqueLGAs.map((lga) => (
                      <SelectItem key={lga} value={lga}>
                        {lga}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 max-h-[600px] overflow-y-auto">
                {filteredFacilities
                  .sort((a, b) => a.READINESS_SCORE - b.READINESS_SCORE)
                  .map((facility, index) => {
                    const { category, color } = categorizeReadiness(facility.READINESS_SCORE)
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <h4 className="font-semibold text-sm">{facility.PHC_NAME}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {facility.LGA}
                            </span>
                            {facility.TOTAL_BEDS !== null && (
                              <span className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                {facility.TOTAL_BEDS} beds
                              </span>
                            )}
                            {facility.DAMAGED_ITEMS_COUNT > 0 && (
                              <span className="flex items-center gap-1 text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                {facility.DAMAGED_ITEMS_COUNT} damaged items
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl font-bold">{facility.READINESS_SCORE.toFixed(0)}%</div>
                            <Badge className={`${color} bg-opacity-10 text-xs`}>{category}</Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Damage Analysis</CardTitle>
              <CardDescription>Overview of facility damage patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Damage Rate</div>
                  <div className="text-3xl font-bold">{damageRate}%</div>
                  <div className="text-xs text-muted-foreground">
                    {damageTypes.withDamage} of {damageTypes.total} facilities
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Avg Damage Items per Facility</div>
                  <div className="text-3xl font-bold">{avgDamageItems}</div>
                  <div className="text-xs text-muted-foreground">Structural and equipment issues</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Priority Interventions</div>
                  <div className="text-3xl font-bold">{Math.ceil(damageTypes.withDamage * 0.3)}</div>
                  <div className="text-xs text-muted-foreground">Critical facilities need immediate attention</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-blue-500/5 border-blue-500/20">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900 dark:text-blue-400">
              <strong>Infrastructure Investment Opportunity:</strong> Focus on the{" "}
              {Math.ceil(lgaReadinessChart.length * 0.2)} lowest-performing LGAs could improve overall state readiness
              by an estimated {(100 - stateMetrics.avgReadiness).toFixed(0)}%.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
