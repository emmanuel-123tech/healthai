export type UserRole = "health_worker" | "facility_manager" | "lga_admin" | "state_official"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  facility?: string
  lga?: string
  state?: string
  country?: string
}

export const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "worker@phc.ng",
    name: "Dr. Adebayo Ogunleye",
    role: "health_worker",
    facility: "PHC IPELE",
    lga: "OWO",
    state: "Ondo",
    country: "Nigeria",
  },
  {
    id: "3",
    email: "lga@phc.ng",
    name: "Mr. Tunde Bakare",
    role: "lga_admin",
    lga: "OWO",
    state: "Ondo",
    country: "Nigeria",
  },
  {
    id: "4",
    email: "policy@phc.ng",
    name: "Dr. Amina Mohammed",
    role: "state_official",
    state: "Ondo",
    country: "Nigeria",
  },
  {
    id: "5",
    email: "cr.worker@phc.ng",
    name: "Dr. Chioma Okafor",
    role: "health_worker",
    facility: "PHC Calabar Central",
    lga: "Calabar Municipal",
    state: "Cross River",
    country: "Nigeria",
  },
  {
    id: "6",
    email: "cr.lga@phc.ng",
    name: "Mr. Ekpo Ogundu",
    role: "lga_admin",
    lga: "Calabar Municipal",
    state: "Cross River",
    country: "Nigeria",
  },
  {
    id: "7",
    email: "cr.policy@phc.ng",
    name: "Dr. Kelechi Nwankwo",
    role: "state_official",
    state: "Cross River",
    country: "Nigeria",
  },
]

export const ROLE_PERMISSIONS = {
  health_worker: {
    name: "Health Worker",
    description: "Access to AI triage, patient management, and facility data",
    canAccess: ["triage", "patients", "facility-dashboard"],
  },
  facility_manager: {
    name: "Facility Manager",
    description: "Manage facility operations, stock alerts, and staff",
    canAccess: ["triage", "patients", "facility-dashboard", "stock-alerts", "staff-management"],
  },
  lga_admin: {
    name: "LGA Administrator",
    description: "Oversee multiple facilities and resource allocation",
    canAccess: ["dashboard", "stock-alerts", "resource-allocation", "lga-reports"],
  },
  state_official: {
    name: "State Official / Policymaker",
    description: "Full access to analytics, reports, and policy insights",
    canAccess: ["dashboard", "ai-hub", "policy-insights", "reports", "impact-metrics", "all"],
  },
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("africare_user")
  return userStr ? JSON.parse(userStr) : null
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem("africare_user", JSON.stringify(user))
  } else {
    localStorage.removeItem("africare_user")
  }
}

export function hasAccess(user: User | null, feature: string): boolean {
  if (!user) return false
  const permissions = ROLE_PERMISSIONS[user.role]
  return permissions.canAccess.includes(feature) || permissions.canAccess.includes("all")
}

export function registerUser(userData: {
  email: string
  password: string
  name: string
  role: UserRole
  lga?: string
  facility?: string
  state?: string
  country?: string
}): { success: boolean; error?: string; user?: User } {
  if (typeof window === "undefined") return { success: false, error: "Not in browser" }

  const existingUsers = getAllUsers()
  if (existingUsers.some((u) => u.email === userData.email)) {
    return { success: false, error: "Email already registered" }
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    lga: userData.lga,
    facility: userData.facility,
    state: userData.state,
    country: userData.country,
  }

  existingUsers.push(newUser)
  localStorage.setItem("africare_users", JSON.stringify(existingUsers))

  return { success: true, user: newUser }
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return DEMO_USERS
  const usersStr = localStorage.getItem("africare_users")
  return usersStr ? JSON.parse(usersStr) : DEMO_USERS
}

export function authenticateUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // In a real app, you'd verify the password hash
  // For demo purposes, we'll just check if password is not empty
  if (!password) {
    return { success: false, error: "Password is required" }
  }

  return { success: true, user }
}

export function getCoverageStats(): {
  countries: number
  states: number
  lgas: number
  facilities: number
  displayText: string
} {
  const users = getAllUsers()

  const uniqueCountries = new Set(users.filter((u) => u.country).map((u) => u.country))
  const uniqueStates = new Set(users.filter((u) => u.state).map((u) => u.state))
  const uniqueLgas = new Set(users.filter((u) => u.lga).map((u) => u.lga))
  const uniqueFacilities = new Set(users.filter((u) => u.facility).map((u) => u.facility))

  const countryCount = uniqueCountries.size
  const stateCount = uniqueStates.size
  const lgaCount = uniqueLgas.size
  const facilityCount = uniqueFacilities.size || 200 // Default to 200+ if no facilities

  let displayText = ""

  if (countryCount > 1) {
    displayText = `${countryCount} Countries, ${stateCount} States, ${lgaCount} LGAs`
  } else if (stateCount > 1) {
    displayText = `${stateCount} States, ${lgaCount} LGAs`
  } else {
    displayText = `${stateCount || 1} State, ${lgaCount || 18} LGAs`
  }

  return {
    countries: countryCount,
    states: stateCount,
    lgas: lgaCount,
    facilities: facilityCount,
    displayText,
  }
}
