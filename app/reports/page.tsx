"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { FileText, Download, Calendar, TrendingUp, Users, Activity, CheckCircle } from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: any
  sections: string[]
}

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedLGA, setSelectedLGA] = useState("all")
  const [generating, setGenerating] = useState(false)

  const reportTemplates: ReportTemplate[] = [
    {
      id: "executive",
      name: "Executive Summary Report",
      description: "High-level overview for policymakers and stakeholders",
      category: "Policy",
      icon: TrendingUp,
      sections: [
        "Key Performance Indicators",
        "Disease Burden Analysis",
        "Resource Utilization",
        "Policy Recommendations",
        "Budget Allocation Insights",
      ],
    },
    {
      id: "disease",
      name: "Disease Surveillance Report",
      description: "Detailed analysis of disease trends and outbreaks",
      category: "Clinical",
      icon: Activity,
      sections: [
        "Disease Incidence Trends",
        "Outbreak Alerts",
        "Geographic Distribution",
        "Seasonal Patterns",
        "Intervention Effectiveness",
      ],
    },
    {
      id: "facility",
      name: "Facility Performance Report",
      description: "Comprehensive facility operations and service delivery",
      category: "Operations",
      icon: Users,
      sections: [
        "Patient Volume Analysis",
        "Service Delivery Metrics",
        "Staff Utilization",
        "Stock Management",
        "Quality Indicators",
      ],
    },
    {
      id: "quarterly",
      name: "Quarterly Health Review",
      description: "Comprehensive quarterly assessment for state officials",
      category: "Policy",
      icon: Calendar,
      sections: [
        "Quarter Overview",
        "Achievement vs Targets",
        "Budget Utilization",
        "Challenges & Solutions",
        "Next Quarter Planning",
      ],
    },
  ]

  const recentReports = [
    {
      name: "December 2024 Executive Summary",
      type: "Executive Summary",
      date: "2025-01-05",
      size: "2.4 MB",
      status: "completed",
    },
    {
      name: "Q4 2024 Health Review",
      type: "Quarterly Review",
      date: "2025-01-03",
      size: "5.1 MB",
      status: "completed",
    },
    {
      name: "Malaria Surveillance - December",
      type: "Disease Surveillance",
      date: "2024-12-28",
      size: "1.8 MB",
      status: "completed",
    },
  ]

  const handleGenerateReport = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      // Simulate download
      alert("Report generated successfully! Download started.")
    }, 2000)
  }

  return (
    <AuthGuard requiredFeature="reports">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">{"Report Generation Center"}</h1>
            <p className="text-slate-400 text-lg">
              {"Generate comprehensive, policy-ready reports with data visualizations and insights"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Report Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">{"Select Report Template"}</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {reportTemplates.map((template) => {
                      const Icon = template.icon
                      return (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedTemplate === template.id
                              ? "bg-emerald-500/10 border-emerald-500/50"
                              : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{template.name}</h4>
                                <Badge
                                  variant="outline"
                                  className="bg-slate-900 text-slate-400 border-slate-700 text-xs"
                                >
                                  {template.category}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                            <div className="space-y-1">
                              {template.sections.slice(0, 3).map((section, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                  <span className="text-xs text-slate-500">{section}</span>
                                </div>
                              ))}
                              {template.sections.length > 3 && (
                                <p className="text-xs text-slate-600 ml-5">
                                  {"+" + (template.sections.length - 3) + " more sections"}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  {selectedTemplate && (
                    <div className="space-y-4 pt-6 border-t border-slate-800">
                      <h4 className="font-semibold text-white mb-4">{"Report Configuration"}</h4>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">{"Time Period"}</label>
                          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">{"Last Week"}</SelectItem>
                              <SelectItem value="monthly">{"Last Month"}</SelectItem>
                              <SelectItem value="quarterly">{"Last Quarter"}</SelectItem>
                              <SelectItem value="yearly">{"Last Year"}</SelectItem>
                              <SelectItem value="custom">{"Custom Range"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2 block">{"LGA Filter"}</label>
                          <Select value={selectedLGA} onValueChange={setSelectedLGA}>
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">{"All LGAs"}</SelectItem>
                              <SelectItem value="OWO">{"OWO"}</SelectItem>
                              <SelectItem value="AKOKO N E">{"AKOKO N E"}</SelectItem>
                              <SelectItem value="IFEDORE">{"IFEDORE"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        onClick={handleGenerateReport}
                        disabled={generating}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4"
                        size="lg"
                      >
                        {generating ? (
                          <>{"Generating Report..."}</>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            {"Generate & Download Report"}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Report Preview */}
              {selectedTemplate && (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">{"Report Contents"}</h3>
                    <div className="space-y-3">
                      {reportTemplates
                        .find((t) => t.id === selectedTemplate)
                        ?.sections.map((section, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <span className="text-sm font-semibold text-emerald-500">{idx + 1}</span>
                            </div>
                            <span className="text-sm text-slate-300">{section}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Recent Reports */}
            <div>
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{"Recent Reports"}</h3>

                  <div className="space-y-3">
                    {recentReports.map((report, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white mb-1 truncate">{report.name}</h4>
                            <p className="text-xs text-slate-400 mb-2">{report.type}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{report.date}</span>
                              <span>{"•"}</span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-3 text-emerald-400 hover:text-emerald-300"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          {"Download"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Report Features */}
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur mt-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{"Report Features"}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{"Data Visualizations"}</p>
                        <p className="text-xs text-slate-400">{"Charts, graphs, and maps"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{"Executive Summaries"}</p>
                        <p className="text-xs text-slate-400">{"Key insights and recommendations"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{"Export Formats"}</p>
                        <p className="text-xs text-slate-400">{"PDF, Excel, and PowerPoint"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-white">{"Customizable"}</p>
                        <p className="text-xs text-slate-400">{"Filter by date, LGA, and metrics"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
