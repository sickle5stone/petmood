import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoPill, IcoPlus } from '../components/icons'

const LS_KEY = (catId) => `petmood_pharmacy_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const FREQ_OPTIONS = ['Once daily', 'Twice daily', 'Every 8h', 'Weekly', 'Monthly', 'As needed', 'Course complete']

function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  return Math.round((d - now) / 86_400_000)
}

function RefillBadge({ date }) {
  const days = daysUntil(date)
  if (days === null) return null
  const color = days <= 3 ? 'bg-red-100 text-red-700' : days <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-secondary-container text-secondary'
  const label = days < 0 ? 'Refill overdue' : days === 0 ? 'Refill today' : `Refill in ${days}d`
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
}

function MedCard({ med, onToggle, onDelete }) {
  return (
    <div className={`bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-opacity ${med.paused ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <IcoPill size={17} color="#7c3aed" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-on-surface">{med.name}</p>
              <p className="text-xs text-on-surface-muted">{med.dose} · {med.frequency}</p>
            </div>
            <RefillBadge date={med.refillDate} />
          </div>
          {med.purpose && <p className="text-xs text-on-surface-muted/70 mt-1">{med.purpose}</p>}
          {med.startDate && (
            <p className="text-[11px] text-on-surface-muted/60 mt-1">
              Started {new Date(med.startDate).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
              {med.endDate && ` · Ends ${new Date(med.endDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}`}
            </p>
          )}
          {med.lastGiven && (
            <p className="text-[11px] text-primary-container font-medium mt-1">
              Last given: {new Date(med.lastGiven).toLocaleDateString('default', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onToggle(med.id, 'dose')}
          className="flex-1 py-1.5 rounded-full bg-primary-container text-white text-xs font-semibold active:scale-95 transition-transform"
        >
          Log dose
        </button>
        <button
          onClick={() => onToggle(med.id, 'pause')}
          className="flex-1 py-1.5 rounded-full bg-surface-container text-on-surface-muted text-xs font-semibold active:scale-95 transition-transform"
        >
          {med.paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={() => onDelete(med.id)}
          className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface-muted text-xs font-semibold active:scale-95 transition-transform"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default function PharmacyLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [meds, setMeds] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', dose: '', frequency: 'Once daily', purpose: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', refillDate: '' })

  useEffect(() => { setMeds(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(updated) { setMeds(updated); lsSet(LS_KEY(cat.id), updated) }

  function addMed() {
    if (!form.name.trim()) return
    save([{ ...form, id: `med_${Date.now()}`, paused: false, lastGiven: null }, ...meds])
    setShowAdd(false)
    setForm({ name: '', dose: '', frequency: 'Once daily', purpose: '', startDate: new Date().toISOString().slice(0, 10), endDate: '', refillDate: '' })
  }

  function handleToggle(id, action) {
    if (action === 'dose') save(meds.map((m) => m.id === id ? { ...m, lastGiven: new Date().toISOString() } : m))
    if (action === 'pause') save(meds.map((m) => m.id === id ? { ...m, paused: !m.paused } : m))
  }

  function deleteMed(id) { save(meds.filter((m) => m.id !== id)) }

  const active = meds.filter((m) => !m.paused && !m.endDate || (m.endDate && new Date(m.endDate) >= new Date()))
  const paused = meds.filter((m) => m.paused)

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Pharmacy Log</h1>
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
        {meds.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <IcoPill size={24} color="#7c3aed" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No medications tracked</p>
            <p className="text-xs text-on-surface-muted mt-1">Track meds, supplements, and refill dates.</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 px-5 py-2 rounded-full bg-primary-container text-white text-sm font-semibold">
              Add medication
            </button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Active Medications</p>
                <div className="flex flex-col gap-3">{active.map((m) => <MedCard key={m.id} med={m} onToggle={handleToggle} onDelete={deleteMed} />)}</div>
              </div>
            )}
            {paused.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Paused</p>
                <div className="flex flex-col gap-3 opacity-60">{paused.map((m) => <MedCard key={m.id} med={m} onToggle={handleToggle} onDelete={deleteMed} />)}</div>
              </div>
            )}
          </>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out] max-h-[90vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Add medication</p>

            {[
              { label: 'Name', key: 'name', placeholder: 'e.g. Prednisolone' },
              { label: 'Dose', key: 'dose', placeholder: 'e.g. 5mg' },
              { label: 'Purpose / Condition', key: 'purpose', placeholder: 'e.g. Inflammation' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">{label}</p>
                <input
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm outline-none"
                />
              </div>
            ))}

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Frequency</p>
              <div className="flex flex-wrap gap-2">
                {FREQ_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setForm((fm) => ({ ...fm, frequency: f }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.frequency === f ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[['startDate', 'Start Date'], ['endDate', 'End Date (optional)'], ['refillDate', 'Refill Date (optional)']].map(([key, label]) => (
                <div key={key}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">{label}</p>
                  <input
                    type="date"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container text-on-surface text-xs outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addMed}
              disabled={!form.name.trim()}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
            >
              Add medication
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
