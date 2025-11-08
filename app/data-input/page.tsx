"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet, Plus, ArrowLeft, CheckCircle } from "@/components/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DataInputPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("csv")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Manual input form state
  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
    // Disease cases
    malariaCase: "",
    typhoidCases: "",
    diarrheaCases: "",
    respiratoryInfections: "",
    // Patient metrics
    totalPatientVisits: "",
    newPatients: "",
    returnPatients: "",
    emergencyCases: "",
    // Maternal health
    antenatalVisits: "",
    deliveries: "",
    postnatalVisits: "",
    maternalDeaths: "",
    // Child health
    childImmunizations: "",
    underFiveVisits: "",
    malnutritionCases: "",
    childDeaths: "",
    // Stock levels (1-10 scale)
    antimalarialStock: "",
    antibioticsStock: "",
    vaccineStock: "",
    medicalSuppliesStock: "",
    // Additional metrics
    hivTests: "",
    tbScreenings: "",
    familyPlanningVisits: "",
    outbreakAlerts: "",
  })

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      setUploadSuccess(false)
    }
  }

  const handleCsvSubmit = () => {
    if (csvFile) {
      // Backend implementation will handle the actual upload
      console.log("[v0] CSV file ready for upload:", csvFile.name)
      setUploadSuccess(true)
      setTimeout(() => {
        router.push("/portal")
      }, 2000)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Backend implementation will handle the actual data submission
    console.log("[v0] Manual data ready for submission:", formData)
    setSubmitSuccess(true)
    setTimeout(() => {
      router.push("/portal")
    }, 2000)
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString())

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => router.push("/portal")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Health Data Input</h1>
            <p className="text-slate-300">
              Submit health data that will automatically appear in LGA and State dashboards
            </p>
          </div>

          <Card className="bg-slate-900/50 border-slate-800 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="csv" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CSV
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Manual Input
                </TabsTrigger>
              </TabsList>

              {/* CSV Upload Tab */}
              <TabsContent value="csv" className="space-y-6">
                <div className="text-center py-8">
                  <div className="mb-6">
                    <FileSpreadsheet className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Upload CSV File</h3>
                    <p className="text-slate-400 text-sm">Upload a CSV file containing your health facility data</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 hover:border-emerald-500 transition-colors">
                      <Input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" id="csv-upload" />
                      <Label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <span className="text-slate-300">{csvFile ? csvFile.name : "Click to select CSV file"}</span>
                        <span className="text-xs text-slate-500">Supported format: .csv</span>
                      </Label>
                    </div>

                    {csvFile && (
                      <Button onClick={handleCsvSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Upload Data
                      </Button>
                    )}

                    {uploadSuccess && (
                      <Alert className="bg-emerald-500/10 border-emerald-500/20">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <AlertDescription className="text-emerald-400">
                          Data uploaded successfully! Redirecting to portal...
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="mt-8 text-left max-w-2xl mx-auto">
                    <h4 className="text-sm font-semibold text-white mb-2">CSV Format Requirements:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Include headers: Month, Year, Disease Cases, Patient Visits, Stock Levels, etc.</li>
                      <li>• Use consistent date format (YYYY-MM)</li>
                      <li>• Numeric values only for counts and metrics</li>
                      <li>• Stock levels should be on a scale of 1-10</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              {/* Manual Input Tab */}
              <TabsContent value="manual">
                <form onSubmit={handleManualSubmit} className="space-y-8">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Reporting Period</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Month</Label>
                        <Select
                          value={formData.month}
                          onValueChange={(value) => setFormData({ ...formData, month: value })}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Year</Label>
                        <Select
                          value={formData.year}
                          onValueChange={(value) => setFormData({ ...formData, year: value })}
                        >
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Disease Cases */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Disease Cases</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Malaria Cases</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.malariaCase}
                          onChange={(e) => setFormData({ ...formData, malariaCase: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Typhoid Cases</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.typhoidCases}
                          onChange={(e) => setFormData({ ...formData, typhoidCases: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Diarrhea Cases</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.diarrheaCases}
                          onChange={(e) => setFormData({ ...formData, diarrheaCases: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Respiratory Infections</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.respiratoryInfections}
                          onChange={(e) => setFormData({ ...formData, respiratoryInfections: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Patient Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Patient Visits</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Total Patient Visits</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.totalPatientVisits}
                          onChange={(e) => setFormData({ ...formData, totalPatientVisits: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">New Patients</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.newPatients}
                          onChange={(e) => setFormData({ ...formData, newPatients: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Return Patients</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.returnPatients}
                          onChange={(e) => setFormData({ ...formData, returnPatients: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Emergency Cases</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.emergencyCases}
                          onChange={(e) => setFormData({ ...formData, emergencyCases: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Maternal Health */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Maternal Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Antenatal Visits</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.antenatalVisits}
                          onChange={(e) => setFormData({ ...formData, antenatalVisits: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Deliveries</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.deliveries}
                          onChange={(e) => setFormData({ ...formData, deliveries: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Postnatal Visits</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.postnatalVisits}
                          onChange={(e) => setFormData({ ...formData, postnatalVisits: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Maternal Deaths</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.maternalDeaths}
                          onChange={(e) => setFormData({ ...formData, maternalDeaths: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Child Health */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Child Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Child Immunizations</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.childImmunizations}
                          onChange={(e) => setFormData({ ...formData, childImmunizations: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Under-5 Visits</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.underFiveVisits}
                          onChange={(e) => setFormData({ ...formData, underFiveVisits: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Malnutrition Cases</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.malnutritionCases}
                          onChange={(e) => setFormData({ ...formData, malnutritionCases: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Child Deaths</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.childDeaths}
                          onChange={(e) => setFormData({ ...formData, childDeaths: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock Levels */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Stock Levels (1-10 Scale)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">Antimalarial Stock</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="1-10"
                          value={formData.antimalarialStock}
                          onChange={(e) => setFormData({ ...formData, antimalarialStock: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Antibiotics Stock</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="1-10"
                          value={formData.antibioticsStock}
                          onChange={(e) => setFormData({ ...formData, antibioticsStock: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Vaccine Stock</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="1-10"
                          value={formData.vaccineStock}
                          onChange={(e) => setFormData({ ...formData, vaccineStock: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Medical Supplies Stock</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          placeholder="1-10"
                          value={formData.medicalSuppliesStock}
                          onChange={(e) => setFormData({ ...formData, medicalSuppliesStock: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Additional Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">HIV Tests Conducted</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.hivTests}
                          onChange={(e) => setFormData({ ...formData, hivTests: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">TB Screenings</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.tbScreenings}
                          onChange={(e) => setFormData({ ...formData, tbScreenings: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Family Planning Visits</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.familyPlanningVisits}
                          onChange={(e) => setFormData({ ...formData, familyPlanningVisits: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Outbreak Alerts</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={formData.outbreakAlerts}
                          onChange={(e) => setFormData({ ...formData, outbreakAlerts: e.target.value })}
                          className="bg-slate-800/50 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {submitSuccess && (
                    <Alert className="bg-emerald-500/10 border-emerald-500/20">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <AlertDescription className="text-emerald-400">
                        Data submitted successfully! Redirecting to portal...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push("/portal")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      Submit Data
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}
