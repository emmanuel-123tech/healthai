import { ChatBubble } from "@/components/chat-bubble"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Globe, Heart, Shield, TrendingUp, Users } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">About AfricareAI</h1>
          <p className="mx-auto max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Transforming Africa's Primary Health Care through predictive intelligence and data-driven decision making
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="leading-relaxed text-muted-foreground">
                To strengthen Africa's PHC systems through predictive intelligence and data-driven planning, ensuring
                every clinic can predict, prepare, and protect their communities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="leading-relaxed text-muted-foreground">
                A continent where every clinic can predict, prepare, and protect — where health data transforms into
                life-saving insights and equitable care for all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-foreground">The Challenge</h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <p className="leading-relaxed text-muted-foreground">
                Primary Health Care is the heartbeat of Africa's health system, yet many facilities operate without
                real-time insight into disease trends, resource needs, or patient outcomes.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Health workers face unpredictable disease outbreaks, insufficient supplies, and limited tools to
                anticipate community needs. This reactive approach costs lives and strains already limited resources.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                AfricareAI bridges this gap by integrating AI-driven analytics with local PHC data, empowering leaders
                to make faster, smarter, and more equitable decisions.
              </p>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:h-auto">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/africa-humanitarian-aid-doctor-taking-care-patient-7YCLrO06H0h3l7kJh8aT3lp3jXS3ID.jpg"
                alt="Healthcare worker providing care"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="mb-16">
          <h2 className="mb-6 text-3xl font-bold text-foreground">Our Solution</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Disease Forecasting</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Predict disease trends before they become crises with advanced AI analytics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Resource Optimization</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Deploy resources efficiently with real-time data-driven insights
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Maternal & Child Health</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Track and improve care outcomes with comprehensive monitoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">AI Assistant</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Get instant answers and recommendations from intelligent chatbot
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Real-Time Analytics</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Monitor health data across multiple facilities in real-time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Data Security</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Enterprise-grade security and privacy protection for sensitive health information
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Impact */}
        <section className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12">
          <h2 className="mb-6 text-center text-3xl font-bold text-foreground">Our Impact</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">18+</div>
              <p className="text-sm font-medium text-muted-foreground">Local Government Areas</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">1.5K+</div>
              <p className="text-sm font-medium text-muted-foreground">Patient Records Analyzed</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">95%</div>
              <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
            </div>
          </div>
        </section>
      </div>

      <ChatBubble />
    </div>
  )
}
