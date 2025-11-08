"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Heart,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
} from "lucide-react"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function ImpactPage() {
  // Key Impact Metrics
  const keyMetrics = [
    {
      title: "Patients Served",
      value: "47,500+",
      change: "+32%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "Total patients served since implementation",
    },
    {
      title: "Cost Savings",
      value: "₦12.5M",
      change: "+45%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
      description: "Operational cost reduction",
    },
    {
      title: "Time Saved",
      value: "8,400 hrs",
      change: "+28%",
      trend: "up",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      description: "Healthcare worker time saved",
    },
    {
      title: "Lives Saved",
      value: "340+",
      change: "+18%",
      trend: "up",
      icon: Heart,
      color: "from-red-500 to-red-600",
      description: "Through early detection & intervention",
    },
  ]

  // Before vs After Comparison
  const beforeAfterData = [
    {
      metric: "Avg Wait Time",
      before: 120,
      after: 45,
      unit: "minutes",
      improvement: 63,
    },
    {
      metric: "Diagnosis Accuracy",
      before: 72,
      after: 94,
      unit: "%",
      improvement: 31,
    },
    {
      metric: "Stock-Out Events",
      before: 45,
      after: 8,
      unit: "per month",
      improvement: 82,
    },
    {
      metric: "Patient Satisfaction",
      before: 68,
      after: 91,
      unit: "%",
      improvement: 34,
    },
  ]

  // Monthly Impact Trend
  const monthlyImpact = [
    { month: "Jul", patients: 3200, savings: 850000, efficiency: 72 },
    { month: "Aug", patients: 3800, savings: 920000, efficiency: 76 },
    { month: "Sep", patients: 4100, savings: 1050000, efficiency: 81 },
    { month: "Oct", patients: 4500, savings: 1180000, efficiency: 85 },
    { month: "Nov", patients: 4800, savings: 1320000, efficiency: 88 },
    { month: "Dec", patients: 5200, savings: 1450000, efficiency: 92 },
  ]

  // SDG Alignment
  const sdgAlignment = [
    { goal: "Good Health", score: 92, fullMark: 100 },
    { goal: "Quality Education", score: 78, fullMark: 100 },
    { goal: "Reduced Inequalities", score: 85, fullMark: 100 },
    { goal: "Partnerships", score: 88, fullMark: 100 },
    { goal: "Innovation", score: 95, fullMark: 100 },
  ]

  // Health Outcomes
  const healthOutcomes = [
    { name: "Malaria", reduction: 35, color: "#10b981" },
    { name: "Typhoid", reduction: 28, color: "#f59e0b" },
    { name: "Diarrhea", reduction: 42, color: "#3b82f6" },
    { name: "RTI", reduction: 31, color: "#8b5cf6" },
  ]

  // System Efficiency Gains
  const efficiencyMetrics = [
    { category: "Triage Speed", value: 85, target: 90 },
    { category: "Stock Management", value: 92, target: 95 },
    { category: "Data Accuracy", value: 96, target: 98 },
    { category: "Response Time", value: 88, target: 90 },
  ]

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"]

  return (
    <AuthGuard requiredFeature="dashboard">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">{"Impact Metrics Dashboard"}</h1>
            <p className="text-slate-400 text-lg">
              {"Measuring real-world impact: lives saved, costs reduced, and health outcomes improved"}
            </p>
          </div>

          {/* Key Impact Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {keyMetrics.map((metric, idx) => {
              const Icon = metric.icon
              return (
                <Card
                  key={idx}
                  className={`bg-gradient-to-br ${metric.color} border-0 backdrop-blur overflow-hidden relative`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  <div className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="w-8 h-8 text-white" />
                      <Badge
                        className={`${
                          metric.trend === "up"
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-white/20 text-white border-white/30"
                        }`}
                      >
                        {metric.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <p className="text-sm text-white/80">{metric.title}</p>
                    <p className="text-xs text-white/60 mt-2">{metric.description}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Before vs After Comparison */}
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur mb-8">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6">{"Before vs After AfricareAI Implementation"}</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {beforeAfterData.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-300 mb-4">{item.metric}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">{"Before"}</span>
                          <span className="text-sm font-semibold text-red-400">
                            {item.before}
                            {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${item.before}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">{"After"}</span>
                          <span className="text-sm font-semibold text-emerald-400">
                            {item.after}
                            {item.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${item.after}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-slate-400">
                          {item.improvement}
                          {"% improvement"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Impact Trend */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{"Monthly Impact Trend"}</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyImpact}>
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
                    <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} name="Patients Served" />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} name="Efficiency %" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">{"Total Patients"}</p>
                    <p className="text-xl font-bold text-white">{"25,600"}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">{"Avg Efficiency"}</p>
                    <p className="text-xl font-bold text-white">{"82%"}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">{"Growth Rate"}</p>
                    <p className="text-xl font-bold text-white">{"+62%"}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* SDG Alignment */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{"UN SDG Alignment Score"}</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={sdgAlignment}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="goal" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar name="AfricareAI" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {sdgAlignment.map((goal, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">{goal.goal}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${goal.score}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-white w-12">{goal.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Health Outcomes */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{"Disease Burden Reduction"}</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={healthOutcomes} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="reduction" fill="#10b981" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{"Overall Disease Burden Reduction"}</p>
                      <p className="text-2xl font-bold text-emerald-500">{"34% Average"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Efficiency */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">{"System Efficiency Metrics"}</h3>

                <div className="space-y-6">
                  {efficiencyMetrics.map((metric, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">{metric.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">
                            {metric.value}% / {metric.target}%
                          </span>
                          {metric.value >= metric.target ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                      <div className="relative w-full bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            metric.value >= metric.target ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${metric.value}%` }}
                        />
                        <div className="absolute top-0 h-3 w-0.5 bg-white/50" style={{ left: `${metric.target}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-slate-400">{"Avg Response"}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{"2.3 min"}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-slate-400">{"Uptime"}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{"99.7%"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
