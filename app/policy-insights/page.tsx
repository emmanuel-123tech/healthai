import { Footer } from "@/components/footer"
import { ChatBubble } from "@/components/chat-bubble"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, FileText, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const insights = [
  {
    title: "Malaria Prevention Strategy",
    category: "Disease Control",
    priority: "High",
    summary:
      "Malaria accounts for 65% of all PHC visits. Recommend increased RDT kit distribution and targeted ITN campaigns in high-burden LGAs.",
    recommendations: [
      "Deploy 50,000 additional RDT kits to Akoko N.E and Okitipupa",
      "Launch community ITN distribution campaign before rainy season",
      "Establish weekly surveillance reporting from all PHC facilities",
    ],
    impact: "Projected 30% reduction in malaria cases within 6 months",
  },
  {
    title: "Maternal Health Improvement",
    category: "Maternal & Child Health",
    priority: "High",
    summary:
      "ANC follow-up rates vary significantly across LGAs. Strengthen maternal health services in underperforming areas.",
    recommendations: [
      "Increase skilled birth attendants in rural LGAs",
      "Implement mobile ANC clinics for remote communities",
      "Establish referral system for high-risk pregnancies",
    ],
    impact: "Target 85% ANC coverage across all LGAs by Q4",
  },
  {
    title: "Resource Allocation Optimization",
    category: "Operations",
    priority: "Medium",
    summary:
      "PHC utilization data reveals significant disparities. Reallocate resources based on patient volume and service demand.",
    recommendations: [
      "Redistribute medical supplies based on facility utilization rates",
      "Deploy additional staff to high-volume facilities",
      "Establish mobile clinics for underserved areas",
    ],
    impact: "Improve service delivery efficiency by 25%",
  },
  {
    title: "Immunization Coverage Expansion",
    category: "Preventive Care",
    priority: "Medium",
    summary: "Immunization rates below national targets in several LGAs. Strengthen routine immunization programs.",
    recommendations: [
      "Conduct catch-up immunization campaigns in low-coverage areas",
      "Improve cold chain infrastructure",
      "Enhance community mobilization and health education",
    ],
    impact: "Achieve 90% immunization coverage by year-end",
  },
]

export default function PolicyInsightsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">Policy Insights</h1>
          <p className="max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Data-driven policy recommendations for strengthening Primary Health Care in Ondo State
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-12 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Recommendations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.length}</div>
              <p className="text-xs text-muted-foreground">Across 4 categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.filter((i) => i.priority === "High").length}</div>
              <p className="text-xs text-muted-foreground">Require immediate action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LGAs Covered</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">Across Ondo State</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected Impact</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30%</div>
              <p className="text-xs text-muted-foreground">Improvement in outcomes</p>
            </CardContent>
          </Card>
        </div>

        {/* Priority Alert */}
        <Alert variant="destructive" className="mb-8 border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Urgent Action Required</AlertTitle>
          <AlertDescription>
            2 high-priority recommendations require immediate policy intervention to prevent health crises.
          </AlertDescription>
        </Alert>

        {/* Policy Recommendations */}
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <Card key={index} className={insight.priority === "High" ? "border-destructive/30" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          insight.priority === "High"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {insight.priority} Priority
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                        {insight.category}
                      </span>
                    </div>
                    <CardTitle className="text-2xl">{insight.title}</CardTitle>
                    <CardDescription className="mt-2">{insight.summary}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-foreground">Recommendations:</h4>
                    <ul className="space-y-2">
                      {insight.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-primary">Expected Impact:</span> {insight.impact}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                      Download Full Report
                    </Button>
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Share with Stakeholders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generate Custom Report */}
        <Card className="mt-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8 text-center">
            <h3 className="mb-3 text-2xl font-bold text-foreground">Need a Custom Policy Brief?</h3>
            <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
              Our AI can generate tailored policy recommendations based on specific LGAs, health priorities, or time
              periods.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Generate Custom Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
      <ChatBubble />
    </div>
  )
}
