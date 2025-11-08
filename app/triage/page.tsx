"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { AlertCircle, CheckCircle2, ClipboardList, HeartPulse, Stethoscope, Thermometer, Users } from "lucide-react"
import {
  PatientInput,
  triagePatient,
  SeverityLevel,
  TriageRecommendation,
} from "@/lib/ai-triage"

const symptomCatalogue = [
  { value: "fever", label: "High fever" },
  { value: "chills", label: "Chills" },
  { value: "headache", label: "Severe headache" },
  { value: "cough", label: "Persistent cough" },
  { value: "breathing", label: "Difficulty breathing" },
  { value: "vomiting", label: "Vomiting" },
  { value: "diarrhea", label: "Watery stool" },
  { value: "abdominal", label: "Abdominal pain" },
  { value: "vision", label: "Blurred vision" },
  { value: "weakness", label: "Weakness" },
  { value: "chest", label: "Chest pain" },
]

const riskCatalogue = [
  { value: "pregnant", label: "Pregnant" },
  { value: "under5", label: "Under 5 years" },
  { value: "over60", label: "Over 60" },
  { value: "hypertension", label: "Hypertension" },
  { value: "diabetes", label: "Diabetes" },
]

const severityStyles: Record<SeverityLevel, string> = {
  emergency: "bg-red-500/10 text-red-400 border-red-500/30",
  urgent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  routine: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
}

export default function TriagePage() {
  const [patientName, setPatientName] = useState("")
  const [gender, setGender] = useState<"male" | "female">("female")
  const [age, setAge] = useState("30")
  const [onset, setOnset] = useState("24")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["fever", "headache"])
  const [riskFactors, setRiskFactors] = useState<string[]>(["over60"])
  const [temperature, setTemperature] = useState("38.2")
  const [heartRate, setHeartRate] = useState("110")
  const [systolic, setSystolic] = useState("140")
  const [diastolic, setDiastolic] = useState("90")
  const [spo2, setSpo2] = useState("97")
  const [freeText, setFreeText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TriageRecommendation | null>(null)

  const toggleValue = (value: string, list: string[], setter: (values: string[]) => void) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    )
  }

  const derivedRiskFactors = useMemo(() => {
    const computed: string[] = [...riskFactors]
    const numericAge = Number(age)
    if (!Number.isNaN(numericAge) && numericAge < 5 && !computed.includes("under5")) {
      computed.push("under5")
    }
    if (!Number.isNaN(numericAge) && numericAge > 60 && !computed.includes("over60")) {
      computed.push("over60")
    }
    return computed
  }, [age, riskFactors])

  const handleAssessment = () => {
    setLoading(true)
    setTimeout(() => {
      const payload: PatientInput = {
        name: patientName || "Unknown",
        age: Number(age) || 0,
        gender,
        pregnant: derivedRiskFactors.includes("pregnant"),
        symptoms: selectedSymptoms,
        vitals: {
          temperature: Number(temperature) || null,
          heartRate: Number(heartRate) || null,
          systolic: Number(systolic) || null,
          diastolic: Number(diastolic) || null,
          spo2: Number(spo2) || null,
        },
        riskFactors: derivedRiskFactors,
        onsetHours: Number(onset) || 0,
        notes: freeText,
      }

      const assessment = triagePatient(payload)
      setResult(assessment)
      setLoading(false)
    }, 800)
  }

  return (
    <AuthGuard requiredFeature="triage">
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold text-white">AI Clinical Triage</h1>
            <p className="text-slate-400 text-lg max-w-3xl">
              Structured triage assistant that blends vitals, symptoms, and facility protocols to recommend stabilisation, referral, and medication pathways within seconds.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card className="bg-slate-900/60 border-slate-800">
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Patient name</label>
                    <Input
                      value={patientName}
                      onChange={(event) => setPatientName(event.target.value)}
                      placeholder="Patient name"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Gender</label>
                    <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                      <SelectTrigger className="bg-slate-950 border-slate-800 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Age</label>
                    <Input
                      value={age}
                      onChange={(event) => setAge(event.target.value)}
                      type="number"
                      min={0}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Symptom onset (hrs)</label>
                    <Input
                      value={onset}
                      onChange={(event) => setOnset(event.target.value)}
                      type="number"
                      min={0}
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Temperature °C</label>
                    <Input
                      value={temperature}
                      onChange={(event) => setTemperature(event.target.value)}
                      type="number"
                      step="0.1"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Heart rate</label>
                    <Input
                      value={heartRate}
                      onChange={(event) => setHeartRate(event.target.value)}
                      type="number"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Blood pressure (systolic)</label>
                    <Input
                      value={systolic}
                      onChange={(event) => setSystolic(event.target.value)}
                      type="number"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Blood pressure (diastolic)</label>
                    <Input
                      value={diastolic}
                      onChange={(event) => setDiastolic(event.target.value)}
                      type="number"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">SpO₂ %</label>
                    <Input
                      value={spo2}
                      onChange={(event) => setSpo2(event.target.value)}
                      type="number"
                      className="bg-slate-950 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-slate-300 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-slate-500" /> Presenting symptoms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {symptomCatalogue.map((symptom) => {
                      const selected = selectedSymptoms.includes(symptom.value)
                      return (
                        <button
                          key={symptom.value}
                          type="button"
                          onClick={() => toggleValue(symptom.value, selectedSymptoms, setSelectedSymptoms)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            selected
                              ? "bg-emerald-500/20 border border-emerald-400 text-emerald-200"
                              : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {symptom.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-slate-300 flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" /> Risk modifiers
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {riskCatalogue.map((risk) => {
                      const selected = riskFactors.includes(risk.value)
                      return (
                        <button
                          key={risk.value}
                          type="button"
                          onClick={() => toggleValue(risk.value, riskFactors, setRiskFactors)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            selected
                              ? "bg-amber-500/20 border border-amber-400 text-amber-200"
                              : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {risk.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-slate-500" /> Clinical notes
                  </label>
                  <Textarea
                    value={freeText}
                    onChange={(event) => setFreeText(event.target.value)}
                    placeholder="Describe notable findings, allergies, or medication history"
                    className="min-h-[100px] bg-slate-950 border-slate-800 text-slate-200"
                  />
                </div>

                <Button onClick={handleAssessment} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                  {loading ? "Analysing vitals…" : "Run AI Triage"}
                </Button>
              </div>
            </Card>

            <Card className="bg-slate-900/60 border-slate-800">
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-emerald-400" /> Triage disposition
                    </h2>
                    <p className="text-sm text-slate-400">
                      Generated from structured symptom scoring and vitals safety thresholds.
                    </p>
                  </div>
                  {result && (
                    <Badge className={`border ${severityStyles[result.severity]}`}>{result.severity.toUpperCase()}</Badge>
                  )}
                </div>

                {!result && (
                  <div className="text-sm text-slate-400 space-y-3">
                    <p>
                      Provide presenting complaints, vitals, and risk modifiers to receive a confidence-weighted clinical pathway. AI recommendations mirror Ondo State PHC protocols.
                    </p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Thermometer className="h-4 w-4" />
                      AI monitors thresholds continuously for early escalation.
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" /> {result.condition}
                      </h3>
                      <p className="text-sm text-slate-300">
                        Confidence {result.confidence}% with matched symptoms: {result.matchedSymptoms.join(", ") || "None"}
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <Card className="bg-slate-950/40 border-slate-800">
                        <div className="p-4 space-y-2">
                          <h4 className="text-sm font-semibold text-white">Immediate clinical actions</h4>
                          <ul className="space-y-1 text-sm text-slate-300 list-disc pl-4">
                            {result.clinicalActions.map((action) => (
                              <li key={action}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      </Card>

                      <Card className="bg-slate-950/40 border-slate-800">
                        <div className="p-4 space-y-2">
                          <h4 className="text-sm font-semibold text-white">Investigations & medications</h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-xs uppercase text-slate-500">Investigations</p>
                              <ul className="space-y-1 text-sm text-slate-300 list-disc pl-4">
                                {result.investigations.map((investigation) => (
                                  <li key={investigation}>{investigation}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs uppercase text-slate-500">Medications</p>
                              <ul className="space-y-1 text-sm text-slate-300 list-disc pl-4">
                                {result.medications.map((medication) => (
                                  <li key={medication}>{medication}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Card>

                      <Card className="bg-slate-950/40 border-slate-800">
                        <div className="p-4 space-y-2">
                          <h4 className="text-sm font-semibold text-white">Referral guidance</h4>
                          <p className="text-sm text-slate-300">
                            {result.referral.needed ? (
                              <span>
                                Refer to <strong>{result.referral.target}</strong> — {result.referral.reason}
                              </span>
                            ) : (
                              "Manage within facility; escalate if condition deteriorates."
                            )}
                          </p>
                          <p className="text-xs text-slate-500">Monitoring</p>
                          <ul className="space-y-1 text-sm text-slate-300 list-disc pl-4">
                            {result.monitoring.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="text-xs text-slate-500 border-t border-slate-800 pt-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Always combine AI suggestions with clinical judgement and national treatment guidelines.
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
