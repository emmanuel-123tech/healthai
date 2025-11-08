"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth-guard"
import { Activity, AlertCircle, CheckCircle, ArrowRight, Stethoscope, Pill, Building2 } from "lucide-react"

interface TriageResult {
  condition: string
  severity: "emergency" | "urgent" | "routine"
  confidence: number
  symptoms: string[]
  treatment: string[]
  referral: {
    needed: boolean
    facility: string
    reason: string
  }
  medications: {
    name: string
    dosage: string
    duration: string
  }[]
}

export default function TriagePage() {
  const [patientName, setPatientName] = useState("")
  const [age, setAge] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [result, setResult] = useState<TriageResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAssessment = () => {
    setLoading(true)

    // Simulate AI assessment based on symptoms
    setTimeout(() => {
      const symptomsLower = symptoms.toLowerCase()
      let assessment: TriageResult

      if (symptomsLower.includes("fever") && symptomsLower.includes("headache")) {
        assessment = {
          condition: "Suspected Malaria",
          severity: "urgent",
          confidence: 87,
          symptoms: ["High fever", "Headache", "Body aches", "Chills"],
          treatment: [
            "Immediate malaria rapid diagnostic test (RDT)",
            "Start antimalarial treatment if positive",
            "Monitor temperature every 4 hours",
            "Ensure adequate hydration",
          ],
          referral: {
            needed: false,
            facility: "PHC IPELE",
            reason: "Can be managed at primary care level",
          },
          medications: [
            {
              name: "Artemether-Lumefantrine (Coartem)",
              dosage: "4 tablets twice daily",
              duration: "3 days",
            },
            {
              name: "Paracetamol",
              dosage: "500mg every 6 hours",
              duration: "As needed for fever",
            },
          ],
        }
      } else if (symptomsLower.includes("diarrhea") || symptomsLower.includes("vomiting")) {
        assessment = {
          condition: "Acute Gastroenteritis",
          severity: "routine",
          confidence: 82,
          symptoms: ["Diarrhea", "Vomiting", "Abdominal pain", "Dehydration risk"],
          treatment: [
            "Oral rehydration therapy (ORS)",
            "Monitor hydration status",
            "Advise on food hygiene",
            "Follow up in 48 hours if symptoms persist",
          ],
          referral: {
            needed: false,
            facility: "PHC IPELE",
            reason: "Manageable with ORS and monitoring",
          },
          medications: [
            {
              name: "Oral Rehydration Salts (ORS)",
              dosage: "1 sachet in 1L water, drink frequently",
              duration: "Until symptoms resolve",
            },
            {
              name: "Zinc Sulfate (for children)",
              dosage: "20mg once daily",
              duration: "10-14 days",
            },
          ],
        }
      } else if (symptomsLower.includes("cough") || symptomsLower.includes("breathing")) {
        assessment = {
          condition: "Respiratory Tract Infection",
          severity: "urgent",
          confidence: 79,
          symptoms: ["Persistent cough", "Difficulty breathing", "Chest pain", "Fever"],
          treatment: [
            "Assess respiratory rate and oxygen saturation",
            "Start antibiotic therapy",
            "Monitor for signs of pneumonia",
            "Chest X-ray if available",
          ],
          referral: {
            needed: true,
            facility: "General Hospital Owo",
            reason: "Requires chest X-ray and possible oxygen therapy",
          },
          medications: [
            {
              name: "Amoxicillin",
              dosage: "500mg three times daily",
              duration: "7 days",
            },
            {
              name: "Salbutamol Inhaler (if wheezing)",
              dosage: "2 puffs every 4-6 hours",
              duration: "As needed",
            },
          ],
        }
      } else if (symptomsLower.includes("typhoid") || symptomsLower.includes("prolonged fever")) {
        assessment = {
          condition: "Suspected Typhoid Fever",
          severity: "urgent",
          confidence: 85,
          symptoms: ["Prolonged fever", "Abdominal pain", "Weakness", "Loss of appetite"],
          treatment: [
            "Widal test or blood culture",
            "Start antibiotic therapy immediately",
            "Monitor for complications",
            "Ensure proper nutrition and hydration",
          ],
          referral: {
            needed: false,
            facility: "PHC IPELE",
            reason: "Can initiate treatment at PHC, refer if complications arise",
          },
          medications: [
            {
              name: "Ciprofloxacin",
              dosage: "500mg twice daily",
              duration: "7-10 days",
            },
            {
              name: "Paracetamol",
              dosage: "500mg every 6 hours",
              duration: "As needed",
            },
          ],
        }
      } else {
        assessment = {
          condition: "General Assessment Required",
          severity: "routine",
          confidence: 65,
          symptoms: ["Non-specific symptoms"],
          treatment: [
            "Complete physical examination",
            "Take detailed medical history",
            "Order relevant laboratory tests",
            "Monitor and reassess in 24-48 hours",
          ],
          referral: {
            needed: false,
            facility: "PHC IPELE",
            reason: "Initial assessment at primary care level",
          },
          medications: [
            {
              name: "Symptomatic treatment as needed",
              dosage: "Based on clinical findings",
              duration: "As prescribed",
            },
          ],
        }
      }

      setResult(assessment)
      setLoading(false)
    }, 1500)
  }

  const severityColors = {
    emergency: "bg-red-500/10 text-red-500 border-red-500/20",
    urgent: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    routine: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  }

  return (
    <AuthGuard requiredFeature="triage">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">{"AI Clinical Triage System"}</h1>
            <p className="text-slate-400 text-lg">
              {"Intelligent symptom assessment with treatment recommendations and referral guidance"}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">{"Patient Assessment"}</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">{"Patient Name"}</label>
                    <Input
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">{"Age"}</label>
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter age"
                      type="number"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">{"Symptoms & Complaints"}</label>
                    <Textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Describe symptoms: fever, headache, cough, diarrhea, etc."
                      rows={6}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleAssessment}
                    disabled={!patientName || !age || !symptoms || loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Analyzing..." : "Assess Patient"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results */}
            {result && (
              <div className="space-y-6">
                {/* Diagnosis */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{result.condition}</h3>
                        <p className="text-sm text-slate-400">{"Confidence: " + result.confidence + "%"}</p>
                      </div>
                      <Badge className={severityColors[result.severity]}>{result.severity.toUpperCase()}</Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-300">{"Identified Symptoms:"}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Treatment Protocol */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{"Treatment Protocol"}</h3>
                    </div>

                    <ul className="space-y-2">
                      {result.treatment.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Medications */}
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{"Prescribed Medications"}</h3>
                    </div>

                    <div className="space-y-3">
                      {result.medications.map((med, idx) => (
                        <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
                          <p className="font-medium text-white mb-2">{med.name}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-slate-500">{"Dosage: "}</span>
                              <span className="text-slate-300">{med.dosage}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">{"Duration: "}</span>
                              <span className="text-slate-300">{med.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Referral Decision */}
                <Card
                  className={`border backdrop-blur ${
                    result.referral.needed
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          result.referral.needed ? "bg-amber-500/10" : "bg-emerald-500/10"
                        }`}
                      >
                        <Building2
                          className={`w-5 h-5 ${result.referral.needed ? "text-amber-500" : "text-emerald-500"}`}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{"Referral Decision"}</h3>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {result.referral.needed ? (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        )}
                        <span className="font-medium text-white">
                          {result.referral.needed ? "Referral Recommended" : "No Referral Needed"}
                        </span>
                      </div>

                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <p className="text-sm text-slate-400 mb-2">{"Facility: " + result.referral.facility}</p>
                        <p className="text-sm text-slate-300">{result.referral.reason}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {!result && (
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <div className="p-12 text-center">
                  <Stethoscope className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">{"Enter patient information to begin assessment"}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
