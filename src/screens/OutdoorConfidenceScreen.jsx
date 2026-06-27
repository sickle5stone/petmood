import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoPlus, IcoCheck } from '../components/icons'

const LS_KEY = (catId) => `petmood_outdoor_${catId}`
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const CONFIDENCE_LEVELS = [
  { level: 1, label: 'Refused to go out', color: '#fecaca' },
  { level: 2, label: 'Peeked from doorway', color: '#fed7aa' },
  { level: 3, label: 'Stepped onto balcony/patio', color: '#fde68a' },
  { level: 4, label: 'Explored immediate area', color: '#ccebc7' },
  { level: 5, label: 'Ventured further with calm', color: '#86efac' },
  { level: 6, label: 'Approached new things', color: '#34d399' },
  { level: 7, label: 'Explored independently', color: '#10b981' },
]

const MILESTONES = [
  { id: 'first_step', label: 'First step outside', unlocked: false },
  { id: 'five_min', label: 'Stayed out 5+ minutes', unlocked: false },
  { id: 'sniff_ground', label: 'Sniffed the ground', unlocked: false },
  { id: 'grass', label: 'Walked on grass', unlocked: false },
  { id: 'solo_explore', label: 'Explored solo for 1 min', unlocked: false },
  { id: 'new_smell', label: 'Investigated a new smell', unlocked: false },
  { id: 'met_person', label: 'Stayed calm near a person', unlocked: false },
  { id: 'no_leash', label: 'Explored off-leash in safe area', unlocked: false },
]

export default function OutdoorConfidenceScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [sessions, setSessions] = useState([])
  const [milestones, setMilestones] = useState(MILESTONES.map((m) => ({ ...m })))
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ level: 3, notes: '', date: new Date().toISOString().slice(0, 10) })

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id)) ?? {}
    setSessions(data.sessions ?? [])
    setMilestones(data.milestones ?? MILESTONES.map((m) => ({ ...m })))
  }, [cat.id])

  function save(s, m) {
    setSessions(s ?? sessions)
    setMilestones(m ?? milestones)
    lsSet(LS_KEY(cat.id), { sessions: s ?? sessions, milestones: m ?? milestones })
  }

  function addSession() {
    save([{ ...form, id: `outdoor_${Date.now()}` }, ...sessions])
    setShowAdd(false)
  }

  function toggleMilestone(id) {
    const updated = milestones.map((m) => m.id === id ? { ...m, unlocked: !m.unlocked, unlockedAt: !m.unlocked ? new Date().toISOString() : null } : m)
    save(sessions, updated)
  }

  const _avgLevel = sessions.length > 0 ? Math.round(sessions.reduce((s, e) => s + e.level, 0) / sessions.length) : 0
  const best = sessions.length > 0 ? Math.max(...sessions.map((s) => s.level)) : 0
  const unlockedCount = milestones.filter((m) => m.unlocked).length

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Outdoor Confidence Map</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform">
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-2xl font-bold text-on-surface">{sessions.length}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">sessions</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-2xl font-bold text-on-surface">{best}/7</p>
            <p className="text-xs text-on-surface-muted mt-0.5">best level</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-2xl font-bold text-on-surface">{unlockedCount}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">milestones</p>
          </div>
        </div>

        {/* Confidence levels guide */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Confidence Scale</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {CONFIDENCE_LEVELS.map((cl) => (
              <div key={cl.level} className={`flex items-center gap-3 py-2.5 border-b border-surface-container last:border-0 ${best >= cl.level ? '' : 'opacity-40'}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-on-surface" style={{ background: cl.color }}>
                  {cl.level}
                </div>
                <p className="text-sm text-on-surface">{cl.label}</p>
                {best >= cl.level && <IcoCheck size={14} color="#5c8a5e" />}
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Milestones ({unlockedCount}/{milestones.length})</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3 border-b border-surface-container last:border-0">
                <button onClick={() => toggleMilestone(m.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all active:scale-90 ${m.unlocked ? 'bg-secondary-container border-secondary' : 'border-outline/40'}`}>
                  {m.unlocked && <IcoCheck size={12} color="#5c8a5e" />}
                </button>
                <p className={`text-sm ${m.unlocked ? 'text-on-surface line-through opacity-60' : 'text-on-surface'}`}>{m.label}</p>
                {m.unlockedAt && <span className="text-[10px] text-on-surface-muted ml-auto">{new Date(m.unlockedAt).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Session history */}
        {sessions.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Sessions</p>
            <div className="flex flex-col gap-2">
              {sessions.slice(0, 10).map((s) => {
                const cl = CONFIDENCE_LEVELS.find((c) => c.level === s.level)
                return (
                  <div key={s.id} className="bg-white rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: cl?.color ?? '#f0edef' }}>{s.level}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface">{cl?.label}</p>
                      {s.notes && <p className="text-xs text-on-surface-muted truncate">{s.notes}</p>}
                    </div>
                    <span className="text-[11px] text-on-surface-muted">{new Date(s.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log outdoor session</p>

            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Confidence Level</p>
              <div className="flex flex-col gap-2">
                {CONFIDENCE_LEVELS.map((cl) => (
                  <button key={cl.level} onClick={() => setForm((f) => ({ ...f, level: cl.level }))}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all ${form.level === cl.level ? 'ring-2 ring-primary-container' : ''}`}
                    style={{ background: cl.color + '88' }}>
                    <span className="w-6 text-sm font-bold text-on-surface">{cl.level}</span>
                    <span className="text-sm text-on-surface">{cl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Notes</p>
              <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="What happened..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <button onClick={addSession} className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Log session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
