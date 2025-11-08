"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authenticateUser, DEMO_USERS, ROLE_PERMISSIONS, type User } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"
import { Activity, Building2, MapPin, Shield, CheckCircle } from "lucide-react"

const ROLE_ICONS = {
  health_worker: Activity,
  facility_manager: Building2,
  lga_admin: MapPin,
  state_official: Shield,
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowSuccess(true)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = authenticateUser(email, password)

    if (result.success && result.user) {
      setUser(result.user)
      router.push("/portal")
    } else {
      setError(result.error || "Login failed")
      setLoading(false)
    }
  }

  const handleDemoLogin = (user: User) => {
    setUser(user)
    router.push("/portal")
  }

  const ondoUsers = DEMO_USERS.filter((u) => u.state === "Ondo")
  const crossRiverUsers = DEMO_USERS.filter((u) => u.state === "Cross River")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AfricareAI Portal</h1>
          <p className="text-slate-300 text-lg">Access your healthcare dashboard</p>
        </div>

        {showSuccess && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-emerald-400">Account created successfully! Please sign in to continue.</p>
          </div>
        )}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="ondo">Ondo Demo</TabsTrigger>
            <TabsTrigger value="crossriver">Cross River Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card className="max-w-md mx-auto bg-slate-900/50 border-slate-800 p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@health.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <p className="text-center text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
                    Sign up
                  </Link>
                </p>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="ondo">
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Ondo State Demo Accounts</h2>
                <p className="text-slate-400">Select a role to explore Ondo State health analytics</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ondoUsers.map((user) => {
                const Icon = ROLE_ICONS[user.role]
                const roleInfo = ROLE_PERMISSIONS[user.role]

                return (
                  <Card
                    key={user.id}
                    className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white mb-1">{roleInfo.name}</h3>
                        <p className="text-sm text-slate-400 mb-3">{user.name}</p>
                        <p className="text-xs text-slate-500">{roleInfo.description}</p>
                      </div>

                      {user.facility && (
                        <div className="pt-3 border-t border-slate-800">
                          <p className="text-xs text-slate-400">
                            <span className="text-slate-500">Facility: </span>
                            {user.facility}
                          </p>
                        </div>
                      )}

                      {user.lga && (
                        <div className={user.facility ? "" : "pt-3 border-t border-slate-800"}>
                          <p className="text-xs text-slate-400">
                            <span className="text-slate-500">LGA: </span>
                            {user.lga}
                          </p>
                        </div>
                      )}

                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Login as {roleInfo.name}</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="crossriver">
            <div className="space-y-4 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Cross River State Demo Accounts</h2>
                <p className="text-slate-400">Select a role to explore Cross River State facility readiness</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crossRiverUsers.map((user) => {
                const Icon = ROLE_ICONS[user.role]
                const roleInfo = ROLE_PERMISSIONS[user.role]

                return (
                  <Card
                    key={user.id}
                    className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-white mb-1">{roleInfo.name}</h3>
                        <p className="text-sm text-slate-400 mb-3">{user.name}</p>
                        <p className="text-xs text-slate-500">{roleInfo.description}</p>
                      </div>

                      {user.facility && (
                        <div className="pt-3 border-t border-slate-800">
                          <p className="text-xs text-slate-400">
                            <span className="text-slate-500">Facility: </span>
                            {user.facility}
                          </p>
                        </div>
                      )}

                      {user.lga && (
                        <div className={user.facility ? "" : "pt-3 border-t border-slate-800"}>
                          <p className="text-xs text-slate-400">
                            <span className="text-slate-500">LGA: </span>
                            {user.lga}
                          </p>
                        </div>
                      )}

                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Login as {roleInfo.name}</Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
