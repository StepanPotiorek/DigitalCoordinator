"use client"

import { useState, useEffect } from "react"
import { TextField } from "@/components/ui/text-field"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"

interface ProfileData {
  countryOfResidence: string
  currentEmployer: string
  currentPosition: string
  englishLevel: string
  preferredPosition: string
  availableStartDate: string
  interestedLongTerm: boolean | null
  validPassport: boolean | null
  validDriversLicense: boolean | null
  driversLicenseCategory: string
  drivingExperience: string
  additionalComments: string
}

const initialProfile: ProfileData = {
  countryOfResidence: "",
  currentEmployer: "",
  currentPosition: "",
  englishLevel: "",
  preferredPosition: "",
  availableStartDate: "",
  interestedLongTerm: null,
  validPassport: null,
  validDriversLicense: null,
  driversLicenseCategory: "",
  drivingExperience: "",
  additionalComments: "",
}

export default function CandidateProfilePage() {
  const lang = useLang()
  const [form, setForm] = useState<ProfileData>(initialProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/user/candidate-profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.countryOfResidence !== undefined) {
          setForm({
            countryOfResidence: data.countryOfResidence || "",
            currentEmployer: data.currentEmployer || "",
            currentPosition: data.currentPosition || "",
            englishLevel: data.englishLevel || "",
            preferredPosition: data.preferredPosition || "",
            availableStartDate: data.availableStartDate || "",
            interestedLongTerm: data.interestedLongTerm ?? null,
            validPassport: data.validPassport ?? null,
            validDriversLicense: data.validDriversLicense ?? null,
            driversLicenseCategory: data.driversLicenseCategory || "",
            drivingExperience: data.drivingExperience || "",
            additionalComments: data.additionalComments || "",
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleBoolean(name: string, value: boolean | null) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError("")

    const res = await fetch("/api/user/candidate-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to save")
      setSaving(false)
      return
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Candidate Information</h1>
      <p className="mt-1 text-sm text-slate-400">
        Fill in your profile to help us find the right job for you.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-900/50 px-4 py-2 text-sm text-red-400">{error}</p>
      )}

      {saved && (
        <p className="mt-4 rounded-lg bg-emerald-900/50 px-4 py-2 text-sm text-emerald-400">Profile saved successfully!</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <TextField
          id="countryOfResidence"
          label="Current Country of Residence"
          value={form.countryOfResidence}
          onChange={handleChange}
          placeholder="e.g. Philippines"
        />

        <TextField
          id="currentEmployer"
          label="Current Employer"
          value={form.currentEmployer}
          onChange={handleChange}
          placeholder="Company name (if any)"
        />

        <TextField
          id="currentPosition"
          label="Current Position"
          value={form.currentPosition}
          onChange={handleChange}
          placeholder="e.g. Factory worker"
        />

        <div>
          <label htmlFor="englishLevel" className="block text-sm font-medium text-slate-300">
            English Proficiency Level
          </label>
          <select
            id="englishLevel"
            name="englishLevel"
            value={form.englishLevel}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select your level...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="fluent">Fluent / Native</option>
          </select>
        </div>

        <TextField
          id="preferredPosition"
          label="Preferred Job Position in CZ"
          value={form.preferredPosition}
          onChange={handleChange}
          placeholder="e.g. Warehouse worker"
        />

        <TextField
          id="availableStartDate"
          label="Available Start Date"
          value={form.availableStartDate}
          onChange={handleChange}
          placeholder="e.g. August 2026"
        />

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Interested in Long-Term Employment?
          </label>
          <div className="mt-1 flex gap-4">
            <button
              type="button"
              onClick={() => handleBoolean("interestedLongTerm", true)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.interestedLongTerm === true
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("interestedLongTerm", false)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.interestedLongTerm === false
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("interestedLongTerm", null)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.interestedLongTerm === null
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Not sure
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Do you have a valid Passport?
          </label>
          <div className="mt-1 flex gap-4">
            <button
              type="button"
              onClick={() => handleBoolean("validPassport", true)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validPassport === true
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("validPassport", false)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validPassport === false
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("validPassport", null)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validPassport === null
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Not sure
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300">
            Do you have a valid Driver&apos;s License?
          </label>
          <div className="mt-1 flex gap-4">
            <button
              type="button"
              onClick={() => handleBoolean("validDriversLicense", true)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validDriversLicense === true
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("validDriversLicense", false)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validDriversLicense === false
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              No
            </button>
            <button
              type="button"
              onClick={() => handleBoolean("validDriversLicense", null)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                form.validDriversLicense === null
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Not sure
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="driversLicenseCategory" className="block text-sm font-medium text-slate-300">
            Driver&apos;s License Category
          </label>
          <select
            id="driversLicenseCategory"
            name="driversLicenseCategory"
            value={form.driversLicenseCategory}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select category...</option>
            <option value="A">A — Motorcycle</option>
            <option value="B">B — Car</option>
            <option value="C">C — Truck</option>
            <option value="D">D — Bus</option>
            <option value="BE">BE — Car with trailer</option>
            <option value="CE">CE — Truck with trailer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="drivingExperience" className="block text-sm font-medium text-slate-300">
            Years of Driving Experience
          </label>
          <select
            id="drivingExperience"
            name="drivingExperience"
            value={form.drivingExperience}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select years...</option>
            <option value="0">None</option>
            <option value="1">Less than 1 year</option>
            <option value="2">1-2 years</option>
            <option value="5">3-5 years</option>
            <option value="10">5-10 years</option>
            <option value="15">10+ years</option>
          </select>
        </div>

        <div>
          <label htmlFor="additionalComments" className="block text-sm font-medium text-slate-300">
            Additional Comments
          </label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            value={form.additionalComments}
            onChange={handleChange}
            rows={4}
            placeholder="Any other information you'd like to share..."
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>


    </div>
  )
}
