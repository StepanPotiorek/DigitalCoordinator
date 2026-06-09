"use client"

import { useEffect, useState } from "react"
import { useLang } from "@/lib/use-lang"
import { t } from "@/lib/translations"
import { PasswordInput } from "@/components/ui/password-input"

interface WorkerData {
  id: number
  name: string
  whatsapp: string
  email: string | null
  employer: string | null
  city: string | null
  accommodation: string | null
  arrivalDate: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  onboardingStatus: string
  createdAt: string
}

export default function WorkerProfilePage() {
  const lang = useLang()
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetch("/api/worker/me")
      .then((r) => r.json())
      .then((data) => {
        const { progress, openIssues, onboardingItems, _count, ...rest } = data
        setWorker(rest)
        setForm({
          name: rest.name || "",
          whatsapp: rest.whatsapp || "",
          emergencyContactName: rest.emergencyContactName || "",
          emergencyContactPhone: rest.emergencyContactPhone || "",
          password: "",
          confirmPassword: "",
        })
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setSaving(true)
    setError("")
    setSaved(false)

    const res = await fetch("/api/worker/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        whatsapp: form.whatsapp,
        emergencyContactName: form.emergencyContactName || null,
        emergencyContactPhone: form.emergencyContactPhone || null,
        password: form.password || undefined,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Failed to save")
    } else {
      setSaved(true)
      setEditMode(false)
      setForm((f) => ({ ...f, password: "", confirmPassword: "" }))
      if (worker) setWorker({ ...worker, name: form.name, whatsapp: form.whatsapp, emergencyContactName: form.emergencyContactName, emergencyContactPhone: form.emergencyContactPhone })
    }

    setSaving(false)
  }

  if (loading) {
    return <div className="text-sm text-slate-400">{t("dashboard.loading", lang)}</div>
  }

  if (!worker) {
    return <div className="text-sm text-slate-400">{t("dashboard.notFound", lang)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("dashboard.myProfile", lang)}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {t("dashboard.personalInfo", lang)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {editMode ? t("form.cancel", lang) : t("dashboard.editProfile", lang)}
        </button>
      </div>

      {editMode ? (
        <form onSubmit={handleSave} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}
          {saved && (
            <div className="mb-4 rounded-lg bg-green-900/30 px-4 py-2 text-sm text-green-400">
              {t("dashboard.profileSaved", lang)}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("form.name", lang)}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("form.whatsapp", lang)}</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("dashboard.emergencyContactName", lang)}</label>
              <input
                value={form.emergencyContactName}
                onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("dashboard.emergencyContactPhone", lang)}</label>
              <input
                value={form.emergencyContactPhone}
                onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("dashboard.newPasswordOptional", lang)}</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                placeholder={t("dashboard.leaveBlank", lang)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">{t("dashboard.confirmNewPassword", lang)}</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder={t("dashboard.confirmNewPassword", lang)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? t("dashboard.saving", lang) : t("dashboard.saveChanges", lang)}
          </button>
        </form>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">{t("dashboard.contactInfo", lang)}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.name", lang)}</dt>
                <dd className="text-white">{worker.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.whatsapp", lang)}</dt>
                <dd className="text-white">{worker.whatsapp}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.email", lang)}</dt>
                <dd className="text-white">{worker.email || "\u2014"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.employer", lang)}</dt>
                <dd className="text-white">{worker.employer || "\u2014"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.city", lang)}</dt>
                <dd className="text-white">{worker.city || "\u2014"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.arrivalDate", lang)}</dt>
                <dd className="text-white">
                  {worker.arrivalDate
                    ? new Date(worker.arrivalDate).toISOString().split("T")[0]
                    : "\u2014"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">{t("dashboard.emergencyContact", lang)}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.name", lang)}</dt>
                <dd className="text-white">
                  {worker.emergencyContactName || "\u2014"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.emergencyPhone", lang)}</dt>
                <dd className="text-white">
                  {worker.emergencyContactPhone || "\u2014"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-white">{t("dashboard.coordinatorContact", lang)}</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.name", lang)}</dt>
                <dd className="text-white">&Scaron;těpán Potiorek</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.whatsapp", lang)}</dt>
                <dd className="text-blue-400">
                  <a href="https://wa.me/420777654279" target="_blank" rel="noopener noreferrer">
                    +420 777 654 279
                  </a>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">{t("form.email", lang)}</dt>
                <dd className="text-blue-400">
                  <a href="mailto:gleestepan@gmail.com">gleestepan@gmail.com</a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
