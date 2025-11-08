import Link from "next/link"
import { Activity, Mail, Globe, MapPin } from "@/components/icons"

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-secondary shadow-lg">
                <Activity className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold text-foreground">AfricareAI</span>
            </Link>
            <p className="text-lg font-semibold text-primary">Predict. Prevent. Empower.</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Transforming Primary Health Care in Africa through AI-powered predictive analytics and intelligent
              decision support.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-muted-foreground transition-colors hover:text-primary">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/policy-insights" className="text-muted-foreground transition-colors hover:text-primary">
                  Policy Insights
                </Link>
              </li>
              <li>
                <Link href="/ai-hub" className="text-muted-foreground transition-colors hover:text-primary">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>AfricareAI, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:africareai@gmail.com" className="transition-colors hover:text-primary">
                  africareai@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-primary" />
                <a href="https://www.africareai.vercel.app" className="transition-colors hover:text-primary">
                  www.africareai.vercel.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AfricareAI. Built with intelligence and compassion for Africa's healthcare future.</p>
        </div>
      </div>
    </footer>
  )
}
