import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoDumbbell, IcoPlus, IcoAlertCircle } from '../components/icons'

const LS_KEY = (catId) => `petmood_human_injury_${catId}`
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const INJURY_TYPES = [
  { id: 'scratch', label: 'Scratch', color: '#fed7aa' },
  { id: 'bite', label: 'Bite', color: '#fecaca' },
  { id: 'other', label: 'Other', color: '#f0edef' },
]
const SEVERITY = ['Minor', 'Moderate', 'Required first aid', 'Medical attention needed']
const CONTEXTS = ['During play', 'Handling/restraint', 'Grooming session', 'Unprovoked', 'Redirected aggression', 'Fear response', 'Pain-related', 'Resource guarding']

export default function HumanInjuryLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [entries, setEntries] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ type: 'scratch', severity: 'Minor', context: '', notes: '', date: new Date().toISOString().slice(0, 10), bodyPart: '' })

  useEffect(() => { setEntries(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(u) { setEntries(u); lsSet(LS_KEY(cat.id), u) }

  function addEntry() {
    if (!form.severity) return
    save([{ ...form, id: `injury_${Date.now()}` }, ...entries])
    setShowAdd(false)
    setForm({ type: 'scratch', severity: 'Minor', context: '', notes: '', date: new Date().toISOString().slice(0, 10), bodyPart: '' })
  }

  const biteCount = entries.filter((e) => e.type === 'bite').length
  const scratchCount = entries.filter((e) => e.type === 'scratch').length

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Human Injury Log</h1>
          <p className="text-xs text-on-surface-muted">Scratches & bites from {cat.name}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform">
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Why log this? */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <IcoAlertCircle size={16} color="#92400e" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Why track this?</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">Logging injuries helps identify patterns (triggers, contexts, body language signals to watch for) and guides behavior/training interventions.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="text-2xl font-bold text-on-surface">{scratchCount}</p>
              <p className="text-xs text-on-surface-muted mt-0.5">scratches total</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="text-2xl font-bold text-on-surface">{biteCount}</p>
              <p className="text-xs text-on-surface-muted mt-0.5">bites total</p>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-semibold text-on-surface">No injuries logged</p>
            <p className="text-xs text-on-surface-muted mt-1">Hopefully stays empty!</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Incidents ({entries.length})</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {entries.map((entry, i) => {
                const typeInfo = INJURY_TYPES.find((t) => t.id === entry.type) ?? INJURY_TYPES[0]
                return (
                  <div key={entry.id} className={`flex items-start gap-3 py-3 ${i < entries.length - 1 ? 'border-b border-surface-container' : ''}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeInfo.color }}>
                      <IcoDumbbell size={13} color="#1b1b1d" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-on-surface">{typeInfo.label}</p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: typeInfo.color }}>{entry.severity}</span>
                      </div>
                      {entry.context && <p className="text-xs text-on-surface-muted">{entry.context}</p>}
                      {entry.bodyPart && <p className="text-xs text-on-surface-muted">{entry.bodyPart}</p>}
                      {entry.notes && <p className="text-xs text-on-surface-muted/70 mt-0.5">{entry.notes}</p>}
                    </div>
                    <span className="text-[11px] text-on-surface-muted flex-shrink-0">
                      {new Date(entry.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </span>
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
          <div className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out] max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log an incident</p>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Type</p>
              <div className="flex gap-2">
                {INJURY_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${form.type === t.id ? 'ring-2 ring-primary-container' : ''}`}
                    style={{ background: t.color }}>{t.label}</button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Severity</p>
              <div className="flex flex-col gap-1">
                {SEVERITY.map((s) => (
                  <button key={s} onClick={() => setForm((f) => ({ ...f, severity: s }))}
                    className={`py-2 px-3 rounded-xl text-sm text-left transition-all ${form.severity === s ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Context</p>
              <div className="flex flex-wrap gap-2">
                {CONTEXTS.map((c) => (
                  <button key={c} onClick={() => setForm((f) => ({ ...f, context: c }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.context === c ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Body part affected</p>
              <input value={form.bodyPart} onChange={(e) => setForm((f) => ({ ...f, bodyPart: e.target.value }))}
                placeholder="e.g. Left hand, ankle"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Notes</p>
              <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="What triggered it? What was the cat doing?" rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none resize-none" />
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Date</p>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <button onClick={addEntry} className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Log incident
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
