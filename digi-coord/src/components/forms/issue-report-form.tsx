"use client"

import { useState, useRef } from "react"

const issueTypes = [
  { value: "Work", label: "Work" },
  { value: "Accommodation", label: "Accommodation" },
  { value: "Health", label: "Health" },
  { value: "Communication", label: "Communication" },
  { value: "Documents", label: "Documents" },
  { value: "Urgent", label: "Urgent" },
]

type IssueFormData = {
  issueType: string
  description: string
  workerName: string
  whatsapp: string
}

function isVideo(mime: string) {
  return mime.startsWith("video/")
}

export function IssueReportForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<IssueFormData>({
    issueType: "",
    description: "",
    workerName: "",
    whatsapp: "",
  })
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selected])

    for (const file of selected) {
      if (!isVideo(file.type)) {
        const url = URL.createObjectURL(file)
        setPreviews((prev) => [...prev, url])
      }
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      const url = prev[index]
      if (url) URL.revokeObjectURL(url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.issueType) {
      setError("Please select an issue type")
      return
    }
    setSaving(true)
    setError("")

    try {
      let mediaUrls: string[] = []

      if (files.length > 0) {
        const uploadData = new FormData()
        for (const file of files) {
          uploadData.append("files", file)
        }

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        })

        if (!uploadRes.ok) {
          const errData = await uploadRes.json()
          setError(errData.error || "Upload failed")
          return
        }

        const uploadResult = await uploadRes.json()
        mediaUrls = uploadResult.urls
      }

      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType: form.issueType,
          description: `From: ${form.workerName || "Anonymous"} (${form.whatsapp || "no contact"})\n\n${form.description}`,
          workerName: form.workerName || undefined,
          mediaUrls,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to submit")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-800 bg-green-900/20 p-8 text-center backdrop-blur-sm">
        <div className="mb-3 text-3xl">✓</div>
        <h2 className="mb-2 text-xl font-semibold text-white">
          Issue Reported
        </h2>
        <p className="text-slate-400">
          Your issue has been submitted. A coordinator will follow up with you
          as soon as possible.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          For emergencies, always call 112 immediately.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-amber-800 bg-amber-900/20 px-4 py-3 text-sm text-amber-400">
        ⚠ For immediate danger, call emergency number <strong>112</strong>{" "}
        before reporting here.
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Issue Type *
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {issueTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setForm({ ...form, issueType: type.value })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                form.issueType === type.value
                  ? "border-blue-600 bg-blue-900/30 text-blue-300"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Description *
        </label>
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="What happened? When? Where? Who is involved?"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Your Name
          </label>
          <input
            value={form.workerName}
            onChange={(e) =>
              setForm({ ...form, workerName: e.target.value })
            }
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            WhatsApp Number
          </label>
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            placeholder="+420..."
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-300">
          Photos / Videos
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative">
              {isVideo(file.type) ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-2xl">
                  🎬
                </div>
              ) : (
                <img
                  src={previews[i]}
                  alt=""
                  className="h-20 w-20 rounded-lg border border-slate-700 object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-slate-700 text-2xl text-slate-500 transition hover:border-slate-500 hover:text-slate-300"
          >
            +
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Images (JPG, PNG, WebP) and videos (MP4, WebM). Max 50MB each.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving || !form.issueType}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {saving ? "Uploading & Submitting..." : "Submit Issue"}
      </button>
    </form>
  )
}
