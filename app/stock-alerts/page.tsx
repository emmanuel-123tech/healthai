"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { AlertTriangle, Package, AlertCircle, CheckCircle, Download } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface StockAlert {
  id: string
  facility: string
  lga: string
  item: string
  currentStock: number
  avgMonthlyUsage: number
  daysRemaining: number
  severity: "critical" | "warning" | "normal"
  predictedStockout: string
  recommendation: string
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLGA, setSelectedLGA] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  useEffect(() => {
    // Simulate loading stock alerts based on service volume trends
    const mockAlerts: StockAlert[] = [
      {
        id: "1",
        facility: "PHC IPELE",
        lga: "OWO",
        item: "Artemether-Lumefantrine (Malaria Treatment)",
        currentStock: 45,
        avgMonthlyUsage: 106,
        daysRemaining: 13,
        severity: "critical",
        predictedStockout: "2025-01-28",
        recommendation: "Urgent restock needed. Order 300 units immediately.",
      },
      {
        id: "2",
        facility: "PHC OKEDOGBON",
        lga: "OWO",
        item: "Oral Rehydration Salts (ORS)",
        currentStock: 28,
        avgMonthlyUsage: 9,
        daysRemaining: 93,
        severity: "normal",
        predictedStockout: "2025-04-18",
        recommendation: "Stock levels adequate. Monitor monthly.",
      },
      {
        id: "3",
        facility: "PHC OKOJA",
        lga: "AKOKO N E",
        item: "Amoxicillin (RTI Treatment)",
        currentStock: 67,
        avgMonthlyUsage: 29,
        daysRemaining: 69,
        severity: "normal",
        predictedStockout: "2025-03-25",
        recommendation: "Stock levels adequate. Schedule routine restock.",
      },
      {
        id: "4",
        facility: "PHC IPELE",
        lga: "OWO",
        item: "Paracetamol Tablets",
        currentStock: 120,
        avgMonthlyUsage: 197,
        daysRemaining: 18,
        severity: "warning",
        predictedStockout: "2025-02-02",
        recommendation: "Restock within 2 weeks. Order 500 units.",
      },
      {
        id: "5",
        facility: "PHC OKEDOGBON",
        lga: "OWO",
        item: "Metronidazole (Diarrhea Treatment)",
        currentStock: 34,
        avgMonthlyUsage: 6,
        daysRemaining: 170,
        severity: "normal",
        predictedStockout: "2025-07-14",
        recommendation: "Stock levels excellent. No action needed.",
      },
      {
        id: "6",
        facility: "PHC OKOJA",
        lga: "AKOKO N E",
        item: "Ciprofloxacin (Typhoid Treatment)",
        currentStock: 12,
        avgMonthlyUsage: 5,
        daysRemaining: 72,
        severity: "warning",
        predictedStockout: "2025-03-28",
        recommendation: "Restock recommended. Order 100 units.",
      },
    ]

    setTimeout(() => {
      setAlerts(mockAlerts)
      setLoading(false)
    }, 800)
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedLGA !== "all" && alert.lga !== selectedLGA) return false
    if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) return false
    return true
  })

  const criticalCount = alerts.filter((a) => a.severity === "critical").length
  const warningCount = alerts.filter((a) => a.severity === "warning").length
  const normalCount = alerts.filter((a) => a.severity === "normal").length

  const severityColors = {
    critical: "text-red-500 bg-red-500/10 border-red-500/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    normal: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  }

  const severityIcons = {
    critical: AlertCircle,
    warning: AlertTriangle,
    normal: CheckCircle,
  }

  // Stock trend data for visualization
  const stockTrendData = [
    { month: "Sep", stock: 450, usage: 380 },
    { month: "Oct", stock: 420, usage: 410 },
    { month: "Nov", stock: 380, usage: 430 },
    { month: "Dec", stock: 320, usage: 450 },
    { month: "Jan", stock: 250, usage: 470 },
    { month: "Feb", stock: 180, usage: 490 },
  ]

  return (
    <AuthGuard requiredFeature="stock-alerts">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">{"Stock-Out Alert System"}</h1>
            <p className="text-slate-400 text-lg">
              {"Predictive alerts for medical supplies based on usage patterns and service volume"}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{"Critical"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{criticalCount}</div>
                <p className="text-sm text-slate-400">{"Urgent Restocks Needed"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{"Warning"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{warningCount}</div>
                <p className="text-sm text-slate-400">{"Restock Soon"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{"Normal"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{normalCount}</div>
                <p className="text-sm text-slate-400">{"Adequate Stock"}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-purple-500" />
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{"Total"}</Badge>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{alerts.length}</div>
                <p className="text-sm text-slate-400">{"Items Monitored"}</p>
              </div>
            </Card>
          </div>

          {/* Stock Trend Chart */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">{"Stock vs Usage Trend"}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockTrendData}>
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
                  <Line type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={3} name="Stock Level" />
                  <Line type="monotone" dataKey="usage" stroke="#f59e0b" strokeWidth={3} name="Monthly Usage" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={selectedLGA} onValueChange={setSelectedLGA}>
              <SelectTrigger className="w-48 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Filter by LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"All LGAs"}</SelectItem>
                <SelectItem value="OWO">{"OWO"}</SelectItem>
                <SelectItem value="AKOKO N E">{"AKOKO N E"}</SelectItem>
                <SelectItem value="IFEDORE">{"IFEDORE"}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-48 bg-slate-900 border-slate-700 text-white">
                <SelectValue placeholder="Filter by Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{"All Severities"}</SelectItem>
                <SelectItem value="critical">{"Critical"}</SelectItem>
                <SelectItem value="warning">{"Warning"}</SelectItem>
                <SelectItem value="normal">{"Normal"}</SelectItem>
              </SelectContent>
            </Select>

            <Button className="ml-auto bg-emerald-600 hover:bg-emerald-700">
              <Download className="w-4 h-4 mr-2" />
              {"Export Report"}
            </Button>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const Icon = severityIcons[alert.severity]
              return (
                <Card key={alert.id} className={`border backdrop-blur ${severityColors[alert.severity]}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/50 flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{alert.item}</h3>
                          <p className="text-sm text-slate-400">
                            {alert.facility} • {alert.lga}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          alert.severity === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : alert.severity === "warning"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{"Current Stock"}</p>
                        <p className="text-lg font-semibold text-white">{alert.currentStock} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{"Avg Monthly Usage"}</p>
                        <p className="text-lg font-semibold text-white">{alert.avgMonthlyUsage} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{"Days Remaining"}</p>
                        <p className="text-lg font-semibold text-white">{alert.daysRemaining} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">{"Predicted Stock-Out"}</p>
                        <p className="text-lg font-semibold text-white">{alert.predictedStockout}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-slate-300 mb-1">{"Recommendation:"}</p>
                      <p className="text-sm text-slate-400">{alert.recommendation}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
