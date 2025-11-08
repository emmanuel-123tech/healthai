"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, ROLE_PERMISSIONS, type User, type UserRole } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, AlertTriangle, TrendingUp, FileText, LayoutDashboard, BarChart3, FileBarChart } from "lucide-react"

type FeatureCard = {
  title: string
  description: string
  icon: typeof Activity
  href: string
  color: string
}

const FEATURE_CARDS: Record<UserRole, FeatureCard[]> = {
  health_worker: [
    {
      title: "AI Triage",
      description: "Intelligent patient assessment and prioritization",
      icon: Activity,
      href: "/triage",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Access Dashboard",
      description: "View facility metrics and analytics",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "from-emerald-500 to-teal-500",
    },
  ],
  facility_manager: [
    {
      title: "Facility Oversight",
      description: "Monitor performance, staffing, and patient flow",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "AI Triage",
      description: "Coordinate rapid patient prioritization",
      icon: Activity,
      href: "/triage",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Stock Alerts",
      description: "Track essential medicines and supplies",
      icon: AlertTriangle,
      href: "/stock-alerts",
      color: "from-orange-500 to-red-500",
    },
  ],
  lga_admin: [
    {
      title: "Dashboard",
      description: "LGA-wide overview and analytics",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Stock Alerts",
      description: "Monitor supply levels across facilities",
      icon: AlertTriangle,
      href: "/stock-alerts",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Predictions",
      description: "AI-powered health trend forecasting",
      icon: TrendingUp,
      href: "/predictions",
      color: "from-purple-500 to-pink-500",
    },
  ],
  state_official: [
    {
      title: "Dashboard",
      description: "State-wide overview and analytics",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Stock Alerts",
      description: "Monitor supply levels state-wide",
      icon: AlertTriangle,
      href: "/stock-alerts",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Predictions",
      description: "AI-powered health trend forecasting",
      icon: TrendingUp,
      href: "/predictions",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Reports",
      description: "Generate state-wide reports",
      icon: FileText,
      href: "/reports",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Impact Analysis",
      description: "Measure healthcare impact across state",
      icon: BarChart3,
      href: "/impact",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Policy Insights",
      description: "Data-driven policy recommendations",
      icon: FileBarChart,
      href: "/policy-insights",
      color: "from-violet-500 to-purple-500",
    },
  ],
}

export default function PortalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const roleInfo = ROLE_PERMISSIONS[user.role]
const features = FEATURE_CARDS[user.role] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
          <p className="text-slate-300 text-lg">{roleInfo.name} Portal</p>
          {user.facility && <p className="text-slate-400 text-sm mt-1">Facility: {user.facility}</p>}
          {user.lga && <p className="text-slate-400 text-sm">LGA: {user.lga}</p>}
        </div>

        {user.role === "health_worker" && (
          <Card className="bg-slate-900/50 border-slate-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Input</h2>
            <p className="text-slate-400 mb-4">
              Submit health data that will automatically appear in LGA and State dashboards
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("/data-input")}>
              Enter Health Data
            </Button>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.href}
                className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group overflow-hidden"
                onClick={() => router.push(feature.href)}
              >
                <div className="p-6 space-y-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:shadow-lg transition-all">
                    Access {feature.title}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
