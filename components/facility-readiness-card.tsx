import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"
import { getReadinessColor } from "@/lib/facility-readiness"

interface FacilityReadinessCardProps {
  name: string
  lga: string
  beds: number | string
  wards: number | string
  score: number
  category: string
  conditions: {
    wellBuilt: string
    dilapidated: string
    brokenCeiling: string
    damagedChairs: string
    leakingRoof: string
    damagedDoor: string
  }
}

export function FacilityReadinessCard({
  name,
  lga,
  beds,
  wards,
  score,
  category,
  conditions,
}: FacilityReadinessCardProps) {
  const colorClass = getReadinessColor(score)
  const isExcellent = score >= 80
  const isPoor = score < 50

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2">{name}</CardTitle>
            <CardDescription className="mt-1">{lga}</CardDescription>
          </div>
          <Badge variant={isExcellent ? "default" : isPoor ? "destructive" : "secondary"} className="whitespace-nowrap">
            {category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Readiness Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Facility Readiness</span>
            <span className="text-2xl font-bold text-foreground">{score}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className={`h-full ${colorClass} rounded-full transition-all`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Capacity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Beds</p>
              <p className="text-sm font-semibold">{beds}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Wards</p>
              <p className="text-sm font-semibold">{wards}</p>
            </div>
          </div>
        </div>

        {/* Infrastructure Conditions */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-medium text-foreground mb-3">Infrastructure Status</p>
          <div className="space-y-2">
            {[
              { label: "Well-Built Structure", value: conditions.wellBuilt, positive: true },
              { label: "Dilapidated Building", value: conditions.dilapidated, positive: false },
              { label: "Broken Ceiling", value: conditions.brokenCeiling, positive: false },
              { label: "Damaged Chairs", value: conditions.damagedChairs, positive: false },
              { label: "Leaking Roof", value: conditions.leakingRoof, positive: false },
              { label: "Damaged Door", value: conditions.damagedDoor, positive: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-1">
                  {item.value?.toLowerCase() === "yes" ? (
                    <>
                      <div className={`h-2 w-2 rounded-full ${item.positive ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="font-medium">Yes</span>
                    </>
                  ) : (
                    <>
                      <div className={`h-2 w-2 rounded-full ${item.positive ? "bg-red-500" : "bg-green-500"}`} />
                      <span className="font-medium">No</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
