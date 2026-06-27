import { useState } from 'react'
import { saveFeedback } from '../dataService'
import { IcoCheck, IcoStar, IcoAlertCircle, IcoX } from '../components/icons'

const OPTIONS = [
  { id: 'accurate', label: 'Spot on', Icon: IcoCheck },
  { id: 'useful',   label: 'Useful',  Icon: IcoStar },
  { id: 'unsure',   label: 'Not sure', Icon: IcoAlertCircle },
  { id: 'wrong',    label: 'Off',     Icon: IcoX },
]

export default function FeedbackWidget({ readId, catId }) {
  const [stage, setStage] = useState('prompt')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  async function handleSelect(id) {
    setSelected(id)
    setStage('note')
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
      <p className="text-center text-caption text-on-surface-muted py-2 fade-in">
        Thanks for the feedback
      </p>
    )
  }

  if (stage === 'note') {
    return (
      <div className="pm-card-inset p-4 flex flex-col gap-3 fade-in">
        <p className="text-caption text-on-surface-muted text-center">Anything to add? (optional)</p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitNote()}
            placeholder="What was off?"
            className="flex-1 pm-input !py-2"
          />
          <button
            type="button"
            onClick={handleSubmitNote}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary-container text-white active:scale-95 transition-transform"
          >
            Done
          </button>
        </div>
        <button
          type="button"
          onClick={handleSubmitNote}
          className="text-caption text-center text-on-surface-muted hover:text-on-surface transition-colors"
        >
          Skip
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-caption text-on-surface-muted text-center">Was this read useful?</p>
      <div className="grid grid-cols-4 gap-2">
        {OPTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id)}
            className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl bg-surface-container border border-border-subtle hover:bg-surface-container-high active:scale-95 transition-all duration-150"
          >
            <Icon size={18} color="#857464" />
            <span className="text-2xs font-semibold text-on-surface-muted">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
