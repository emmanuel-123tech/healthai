"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CrossRiverReadinessDashboard } from "@/components/crossriver-readiness-dashboard"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Building2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import type { FacilityReadiness } from "@/lib/facility-readiness"

export default function CrossRiverDemo() {
  const [facilities, setFacilities] = useState<FacilityReadiness[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        console.log("[v0] Loading Cross River demo data...")
        const response = await fetch("/crossriver_facility_readiness.csv")
        const csvText = await response.text()

        const lines = csvText.trim().split("\n")
        const parsedFacilities: FacilityReadiness[] = lines.slice(1).map((line) => {
          const values = line.split(",")
          return {
            PHC_NAME: values[0] || "",
            LGA: values[1] || "",
            STATE: values[2] || "Cross River State",
            TOTAL_BEDS:
              values[3] === "Greater than 10" ? 15 : isNaN(Number.parseInt(values[3])) ? 0 : Number.parseInt(values[3]),
            TOTAL_WARDS: values[4] === "None" ? 0 : isNaN(Number.parseInt(values[4])) ? 0 : Number.parseInt(values[4]),
            WELL_BUILT_STRUCTURE: values[5] || "",
            HAS_DILAPIDATED_BUILDING: values[6] || "",
            BROKEN_CEILING: values[7] || "",
            DAMAGED_CHAIRS: values[8] || "",
            LEAKING_ROOF: values[9] || "",
            DAMAGED_DOOR: values[10] || "",
            READINESS_SCORE: Number.parseInt(values[11]) || 0,
            READINESS_CATEGORY: values[12] || "",
          }
        })

        const validFacilities = parsedFacilities.filter((f) => f.PHC_NAME && f.LGA && f.STATE === "Cross River State")
        console.log("[v0] Loaded Cross River demo: " + validFacilities.length + " facilities")
        setFacilities(validFacilities)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error loading Cross River demo:", error)
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
          <p className="text-lg font-medium text-foreground">Loading Cross River Demo</p>
          <p className="text-sm text-muted-foreground mt-2">
            Analyzing infrastructure readiness across {facilities.length} facilities...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20">
              <Building2 className="h-3 w-3 mr-1" />
              Cross River State Infrastructure Assessment
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-balance md:text-6xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Facility Infrastructure Readiness
          </h1>
          <p className="mt-3 text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Comprehensive assessment of {facilities.length} Primary Health Care facilities across Cross River State's 18
            Local Government Areas. Each facility is evaluated based on infrastructure condition and resource
            availability to determine operational readiness.
          </p>

          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900 dark:text-orange-400">Infrastructure Focus</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This assessment prioritizes physical infrastructure conditions like building structure, damaged
                  equipment, and facility capacity to determine readiness for service delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link href="/login?demo=crossriver">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Access Full Dashboard
                <Building2 className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>

        <CrossRiverReadinessDashboard facilities={facilities} />
      </div>

      <Footer />
    </div>
  )
}
