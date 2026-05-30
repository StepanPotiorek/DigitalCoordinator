"use client"

import { useEffect, useState, useRef } from "react"

interface Document {
  id: number
  type: string
  filename: string
  originalName: string
  uploadedAt: string
}

const docTypeLabels: Record<string, string> = {
  PASSPORT: "Passport",
  VISA: "Visa",
  CONTRACT: "Contract",
  OTHER: "Other",
}

const docTypeColors: Record<string, string> = {
  PASSPORT: "border-blue-800 bg-blue-900/20 text-blue-300",
  VISA: "border-green-800 bg-green-900/20 text-green-300",
  CONTRACT: "border-amber-800 bg-amber-900/20 text-amber-300",
  OTHER: "border-slate-700 bg-slate-800 text-slate-300",
}

export default function WorkerDocumentsPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState("PASSPORT")
  const [error, setError] = useState("")

  async function loadDocs() {
    const res = await fetch("/api/worker/me/documents")
    const data = await res.json()
    setDocs(data)
    setLoading(false)
  }

  useEffect(() => { loadDocs() }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", docType)

    const res = await fetch("/api/worker/me/documents", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Upload failed")
    } else {
      if (fileRef.current) fileRef.current.value = ""
      loadDocs()
    }

    setUploading(false)
  }

  function isImage(name: string) {
    return /\.(jpg|jpeg|png|webp)$/i.test(name)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Documents</h1>
        <p className="mt-1 text-sm text-slate-400">
          Upload your passport, visa, contract and other documents
        </p>
      </div>

      <form onSubmit={handleUpload} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-semibold text-white">Upload Document</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none focus:border-blue-500"
            >
              {Object.entries(docTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">File</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white file:mr-2 file:rounded file:border-0 file:bg-blue-600 file:px-2 file:py-1 file:text-xs file:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={uploading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <p className="mt-2 text-xs text-slate-500">Accepted: JPG, PNG, WebP, PDF. Max 20MB.</p>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : docs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <p className="text-slate-400">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <div key={doc.id} className={`rounded-xl border p-4 backdrop-blur-sm ${docTypeColors[doc.type] || docTypeColors.OTHER}`}>
              <div className="mb-1 text-xs font-medium uppercase tracking-wider opacity-70">
                {docTypeLabels[doc.type] || doc.type}
              </div>
              <div className="truncate text-sm font-medium text-white">
                {doc.originalName}
              </div>
              <div className="mt-1 text-xs opacity-60">
                {new Date(doc.uploadedAt).toISOString().split("T")[0]}
              </div>
              {isImage(doc.filename) ? (
                <a
                  href={`/api/media/${doc.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300"
                >
                  View →
                </a>
              ) : (
                <a
                  href={`/api/media/${doc.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300"
                >
                  Download →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
