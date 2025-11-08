"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FacilityReadinessCard } from "./facility-readiness-card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Building2, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import type { FacilityReadiness } from "@/lib/facility-readiness"

interface CrossRiverDashboardProps {
  facilities: FacilityReadiness[]
}

export function CrossRiverReadinessDashboard({ facilities }: CrossRiverDashboardProps) {
  const [selectedLGA, setSelectedLGA] = useState("all")

  const filteredFacilities = useMemo(() => {
    if (selectedLGA === "all") return facilities
    return facilities.filter((f) => f.LGA === selectedLGA)
  }, [facilities, selectedLGA])

  const stats = useMemo(() => {
    const scores = filteredFacilities.map((f) => f.READINESS_SCORE)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    const minScore = scores.length > 0 ? Math.min(...scores) : 0
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0

    const categoryCounts = {
      Excellent: 0,
      Good: 0,
      Fair: 0,
      Poor: 0,
      Critical: 0,
    }

    filteredFacilities.forEach((f) => {
      categoryCounts[f.READINESS_CATEGORY as keyof typeof categoryCounts]++
    })

    return { avgScore, minScore, maxScore, categoryCounts }
  }, [filteredFacilities])

  const lgaData = useMemo(() => {
    const grouped = facilities.reduce(
      (acc, f) => {
        if (!acc[f.LGA]) {
          acc[f.LGA] = { lga: f.LGA, count: 0, totalScore: 0, avgScore: 0 }
        }
        acc[f.LGA].count++
        acc[f.LGA].totalScore += f.READINESS_SCORE
        return acc
      },
      {} as Record<string, any>,
    )

    return Object.values(grouped)
      .map((d) => ({ ...d, avgScore: Math.round(d.totalScore / d.count) }))
      .sort((a, b) => b.avgScore - a.avgScore)
  }, [facilities])

  const categoryDistribution = useMemo(() => {
    const counts = {
      Excellent: facilities.filter((f) => f.READINESS_CATEGORY === "Excellent").length,
      Good: facilities.filter((f) => f.READINESS_CATEGORY === "Good").length,
      Fair: facilities.filter((f) => f.READINESS_CATEGORY === "Fair").length,
      Poor: facilities.filter((f) => f.READINESS_CATEGORY === "Poor").length,
      Critical: facilities.filter((f) => f.READINESS_CATEGORY === "Critical").length,
    }
    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({
        name,
        value,
        color: {
          Excellent: "var(--chart-1)",
          Good: "var(--chart-2)",
          Fair: "var(--chart-3)",
          Poor: "var(--chart-4)",
          Critical: "var(--chart-5)",
        }[name],
      }))
  }, [facilities])

  const uniqueLGAs = useMemo(() => Array.from(new Set(facilities.map((f) => f.LGA))).sort(), [facilities])

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Average Readiness</p>
                <p className="text-4xl font-bold">{stats.avgScore}%</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Excellent Status</p>
                <p className="text-4xl font-bold">{stats.categoryCounts.Excellent}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Requires Attention</p>
                <p className="text-4xl font-bold">{stats.categoryCounts.Poor + stats.categoryCounts.Critical}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Total Facilities</p>
                <p className="text-4xl font-bold">{filteredFacilities.length}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Readiness by LGA</CardTitle>
            <CardDescription>Average infrastructure readiness score per LGA</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lgaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="lga" stroke="var(--muted-foreground)" fontSize={11} angle={-45} textAnchor="end" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="avgScore" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Readiness Distribution</CardTitle>
            <CardDescription>Facilities by readiness category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Facility List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Facility Infrastructure Readiness</CardTitle>
              <CardDescription>Detailed facility-level readiness assessment</CardDescription>
            </div>
            <Select value={selectedLGA} onValueChange={setSelectedLGA}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
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
      </Card>

      {/* Facility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <FacilityReadinessCard
            key={facility.PHC_NAME}
            name={facility.PHC_NAME}
            lga={facility.LGA}
            beds={facility.TOTAL_BEDS}
            wards={facility.TOTAL_WARDS}
            score={facility.READINESS_SCORE}
            category={facility.READINESS_CATEGORY}
            conditions={{
              wellBuilt: facility.WELL_BUILT_STRUCTURE,
              dilapidated: facility.HAS_DILAPIDATED_BUILDING,
              brokenCeiling: facility.BROKEN_CEILING,
              damagedChairs: facility.DAMAGED_CHAIRS,
              leakingRoof: facility.LEAKING_ROOF,
              damagedDoor: facility.DAMAGED_DOOR,
            }}
          />
        ))}
      </div>
    </div>
  )
}
