export interface FacilityReadiness {
  PHC_NAME: string
  LGA: string
  STATE: string
  TOTAL_BEDS: number | string
  TOTAL_WARDS: number | string
  WELL_BUILT_STRUCTURE: string
  HAS_DILAPIDATED_BUILDING: string
  BROKEN_CEILING: string
  DAMAGED_CHAIRS: string
  LEAKING_ROOF: string
  DAMAGED_DOOR: string
  READINESS_SCORE: number
  READINESS_CATEGORY: string
}

/**
 * Calculates a facility readiness score (0-100) based on infrastructure damage indicators
 * "Yes" values for damage reduce the score proportionally
 * "Yes" for well-built structure increases the score
 */
export function calculateReadinessScore(
  wellBuilt: string,
  dilapidated: string,
  brokenCeiling: string,
  damagedChairs: string,
  leakingRoof: string,
  damagedDoor: string,
): number {
  // Start with base score
  let score = 100

  // Positive indicator
  if (wellBuilt?.toLowerCase() === "yes") {
    score += 5
  }

  // Damage indicators - each reduces score proportionally
  const damageIndicators = [
    dilapidated?.toLowerCase() === "yes" ? 15 : 0,
    brokenCeiling?.toLowerCase() === "yes" ? 12 : 0,
    damagedChairs?.toLowerCase() === "yes" ? 10 : 0,
    leakingRoof?.toLowerCase() === "yes" ? 12 : 0,
    damagedDoor?.toLowerCase() === "yes" ? 10 : 0,
  ]

  const totalDamage = damageIndicators.reduce((a, b) => a + b, 0)
  score -= totalDamage

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
}

export function getReadinessCategory(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 50) return "Fair"
  if (score >= 35) return "Poor"
  return "Critical"
}

export function getReadinessColor(score: number): string {
  if (score >= 80) return "bg-green-500"
  if (score >= 65) return "bg-blue-500"
  if (score >= 50) return "bg-yellow-500"
  if (score >= 35) return "bg-orange-500"
  return "bg-red-500"
}

export function processCrossRiverData(csvText: string): FacilityReadiness[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ""
    })

    // Parse numeric fields
    const totalBeds = row.TOTAL_BEDS === "Greater than 10" ? 15 : Number.parseInt(row.TOTAL_BEDS) || 0
    const totalWards = row.TOTAL_WARDS === "None" ? 0 : Number.parseInt(row.TOTAL_WARDS) || 0

    const readinessScore = calculateReadinessScore(
      row.WELL_BUILT_STRUCTURE,
      row.HAS_DILAPIDATED_BUILDING,
      row.BROKEN_CEILING,
      row.DAMAGED_CHAIRS,
      row.LEAKING_ROOF,
      row.DAMAGED_DOOR,
    )

    return {
      PHC_NAME: row.PHC_NAME || "",
      LGA: row.LGA || "",
      STATE: row.STATE || "Cross River State",
      TOTAL_BEDS: totalBeds,
      TOTAL_WARDS: totalWards,
      WELL_BUILT_STRUCTURE: row.WELL_BUILT_STRUCTURE,
      HAS_DILAPIDATED_BUILDING: row.HAS_DILAPIDATED_BUILDING,
      BROKEN_CEILING: row.BROKEN_CEILING,
      DAMAGED_CHAIRS: row.DAMAGED_CHAIRS,
      LEAKING_ROOF: row.LEAKING_ROOF,
      DAMAGED_DOOR: row.DAMAGED_DOOR,
      READINESS_SCORE: readinessScore,
      READINESS_CATEGORY: getReadinessCategory(readinessScore),
    }
  })
}
