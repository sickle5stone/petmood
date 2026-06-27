import { useState } from 'react'
import { saveFeedback } from '../dataService'

const OPTIONS = [
  { id: 'accurate', label: 'Spot on', icon: '✓' },
  { id: 'useful',   label: 'Useful',  icon: '👍' },
  { id: 'unsure',   label: 'Not sure', icon: '~' },
  { id: 'wrong',    label: 'Off',     icon: '✗' },
]

/**
 * Collects a one-tap rating + optional note after each read.
 * Persists to localStorage immediately; attempts Firestore in background.
 *
 * @param {{ readId: string, catId: string }} props
 */
export default function FeedbackWidget({ readId, catId }) {
  const [stage, setStage] = useState('prompt') // 'prompt' | 'note' | 'done'
  const [selected, setSelected] = useState(null)
  const [note, setNote]   = useState('')

  async function handleSelect(id) {
    setSelected(id)
    setStage('note')
    // Optimistic — fire and forget; note may arrive in the next step
    saveFeedback({ readId, catId, rating: id, note: '' }).catch(() => {})
  }

  async function handleSubmitNote() {
    setStage('done')
    if (note.trim()) {
      saveFeedback({ readId, catId, rating: selected, note: note.trim() }).catch(() => {})
    }
  }

  if (stage === 'done') {
    return (
      <p className="text-center text-xs text-on-surface-muted py-2 fade-in">
        Thanks for the feedback
      </p>
    )
  }

  if (stage === 'note') {
    return (
      <div className="flex flex-col gap-2 fade-in">
        <p className="text-xs text-on-surface-muted text-center">Anything to add? (optional)</p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitNote()}
            placeholder="What was off?"
            className="flex-1 px-3 py-2 rounded-xl text-sm bg-surface-container outline-none focus:ring-2 ring-primary-container/40 placeholder:text-on-surface-muted/50"
          />
          <button
            onClick={handleSubmitNote}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-container text-white active:scale-95 transition-transform"
          >
            Done
          </button>
        </div>
        <button
          onClick={handleSubmitNote}
          className="text-xs text-center text-on-surface-muted hover:text-on-surface transition-colors"
        >
          Skip
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-on-surface-muted text-center">Was this read useful?</p>
      <div className="flex gap-1.5">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className="flex-1 flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all text-xs font-medium text-on-surface-muted"
          >
            <span className="text-sm leading-none">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
