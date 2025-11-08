"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Brain,
  TrendingUp,
  Heart,
  Shield,
  Activity,
  Globe2,
  Sparkles,
  LineChart,
  Database,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, getCoverageStats } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    about: false,
    mission: false,
    cta: false,
  })
  const [coverageStats, setCoverageStats] = useState({ displayText: "1 State, 18 LGAs", facilities: 200 })

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      const redirectPath = user.role === "health_worker" ? "/triage" : "/dashboard"
      router.push(redirectPath)
    }

    const stats = getCoverageStats()
    setCoverageStats({ displayText: stats.displayText, facilities: stats.facilities })

    setTimeout(() => {
      setIsVisible((prev) => ({ ...prev, hero: true }))
    }, 100)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setIsVisible((prev) => ({ ...prev, [id]: true }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = ["features", "about", "mission", "cta"]
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="container relative mx-auto px-4 py-20 md:py-28 lg:py-36">
          <div
            className={`mx-auto max-w-5xl text-center transition-all duration-1000 ${
              isVisible.hero ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" />
              <span className="text-foreground">AI-Powered Healthcare Intelligence</span>
            </div>

            <h1 className="mb-6 text-balance text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Predictive insights for <span className="text-primary">Africa's Primary Health Care</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Transform health data into actionable foresight. Empower PHC workers, facility managers, and policymakers
              to anticipate tomorrow's challenges today.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group h-12 w-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-2 border-primary/30 bg-background/50 px-8 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8">
              {[
                { value: "200+", label: "PHC Facilities" },
                { value: "95%", label: "Prediction Accuracy" },
                { value: "1 State, 18 LGAs", label: "Coverage" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 md:p-6"
                  style={{
                    animation: isVisible.hero ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards` : "none",
                    opacity: isVisible.hero ? 1 : 0,
                  }}
                >
                  <div className="text-3xl font-bold text-foreground md:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div
            className={`mb-16 text-center transition-all duration-1000 ${
              isVisible.features ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Intelligent healthcare analytics
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Powered by AI to transform Primary Health Care delivery across Africa
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: "Disease Forecasting",
                description: "Predict disease trends before they become crises with advanced AI analytics",
              },
              {
                icon: Database,
                title: "Resource Optimization",
                description: "Deploy resources efficiently with real-time data-driven insights",
              },
              {
                icon: Heart,
                title: "Maternal & Child Health",
                description: "Track and improve care outcomes with comprehensive monitoring",
              },
              {
                icon: Brain,
                title: "AI Assistant",
                description: "Get instant answers and recommendations from intelligent chatbot",
              },
              {
                icon: LineChart,
                title: "Real-Time Analytics",
                description: "Monitor health data across multiple facilities in real-time",
              },
              {
                icon: Shield,
                title: "Data Security",
                description: "Enterprise-grade security and privacy protection for sensitive health information",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group border-border/50 bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                style={{
                  animation: isVisible.features ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards` : "none",
                  opacity: isVisible.features ? 1 : 0,
                }}
              >
                <CardContent className="p-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border/50 bg-muted/20 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div
              className={`relative order-2 flex items-center justify-center transition-all duration-1000 lg:order-1 ${
                isVisible.about ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-3xl md:h-[500px]">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/africa-humanitarian-aid-doctor-taking-care-patient-7YCLrO06H0h3l7kJh8aT3lp3jXS3ID.jpg"
                  alt="Healthcare worker providing care"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            </div>

            <div
              className={`order-1 flex flex-col justify-center transition-all duration-1000 lg:order-2 ${
                isVisible.about ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
            >
              <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Bridging the gap in Primary Health Care
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Primary Health Care is the heartbeat of Africa's health system — yet many facilities operate without
                real-time insight. AfricareAI bridges this gap by integrating AI-driven analytics with local PHC data.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Shield, label: "Data Security", value: "HIPAA Compliant" },
                  { icon: Activity, label: "Active Users", value: "10,000+" },
                  { icon: BarChart3, label: "Uptime", value: "99.9%" },
                  { icon: Globe2, label: "Coverage", value: "18 LGAs" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-xl border border-border/50 bg-background p-5 transition-all duration-500 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
                    style={{
                      animation: isVisible.about ? `fadeInUp 0.6s ease-out ${index * 0.1 + 0.3}s forwards` : "none",
                      opacity: isVisible.about ? 1 : 0,
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 hover:rotate-12">
                      <stat.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="border-b border-border/50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: Shield,
                title: "Our Mission",
                description:
                  "To strengthen Africa's PHC systems through predictive intelligence and data-driven planning, ensuring every clinic can predict, prepare, and protect their communities.",
                gradient: "from-primary/5",
                iconBg: "bg-primary/10",
                iconColor: "text-primary",
                border: "border-primary/20",
              },
              {
                icon: Globe2,
                title: "Our Vision",
                description:
                  "A continent where every clinic can predict, prepare, and protect — where health data transforms into life-saving insights and equitable care for all.",
                gradient: "from-accent/5",
                iconBg: "bg-accent/10",
                iconColor: "text-accent",
                border: "border-accent/20",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className={`${item.border} bg-gradient-to-br ${item.gradient} to-transparent transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-primary/5`}
                style={{
                  animation: isVisible.mission ? `fadeInUp 0.8s ease-out ${index * 0.2}s forwards` : "none",
                  opacity: isVisible.mission ? 1 : 0,
                }}
              >
                <CardContent className="p-10">
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${item.iconBg} transition-all duration-300 hover:scale-110 hover:rotate-12`}
                  >
                    <item.icon className={`${item.iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-lg leading-relaxed text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div
            className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${
              isVisible.cta ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Ready to transform your health data?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Join us in building a smarter, more predictive Primary Health Care system for Africa. Start making
              data-driven decisions today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group h-12 w-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-2 border-primary/30 bg-transparent px-8 text-base font-medium transition-all duration-300 hover:scale-105 hover:border-primary/50 sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
