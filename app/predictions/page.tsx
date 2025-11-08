"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Activity,
  Download,
  Sparkles,
  Clock4,
  LineChart as LineChartIcon,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import {
  baseFacilityLoads,
  buildFacilityScenario,
  describeScenarioImpact,
  generateForecast,
  historicalWindow,
  parseScenarioDataset,
  ScenarioConfig,
  updateForecastStream,
} from "@/lib/ai-forecasting"

const diseaseLabels: Record<string, string> = {
  malaria: "Malaria",
  typhoid: "Typhoid Fever",
  diarrhea: "Acute Diarrhea",
  rti: "Respiratory Tract Infection",
}

const monthSequence = [
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

function advanceMonth(label: string, step = 1) {
  const [monthName, yearString] = label.split(" ")
  const monthIndex = monthSequence.indexOf(monthName)
  const year = Number(yearString)
  const totalMonths = (monthIndex >= 0 ? monthIndex : 0) + step
  const nextYear = year + Math.floor(totalMonths / 12)
  const nextMonthIndex = totalMonths % 12
  return `${monthSequence[nextMonthIndex]} ${nextYear}`
}

export default function PredictionsPage() {
  const [selectedDisease, setSelectedDisease] = useState<keyof typeof diseaseLabels>("malaria")
  const [scenarioConfig, setScenarioConfig] = useState<ScenarioConfig>({
    rainfall: 48,
    vectorControl: 62,
    drugStock: 58,
    communityEngagement: 54,
  })
  const [demandShock, setDemandShock] = useState(12)
  const [liveForecast, setLiveForecast] = useState(() => generateForecast(scenarioConfig))
  const [streamLog, setStreamLog] = useState<string[]>([])
  const [customData, setCustomData] = useState("")
  const [customSeries, setCustomSeries] = useState<number[] | null>(null)
  const [simulationError, setSimulationError] = useState<string | null>(null)

  useEffect(() => {
    setLiveForecast(generateForecast(scenarioConfig))
  }, [scenarioConfig])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveForecast((prev) => {
        const { points, message } = updateForecastStream(prev, scenarioConfig)
        setStreamLog((logs) => [message, ...logs.slice(0, 4)])
        return points
      })
    }, 6000)

    return () => clearInterval(interval)
  }, [scenarioConfig])

  const currentDiseaseSeries = useMemo(() => {
    const offset = Object.keys(diseaseLabels).indexOf(selectedDisease)
    return liveForecast.map((point, index) => ({
      ...point,
      scenario: Math.max(120, Math.round(point.scenario * (1 + (offset * 0.02 * Math.sin(index / 2))))),
    }))
  }, [liveForecast, selectedDisease])

  const facilityScenario = useMemo(
    () => buildFacilityScenario(baseFacilityLoads, scenarioConfig, demandShock),
    [demandShock, scenarioConfig],
  )

  const selectedFuturePoint = currentDiseaseSeries[currentDiseaseSeries.length - 1]

  const handleScenarioChange = (key: keyof ScenarioConfig, value: number) => {
    setScenarioConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleCustomSimulation = () => {
    try {
      const parsed = parseScenarioDataset(customData)
      if (!parsed) {
        setSimulationError("Provide numeric values separated by commas or new lines.")
        setCustomSeries(null)
        return
      }
      setCustomSeries(parsed.values)
      setSimulationError(null)
    } catch (error) {
      setSimulationError(error instanceof Error ? error.message : "Unable to parse dataset")
      setCustomSeries(null)
    }
  }

  const simulatedChart = useMemo(() => {
    if (!customSeries || customSeries.length === 0) return []
    const extendedHistory = [...historicalWindow]
    let cursor = extendedHistory[extendedHistory.length - 1]?.month ?? "Jan 2024"
    customSeries.forEach((value) => {
      cursor = advanceMonth(cursor)
      extendedHistory.push({ month: cursor, cases: value })
    })
    const windowedHistory = extendedHistory.slice(-Math.min(extendedHistory.length, 10))
    const preview = generateForecast(scenarioConfig, 4, windowedHistory)
    return preview.map((point, index) => ({
      ...point,
      custom: windowedHistory[index]?.cases ?? null,
    }))
  }, [customSeries, scenarioConfig])

  const severityBadge = selectedFuturePoint.reproductionNumber >= 1.2
    ? { label: "High Transmission", color: "bg-red-500/10 text-red-400 border-red-500/30" }
    : selectedFuturePoint.reproductionNumber >= 1.05
      ? { label: "Sustained Growth", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" }
      : { label: "Stable", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" }

  return (
    <AuthGuard requiredFeature="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold text-white">Predictive Intelligence Control Room</h1>
            <p className="text-slate-400 text-lg max-w-3xl">
              Live AI forecasting stream that fuses weather patterns, commodity readiness, and behavioural signals to keep facility teams ahead of outbreaks.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30">
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-7 h-7 text-purple-400" />
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/40">Streaming</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{liveForecast.length}</p>
                <p className="text-xs uppercase tracking-wide text-purple-200/70">Forecast horizon (months)</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30">
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Activity className="w-7 h-7 text-emerald-400" />
                  <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/40">Re Index</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{selectedFuturePoint.reproductionNumber}</p>
                <p className="text-xs uppercase tracking-wide text-emerald-200/70">Transmission signal</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <Users className="w-7 h-7 text-amber-400" />
                  <Badge className="bg-amber-500/20 text-amber-200 border-amber-500/40">Capacity</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{facilityScenario[0].projectedLoad.toLocaleString()}</p>
                <p className="text-xs uppercase tracking-wide text-amber-200/70">Projected peak facility load</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-sky-500/10 to-sky-600/5 border-sky-500/30">
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <AlertTriangle className="w-7 h-7 text-sky-400" />
                  <Badge className={`border ${severityBadge.color}`}>{severityBadge.label}</Badge>
                </div>
                <p className="text-3xl font-bold text-white">{selectedFuturePoint.scenario.toLocaleString()}</p>
                <p className="text-xs uppercase tracking-wide text-sky-200/70">Cases projected (6m)</p>
              </div>
            </Card>
          </section>

          <Card className="bg-slate-900/60 border-slate-800">
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Real-time outbreak forecasting</h2>
                  <p className="text-sm text-slate-400">
                    Model adapts to environmental, commodity, and behavioural levers. Adjust the sliders to stress-test intervention coverage and watch the projections respond in real time.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Select value={selectedDisease} onValueChange={(value: keyof typeof diseaseLabels) => setSelectedDisease(value)}>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select disease" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(diseaseLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-slate-700 text-slate-200" onClick={() => setLiveForecast(generateForecast(scenarioConfig))}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={currentDiseaseSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="#22d3ee" strokeWidth={2} name="Baseline" />
                  <Line type="monotone" dataKey="scenario" stroke="#fbbf24" strokeWidth={3} name="Scenario" />
                  <Line type="monotone" dataKey="lower" stroke="#f87171" strokeWidth={1} strokeDasharray="6 4" name="Lower bound" />
                  <Line type="monotone" dataKey="upper" stroke="#34d399" strokeWidth={1} strokeDasharray="6 4" name="Upper bound" />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid gap-4 lg:grid-cols-4">
                {(
                  [
                    ["rainfall", "Rainfall outlook"],
                    ["vectorControl", "Vector control coverage"],
                    ["drugStock", "Essential drug availability"],
                    ["communityEngagement", "Community mobilisation"],
                  ] as Array<[keyof ScenarioConfig, string]>
                ).map(([key, label]) => (
                  <div key={key} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{label}</span>
                      <span className="text-emerald-400 font-semibold">{scenarioConfig[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={scenarioConfig[key]}
                      onChange={(event) => handleScenarioChange(key, Number(event.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="bg-slate-900/40 border-slate-800">
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Clock4 className="h-4 w-4 text-slate-400" /> Live forecast feed
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300 max-h-40 overflow-y-auto">
                      {streamLog.length === 0 ? (
                        <li className="text-slate-500">Streaming updates initialise after a few seconds…</li>
                      ) : (
                        streamLog.map((entry, index) => (
                          <li key={index} className="border border-slate-800 rounded-lg p-2 bg-slate-900/60">
                            {entry}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </Card>
                <Card className="bg-slate-900/40 border-slate-800">
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4 text-slate-400" /> AI interpretation
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {describeScenarioImpact(selectedFuturePoint)} Confidence remains {selectedFuturePoint.confidence}% with bounds between {selectedFuturePoint.lower.toLocaleString()} and {selectedFuturePoint.upper.toLocaleString()} cases.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Facility load scenario lab</h2>
                  <p className="text-sm text-slate-400">
                    Stress test staffing coverage against forecast surges. Apply a demand shock to see projected utilisation and staffing pressure.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-slate-300">Demand shock</label>
                  <Input
                    type="number"
                    min={-30}
                    max={60}
                    value={demandShock}
                    onChange={(event) => setDemandShock(Number(event.target.value))}
                    className="w-24 bg-slate-800 border-slate-700 text-white"
                  />
                  <span className="text-sm text-emerald-400">{demandShock}%</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={facilityScenario}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="facility" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 8,
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="projectedLoad" stackId="a" fill="#22d3ee" name="Projected load" />
                  <Bar dataKey="capacity" stackId="b" fill="#fbbf24" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {facilityScenario.map((facility) => (
                  <div key={facility.facility} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{facility.facility}</p>
                      <Badge className="bg-slate-800 text-slate-300 border-slate-700">{facility.utilization}% utilised</Badge>
                    </div>
                    <p className="text-xs text-slate-400">
                      Staffing pressure +{facility.staffingPressure} points. Target surge roster and redistribute referrals.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="bg-slate-900/60 border-slate-800">
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">What-if dataset simulations</h2>
                  <p className="text-sm text-slate-400">
                    Paste monthly case counts or admissions data to generate a blended baseline vs. forecast curve. The AI forecaster extends your series six months forward with confidence bounds.
                  </p>
                </div>
                <Button onClick={handleCustomSimulation} className="bg-emerald-600 hover:bg-emerald-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Run simulation
                </Button>
              </div>

              <Textarea
                value={customData}
                onChange={(event) => setCustomData(event.target.value)}
                placeholder={`Paste values like\n2024-07,430\n2024-08,455\n2024-09,510`}
                className="min-h-[120px] bg-slate-950 border-slate-800 text-slate-100"
              />
              {simulationError && <p className="text-sm text-red-400">{simulationError}</p>}

              {simulatedChart.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-2">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={simulatedChart}>
                      <defs>
                        <linearGradient id="colorCustom" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="custom" stroke="#22d3ee" fillOpacity={1} fill="url(#colorCustom)" name="Submitted" />
                      <Area type="monotone" dataKey="scenario" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.2} name="Forecast" />
                    </AreaChart>
                  </ResponsiveContainer>

                  <div className="space-y-4">
                    <Card className="bg-slate-900/40 border-slate-800">
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white">Automated insight</h3>
                        <p className="text-sm text-slate-300">
                          Latest projection estimates {simulatedChart[simulatedChart.length - 1].scenario.toLocaleString()} cases with {simulatedChart[simulatedChart.length - 1].confidence}% confidence. Maintain surge plan readiness and validate inventory every 72 hours.
                        </p>
                      </div>
                    </Card>
                    <Card className="bg-slate-900/40 border-slate-800">
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white">Download scenario</h3>
                        <Button className="bg-slate-800 hover:bg-slate-700 w-full" onClick={() => {
                          const csv = simulatedChart
                            .map((row) => `${row.month},${row.scenario}`)
                            .join("\n")
                          const blob = new Blob([`month,cases\n${csv}`], { type: "text/csv" })
                          const url = URL.createObjectURL(blob)
                          const link = document.createElement("a")
                          link.href = url
                          link.download = "forecast-scenario.csv"
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          URL.revokeObjectURL(url)
                        }}>
                          <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
