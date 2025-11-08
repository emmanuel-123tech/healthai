export type SeverityLevel = "emergency" | "urgent" | "routine"

export interface PatientVitals {
  temperature: number | null
  heartRate: number | null
  systolic: number | null
  diastolic: number | null
  spo2: number | null
}

export interface PatientInput {
  name: string
  age: number
  gender: "male" | "female"
  pregnant: boolean
  symptoms: string[]
  vitals: PatientVitals
  riskFactors: string[]
  onsetHours: number
  notes?: string
}

export interface TriageRecommendation {
  condition: string
  severity: SeverityLevel
  confidence: number
  matchedSymptoms: string[]
  differentialDiagnoses: string[]
  clinicalActions: string[]
  referral: {
    needed: boolean
    target: string
    reason: string
  }
  investigations: string[]
  medications: string[]
  monitoring: string[]
}

interface KnowledgeBaseCondition {
  condition: string
  keywords: string[]
  severity: SeverityLevel
  baselineConfidence: number
  vitals?: Partial<Record<keyof PatientVitals, { min?: number; max?: number }>>
  investigations: string[]
  interventions: string[]
  medications: string[]
  referral?: {
    needed: boolean
    target: string
    reason: string
  }
  differential: string[]
}

const knowledgeBase: KnowledgeBaseCondition[] = [
  {
    condition: "Severe Malaria",
    keywords: ["fever", "chills", "sweating", "vomiting", "headache", "body pain"],
    severity: "urgent",
    baselineConfidence: 0.82,
    vitals: {
      temperature: { min: 38 },
      heartRate: { min: 110 },
    },
    investigations: ["Malaria RDT", "Full blood count", "Blood glucose"],
    interventions: ["Commence ACT under observation", "Administer IV fluids if dehydrated", "Monitor for cerebral involvement"],
    medications: ["Artemether-Lumefantrine", "Paracetamol"],
    referral: {
      needed: true,
      target: "General Hospital Owo",
      reason: "Requires close monitoring for severe malaria complications",
    },
    differential: ["Acute typhoid", "Viral hemorrhagic fever"],
  },
  {
    condition: "Lower Respiratory Tract Infection",
    keywords: ["cough", "breath", "wheeze", "chest pain", "shortness"],
    severity: "urgent",
    baselineConfidence: 0.76,
    vitals: {
      spo2: { max: 94 },
      heartRate: { min: 105 },
    },
    investigations: ["Pulse oximetry", "Chest auscultation", "Chest X-ray if available"],
    interventions: ["Initiate oxygen therapy if SpO2 < 92%", "Start empiric antibiotics", "Encourage airway clearance"],
    medications: ["Amoxicillin", "Salbutamol inhaler"],
    referral: {
      needed: true,
      target: "PHC Ipele Stabilisation Unit",
      reason: "Respiratory distress indicators present",
    },
    differential: ["Pulmonary tuberculosis", "COVID-19"],
  },
  {
    condition: "Acute Gastroenteritis",
    keywords: ["diarrhea", "vomit", "stool", "abdominal", "cramp"],
    severity: "routine",
    baselineConfidence: 0.7,
    vitals: {
      heartRate: { min: 95 },
    },
    investigations: ["Hydration assessment", "Stool microscopy if persistent", "Electrolyte panel"],
    interventions: ["Oral rehydration therapy", "Zinc supplementation for under-5", "Food safety counselling"],
    medications: ["Oral Rehydration Salts", "Zinc sulfate"],
    referral: {
      needed: false,
      target: "Facility level care",
      reason: "Manageable at primary care with ORS and monitoring",
    },
    differential: ["Cholera", "Typhoid fever"],
  },
  {
    condition: "Hypertensive Emergency",
    keywords: ["headache", "vision", "dizziness", "chest", "weakness"],
    severity: "emergency",
    baselineConfidence: 0.68,
    vitals: {
      systolic: { min: 180 },
      diastolic: { min: 110 },
    },
    investigations: ["Blood pressure repeat", "ECG if available", "Urinalysis"],
    interventions: ["Initiate IV antihypertensives", "Monitor cardiac status", "Assess for target organ damage"],
    medications: ["IV Labetalol", "Sublingual Nifedipine"],
    referral: {
      needed: true,
      target: "State Specialist Hospital Akure",
      reason: "Requires advanced cardiovascular support",
    },
    differential: ["Stroke", "Acute coronary syndrome"],
  },
]

function scoreVitals(
  vitals: PatientVitals,
  criteria: KnowledgeBaseCondition["vitals"],
): number {
  if (!criteria) return 0
  let score = 0
  const entries = Object.entries(criteria)
  entries.forEach(([key, bounds]) => {
    const reading = vitals[key as keyof PatientVitals]
    if (reading == null) return
    if (bounds?.min != null && reading >= bounds.min) {
      score += 0.15
    }
    if (bounds?.max != null && reading <= bounds.max) {
      score += 0.12
    }
  })
  return score
}

function symptomScore(symptoms: string[], keywords: string[]) {
  const normalisedSymptoms = symptoms.map((symptom) => symptom.toLowerCase())
  const matches = keywords.filter((keyword) => normalisedSymptoms.some((symptom) => symptom.includes(keyword)))
  return { matches, score: matches.length * 0.12 }
}

export function triagePatient(input: PatientInput): TriageRecommendation {
  let bestMatch: TriageRecommendation | null = null

  knowledgeBase.forEach((condition) => {
    const { matches, score } = symptomScore(input.symptoms, condition.keywords)
    const vitalScore = scoreVitals(input.vitals, condition.vitals)

    const riskMultiplier = input.riskFactors.includes("pregnant") || input.pregnant ? 1.1 : 1
    const ageMultiplier = input.age < 5 || input.age > 60 ? 1.05 : 1
    const onsetMultiplier = input.onsetHours < 24 ? 1.05 : 0.95

    const compositeConfidence = Math.min(
      0.98,
      condition.baselineConfidence * riskMultiplier * ageMultiplier * onsetMultiplier + score + vitalScore,
    )

    const severity: SeverityLevel =
      condition.severity === "emergency" || (vitalScore > 0.25 && matches.length >= 2)
        ? "emergency"
        : condition.severity

    const referralInfo = condition.referral ?? {
      needed: severity !== "routine",
      target: "Nearest comprehensive centre",
      reason: "Clinical judgement based on AI triage output",
    }

    const recommendation: TriageRecommendation = {
      condition: condition.condition,
      severity,
      confidence: Math.round(compositeConfidence * 100),
      matchedSymptoms: matches,
      differentialDiagnoses: condition.differential,
      clinicalActions: condition.interventions,
      referral: referralInfo,
      investigations: condition.investigations,
      medications: condition.medications,
      monitoring: [
        "Repeat vitals every 30 minutes until stabilised",
        "Document fluid balance",
        `Escalate to supervising officer if deterioration detected (confidence ${Math.round(
          compositeConfidence * 100,
        )}%)`,
      ],
    }

    if (!bestMatch || recommendation.confidence > bestMatch.confidence) {
      bestMatch = recommendation
    }
  })

  if (!bestMatch) {
    return {
      condition: "General assessment required",
      severity: "routine",
      confidence: 65,
      matchedSymptoms: [],
      differentialDiagnoses: ["Malaria", "Respiratory infection", "Gastroenteritis"],
      clinicalActions: ["Complete physical examination", "Collect detailed history", "Schedule follow-up within 48 hours"],
      referral: {
        needed: false,
        target: "Primary care",
        reason: "No high-risk indicators detected",
      },
      investigations: ["Basic vitals", "Rapid malaria diagnostic test"],
      medications: ["Symptomatic relief as per protocol"],
      monitoring: ["Advise patient to return if symptoms worsen", "Reassess in 2 days"],
    }
  }

  return bestMatch
}
