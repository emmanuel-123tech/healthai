import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: "AfricareAI - Smarter Primary Health Care for Africa",
  description: "Predict. Prevent. Empower. Transform health data into predictive insights for Primary Health Care.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            {children}
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
