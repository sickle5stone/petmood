import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoBook, IcoPlus } from '../components/icons'

const LS_KEY = (catId) => `petmood_training_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const TECHNIQUES = ['Clicker training', 'Treat luring', 'Target stick', 'Free shaping', 'Desensitization', 'Counter-conditioning', 'Play-based', 'Verbal cue']
const SUCCESS_LEVELS = ['Breakthrough', 'Good progress', 'Steady', 'Struggled', 'Setback']
const SUCCESS_COLORS = { Breakthrough: '#ccebc7', 'Good progress': '#bfdbfe', Steady: '#fde68a', Struggled: '#fed7aa', Setback: '#fecaca' }

function SessionCard({ session }) {
  const color = SUCCESS_COLORS[session.success] ?? '#f0edef'
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color }}>
          <IcoBook size={16} color="#1b1b1d" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-on-surface">{session.cue}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: color }}>
              {session.success}
            </span>
          </div>
          <p className="text-xs text-on-surface-muted">{session.technique} · {session.duration}min</p>
          {session.notes && <p className="text-xs text-on-surface-muted/70 mt-1.5 leading-snug">{session.notes}</p>}
        </div>
        <span className="text-[11px] text-on-surface-muted flex-shrink-0">
          {new Date(session.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

export default function TrainingLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [sessions, setSessions] = useState([])
  const [cues, setCues] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showAddCue, setShowAddCue] = useState(false)
  const [form, setForm] = useState({ cue: '', technique: 'Clicker training', duration: '5', success: 'Good progress', notes: '', date: new Date().toISOString().slice(0, 10) })
  const [newCue, setNewCue] = useState('')

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id)) ?? {}
    setSessions(data.sessions ?? [])
    setCues(data.cues ?? ['Sit', 'Come', 'Stay', 'High five', 'Touch target'])
  }, [cat.id])

  function save(s, c) {
    setSessions(s ?? sessions)
    setCues(c ?? cues)
    lsSet(LS_KEY(cat.id), { sessions: s ?? sessions, cues: c ?? cues })
  }

  function addSession() {
    if (!form.cue) return
    const updated = [{ ...form, id: `train_${Date.now()}` }, ...sessions]
    save(updated)
    setShowAdd(false)
  }

  function addCue() {
    if (!newCue.trim()) return
    const updated = [...cues, newCue.trim()]
    save(sessions, updated)
    setNewCue('')
    setShowAddCue(false)
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Training Session Log</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform"
        >
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Cue library */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted">Cue Library</p>
            <button onClick={() => setShowAddCue(true)} className="text-xs font-semibold text-primary-container">+ Add cue</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {cues.map((c) => (
              <button
                key={c}
                onClick={() => { setForm((f) => ({ ...f, cue: c })); setShowAdd(true) }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-primary-container hover:text-white transition-all active:scale-95"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <IcoBook size={24} color="#92400e" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No sessions logged yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Track training sessions to see progress over time.</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
              Sessions ({sessions.length} total)
            </p>
            <div className="flex flex-col gap-3">{sessions.slice(0, 20).map((s) => <SessionCard key={s.id} session={s} />)}</div>
          </div>
        )}
      </div>

      {/* Add cue */}
      {showAddCue && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAddCue(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Add new cue</p>
            <input
              autoFocus
              value={newCue}
              onChange={(e) => setNewCue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCue()}
              placeholder="e.g. Roll over, Shake paw"
              className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface text-sm outline-none mb-4"
            />
            <button onClick={addCue} className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Add cue
            </button>
          </div>
        </div>
      )}

      {/* Add session */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out] max-h-[90vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log training session</p>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Cue practiced</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {cues.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, cue: c }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.cue === c ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <input value={form.cue} onChange={(e) => setForm((f) => ({ ...f, cue: e.target.value }))}
                placeholder="Or type custom cue"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Technique</p>
              <div className="flex flex-wrap gap-2">
                {TECHNIQUES.map((t) => (
                  <button key={t} onClick={() => setForm((f) => ({ ...f, technique: t }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.technique === t ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Duration (min)</p>
                <input type="number" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Date</p>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Outcome</p>
              <div className="flex flex-wrap gap-2">
                {SUCCESS_LEVELS.map((s) => (
                  <button key={s} onClick={() => setForm((f) => ({ ...f, success: s }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.success === s ? 'ring-2 ring-primary-container' : ''}`}
                    style={{ background: SUCCESS_COLORS[s] }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Notes</p>
              <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="What happened, what worked..." rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none resize-none" />
            </div>

            <button onClick={addSession} disabled={!form.cue}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40">
              Log session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
