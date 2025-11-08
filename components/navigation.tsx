"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X, Activity } from "@/components/icons"
import { useState } from "react"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { ThemeSwitcher } from "@/components/theme-switcher"

const getNavItemsForRole = (isLoggedIn: boolean) => {
  if (!isLoggedIn) {
    return [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "Team", href: "/team" },
      { name: "Contact", href: "/contact" },
    ]
  }

  return [
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ]
}

const getDashboardItems = (isLoggedIn: boolean, pathname: string) => {
  if (!isLoggedIn) return []

  return [
    { name: "Ondo State", href: "/dashboard" },
    { name: "Cross River", href: "/dashboard/crossriver" },
  ]
}

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()
  const isLoggedIn = !!user
  const navItems = getNavItemsForRole(isLoggedIn)
  const dashboardItems = getDashboardItems(isLoggedIn, pathname)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link
            href={isLoggedIn ? "/portal" : "/"}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-secondary shadow-lg shadow-primary/20">
              <Activity className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">AfricareAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {dashboardItems.length > 0 && (
              <div className="flex items-center gap-1 mr-2 border-r border-border/50 pr-2">
                {dashboardItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      pathname.includes(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
            <ThemeSwitcher />
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="animate-slide-up border-t border-border/50 py-6 md:hidden">
            <div className="flex flex-col gap-2">
              {dashboardItems.length > 0 && (
                <>
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">DASHBOARDS</p>
                    <div className="flex flex-col gap-1">
                      {dashboardItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                            pathname.includes(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-accent/50",
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/50 my-2" />
                </>
              )}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="text-sm text-muted-foreground">Theme:</span>
                <ThemeSwitcher />
              </div>
              <UserMenu />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
