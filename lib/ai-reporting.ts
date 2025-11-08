export interface DatasetPoint {
  period: string
  value: number
  forecast?: number
}

export interface DatasetSummary {
  points: DatasetPoint[]
  growthRate: number
  average: number
  peak: { period: string; value: number }
  trough: { period: string; value: number }
  forecastHorizon: DatasetPoint[]
}

export function parseDataset(input: string): DatasetPoint[] {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const points: DatasetPoint[] = []

  lines.forEach((line) => {
    const [period, valueString] = line.split(/,|\t|;/).map((segment) => segment.trim())
    const value = Number(valueString)
    if (!period || Number.isNaN(value)) return
    points.push({ period, value })
  })

  if (points.length === 0) {
    throw new Error("No valid rows detected. Provide data as '2024-01,1234'.")
  }

  return points
}

export function buildForecast(series: DatasetPoint[], monthsAhead = 6): DatasetPoint[] {
  if (series.length === 0) return []

  const lastPoint = series[series.length - 1]
  const monthlyChanges = series.slice(1).map((point, index) => {
    const prev = series[index]
    return prev.value === 0 ? 0 : (point.value - prev.value) / prev.value
  })
  const avgChange = monthlyChanges.length
    ? monthlyChanges.reduce((total, change) => total + change, 0) / monthlyChanges.length
    : 0.04

  const results: DatasetPoint[] = []
  let previousValue = lastPoint.value

  for (let i = 1; i <= monthsAhead; i++) {
    const projectedValue = Math.round(previousValue * (1 + avgChange * 0.9 + 0.02))
    results.push({
      period: addMonth(lastPoint.period, i),
      value: previousValue,
      forecast: projectedValue,
    })
    previousValue = projectedValue
  }

  return results
}

function addMonth(period: string, offset: number) {
  const [yearString, monthString] = period.split("-")
  const year = Number(yearString)
  const month = Number(monthString) - 1
  if (Number.isNaN(year) || Number.isNaN(month)) {
    return `M${offset}`
  }

  const total = year * 12 + month + offset
  const newYear = Math.floor(total / 12)
  const newMonth = (total % 12) + 1
  return `${newYear}-${String(newMonth).padStart(2, "0")}`
}

export function summariseDataset(points: DatasetPoint[]): DatasetSummary {
  if (points.length === 0) {
    throw new Error("Dataset empty")
  }

  const average = points.reduce((sum, point) => sum + point.value, 0) / points.length
  const peak = points.reduce((max, point) => (point.value > max.value ? point : max), points[0])
  const trough = points.reduce((min, point) => (point.value < min.value ? point : min), points[0])

  const forecastHorizon = buildForecast(points)
  const growthRate = points.length > 1
    ? ((points[points.length - 1].value - points[0].value) / points[0].value) * 100
    : 0

  return {
    points,
    average: Math.round(average),
    peak,
    trough,
    growthRate: Math.round(growthRate * 10) / 10,
    forecastHorizon,
  }
}

export function generateNarrative(summary: DatasetSummary, topic = "Health service utilisation") {
  const direction = summary.growthRate > 10 ? "accelerating" : summary.growthRate > 0 ? "rising" : "cooling"
  const emphasis = summary.peak.value > summary.average * 1.2 ? "spike" : "steady trend"

  return [
    `${topic} is ${direction} with a ${summary.growthRate}% change across the reporting window and a mean volume of ${summary.average.toLocaleString()} cases.`,
    `Peak activity was observed in ${summary.peak.period} with ${summary.peak.value.toLocaleString()} cases while the trough in ${summary.trough.period} recorded ${summary.trough.value.toLocaleString()}.`,
    `Projected demand could reach ${summary.forecastHorizon[summary.forecastHorizon.length - 1]?.forecast?.toLocaleString()} cases in ${summary.forecastHorizon[summary.forecastHorizon.length - 1]?.period} if current dynamics persist, signalling the need for proactive resource planning.`,
    `Operational note: ${emphasis === "spike" ? "deploy surge staff" : "maintain current staffing"} and align commodity distribution with observed seasonal patterns.`,
  ]
}
