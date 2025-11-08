"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser, type UserRole } from "@/lib/auth"
import { getCountries, getStatesByCountry, getLGAsByState } from "@/lib/location-data"
import { Activity, MapPin, Shield, ArrowLeft } from "@/components/icons"

const ROLE_OPTIONS = [
  {
    value: "health_worker" as UserRole,
    label: "Health Worker",
    icon: Activity,
    description: "Access to AI triage and patient management",
  },
  {
    value: "lga_admin" as UserRole,
    label: "LGA Administrator",
    icon: MapPin,
    description: "Oversee multiple facilities in your LGA",
  },
  {
    value: "state_official" as UserRole,
    label: "State Official",
    icon: Shield,
    description: "Full access to state-wide analytics",
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    country: "",
    state: "",
    lga: "",
    facility: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [facilities, setFacilities] = useState<{ name: string; lga: string }[]>([])
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)

  const countries = getCountries()
  const states = formData.country ? getStatesByCountry(formData.country) : []
  const lgas = formData.country && formData.state ? getLGAsByState(formData.country, formData.state) : []

  useEffect(() => {
    async function loadFacilities() {
      try {
        const response = await fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/facility_month_agg-AfR2ZMpVCLijpSG8F9ut4Apy986uYQ.csv",
        )
        const text = await response.text()
        const lines = text.trim().split("\n")
        const headers = lines[0].split(",")
        const nameIndex = headers.indexOf("NAME_OF_FACILITIES")
        const lgaIndex = headers.indexOf("LGA")

        const facilitySet = new Set<string>()
        const facilityList: { name: string; lga: string }[] = []

        lines.slice(1).forEach((line) => {
          const values = line.split(",")
          const name = values[nameIndex]
          const lga = values[lgaIndex]
          const key = `${lga}-${name}`

          if (!facilitySet.has(key)) {
            facilitySet.add(key)
            facilityList.push({ name, lga })
          }
        })

        setFacilities(facilityList.sort((a, b) => a.name.localeCompare(b.name)))
        setFacilitiesLoading(false)
      } catch (error) {
        console.error("Error loading facilities:", error)
        setFacilitiesLoading(false)
      }
    }

    loadFacilities()
  }, [])

  const availableFacilities = formData.lga ? facilities.filter((f) => f.lga === formData.lga) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!formData.country) {
      setError("Please select your country")
      setLoading(false)
      return
    }

    if (!formData.state) {
      setError("Please select your state")
      setLoading(false)
      return
    }

    if ((formData.role === "health_worker" || formData.role === "lga_admin") && !formData.lga) {
      setError("Please select your LGA")
      setLoading(false)
      return
    }

    if (formData.role === "health_worker" && !formData.facility) {
      setError("Please select your facility")
      setLoading(false)
      return
    }

    const selectedCountry = countries.find((c) => c.code === formData.country)
    const selectedState = states.find((s) => s.code === formData.state)

    const result = registerUser({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role,
      country: selectedCountry?.name,
      state: selectedState?.name,
      lga: formData.lga || undefined,
      facility: formData.facility || undefined,
    })

    if (result.success && result.user) {
      router.push("/login?registered=true")
    } else {
      setError(result.error || "Registration failed")
      setLoading(false)
    }
  }

  const selectedRoleInfo = ROLE_OPTIONS.find((r) => r.value === formData.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-900/50 border-slate-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-slate-400">Join the AfricareAI healthcare platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@health.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-300">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => {
                    const Icon = role.icon
                    return (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {selectedRoleInfo && <p className="text-xs text-slate-400 mt-1">{selectedRoleInfo.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-slate-300">
                  Country <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value, state: "", lga: "", facility: "" })
                  }
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-slate-300">
                  State <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value, lga: "", facility: "" })}
                  disabled={!formData.country}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder={!formData.country ? "Select country first" : "Select state"} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(formData.role === "health_worker" || formData.role === "lga_admin") && (
              <div className="space-y-2">
                <Label htmlFor="lga" className="text-slate-300">
                  Local Government Area (LGA) <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.lga}
                  onValueChange={(value) => setFormData({ ...formData, lga: value, facility: "" })}
                  disabled={!formData.state}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue placeholder={!formData.state ? "Select state first" : "Select your LGA"} />
                  </SelectTrigger>
                  <SelectContent>
                    {lgas.map((lga) => (
                      <SelectItem key={lga} value={lga}>
                        {lga}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.role === "health_worker" && (
              <div className="space-y-2">
                <Label htmlFor="facility" className="text-slate-300">
                  Facility Name <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.facility}
                  onValueChange={(value) => setFormData({ ...formData, facility: value })}
                  disabled={!formData.lga || facilitiesLoading}
                >
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue
                      placeholder={
                        facilitiesLoading
                          ? "Loading facilities..."
                          : !formData.lga
                            ? "Select LGA first"
                            : "Select your facility"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFacilities.map((facility) => (
                      <SelectItem key={facility.name} value={facility.name}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.lga && availableFacilities.length === 0 && !facilitiesLoading && (
                  <p className="text-xs text-slate-400 mt-1">No facilities found for this LGA</p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
