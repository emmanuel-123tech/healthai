import { Footer } from "@/components/footer"
import { PredictiveIntelligence } from "@/components/predictive-intelligence"
import { AIAssistant } from "@/components/ai-assistant"

export default function AIHubPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b border-border/50 bg-gradient-to-r from-purple-500/10 via-emerald-500/10 to-amber-500/10">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">AI-Powered Intelligence</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">AI Intelligence Hub</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Leverage advanced machine learning to forecast disease trends, optimize resource allocation, and generate
            data-driven policy recommendations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <PredictiveIntelligence />
          <AIAssistant />
        </div>
      </div>

      <Footer />
    </div>
  )
}
