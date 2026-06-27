import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoHeart, IcoPlus } from '../components/icons'

const LS_KEY = (catId) => `petmood_bond_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const BOND_TYPES = [
  { id: 'bond', label: 'Bond moment', color: '#fde68a', desc: 'Positive connection' },
  { id: 'friction', label: 'Friction', color: '#fecaca', desc: 'Stress or avoidance' },
  { id: 'neutral', label: 'Neutral', color: '#f0edef', desc: 'Indifference or calm' },
  { id: 'breakthrough', label: 'Breakthrough', color: '#ccebc7', desc: 'New trust milestone' },
]

const BOND_MOMENTS = ['Lap sitting', 'Headbutt / bunt', 'Slow blink exchange', 'Grooming request', 'Followed me', 'Slept next to me', 'Purring loudly', 'Playing together', 'Brought toy to me']
const FRICTION_MOMENTS = ['Hissed', 'Swiped/scratched', 'Hiding from me', 'Running away', 'Growled', 'Refused interaction', 'Stress signs visible', 'Startled easily']

function EventCard({ event }) {
  const typeInfo = BOND_TYPES.find((t) => t.id === event.type) ?? BOND_TYPES[0]
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeInfo.color }}>
        <IcoHeart size={14} color="#1b1b1d" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{event.moment}</p>
        <p className="text-xs text-on-surface-muted">{typeInfo.label}</p>
        {event.notes && <p className="text-xs text-on-surface-muted/70 mt-0.5">{event.notes}</p>}
      </div>
      <span className="text-[11px] text-on-surface-muted flex-shrink-0">
        {new Date(event.time).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
      </span>
    </div>
  )
}

export default function BondLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [events, setEvents] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState('bond')
  const [moment, setMoment] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => { setEvents(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(updated) { setEvents(updated); lsSet(LS_KEY(cat.id), updated) }

  function addEvent() {
    if (!moment) return
    save([{ id: `bond_${Date.now()}`, type, moment, notes, time: new Date().toISOString() }, ...events])
    setShowAdd(false)
    setMoment('')
    setNotes('')
  }

  const bonds = events.filter((e) => e.type === 'bond' || e.type === 'breakthrough')
  const friction = events.filter((e) => e.type === 'friction')
  const last7 = events.filter((e) => Date.now() - new Date(e.time).getTime() < 7 * 86_400_000)
  const bondScore = last7.length > 0
    ? Math.round((last7.filter((e) => e.type === 'bond' || e.type === 'breakthrough').length / last7.length) * 100)
    : null

  const options = type === 'friction' ? FRICTION_MOMENTS : BOND_MOMENTS

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Bond & Friction Log</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
        <button
          onClick={() => { setType('bond'); setMoment(''); setShowAdd(true) }}
          className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform"
        >
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Score card */}
        {bondScore !== null && (
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">7-Day Bond Score</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 60 60" className="-rotate-90 w-16 h-16">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#f0edef" strokeWidth="6" />
                  <circle cx="30" cy="30" r="24" fill="none" stroke="#e89a3c" strokeWidth="6"
                    strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - bondScore / 100)}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-on-surface">
                  {bondScore}%
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-on-surface">
                  {bondScore >= 70 ? 'Great bond' : bondScore >= 40 ? 'Building trust' : 'Needs attention'}
                </p>
                <p className="text-xs text-on-surface-muted">{last7.length} events this week</p>
                <p className="text-xs text-on-surface-muted">{bonds.length} bond · {friction.length} friction total</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick log buttons */}
        <div className="grid grid-cols-2 gap-2">
          {BOND_TYPES.map((t) => (
            <button key={t.id} onClick={() => { setType(t.id); setMoment(''); setShowAdd(true) }}
              className="py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all flex flex-col items-center gap-0.5"
              style={{ background: t.color }}>
              <span className="font-semibold text-on-surface text-sm">{t.label}</span>
              <span className="text-xs text-on-surface-muted/70">{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Events timeline */}
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center mx-auto mb-3">
              <IcoHeart size={24} color="#ec4899" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No moments logged yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Track your relationship with {cat.name} over time.</p>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">All Events</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {events.slice(0, 30).map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out] max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log a moment</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {BOND_TYPES.map((t) => (
                <button key={t.id} onClick={() => { setType(t.id); setMoment('') }}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${type === t.id ? 'ring-2 ring-primary-container' : ''}`}
                  style={{ background: t.color }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">What happened?</p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button key={opt} onClick={() => setMoment(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${moment === opt ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>
                    {opt}
                  </button>
                ))}
              </div>
              <input value={moment} onChange={(e) => setMoment(e.target.value)} placeholder="Or describe your own..."
                className="w-full mt-2 px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Notes (optional)</p>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add context..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>

            <button onClick={addEvent} disabled={!moment}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40">
              Log moment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
