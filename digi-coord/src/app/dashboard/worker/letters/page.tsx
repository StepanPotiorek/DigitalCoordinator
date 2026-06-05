"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { letterCategories, letterIcons, type LetterCategory } from "@/lib/letter-guides"

interface LetterRecord {
  id: number
  sender: string | null
  purpose: string | null
  actionRequired: string | null
  deadline: string | null
  explanation: string | null
  photoPath: string
  mimeType: string
  aiConfidence: number | null
  createdAt: string
}

type ViewState =
  | { type: "grid" }
  | { type: "category"; category: LetterCategory }
  | { type: "upload" }
  | { type: "result"; letter: LetterRecord }

export default function LettersPage() {
  const [view, setView] = useState<ViewState>({ type: "grid" })
  const [letters, setLetters] = useState<LetterRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [aiConfigured, setAiConfigured] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch("/api/worker/me/letters")
      .then((r) => r.json())
      .then((data) => {
        setLetters(Array.isArray(data) ? data : [])
      })
      .finally(() => setLoading(false))

    // Check if AI is configured by trying a lightweight check
    fetch("/api/ai/analyze-letter", { method: "POST", body: "{}" }).catch(() => {})
    // If GEMINI_API_KEY is not set, the analyze endpoint returns null - we just treat it as not configured
  }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setUploadError("")

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setAnalyzing(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch("/api/worker/me/letters", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        setUploadError(err.error || "Upload failed")
        setUploading(false)
        setAnalyzing(false)
        return
      }

      const letter: LetterRecord = await res.json()
      setLetters((prev) => [letter, ...prev])
      setView({ type: "result", letter })
    } catch {
      setUploadError("Upload failed. Try again.")
    }

    setUploading(false)
    setAnalyzing(false)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadError("")
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file))
      } else {
        setPreviewUrl(null)
      }
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/worker/me/letters/${id}`, { method: "DELETE" })
    if (res.ok) {
      setLetters((prev) => prev.filter((l) => l.id !== id))
    }
  }

  if (view.type === "category") {
    const cat = view.category
    const t = (obj: { en: string; cz: string }) => obj.en
    const reasons = cat.commonReasons.en
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => setView({ type: "grid" })}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to categories
        </button>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{cat.icon}</span>
            <h2 className="text-xl font-bold text-white">{t(cat.title)}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-400">Common reasons</h3>
              <ul className="space-y-1.5">
                {reasons.map((reason: string) => (
                  <li key={reason} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 shrink-0 text-slate-600">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-4">
              <h3 className="mb-2 text-sm font-semibold text-amber-400">⚠️ What should I do?</h3>
              <p className="text-sm text-slate-300">{t(cat.action)}</p>
            </div>

            {cat.requiresCoordinator && cat.coordinatorNote && (
              <div className="rounded-lg border border-blue-800/50 bg-blue-950/30 p-4">
                <h3 className="mb-2 text-sm font-semibold text-blue-400">📞 Contact your coordinator</h3>
                <p className="text-sm text-slate-300">{t(cat.coordinatorNote)}</p>
              </div>
            )}

            {!cat.requiresCoordinator && (
              <p className="text-xs text-slate-500">
                You can handle this on your own. Contact your coordinator only if you are unsure.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (view.type === "result") {
    const letter = view.letter
    const icon = letter.sender ? (letterIcons[letter.sender] || "📮") : "📮"
    const senderLabel = letter.sender
      ? letterCategories.find((c) => c.id === letter.sender)?.title.en || letter.sender
      : "Unknown"

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => setView({ type: "grid" })}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to categories
        </button>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">AI Analysis Result</h2>
              {letter.aiConfidence && (
                <span className="text-xs text-emerald-400">
                  Analyzed by AI
                </span>
              )}
            </div>
          </div>

          {letter.photoPath && (
            <div className="mb-4 overflow-hidden rounded-lg border border-slate-700">
              <img
                src={letter.photoPath}
                alt="Letter photo"
                className="max-h-64 w-full object-contain bg-slate-950"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-800/50 p-3">
                <div className="text-xs text-slate-500">Sender</div>
                <div className="text-sm font-medium text-white">{senderLabel}</div>
              </div>
              {letter.deadline && (
                <div className="rounded-lg bg-slate-800/50 p-3">
                  <div className="text-xs text-slate-500">Deadline</div>
                  <div className="text-sm font-medium text-amber-400">
                    {new Date(letter.deadline).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {letter.purpose && (
              <div className="rounded-lg bg-slate-800/50 p-3">
                <div className="text-xs text-slate-500">Purpose</div>
                <div className="text-sm text-white">{letter.purpose}</div>
              </div>
            )}

            {letter.actionRequired && (
              <div className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-3">
                <div className="text-xs font-medium text-amber-400">Action Required</div>
                <div className="text-sm text-white">{letter.actionRequired}</div>
              </div>
            )}

            {letter.explanation && (
              <div className="rounded-lg border border-blue-800/50 bg-blue-950/30 p-3">
                <div className="text-xs font-medium text-blue-400">Explanation</div>
                <div className="text-sm text-slate-200">{letter.explanation}</div>
              </div>
            )}

            {letter.sender && letter.sender !== "OTHER" && (
              <button
                onClick={() => {
                  const cat = letterCategories.find((c) => c.id === letter.sender)
                  if (cat) setView({ type: "category", category: cat })
                }}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Show guide for {senderLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (view.type === "upload") {
    const hasApiKey = typeof process !== "undefined" // stub - real check is at runtime
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          onClick={() => setView({ type: "grid" })}
          className="text-sm text-slate-400 hover:text-white transition"
        >
          ← Back to categories
        </button>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Upload a letter photo</h2>
            <p className="mt-1 text-sm text-slate-400">
              Take a photo or upload a scan of the letter. AI will analyze it.
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 p-8 text-center transition hover:border-blue-600 hover:bg-slate-800/50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <>
                <span className="mb-2 text-3xl">📸</span>
                <p className="text-sm text-slate-400">
                  Tap to select a photo or drag & drop
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  JPG, PNG, WEBP or PDF — max 20MB
                </p>
              </>
            )}
          </div>

          {selectedFile && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-white">{selectedFile.name}</div>
                <div className="text-xs text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                }}
                className="ml-2 text-sm text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          )}

          {uploadError && (
            <p className="mb-4 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-400">
              {uploadError}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing
              ? "Analyzing letter..."
              : uploading
                ? "Uploading..."
                : "Upload & Analyze"}
          </button>

          {analyzing && (
            <div className="mt-4 text-center text-sm text-slate-400">
              <span className="inline-block animate-pulse">AI is reading the letter...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid view (default)
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">📬 My Letters</h1>
        <p className="mt-1 text-sm text-slate-400">
          Understand official letters you receive. Choose a category or upload a photo.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {letterCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setView({ type: "category", category: cat })}
            className="group flex flex-col items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-center backdrop-blur-sm transition hover:border-blue-700 hover:bg-slate-800/50"
          >
            <span className="text-2xl transition group-hover:scale-110">{cat.icon}</span>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition">
              {cat.title.en}
            </span>
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-4 backdrop-blur-sm">
        <button
          onClick={() => setView({ type: "upload" })}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm text-slate-400 transition hover:bg-slate-800/50 hover:text-white"
        >
          <span className="text-lg">📸</span>
          <span>Upload a photo of your letter — AI will analyze it</span>
        </button>
      </div>

      {/* History */}
      {letters.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-slate-400">Letter History</h3>
          <div className="space-y-2">
            {letters.map((letter) => {
              const icon = letter.sender ? (letterIcons[letter.sender] || "📮") : "📮"
              const senderLabel = letter.sender
                ? letterCategories.find((c) => c.id === letter.sender)?.title.en || letter.sender
                : "Pending analysis"
              return (
                <button
                  key={letter.id}
                  onClick={() => setView({ type: "result", letter })}
                  className="group flex w-full items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-left transition hover:bg-slate-800/50"
                >
                  <span className="text-lg">{icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">
                      {senderLabel}
                    </div>
                    {letter.purpose && (
                      <div className="truncate text-xs text-slate-400">{letter.purpose}</div>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(letter.id)
                    }}
                    className="opacity-0 transition group-hover:opacity-100 text-xs text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center text-sm text-slate-400">Loading...</div>
      )}

      {!loading && letters.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center">
          <p className="text-sm text-slate-500">No letters yet.</p>
          <p className="mt-1 text-xs text-slate-600">
            Upload a letter photo or browse categories above.
          </p>
        </div>
      )}
    </div>
  )
}
