export interface ScenarioConfig {
  /** Rainfall and environmental vector favourability index (0-100) */
  rainfall: number
  /** Level of active vector control interventions (0-100) */
  vectorControl: number
  /** Stock availability for critical medicines and supplies (0-100) */
  drugStock: number
  /** Community engagement and awareness index (0-100) */
  communityEngagement: number
}

export interface ForecastPoint {
  month: string
  baseline: number
  scenario: number
  lower: number
  upper: number
  reproductionNumber: number
  confidence: number
}

export interface FacilityLoad {
  facility: string
  baseLoad: number
  capacity: number
  staffOnDuty: number
}

export const historicalWindow: { month: string; cases: number }[] = [
  { month: "Jul 2024", cases: 412 },
  { month: "Aug 2024", cases: 438 },
  { month: "Sep 2024", cases: 465 },
  { month: "Oct 2024", cases: 492 },
  { month: "Nov 2024", cases: 521 },
  { month: "Dec 2024", cases: 549 },
]

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function getNextMonth(currentLabel: string, step: number) {
  const [monthName, yearString] = currentLabel.split(" ")
  const monthIndex = monthNames.indexOf(monthName)
  const year = Number(yearString)
  const totalMonths = (monthIndex >= 0 ? monthIndex : 0) + step
  const nextYear = year + Math.floor(totalMonths / 12)
  const nextMonthIndex = totalMonths % 12
  return `${monthNames[nextMonthIndex]} ${nextYear}`
}

export function generateForecast(
  scenario: ScenarioConfig,
  monthsAhead = 6,
  baseSeries: { month: string; cases: number }[] = historicalWindow,
): ForecastPoint[] {
  const latest = baseSeries[baseSeries.length - 1]
  const points: ForecastPoint[] = baseSeries.map((item) => ({
    month: item.month,
    baseline: item.cases,
    scenario: item.cases,
    lower: Math.round(item.cases * 0.92),
    upper: Math.round(item.cases * 1.08),
    reproductionNumber: 1.12,
    confidence: 92,
  }))

  let previousCases = latest.cases
  let reproduction = 1.1

  for (let i = 1; i <= monthsAhead; i++) {
    const rainfallFactor = scenario.rainfall / 100
    const vectorFactor = scenario.vectorControl / 100
    const stockFactor = scenario.drugStock / 100
    const communityFactor = scenario.communityEngagement / 100

    const environmentalPressure = 0.25 + rainfallFactor * 0.45 - communityFactor * 0.1
    const mitigation = vectorFactor * 0.35 + stockFactor * 0.25
    reproduction = 1 + environmentalPressure - mitigation

    const noise = (Math.sin((points.length + i) / 2) + Math.random() * 0.2 - 0.1) * 0.05
    const nextCases = Math.max(120, Math.round(previousCases * (reproduction + noise)))
    const confidence = Math.max(70, Math.min(96, Math.round(100 - Math.abs(noise) * 80 - environmentalPressure * 12 + mitigation * 10)))

    points.push({
      month: getNextMonth(latest.month, i),
      baseline: Math.round(previousCases * 1.06),
      scenario: nextCases,
      lower: Math.round(nextCases * 0.9),
      upper: Math.round(nextCases * 1.12),
      reproductionNumber: Number(reproduction.toFixed(2)),
      confidence,
    })

    previousCases = nextCases
  }

  return points
}

export function updateForecastStream(
  existing: ForecastPoint[],
  scenario: ScenarioConfig,
): { points: ForecastPoint[]; message: string } {
  const historyLength = historicalWindow.length
  const forecastSlice = existing.slice(historyLength)
  const lastPoint = forecastSlice[forecastSlice.length - 1]
  const reference = lastPoint ?? existing[existing.length - 1]

  const rainfallFactor = scenario.rainfall / 100
  const vectorFactor = scenario.vectorControl / 100
  const stockFactor = scenario.drugStock / 100
  const communityFactor = scenario.communityEngagement / 100

  const environmentalPressure = 0.25 + rainfallFactor * 0.45 - communityFactor * 0.1
  const mitigation = vectorFactor * 0.35 + stockFactor * 0.25
  const reproduction = 1 + environmentalPressure - mitigation

  const shock = (Math.random() - 0.5) * 0.08
  const nextCases = Math.max(100, Math.round(reference.scenario * (reproduction + shock)))
  const confidence = Math.max(68, Math.min(97, Math.round(reference.confidence - shock * 25)))

  const nextPoint: ForecastPoint = {
    month: getNextMonth(reference.month, 1),
    baseline: Math.round(reference.baseline * 1.04),
    scenario: nextCases,
    lower: Math.round(nextCases * 0.9),
    upper: Math.round(nextCases * 1.1),
    reproductionNumber: Number(reproduction.toFixed(2)),
    confidence,
  }

  const updated = [...existing, nextPoint]
  const direction = nextCases > reference.scenario ? "rise" : "cooling"
  const message = `Live forecast ${direction} to ${nextCases.toLocaleString()} cases (Re=${nextPoint.reproductionNumber}).`

  return { points: updated, message }
}

export function parseScenarioDataset(input: string): { label: string; values: number[] } | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const values = trimmed
    .split(/\n|,/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value) && Number.isFinite(value))

  if (values.length === 0) {
    return null
  }

  return { label: `Custom dataset (${values.length} pts)`, values }
}

export function buildFacilityScenario(
  facilities: FacilityLoad[],
  scenario: ScenarioConfig,
  demandShock: number,
) {
  return facilities.map((facility) => {
    const mitigation = (scenario.vectorControl + scenario.communityEngagement) / 200
    const resourceBoost = scenario.drugStock / 160
    const adjustedShock = demandShock / 100
    const projectedLoad = Math.round(
      facility.baseLoad * (1 + adjustedShock + (scenario.rainfall / 200 - mitigation * 0.4 + resourceBoost * 0.3)),
    )
    const utilization = Math.round((projectedLoad / facility.capacity) * 100)
    const staffingPressure = Math.max(0, utilization - facility.staffOnDuty)

    return {
      ...facility,
      projectedLoad,
      utilization,
      staffingPressure,
    }
  })
}

export function describeScenarioImpact(point: ForecastPoint) {
  if (point.reproductionNumber >= 1.25) {
    return "Escalating transmission; mobilise surge vector control teams and expand community testing."
  }
  if (point.reproductionNumber >= 1.1) {
    return "Sustained growth; reinforce commodity stockpiles and activate rapid response protocols."
  }
  if (point.reproductionNumber >= 0.95) {
    return "Stabilising trend; maintain current interventions and monitor sentinel sites."
  }
  return "Declining caseload; plan step-down of surge resources while sustaining surveillance."
}

export const baseFacilityLoads: FacilityLoad[] = [
  { facility: "PHC IPELE", baseLoad: 1280, capacity: 1500, staffOnDuty: 92 },
  { facility: "PHC OKEDOGBON", baseLoad: 980, capacity: 1200, staffOnDuty: 74 },
  { facility: "PHC OKOJA", baseLoad: 1185, capacity: 1400, staffOnDuty: 81 },
  { facility: "PHC ISUA", baseLoad: 860, capacity: 1100, staffOnDuty: 69 },
]
