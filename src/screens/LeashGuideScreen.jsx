import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoLeash, IcoCheck, IcoChevronRight } from '../components/icons'
import { useState, useEffect } from 'react'

const LS_KEY = (catId) => `petmood_leash_${catId}`
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const GUIDE_STEPS = [
  {
    phase: 1, title: 'Harness Introduction',
    steps: [
      { id: 's1_1', text: 'Place harness near cat without touching — let them sniff and investigate.' },
      { id: 's1_2', text: 'Leave harness near food bowl for positive association.' },
      { id: 's1_3', text: 'Touch cat with harness gently, reward with treats.' },
      { id: 's1_4', text: 'Put harness on for 1–2 minutes, offer high-value treats throughout.' },
    ]
  },
  {
    phase: 2, title: 'Wearing the Harness',
    steps: [
      { id: 's2_1', text: 'Gradually increase harness wear time over days.' },
      { id: 's2_2', text: 'Let cat wear harness during feeding or play.' },
      { id: 's2_3', text: 'Ensure no escape gaps — check 2-finger rule at all points.' },
      { id: 's2_4', text: 'Cat moves comfortably for 15+ minutes without distress.' },
    ]
  },
  {
    phase: 3, title: 'Leash Attachment (Indoors)',
    steps: [
      { id: 's3_1', text: 'Attach leash, let cat drag it around indoors.' },
      { id: 's3_2', text: 'Pick up leash, follow cat — do not pull.' },
      { id: 's3_3', text: 'Practice leash "giving" — light pressure, cat moves toward you.' },
      { id: 's3_4', text: 'Walk figure-8 pattern indoors, cat confident and calm.' },
    ]
  },
  {
    phase: 4, title: 'First Outdoor Experience',
    steps: [
      { id: 's4_1', text: 'Choose quiet time of day, low-traffic area.' },
      { id: 's4_2', text: 'Step out just outside door — let cat decide.' },
      { id: 's4_3', text: 'Let cat sniff and investigate at their pace.' },
      { id: 's4_4', text: 'Return inside before cat shows stress. End positively.' },
    ]
  },
  {
    phase: 5, title: 'Building Duration & Distance',
    steps: [
      { id: 's5_1', text: 'Add 2–3 minutes each successful session.' },
      { id: 's5_2', text: 'Explore new surfaces: grass, concrete, soil.' },
      { id: 's5_3', text: 'Practice "check-ins" — cat looks back at you for reassurance.' },
      { id: 's5_4', text: 'Cat walks confidently and is curious rather than fearful.' },
    ]
  },
]

export default function LeashGuideScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [completed, setCompleted] = useState({})
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState(1)

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id)) ?? {}
    setCompleted(data.completed ?? {})
    setNotes(data.notes ?? '')
  }, [cat.id])

  function toggle(id) {
    const updated = { ...completed, [id]: !completed[id] }
    setCompleted(updated)
    lsSet(LS_KEY(cat.id), { completed: updated, notes })
  }

  const totalSteps = GUIDE_STEPS.reduce((s, p) => s + p.steps.length, 0)
  const doneSteps = Object.values(completed).filter(Boolean).length
  const progress = Math.round((doneSteps / totalSteps) * 100)

  const currentPhase = GUIDE_STEPS.findIndex((p) => p.steps.some((s) => !completed[s.id])) + 1 || GUIDE_STEPS.length

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Leash Training Guide</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {/* Progress */}
        <div className="pm-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <IcoLeash size={18} color="#16a34a" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-on-surface">{doneSteps}/{totalSteps} steps complete</p>
              <p className="text-caption text-on-surface-muted font-medium">Phase {Math.min(currentPhase, GUIDE_STEPS.length)}: {GUIDE_STEPS[Math.min(currentPhase - 1, GUIDE_STEPS.length - 1)].title}</p>
            </div>
            <span className="text-sm font-bold text-primary-container">{progress}%</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary-container rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Phases */}
        {GUIDE_STEPS.map((phase) => {
          const phaseComplete = phase.steps.every((s) => completed[s.id])
          const isExpanded = expanded === phase.phase

          return (
            <div key={phase.phase}>
              <button
                onClick={() => setExpanded(isExpanded ? null : phase.phase)}
                className="w-full flex items-center gap-3 mb-2"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${phaseComplete ? 'bg-secondary-container' : 'bg-surface-container'}`}>
                  {phaseComplete ? <IcoCheck size={14} color="#5c8a5e" /> : phase.phase}
                </div>
                <p className={`flex-1 text-sm font-semibold text-left ${phaseComplete ? 'text-on-surface-muted line-through' : 'text-on-surface'}`}>
                  Phase {phase.phase}: {phase.title}
                </p>
                <IcoChevronRight size={16} color="#857464" className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
              {isExpanded && (
                <div className="pm-card px-4 ml-11">
                  {phase.steps.map((step, i) => (
                    <div key={step.id} className={`flex items-start gap-3 py-3 ${i < phase.steps.length - 1 ? 'border-b border-surface-container' : ''}`}>
                      <button
                        onClick={() => toggle(step.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all active:scale-90 ${completed[step.id] ? 'bg-secondary-container border-secondary' : 'border-outline/40'}`}
                      >
                        {completed[step.id] && <IcoCheck size={12} color="#5c8a5e" />}
                      </button>
                      <p className={`text-sm leading-snug ${completed[step.id] ? 'text-on-surface-muted line-through' : 'text-on-surface'}`}>
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Notes */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Training Notes</p>
          <div className="pm-card p-4">
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); lsSet(LS_KEY(cat.id), { completed, notes: e.target.value }) }}
              placeholder="Notes on reactions, setbacks, breakthroughs..."
              rows={4}
              className="w-full text-sm text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-muted/40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
