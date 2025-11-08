// Cross River State data utilities for handling multiple aggregation levels

export interface FacilityRecord {
  PHC_NAME: string
  LGA: string
  STATE: string
  TOTAL_BEDS: number | null
  TOTAL_WARDS: number | null
  WELL_BUILT_STRUCTURE: string
  HAS_DILAPIDATED_BUILDING: string
  BROKEN_CEILING: string
  DAMAGED_CHAIRS: string
  LEAKING_ROOF: string
  DAMAGED_DOOR: string
  MONTH: string
  MONTH_NUM: number
  YEAR: number
  YEAR_MONTH: string
}

export interface FacilityMonthlyAgg {
  PHC_NAME: string
  LGA: string
  STATE: string
  READINESS_SCORE: number
  HAS_DAMAGE: string
  DAMAGED_ITEMS_COUNT: number
  TOTAL_BEDS: number | null
  TOTAL_WARDS: number | null
  MONTH: string
  YEAR: number
  YEAR_MONTH: string
}

export interface LGAMonthlyAgg {
  STATE: string
  LGA: string
  TOTAL_FACILITIES: number
  AVG_BEDS: number | null
  AVG_WARDS: number | null
  AVG_READINESS: number
  FACILITIES_WITH_DAMAGES: number
  MONTH: string
  YEAR: number
  YEAR_MONTH: string
}

export interface StateMonthlyAgg {
  STATE: string
  TOTAL_LGAS: number
  TOTAL_FACILITIES: number
  AVG_BEDS: number | null
  AVG_WARDS: number | null
  AVG_READINESS: number
  DAMAGED_FACILITIES: number
  MONTH: string
  YEAR: number
  YEAR_MONTH: string
}

// Calculate readiness score based on damage indicators
export function calculateReadinessScore(facility: Partial<FacilityRecord>): number {
  let score = 100

  // Deduct points for structural issues
  if (facility.WELL_BUILT_STRUCTURE === "No") score -= 20
  if (facility.HAS_DILAPIDATED_BUILDING === "Yes") score -= 15
  if (facility.BROKEN_CEILING === "Yes") score -= 15
  if (facility.LEAKING_ROOF === "Yes") score -= 15
  if (facility.DAMAGED_CHAIRS === "Yes") score -= 10
  if (facility.DAMAGED_DOOR === "Yes") score -= 10

  return Math.max(0, score)
}

// Categorize readiness level
export function categorizeReadiness(score: number): {
  category: string
  color: string
  description: string
} {
  if (score >= 90) {
    return {
      category: "Excellent",
      color: "text-green-600",
      description: "Fully operational with minimal issues",
    }
  } else if (score >= 75) {
    return {
      category: "Good",
      color: "text-blue-600",
      description: "Operational with minor repairs needed",
    }
  } else if (score >= 60) {
    return {
      category: "Fair",
      color: "text-yellow-600",
      description: "Needs attention and repairs",
    }
  } else if (score >= 40) {
    return {
      category: "Poor",
      color: "text-orange-600",
      description: "Requires significant repairs",
    }
  } else {
    return {
      category: "Critical",
      color: "text-red-600",
      description: "Urgent intervention required",
    }
  }
}

// Parse CSV helper
export function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n")
  return lines.map((line) => {
    // Handle commas within quotes
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  })
}

// Load facility master records
export async function loadFacilityRecords(): Promise<FacilityRecord[]> {
  try {
    const response = await fetch("/crossriver-master-records.csv")
    const csvText = await response.text()
    const rows = parseCSV(csvText)
    const headers = rows[0]

    return rows
      .slice(1)
      .map((row) => ({
        PHC_NAME: row[0] || "",
        LGA: row[1] || "",
        STATE: row[2] || "",
        TOTAL_BEDS: row[3] ? (isNaN(Number.parseFloat(row[3])) ? null : Number.parseFloat(row[3])) : null,
        TOTAL_WARDS: row[4] ? (isNaN(Number.parseFloat(row[4])) ? null : Number.parseFloat(row[4])) : null,
        WELL_BUILT_STRUCTURE: row[5] || "",
        HAS_DILAPIDATED_BUILDING: row[6] || "",
        BROKEN_CEILING: row[7] || "",
        DAMAGED_CHAIRS: row[8] || "",
        LEAKING_ROOF: row[9] || "",
        DAMAGED_DOOR: row[10] || "",
        MONTH: row[11] || "",
        MONTH_NUM: Number.parseInt(row[12]) || 1,
        YEAR: Number.parseInt(row[13]) || 2025,
        YEAR_MONTH: row[14] || "",
      }))
      .filter((f) => f.PHC_NAME && f.LGA && f.STATE)
  } catch (error) {
    console.error("[v0] Error loading facility records:", error)
    return []
  }
}

// Load facility monthly aggregations
export async function loadFacilityMonthlyAgg(): Promise<FacilityMonthlyAgg[]> {
  try {
    const response = await fetch("/crossriver-facility-agg.csv")
    const csvText = await response.text()
    const rows = parseCSV(csvText)

    return rows
      .slice(1)
      .map((row) => ({
        PHC_NAME: row[0] || "",
        LGA: row[1] || "",
        STATE: row[2] || "",
        READINESS_SCORE: Number.parseFloat(row[15]) || 0,
        HAS_DAMAGE: row[16] || "",
        DAMAGED_ITEMS_COUNT: row[17] ? Number.parseInt(row[17]) : 0,
        TOTAL_BEDS: row[3] ? (isNaN(Number.parseFloat(row[3])) ? null : Number.parseFloat(row[3])) : null,
        TOTAL_WARDS: row[4] ? (isNaN(Number.parseFloat(row[4])) ? null : Number.parseFloat(row[4])) : null,
        MONTH: row[11] || "",
        YEAR: Number.parseInt(row[13]) || 2025,
        YEAR_MONTH: row[14] || "",
      }))
      .filter((f) => f.PHC_NAME && f.LGA)
  } catch (error) {
    console.error("[v0] Error loading facility monthly aggregations:", error)
    return []
  }
}

// Load LGA monthly aggregations
export async function loadLGAMonthlyAgg(): Promise<LGAMonthlyAgg[]> {
  try {
    const response = await fetch("/crossriver-lga-agg.csv")
    const csvText = await response.text()
    const rows = parseCSV(csvText)

    return rows
      .slice(1)
      .map((row) => ({
        STATE: row[0] || "",
        LGA: row[1] || "",
        TOTAL_FACILITIES: Number.parseInt(row[2]) || 0,
        AVG_BEDS: row[3] ? (isNaN(Number.parseFloat(row[3])) ? null : Number.parseFloat(row[3])) : null,
        AVG_WARDS: row[4] ? (isNaN(Number.parseFloat(row[4])) ? null : Number.parseFloat(row[4])) : null,
        AVG_READINESS: Number.parseFloat(row[5]) || 0,
        FACILITIES_WITH_DAMAGES: Number.parseInt(row[6]) || 0,
        MONTH: row[7] || "",
        YEAR: Number.parseInt(row[8]) || 2025,
        YEAR_MONTH: row[9] || "",
      }))
      .filter((l) => l.LGA && l.TOTAL_FACILITIES > 0)
  } catch (error) {
    console.error("[v0] Error loading LGA aggregations:", error)
    return []
  }
}

// Load state monthly aggregations
export async function loadStateMonthlyAgg(): Promise<StateMonthlyAgg[]> {
  try {
    const response = await fetch("/crossriver-state-agg.csv")
    const csvText = await response.text()
    const rows = parseCSV(csvText)

    return rows
      .slice(1)
      .map((row) => ({
        STATE: row[0] || "",
        TOTAL_LGAS: Number.parseInt(row[1]) || 0,
        TOTAL_FACILITIES: Number.parseInt(row[2]) || 0,
        AVG_BEDS: row[3] ? (isNaN(Number.parseFloat(row[3])) ? null : Number.parseFloat(row[3])) : null,
        AVG_WARDS: row[4] ? (isNaN(Number.parseFloat(row[4])) ? null : Number.parseFloat(row[4])) : null,
        AVG_READINESS: Number.parseFloat(row[5]) || 0,
        DAMAGED_FACILITIES: Number.parseInt(row[6]) || 0,
        MONTH: row[7] || "",
        YEAR: Number.parseInt(row[8]) || 2025,
        YEAR_MONTH: row[9] || "",
      }))
      .filter((s) => s.STATE && s.TOTAL_FACILITIES > 0)
  } catch (error) {
    console.error("[v0] Error loading state aggregations:", error)
    return []
  }
}
