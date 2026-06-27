import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoHeartPulse, IcoPlus, IcoAlertCircle } from '../components/icons'

const LS_KEY = (catId) => `petmood_health_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const ENTRY_TYPES = [
  { id: 'symptom', label: 'Symptom', color: '#fecaca' },
  { id: 'injury', label: 'Injury', color: '#fed7aa' },
  { id: 'illness', label: 'Illness', color: '#fde68a' },
  { id: 'surgery', label: 'Surgery/Procedure', color: '#ddd6fe' },
  { id: 'recovery', label: 'Recovery Note', color: '#ccebc7' },
  { id: 'observation', label: 'Observation', color: '#bfdbfe' },
]

const SEVERITY = ['Mild', 'Moderate', 'Severe']

function EntryCard({ entry, onDelete }) {
  const typeInfo = ENTRY_TYPES.find((t) => t.id === entry.type) ?? ENTRY_TYPES[0]
  return (
    <div className="pm-card px-4 py-4">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: typeInfo.color }}
        >
          <IcoHeartPulse size={16} color="#1b1b1d" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-on-surface">{entry.title}</span>
            {entry.severity && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: typeInfo.color }}>
                {entry.severity}
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-muted mt-0.5">{typeInfo.label}</p>
          {entry.notes && <p className="text-sm text-on-surface-muted mt-1.5 leading-snug">{entry.notes}</p>}
          {entry.vetVisit && (
            <p className="text-[11px] text-primary-container mt-1 font-medium">Vet consulted</p>
          )}
          <p className="text-[11px] text-on-surface-muted/60 mt-1.5">
            {new Date(entry.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
            {entry.resolvedAt && ` · Resolved ${new Date(entry.resolvedAt).toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}
          </p>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="text-on-surface-muted/40 hover:text-red-400 transition-colors p-1 mt-0.5"
          aria-label="Delete entry"
        >
          <IcoAlertCircle size={16} color="currentColor" />
        </button>
      </div>
    </div>
  )
}

export default function HealthLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [entries, setEntries] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ type: 'symptom', title: '', severity: 'Mild', notes: '', vetVisit: false, date: new Date().toISOString().slice(0, 10) })

  useEffect(() => {
    setEntries(lsGet(LS_KEY(cat.id)) ?? [])
  }, [cat.id])

  function save(updated) {
    setEntries(updated)
    lsSet(LS_KEY(cat.id), updated)
  }

  function addEntry() {
    if (!form.title.trim()) return
    const entry = { ...form, id: `health_${Date.now()}`, createdAt: new Date().toISOString() }
    save([entry, ...entries])
    setShowAdd(false)
    setForm({ type: 'symptom', title: '', severity: 'Mild', notes: '', vetVisit: false, date: new Date().toISOString().slice(0, 10) })
  }

  function deleteEntry(id) {
    save(entries.filter((e) => e.id !== id))
  }

  const open = entries.filter((e) => !e.resolvedAt)
  const resolved = entries.filter((e) => e.resolvedAt)

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Health & Injury Log</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="pm-add-btn"
          aria-label="Add entry"
        >
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {entries.length === 0 ? (
          <div className="pm-card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-3">
              <IcoHeartPulse size={24} color="#e89a3c" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No health events recorded</p>
            <p className="text-xs text-on-surface-muted mt-1">Log symptoms, injuries, and recovery milestones.</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 px-5 py-2 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Add first entry
            </button>
          </div>
        ) : (
          <>
            {open.length > 0 && (
              <div>
                <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Active / Ongoing</p>
                <div className="flex flex-col gap-3">{open.map((e) => <EntryCard key={e.id} entry={e} onDelete={deleteEntry} />)}</div>
              </div>
            )}
            {resolved.length > 0 && (
              <div>
                <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Resolved</p>
                <div className="flex flex-col gap-3 opacity-70">{resolved.map((e) => <EntryCard key={e.id} entry={e} onDelete={deleteEntry} />)}</div>
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="pm-sheet animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log health event</p>

            <div className="mb-4">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-2">Type</p>
              <div className="grid grid-cols-3 gap-2">
                {ENTRY_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${form.type === t.id ? 'ring-2 ring-primary-container' : ''}`}
                    style={{ background: t.color }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Title</p>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Limping on right paw"
                className="pm-input"
              />
            </div>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Severity</p>
              <div className="flex gap-2">
                {SEVERITY.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((f) => ({ ...f, severity: s }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.severity === s ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Date</p>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="pm-input"
              />
            </div>

            <div className="mb-4">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Notes</p>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Optional details..."
                rows={3}
                className="pm-input resize-none"
              />
            </div>

            <div className="mb-5 flex items-center gap-3">
              <button
                onClick={() => setForm((f) => ({ ...f, vetVisit: !f.vetVisit }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.vetVisit ? 'bg-secondary' : 'bg-surface-container-high'}`}
                role="switch"
                aria-checked={form.vetVisit}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.vetVisit ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-on-surface">Vet was consulted</span>
            </div>

            <button
              onClick={addEntry}
              disabled={!form.title.trim()}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
            >
              Save entry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
