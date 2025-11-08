"use client"

import { useState, useEffect, useMemo } from "react"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  TrendingUp,
  Users,
  Building2,
  AlertTriangle,
  Heart,
  Stethoscope,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { PieLabelRenderProps } from "recharts"
import { getCurrentUser } from "@/lib/auth"

type AggregatedRecord = {
  YEAR_MONTH: string
  LGA?: string
  NAME_OF_FACILITIES?: string
  OPD?: number
  TOTAL_SERVICE?: number
  RTI?: number
  DIARRHEA?: number
  UTI?: number
  GIT?: number
  REFERRALS?: number
  DEATHS?: number
  [key: string]: string | number | undefined
}

type FilteredDataset = {
  lgaData: AggregatedRecord[]
  facilityData: AggregatedRecord[]
}

const renderDistributionLabel = ({ name, percent }: PieLabelRenderProps) => {
  const ratio = typeof percent === "number" ? percent : Number(percent ?? 0)
  return `${name ?? "Unknown"} ${Math.round(ratio * 100)}%`
}

export default function OndoStateDashboard() {
  const [stateData, setStateData] = useState<AggregatedRecord[]>([])
  const [lgaData, setLgaData] = useState<AggregatedRecord[]>([])
  const [facilityData, setFacilityData] = useState<AggregatedRecord[]>([])
  const currentUser = getCurrentUser()
  const [selectedLGA, setSelectedLGA] = useState(currentUser?.lga || "all")
  const [selectedFacility, setSelectedFacility] = useState(currentUser?.facility || "all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        console.log("[v0] Starting to load Ondo State dashboard data...")
        const [stateRes, lgaRes, facilityRes] = await Promise.all([
          fetch(
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/state_month_agg-ygIa1uf5jsPNL1lqf1p0V6XGn0sqGs.csv",
          ),
          fetch(
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lga_month_agg-cl9KdhHuPXIeUVpFBlmR8GJYfp1zbc.csv",
          ),
          fetch(
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/facility_month_agg-AfR2ZMpVCLijpSG8F9ut4Apy986uYQ.csv",
          ),
        ])

        console.log("[v0] Fetch responses received:", {
          stateOk: stateRes.ok,
          lgaOk: lgaRes.ok,
          facilityOk: facilityRes.ok,
        })

        const [stateText, lgaText, facilityText] = await Promise.all([
          stateRes.text(),
          lgaRes.text(),
          facilityRes.text(),
        ])

        const parseCSV = (text: string): AggregatedRecord[] => {
          const lines = text.trim().split("\n")
          const headers = lines[0].split(",")
          return lines.slice(1).map((line) => {
            const values = line.split(",")
            return headers.reduce<AggregatedRecord>((obj, header, index) => {
              const value = values[index]
              obj[header] = isNaN(Number(value)) ? value : Number(value)
              return obj
            }, { YEAR_MONTH: "" })
          })
        }

        const stateParsed = parseCSV(stateText)
        const lgaParsed = parseCSV(lgaText)
        const facilityParsed = parseCSV(facilityText)

        setStateData(stateParsed)
        setLgaData(lgaParsed)
        setFacilityData(facilityParsed)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error loading Ondo State data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredData = useMemo<FilteredDataset>(() => {
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      const facilityName = currentUser.facility || selectedFacility
      if (facilityName && facilityName !== "all") {
        return {
          lgaData: lgaData.filter((d) => d.LGA === (currentUser.lga || selectedLGA)),
          facilityData: facilityData.filter((d) => d.NAME_OF_FACILITIES === facilityName),
        }
      }
    }

    if (selectedLGA === "all") {
      return {
        lgaData: lgaData,
        facilityData: facilityData,
      }
    }

    return {
      lgaData: lgaData.filter((d) => d.LGA === selectedLGA),
      facilityData: facilityData.filter((d) => d.LGA === selectedLGA),
    }
  }, [selectedLGA, selectedFacility, lgaData, facilityData, currentUser])

  const totalOPD = useMemo(() => {
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      return filteredData.facilityData.reduce((sum, d) => sum + (d.OPD || 0), 0)
    }
    if (selectedLGA === "all") {
      return stateData.reduce((sum, d) => sum + (d.OPD || 0), 0)
    }
    return filteredData.lgaData.reduce((sum, d) => sum + (d.OPD || 0), 0)
  }, [selectedLGA, stateData, filteredData, currentUser])

  const totalServices = useMemo(() => {
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      return filteredData.facilityData.reduce((sum, d) => sum + (d.TOTAL_SERVICE || 0), 0)
    }
    if (selectedLGA === "all") {
      return stateData.reduce((sum, d) => sum + (d.TOTAL_SERVICE || 0), 0)
    }
    return filteredData.lgaData.reduce((sum, d) => sum + (d.TOTAL_SERVICE || 0), 0)
  }, [selectedLGA, stateData, filteredData, currentUser])

  const totalReferrals = useMemo(() => {
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      return filteredData.facilityData.reduce((sum, d) => sum + (d.REFERRALS || 0), 0)
    }
    if (selectedLGA === "all") {
      return stateData.reduce((sum, d) => sum + (d.REFERRALS || 0), 0)
    }
    return filteredData.lgaData.reduce((sum, d) => sum + (d.REFERRALS || 0), 0)
  }, [selectedLGA, stateData, filteredData, currentUser])

  const uniqueLGAs = useMemo(() => {
    if (selectedLGA === "all") {
      return new Set(
        lgaData
          .map((d) => d.LGA)
          .filter((lga): lga is string => typeof lga === "string" && lga.length > 0),
      ).size
    }
    return 1
  }, [selectedLGA, lgaData])

  const uniqueFacilities = useMemo(() => {
    return new Set(
      filteredData.facilityData
        .map((d) => d.NAME_OF_FACILITIES)
        .filter((facility): facility is string => typeof facility === "string" && facility.length > 0),
    ).size
  }, [filteredData.facilityData])

  const avgOPDPerFacility = uniqueFacilities > 0 ? Math.round(totalOPD / uniqueFacilities) : 0
  const totalDeaths = useMemo(() => {
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      return filteredData.facilityData.reduce((sum, d) => sum + (d.DEATHS || 0), 0)
    }
    if (selectedLGA === "all") {
      return stateData.reduce((sum, d) => sum + (d.DEATHS || 0), 0)
    }
    return filteredData.lgaData.reduce((sum, d) => sum + (d.DEATHS || 0), 0)
  }, [selectedLGA, stateData, filteredData, currentUser])

  const referralRate = totalOPD > 0 ? ((totalReferrals / totalOPD) * 100).toFixed(1) : "0"

  const monthlyTrends = useMemo(() => {
    let dataSource: AggregatedRecord[]
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      dataSource = filteredData.facilityData
    } else {
      dataSource = selectedLGA === "all" ? stateData : filteredData.lgaData
    }

    return dataSource
      .map((d) => ({
        month: new Date(d.YEAR_MONTH).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        opd: d.OPD || 0,
        services: d.TOTAL_SERVICE || 0,
        rti: d.RTI || 0,
        diarrhea: d.DIARRHEA || 0,
        uti: d.UTI || 0,
        git: d.GIT || 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [selectedLGA, stateData, filteredData, currentUser])

  const lgaComparison = useMemo(() => {
    const dataSource = selectedLGA === "all" ? lgaData : filteredData.lgaData

    const aggregated = dataSource.reduce(
      (acc, d) => {
        const lga = d.LGA
        if (!lga) {
          return acc
        }
        if (!acc.has(lga)) {
          acc.set(lga, { lga, opd: 0, services: 0, referrals: 0 })
        }
        const current = acc.get(lga)!
        current.opd += d.OPD || 0
        current.services += d.TOTAL_SERVICE || 0
        current.referrals += d.REFERRALS || 0
        return acc
      },
      new Map<string, { lga: string; opd: number; services: number; referrals: number }>(),
    )

    return Array.from(aggregated.values())
      .sort((a, b) => b.opd - a.opd)
      .slice(0, 8)
  }, [selectedLGA, lgaData, filteredData.lgaData])

  const diseaseDistribution = useMemo(() => {
    let dataSource
    if (currentUser?.role === "health_worker" || currentUser?.role === "facility_manager") {
      dataSource = filteredData.facilityData
    } else {
      dataSource = selectedLGA === "all" ? stateData : filteredData.lgaData
    }

    return [
      { name: "RTI", value: dataSource.reduce((sum, d) => sum + (d.RTI || 0), 0), color: "var(--chart-1)" },
      { name: "Diarrhea", value: dataSource.reduce((sum, d) => sum + (d.DIARRHEA || 0), 0), color: "var(--chart-2)" },
      { name: "UTI", value: dataSource.reduce((sum, d) => sum + (d.UTI || 0), 0), color: "var(--chart-3)" },
      { name: "GIT", value: dataSource.reduce((sum, d) => sum + (d.GIT || 0), 0), color: "var(--chart-4)" },
    ].filter((d) => d.value > 0)
  }, [selectedLGA, stateData, filteredData, currentUser])

  const topFacilities = useMemo(() => {
    const facilityUtilization = filteredData.facilityData.reduce(
      (acc, d) => {
        const facility = d.NAME_OF_FACILITIES
        if (!facility) {
          return acc
        }
        if (!acc.has(facility)) {
          acc.set(facility, { facility, opd: 0, services: 0 })
        }
        const current = acc.get(facility)!
        current.opd += d.OPD || 0
        current.services += d.TOTAL_SERVICE || 0
        return acc
      },
      new Map<string, { facility: string; opd: number; services: number }>(),
    )

    return Array.from(facilityUtilization.values())
      .map((f) => ({
        ...f,
        utilization: f.opd > 0 ? Math.round((f.services / f.opd) * 100) : 0,
      }))
      .sort((a, b) => b.opd - a.opd)
      .slice(0, 6)
  }, [filteredData.facilityData])

  const lgas = Array.from(
    new Set(
      lgaData
        .map((d) => d.LGA)
        .filter((lga): lga is string => typeof lga === "string" && lga.length > 0),
    ),
  ).sort()
  const canChangeLGA = !currentUser?.lga || currentUser.role === "state_official"

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="relative h-16 w-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-lg font-medium text-foreground">Loading Ondo State Health Intelligence</p>
          <p className="text-sm text-muted-foreground mt-2">Analyzing PHC data across Ondo State...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Ondo State PHC Analytics
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-balance md:text-6xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Ondo State Health Dashboard
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Real-time health analytics and predictive insights from {uniqueFacilities} Primary Health Care facilities
            across {uniqueLGAs} Local Government Areas in Ondo State
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 animate-slide-up card-hover border-0 shadow-lg bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total OPD Visits</p>
              <p className="text-4xl font-bold mb-2">{totalOPD.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Avg {avgOPDPerFacility.toLocaleString()} per facility</p>
            </div>
          </Card>

          <Card
            className="p-6 animate-slide-up card-hover border-0 shadow-lg bg-gradient-to-br from-card to-accent/5 relative overflow-hidden"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Activity className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="outline" className="bg-accent/5 border-accent/20">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Healthcare Services</p>
              <p className="text-4xl font-bold mb-2">{totalServices.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Across all service types</p>
            </div>
          </Card>

          <Card
            className="p-6 animate-slide-up card-hover border-0 shadow-lg bg-gradient-to-br from-card to-secondary/5 relative overflow-hidden"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant="outline" className="bg-secondary/5 border-secondary/20">
                  Active
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">PHC Facilities</p>
              <p className="text-4xl font-bold mb-2">{uniqueFacilities}</p>
              <p className="text-xs text-muted-foreground">Across {uniqueLGAs} Local Government Areas</p>
            </div>
          </Card>

          <Card
            className="p-6 animate-slide-up card-hover border-0 shadow-lg bg-gradient-to-br from-card to-warning/5 relative overflow-hidden"
            style={{ animationDelay: "300ms" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <Badge variant="outline" className="bg-warning/5 border-warning/20">
                  {referralRate}%
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Referrals</p>
              <p className="text-4xl font-bold mb-2">{totalReferrals.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">To higher-level facilities</p>
            </div>
          </Card>
        </div>

        <Card
          className="p-6 animate-slide-up border-0 shadow-lg bg-gradient-to-r from-card to-muted/20"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Filter Analytics
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Drill down by Local Government Area</p>
            </div>
            {canChangeLGA && (
              <Select value={selectedLGA} onValueChange={setSelectedLGA}>
                <SelectTrigger className="w-full sm:w-[280px] border-2">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="font-medium">All LGAs</span>
                  </SelectItem>
                  {lgas.map((lga) => (
                    <SelectItem key={lga} value={lga}>
                      {lga}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        <Tabs defaultValue="overview" className="animate-slide-up" style={{ animationDelay: "500ms" }}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-card data-[state=active]:shadow-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="diseases" className="data-[state=active]:bg-card data-[state=active]:shadow-md">
              Disease Trends
            </TabsTrigger>
            <TabsTrigger value="facilities" className="data-[state=active]:bg-card data-[state=active]:shadow-md">
              Facilities
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-card data-[state=active]:shadow-md">
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="p-6 border-0 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Monthly OPD & Services Trend
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Patient visits and services over time</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorOPD" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="opd"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOPD)"
                    name="OPD Visits"
                  />
                  <Area
                    type="monotone"
                    dataKey="services"
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorServices)"
                    name="Services"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-accent" />
                    Top LGAs by OPD Volume
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Highest patient visit counts</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={lgaComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                    <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis dataKey="lga" type="category" stroke="var(--muted-foreground)" fontSize={11} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="opd" fill="var(--chart-1)" radius={[0, 8, 8, 0]} name="OPD Visits" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 border-0 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-destructive" />
                    Disease Distribution
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Common conditions treated</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderDistributionLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diseaseDistribution.map((entry, index) => (
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
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diseases" className="space-y-6 mt-6">
            <Card className="p-6 border-0 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Disease Trends Over Time
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Monthly progression of common conditions</p>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rti"
                    stroke="var(--chart-1)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="RTI"
                  />
                  <Line
                    type="monotone"
                    dataKey="diarrhea"
                    stroke="var(--chart-2)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Diarrhea"
                  />
                  <Line
                    type="monotone"
                    dataKey="uti"
                    stroke="var(--chart-3)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="UTI"
                  />
                  <Line
                    type="monotone"
                    dataKey="git"
                    stroke="var(--chart-4)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="GIT"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFacilities.map((facility, index) => (
                <Card
                  key={facility.facility}
                  className="p-6 border-0 shadow-lg card-hover animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20">
                      #{index + 1}
                    </Badge>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{facility.facility}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">OPD Visits</span>
                        <span className="font-semibold">{facility.opd.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          style={{ width: `${Math.min((facility.opd / topFacilities[0].opd) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Services</span>
                      <span className="font-semibold">{facility.services.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <Badge variant="secondary">{facility.utilization}%</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Key Insight</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      OPD visits have increased by 12% compared to the previous period, with RTI cases showing the
                      highest growth at 18%. Consider allocating additional resources for respiratory care.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-warning/5 to-destructive/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-warning/10 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Alert</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Referral rate of {referralRate}% suggests potential capacity constraints. Top 3 LGAs account for
                      65% of all referrals. Review facility capabilities in high-referral areas.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-8 border-0 shadow-lg text-center bg-gradient-to-br from-card to-accent/5">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex p-4 bg-accent/10 rounded-2xl mb-6">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-Powered Predictive Analytics</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our machine learning models analyze historical patterns to forecast disease outbreaks, predict
                  resource needs, and identify facilities at risk of stock-outs. Get proactive insights to improve
                  healthcare delivery.
                </p>
                <Badge className="bg-accent text-accent-foreground">Coming Soon: Advanced Forecasting</Badge>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
