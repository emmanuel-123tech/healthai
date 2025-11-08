"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "@/components/icons"

const themes = [
  {
    name: "Teal & Coral",
    id: "default",
    colors: {
      primary: "oklch(0.52 0.15 190)",
      secondary: "oklch(0.68 0.18 35)",
      accent: "oklch(0.48 0.16 250)",
    },
  },
  {
    name: "Ocean Blue",
    id: "ocean",
    colors: {
      primary: "oklch(0.48 0.16 250)",
      secondary: "oklch(0.58 0.18 220)",
      accent: "oklch(0.52 0.15 190)",
    },
  },
  {
    name: "Forest Green",
    id: "forest",
    colors: {
      primary: "oklch(0.52 0.15 150)",
      secondary: "oklch(0.62 0.18 130)",
      accent: "oklch(0.68 0.18 35)",
    },
  },
  {
    name: "Royal Purple",
    id: "purple",
    colors: {
      primary: "oklch(0.55 0.18 290)",
      secondary: "oklch(0.65 0.2 320)",
      accent: "oklch(0.52 0.15 190)",
    },
  },
  {
    name: "Sunset Orange",
    id: "sunset",
    colors: {
      primary: "oklch(0.65 0.2 40)",
      secondary: "oklch(0.62 0.22 25)",
      accent: "oklch(0.55 0.18 290)",
    },
  },
  {
    name: "Rose Pink",
    id: "rose",
    colors: {
      primary: "oklch(0.62 0.2 350)",
      secondary: "oklch(0.68 0.18 35)",
      accent: "oklch(0.55 0.18 290)",
    },
  },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("default")

  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") || "default"
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    const root = document.documentElement
    root.style.setProperty("--primary", theme.colors.primary)
    root.style.setProperty("--secondary", theme.colors.secondary)
    root.style.setProperty("--accent", theme.colors.accent)

    // Update dark mode variants
    const primaryDark = theme.colors.primary.replace(/0\.\d+/, "0.62")
    const secondaryDark = theme.colors.secondary.replace(/0\.\d+/, "0.72")
    const accentDark = theme.colors.accent.replace(/0\.\d+/, "0.58")

    root.style.setProperty("--primary-dark", primaryDark)
    root.style.setProperty("--secondary-dark", secondaryDark)
    root.style.setProperty("--accent-dark", accentDark)
  }

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
    applyTheme(themeId)
    localStorage.setItem("color-theme", themeId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg transition-colors hover:bg-accent">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme colors</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex gap-1">
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: theme.colors.secondary }}
              />
              <div
                className="h-4 w-4 rounded-full border border-border"
                style={{ backgroundColor: theme.colors.accent }}
              />
            </div>
            <span className="text-sm">{theme.name}</span>
            {currentTheme === theme.id && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
