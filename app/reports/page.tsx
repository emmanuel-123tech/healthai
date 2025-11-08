"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth-guard"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  CheckCircle,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DatasetSummary, generateNarrative, parseDataset, summariseDataset } from "@/lib/ai-reporting"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  sections: string[]
}

const templates: ReportTemplate[] = [
  {
    id: "executive",
    name: "Executive Summary Report",
    description: "High-level overview for policymakers and stakeholders",
    category: "Policy",
    icon: TrendingUp,
    sections: [
      "Key Performance Indicators",
      "Disease Burden Analysis",
      "Resource Utilization",
      "Policy Recommendations",
      "Budget Allocation Insights",
    ],
  },
  {
    id: "disease",
    name: "Disease Surveillance Report",
    description: "Detailed analysis of disease trends and outbreaks",
    category: "Clinical",
    icon: Activity,
    sections: [
      "Disease Incidence Trends",
      "Outbreak Alerts",
      "Geographic Distribution",
      "Seasonal Patterns",
      "Intervention Effectiveness",
    ],
  },
  {
    id: "facility",
    name: "Facility Performance Report",
    description: "Comprehensive facility operations and service delivery",
    category: "Operations",
    icon: Users,
    sections: [
      "Patient Volume Analysis",
      "Service Delivery Metrics",
      "Staff Utilization",
      "Stock Management",
      "Quality Indicators",
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly Health Review",
    description: "Comprehensive quarterly assessment for state officials",
    category: "Policy",
    icon: Calendar,
    sections: [
      "Quarter Overview",
      "Achievement vs Targets",
      "Budget Utilization",
      "Challenges & Solutions",
      "Next Quarter Planning",
    ],
  },
]

const seedDataset = `2024-07,430\n2024-08,455\n2024-09,512\n2024-10,548\n2024-11,590\n2024-12,640`

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("executive")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedLGA, setSelectedLGA] = useState("all")
  const [datasetInput, setDatasetInput] = useState(seedDataset)
  const [summary, setSummary] = useState<DatasetSummary | null>(null)
  const [narrative, setNarrative] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyseDataset = () => {
    try {
      setProcessing(true)
      setError(null)
      const parsed = parseDataset(datasetInput)
      const datasetSummary = summariseDataset(parsed)
      setSummary(datasetSummary)
      setNarrative(generateNarrative(datasetSummary))
      setTimeout(() => {
        setProcessing(false)
      }, 700)
    } catch (err) {
      setProcessing(false)
      setSummary(null)
      setNarrative([])
      setError(err instanceof Error ? err.message : "Unable to analyse dataset")
    }
  }

  const insightSeries = useMemo(() => {
    if (!summary) return []
    const combined = [...summary.points, ...summary.forecastHorizon]
    return combined.map((point) => ({
      period: point.period,
      actual: point.value,
      forecast: point.forecast ?? point.value,
    }))
  }, [summary])

  const reportMetrics = summary
    ? [
        {
          label: "Growth rate",
          value: `${summary.growthRate}%`,
          helper: "Change across series",
        },
        {
          label: "Average volume",
          value: summary.average.toLocaleString(),
          helper: "Mean across input",
        },
        {
          label: "Peak period",
          value: `${summary.peak.period} (${summary.peak.value.toLocaleString()})`,
          helper: "Highest monthly demand",
        },
        {
          label: "Trough",
          value: `${summary.trough.period} (${summary.trough.value.toLocaleString()})`,
          helper: "Lowest demand point",
        },
      ]
    : []

  const handleGenerateReport = () => {
    if (!summary) {
      setError("Analyse a dataset before generating the report.")
      return
    }
    const blob = new Blob(
      [
        `Template: ${selectedTemplate}\nPeriod: ${selectedPeriod}\nLGA: ${selectedLGA}\n`,
        `Narrative:\n${narrative.join("\n")}\n`,
      ],
      { type: "text/plain" },
    )
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ai-health-report.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AuthGuard requiredFeature="reports">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold text-white">AI Reporting Workspace</h1>
            <p className="text-slate-400 text-lg max-w-3xl">
              Upload facility datasets, run AI-led analytics, and export policy-ready narratives for Ondo State stakeholders.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card className="bg-slate-900/60 border-slate-800">
              <div className="p-6 space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-emerald-400" /> Dataset ingestion
                    </h2>
                    <p className="text-sm text-slate-400">
                      Paste monthly counts or service volumes. The engine parses, scores, and projects six months forward.
                    </p>
                  </div>
                  <Button onClick={handleAnalyseDataset} disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                    {processing ? "Analysing…" : <Sparkles className="h-4 w-4 mr-2" />} {processing ? "" : "Run analytics"}
                  </Button>
                </div>

                <Textarea
                  value={datasetInput}
                  onChange={(event) => setDatasetInput(event.target.value)}
                  className="min-h-[160px] bg-slate-950 border-slate-800 text-slate-100"
                  placeholder="Paste data as YYYY-MM,value"
                />
                {error && <p className="text-sm text-red-400">{error}</p>}

                {summary && (
                  <div className="space-y-5">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={insightSeries}>
                        <defs>
                          <linearGradient id="reportActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="period" stroke="#94a3b8" />
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
                        <Area type="monotone" dataKey="actual" stroke="#22d3ee" fillOpacity={1} fill="url(#reportActual)" name="Historical" />
                        <Area type="monotone" dataKey="forecast" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.2} name="Forecast" />
                      </AreaChart>
                    </ResponsiveContainer>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {reportMetrics.map((metric) => (
                        <div key={metric.label} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-1">
                          <p className="text-xs text-slate-500 uppercase">{metric.label}</p>
                          <p className="text-2xl font-semibold text-white">{metric.value}</p>
                          <p className="text-xs text-slate-500">{metric.helper}</p>
                        </div>
                      ))}
                    </div>

                    <Card className="bg-slate-900/40 border-slate-800">
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          <FileText className="h-4 w-4 text-emerald-400" /> Narrative insight pack
                        </h3>
                        <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                          {narrative.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-900/60 border-slate-800">
                <div className="p-5 space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" /> Report builder
                  </h2>
                  <div className="space-y-3">
                    <label className="text-sm text-slate-300">Template</label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm text-slate-300">Reporting period</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Last Week</SelectItem>
                        <SelectItem value="monthly">Last Month</SelectItem>
                        <SelectItem value="quarterly">Last Quarter</SelectItem>
                        <SelectItem value="yearly">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm text-slate-300">Focus LGA</label>
                    <Input
                      value={selectedLGA}
                      onChange={(event) => setSelectedLGA(event.target.value)}
                      className="bg-slate-950 border-slate-800 text-white"
                      placeholder="e.g. Owo"
                    />
                  </div>

                  <div className="space-y-2 text-sm text-slate-400">
                    <p className="font-semibold text-slate-200">Included sections</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {templates
                        .find((template) => template.id === selectedTemplate)
                        ?.sections.map((section) => (
                          <li key={section}>{section}</li>
                        ))}
                    </ul>
                  </div>

                  <Button onClick={handleGenerateReport} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4 h-4 mr-2" /> Export narrative bundle
                  </Button>
                </div>
              </Card>

              <Card className="bg-slate-900/60 border-slate-800">
                <div className="p-5 space-y-3">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" /> Recent exports
                  </h2>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {narrative.length === 0 ? (
                      <li className="text-slate-500">Run analytics to generate export history.</li>
                    ) : (
                      narrative.map((line) => (
                        <li key={line} className="border border-slate-800 rounded-lg p-3 bg-slate-950/60">
                          {line}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
