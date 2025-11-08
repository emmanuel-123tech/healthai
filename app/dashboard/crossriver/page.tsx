"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CrossRiverEnhancedDashboard } from "@/components/crossriver-enhanced-dashboard"
import { Footer } from "@/components/footer"
import { Sparkles } from "lucide-react"
import {
  loadFacilityMonthlyAgg,
  loadLGAMonthlyAgg,
  loadStateMonthlyAgg,
  type FacilityMonthlyAgg,
  type LGAMonthlyAgg,
  type StateMonthlyAgg,
} from "@/lib/crossriver-data"

export default function CrossRiverDashboard() {
  const [facilities, setFacilities] = useState<FacilityMonthlyAgg[]>([])
  const [lgaData, setLGAData] = useState<LGAMonthlyAgg[]>([])
  const [stateData, setStateData] = useState<StateMonthlyAgg[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        console.log("[v0] Loading Cross River comprehensive data...")

        const [facilitiesData, lgasData, statesData] = await Promise.all([
          loadFacilityMonthlyAgg(),
          loadLGAMonthlyAgg(),
          loadStateMonthlyAgg(),
        ])

        console.log(
          "[v0] Loaded:",
          facilitiesData.length,
          "facilities,",
          lgasData.length,
          "LGAs,",
          statesData.length,
          "state records",
        )

        setFacilities(facilitiesData)
        setLGAData(lgasData)
        setStateData(statesData)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error loading Cross River data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="text-center">
          <div className="relative h-16 w-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-lg font-medium text-foreground">Loading Cross River State Data</p>
          <p className="text-sm text-muted-foreground mt-2">
            Analyzing {facilities.length || "..."} facilities across multiple LGAs...
          </p>
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
              Comprehensive Infrastructure Dashboard
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-balance md:text-6xl bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Cross River State Health Analytics
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Real-time infrastructure assessment across {facilities.length} Primary Health Care facilities in{" "}
            {lgaData.filter((l) => l.LGA && l.LGA !== "").length} Local Government Areas. Data-driven insights for
            strategic resource allocation and facility improvement planning.
          </p>
        </div>

        <CrossRiverEnhancedDashboard facilities={facilities} lgaData={lgaData} stateData={stateData} />
      </div>

      <Footer />
    </div>
  )
}
