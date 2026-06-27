import { useState } from 'react'
import { updateReadLocal } from '../dataService'

const SUGGESTED_TAGS = [
  'food change', 'litter', 'vet visit', 'medication',
  'visitors', 'travel', 'play', 'sleep', 'appetite',
  'new toy', 'grooming', 'outdoor',
]

/**
 * Appears after saving a read — lets the user attach context tags and a freeform note.
 * Persists to localStorage immediately on every toggle/change.
 */
export default function NoteTagEditor({ catId, readId, onDone }) {
  const [selectedTags, setSelectedTags] = useState([])
  const [note, setNote]                 = useState('')
  const [saving, setSaving]             = useState(false)
  const [done, setDone]                 = useState(false)

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleSkip() {
    onDone?.()
  }

  async function handleSave() {
    setSaving(true)
    updateReadLocal(catId, readId, { tags: selectedTags, note: note.trim() })
    setSaving(false)
    setDone(true)
    setTimeout(() => onDone?.(), 600)
  }

  if (done) {
    return (
      <div className="bg-surface-container rounded-2xl px-5 py-4 flex items-center gap-3 fade-in">
        <span className="text-xl">✓</span>
        <p className="text-sm font-medium text-on-surface">Context saved</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container rounded-2xl px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-on-surface-muted uppercase tracking-widest">
          Add context
        </p>
        <button
          onClick={handleSkip}
          className="text-xs text-on-surface-muted/60 hover:text-on-surface-muted transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 ${
              selectedTags.includes(tag)
                ? 'bg-primary-container text-white shadow-sm'
                : 'bg-surface-container-high text-on-surface-muted hover:bg-surface-dim'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Note input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Anything to note about today? (optional)"
        rows={2}
        className="w-full bg-white/70 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted/50 outline-none resize-none ring-1 ring-outline/20 focus:ring-primary-container/60 transition-shadow"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 w-full py-3 rounded-full bg-primary-container text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 shadow-sm"
      >
        {saving ? 'Saving…' : 'Save context'}
      </button>
    </div>
  )
}
