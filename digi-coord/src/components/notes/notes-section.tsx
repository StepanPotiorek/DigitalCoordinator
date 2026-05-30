"use client"

import { useEffect, useState, useRef } from "react"

interface Note {
  id: number
  content: string
  createdBy: string
  createdAt: string
}

export function NotesSection({ workerId }: { workerId: number }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const fetchNotes = async () => {
    const res = await fetch(`/api/notes?workerId=${workerId}`)
    if (res.ok) setNotes(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [workerId])

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId, content: content.trim() }),
    })
    if (res.ok) {
      setContent("")
      fetchNotes()
    }
    setSaving(false)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-white">Internal Notes</h2>

      <form ref={formRef} onSubmit={addNote} className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add an internal note..."
          rows={2}
          className="mb-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add Note"}
        </button>
      </form>

      {loading ? (
        <div className="text-sm text-slate-400">Loading...</div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-slate-500">No notes yet.</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
            >
              <p className="whitespace-pre-wrap text-sm text-slate-200">{note.content}</p>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                <span>{note.createdBy}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
