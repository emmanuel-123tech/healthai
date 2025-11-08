"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Building2 } from "lucide-react"

interface FacilityPerformanceProps {
  facilityData: any[]
  selectedLGA: string
}

export function FacilityPerformance({ facilityData, selectedLGA }: FacilityPerformanceProps) {
  // Aggregate facility performance
  const facilityStats = Object.values(
    facilityData.reduce((acc: any, d) => {
      const key = `${d.LGA}-${d.NAME_OF_FACILITIES}`
      if (!acc[key]) {
        acc[key] = {
          lga: d.LGA,
          name: d.NAME_OF_FACILITIES,
          totalOPD: 0,
          totalServices: 0,
          totalReferrals: 0,
          totalDeaths: 0,
          months: 0,
        }
      }
      acc[key].totalOPD += d.OPD || 0
      acc[key].totalServices += d.TOTAL_SERVICE || 0
      acc[key].totalReferrals += d.REFERRALS || 0
      acc[key].totalDeaths += d.DEATHS || 0
      acc[key].months += 1
      return acc
    }, {}),
  )
    .filter((f: any) => selectedLGA === "all" || f.lga === selectedLGA)
    .map((f: any) => ({
      ...f,
      avgOPD: Math.round(f.totalOPD / f.months),
      avgServices: Math.round(f.totalServices / f.months),
      referralRate: f.totalOPD > 0 ? ((f.totalReferrals / f.totalOPD) * 100).toFixed(1) : 0,
      utilizationRate: f.totalOPD > 0 ? ((f.totalServices / f.totalOPD) * 100).toFixed(0) : 0,
    }))
    .sort((a: any, b: any) => b.totalOPD - a.totalOPD)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilityStats.slice(0, 12).map((facility: any, index: number) => (
          <Card
            key={`${facility.lga}-${facility.name}`}
            className="p-6 hover:shadow-lg transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-balance leading-tight">{facility.name}</h3>
                  <Badge variant="outline" className="mt-2">
                    {facility.lga}
                  </Badge>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total OPD</p>
                  <p className="text-2xl font-bold">{facility.totalOPD.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg/Month</p>
                  <p className="text-2xl font-bold">{facility.avgOPD.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Utilization Rate</span>
                  <span className="font-semibold">{facility.utilizationRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(facility.utilizationRate, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  {Number(facility.referralRate) > 5 ? (
                    <TrendingUp className="h-4 w-4 text-warning" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                  <span className="text-sm">Referral Rate: {facility.referralRate}%</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
