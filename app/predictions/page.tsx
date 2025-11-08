"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { TrendingUp, AlertTriangle, Users, Activity, Download } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function PredictionsPage() {
  const [selectedDisease, setSelectedDisease] = useState("malaria")
  const [selectedLGA, setSelectedLGA] = useState("OWO")

  // Disease outbreak predictions based on historical trends
  const malariaForecast = [
    { month: "Jan 2025", actual: 450, predicted: 465, confidence: 92 },
    { month: "Feb 2025", actual: null, predicted: 520, confidence: 88 },
    { month: "Mar 2025", actual: null, predicted: 580, confidence: 85 },
    { month: "Apr 2025", actual: null, predicted: 640, confidence: 82 },
    { month: "May 2025", actual: null, predicted: 710, confidence: 78 },
    { month: "Jun 2025", actual: null, predicted: 680, confidence: 75 },
  ]

  const typhoidForecast = [
    { month: "Jan 2025", actual: 89, predicted: 92, confidence: 90 },
    { month: "Feb 2025", actual: null, predicted: 105, confidence: 87 },
    { month: "Mar 2025", actual: null, predicted: 118, confidence: 84 },
    { month: "Apr 2025", actual: null, predicted: 125, confidence: 81 },
    { month: "May 2025", actual: null, predicted: 132, confidence: 78 },
    { month: "Jun 2025", actual: null, predicted: 128, confidence: 75 },
  ]

  const diarrheaForecast = [
    { month: "Jan 2025", actual: 156, predicted: 160, confidence: 91 },
    { month: "Feb 2025", actual: null, predicted: 145, confidence: 88 },
    { month: "Mar 2025", actual: null, predicted: 135, confidence: 85 },
    { month: "Apr 2025", actual: null, predicted: 128, confidence: 82 },
    { month: "May 2025", actual: null, predicted: 122, confidence: 79 },
    { month: "Jun 2025", actual: null, predicted: 118, confidence: 76 },
  ]

  const rtiForecast = [
    { month: "Jan 2025", actual: 234, predicted: 240, confidence: 89 },
    { month: "Feb 2025", actual: null, predicted: 220, confidence: 86 },
    { month: "Mar 2025", actual: null, predicted: 205, confidence: 83 },
    { month: "Apr 2025", actual: null, predicted: 195, confidence: 80 },
    { month: "May 2025", actual: null, predicted: 188, confidence: 77 },
    { month: "Jun 2025", actual: null, predicted: 182, confidence: 74 },
  ]

  const forecasts: Record<string, typeof malariaForecast> = {
    malaria: malariaForecast,
    typhoid: typhoidForecast,
    diarrhea: diarrheaForecast,
    rti: rtiForecast,
  }

  const currentForecast = forecasts[selectedDisease]

  // Patient load predictions by facility
  const facilityLoadPredictions = [
    { facility: "PHC IPELE", current: 1250, predicted: 1420, capacity: 1500, utilization: 95 },
    { facility: "PHC OKEDOGBON", current: 890, predicted: 980, capacity: 1200, utilization: 82 },
    { facility: "PHC OKOJA", current: 1100, predicted: 1280, capacity: 1400, utilization: 91 },
    { facility: "PHC ISUA", current: 750, predicted: 820, capacity: 1000, utilization: 82 },
  ]

  // Risk alerts
  const riskAlerts = [
    {
      type: "Outbreak Risk",
      disease: "Malaria",
      lga: "OWO",
      risk: "High",
      probability: 78,
      timeframe: "Next 2 months",
      recommendation: "Increase antimalarial stock by 40%. Deploy additional health workers.",
    },
    {
      type: "Capacity Alert",
      disease: "General",
      lga: "OWO",
      risk: "Medium",
      probability: 65,
      timeframe: "Next month",
      recommendation: "PHC IPELE approaching capacity. Consider patient redistribution.",
    },
    {
      type: "Seasonal Trend",
      disease: "Diarrhea",
      lga: "AKOKO N E",
      risk: "Low",
      probability: 45,
      timeframe: "Next 3 months",
      recommendation: "Declining trend expected. Maintain current ORS stock levels.",
    },
  ]

  const riskColors = {
    High: "bg-red-500/10 text-red-500 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  }

  return (
    <AuthGuard requiredFeature="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">{"Predictive Analytics Engine"}</h1>
            <p className="text-slate-400 text-lg">
              {"ML-powered disease forecasting, outbreak predictions, and resource optimization"}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-500" />
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{"Active"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{"4"}</div>
                <p className="text-sm text-slate-400">{"Disease Models"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-blue-500" />
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{"6 Months"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{"85%"}</div>
                <p className="text-sm text-slate-400">{"Avg Accuracy"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{"Alert"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{"3"}</div>
                <p className="text-sm text-slate-400">{"Risk Alerts"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-emerald-500" />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{"Forecast"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{"5,500"}</div>
                <p className="text-sm text-slate-400">{"Predicted Cases"}</p>
              </div>
            </Card>
          </div>

          {/* Disease Forecast */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">{"Disease Outbreak Forecast"}</h3>
                <div className="flex gap-4">
                  <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                    <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="malaria">{"Malaria"}</SelectItem>
                      <SelectItem value="typhoid">{"Typhoid Fever"}</SelectItem>
                      <SelectItem value="diarrhea">{"Diarrhea"}</SelectItem>
                      <SelectItem value="rti">{"RTI"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="w-4 h-4 mr-2" />
                    {"Export"}
                  </Button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={currentForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Cases" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Predicted Cases"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-3 gap-4">
                {currentForecast.slice(1, 4).map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">{item.month}</p>
                    <p className="text-2xl font-bold text-white mb-1">{item.predicted}</p>
                    <p className="text-xs text-slate-500">{"Confidence: " + item.confidence + "%"}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Facility Load Predictions */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">{"Facility Patient Load Forecast"}</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facilityLoadPredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="facility" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" fill="#10b981" name="Current Load" />
                  <Bar dataKey="predicted" fill="#f59e0b" name="Predicted Load" />
                  <Bar dataKey="capacity" fill="#6366f1" name="Capacity" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {facilityLoadPredictions.map((facility, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-white mb-2">{facility.facility}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">
                        {"Utilization: "}
                        <span className="text-white font-semibold">{facility.utilization + "%"}</span>
                      </p>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            facility.utilization > 90
                              ? "bg-red-500"
                              : facility.utilization > 75
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                          style={{ width: `${facility.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Risk Alerts */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">{"Predictive Risk Alerts"}</h3>
            {riskAlerts.map((alert, idx) => (
              <Card key={idx} className={`border backdrop-blur ${riskColors[alert.risk as keyof typeof riskColors]}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-slate-900/50 text-white border-slate-700">{alert.type}</Badge>
                        <Badge className={riskColors[alert.risk as keyof typeof riskColors]}>
                          {alert.risk + " Risk"}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-1">{alert.disease + " - " + alert.lga}</h4>
                      <p className="text-sm text-slate-400">
                        {"Probability: " + alert.probability + "% • " + alert.timeframe}
                      </p>
                    </div>
                    <AlertTriangle className="w-6 h-6" />
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-300 mb-1">{"Recommendation:"}</p>
                    <p className="text-sm text-slate-400">{alert.recommendation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
