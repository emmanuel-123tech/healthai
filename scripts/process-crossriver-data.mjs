import fs from "fs"

function calculateReadinessScore(
  wellBuilt,
  dilapidated,
  brokenCeiling,
  damagedChairs,
  leakingRoof,
  damagedDoor,
) {
  let score = 100

  if (wellBuilt?.toLowerCase() === "yes") {
    score += 5
  }

  const damageIndicators = [
    dilapidated?.toLowerCase() === "yes" ? 15 : 0,
    brokenCeiling?.toLowerCase() === "yes" ? 12 : 0,
    damagedChairs?.toLowerCase() === "yes" ? 10 : 0,
    leakingRoof?.toLowerCase() === "yes" ? 12 : 0,
    damagedDoor?.toLowerCase() === "yes" ? 10 : 0,
  ]

  const totalDamage = damageIndicators.reduce((a, b) => a + b, 0)
  score -= totalDamage

  return Math.max(0, Math.min(100, score))
}

function getReadinessCategory(score) {
  if (score >= 80) return "Excellent"
  if (score >= 65) return "Good"
  if (score >= 50) return "Fair"
  if (score >= 35) return "Poor"
  return "Critical"
}

// Read the raw CSV
const rawCsv = fs.readFileSync("user_read_only_context/text_attachments/CrossRiver_Facility_Condition_Master-xnnaL.csv", "utf-8")

const lines = rawCsv.trim().split("\n")
const headers = lines[0].split(",").map((h) => h.trim())

// Add new columns for readiness score
const outputHeaders = [...headers, "READINESS_SCORE", "READINESS_CATEGORY"]

// Process data rows
const processed = []
for (let i = 1; i < lines.length; i++) {
  const line = lines[i]
  if (!line.trim() || line.includes("Name of Primary Health Center")) continue

  const values = line.split(",").map((v) => v.trim())

  // Skip duplicate header rows
  if (values[0]?.includes("Name of Primary")) continue

  const row = {}
  headers.forEach((header, index) => {
    row[header] = values[index] || ""
  })

  // Skip empty rows
  if (!row.PHC_NAME) continue

  const readinessScore = calculateReadinessScore(
    row.WELL_BUILT_STRUCTURE,
    row.HAS_DILAPIDATED_BUILDING,
    row.BROKEN_CEILING,
    row.DAMAGED_CHAIRS,
    row.LEAKING_ROOF,
    row.DAMAGED_DOOR,
  )

  const readinessCategory = getReadinessCategory(readinessScore)

  processed.push({
    ...row,
    READINESS_SCORE: readinessScore,
    READINESS_CATEGORY: readinessCategory,
  })
}

// Generate CSV output
let output = outputHeaders.join(",") + "\n"
processed.forEach((row) => {
  const values = outputHeaders.map((h) => {
    const val = row[h] ?? ""
    return typeof val === "string" && val.includes(",") ? `"${val}"` : val
  })
  output += values.join(",") + "\n"
})

fs.writeFileSync("public/crossriver_facility_readiness.csv", output)
console.log(`Processed ${processed.length} facilities`)
console.log("Output written to public/crossriver_facility_readiness.csv")
