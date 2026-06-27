import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoPlay, IcoPlus, IcoZap } from '../components/icons'

const LS_KEY = (catId) => `petmood_play_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const TOY_TYPES = ['Laser pointer', 'Wand toy', 'Crinkle ball', 'Feather', 'Mouse toy', 'Puzzle feeder', 'Tunnels', 'Cat tree', 'Interactive app', 'Solo play', 'Other']
const ENERGY_LEVELS = ['Low energy', 'Medium energy', 'High energy', 'Frantic']
const ENGAGEMENT = ['Very engaged', 'Engaged', 'Mild interest', 'Disinterested']

function today() { return new Date().toDateString() }

function SessionCard({ session }) {
  return (
    <div className="pm-card px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <IcoPlay size={16} color="#1d4ed8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-on-surface">{session.toy}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {session.duration}m
            </span>
          </div>
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-on-surface-muted">{session.energy}</span>
            <span className="text-[10px] text-on-surface-muted">·</span>
            <span className="text-[10px] text-on-surface-muted">{session.engagement}</span>
          </div>
          {session.notes && <p className="text-xs text-on-surface-muted/70 mt-1">{session.notes}</p>}
        </div>
        <span className="text-[11px] text-on-surface-muted flex-shrink-0">
          {new Date(session.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default function PlayLabScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [sessions, setSessions] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ toy: 'Wand toy', duration: '10', energy: 'High energy', engagement: 'Very engaged', notes: '' })

  useEffect(() => { setSessions(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(updated) { setSessions(updated); lsSet(LS_KEY(cat.id), updated) }

  function addSession() {
    save([{ ...form, id: `play_${Date.now()}`, time: new Date().toISOString() }, ...sessions])
    setShowAdd(false)
  }

  const todaySessions = sessions.filter((s) => new Date(s.time).toDateString() === today())
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0)

  const favToy = sessions.length > 0
    ? Object.entries(sessions.reduce((acc, s) => { acc[s.toy] = (acc[s.toy] || 0) + 1; return acc }, {}))
        .sort((a, b) => b[1] - a[1])[0]?.[0]
    : null

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Play Lab</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="pm-add-btn"
        >
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="pm-card p-4 text-center">
            <p className="text-2xl font-bold text-on-surface">{todayMinutes}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">min today</p>
          </div>
          <div className="pm-card p-4 text-center">
            <p className="text-2xl font-bold text-on-surface">{todaySessions.length}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">sessions</p>
          </div>
          <div className="pm-card p-4 text-center">
            <p className="text-sm font-bold text-on-surface leading-tight">{favToy?.split(' ')[0] ?? '—'}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">fav toy</p>
          </div>
        </div>

        {/* Quick start */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Quick Start</p>
          <div className="grid grid-cols-2 gap-2">
            {['Wand toy', 'Laser pointer', 'Crinkle ball', 'Puzzle feeder'].map((toy) => (
              <button
                key={toy}
                onClick={() => { setForm((f) => ({ ...f, toy })); setShowAdd(true) }}
                className="py-3 rounded-2xl text-sm font-semibold bg-blue-50 text-blue-700 active:scale-95 transition-all"
              >
                {toy}
              </button>
            ))}
          </div>
        </div>

        {/* Today sessions */}
        {todaySessions.length > 0 && (
          <div>
            <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Today's Sessions</p>
            <div className="flex flex-col gap-3">{todaySessions.map((s) => <SessionCard key={s.id} session={s} />)}</div>
          </div>
        )}

        {/* History */}
        {sessions.filter((s) => new Date(s.time).toDateString() !== today()).length > 0 && (
          <div>
            <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Past Sessions</p>
            <div className="flex flex-col gap-3">
              {sessions.filter((s) => new Date(s.time).toDateString() !== today()).slice(0, 8).map((s) => (
                <div key={s.id} className="pm-card px-4 py-3 flex items-center gap-3">
                  <IcoZap size={16} color="#e89a3c" />
                  <p className="text-sm text-on-surface flex-1">{s.toy} · {s.duration}min</p>
                  <span className="text-[11px] text-on-surface-muted">
                    {new Date(s.time).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="pm-card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <IcoPlay size={24} color="#1d4ed8" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No play sessions yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Track play to find what your cat loves most.</p>
          </div>
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
            <p className="text-base font-semibold text-on-surface mb-4">Log play session</p>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-2">Toy / Activity</p>
              <div className="flex flex-wrap gap-2">
                {TOY_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, toy: t }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.toy === t ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Duration (minutes)</p>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                min="1" max="120"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-2">Energy Level</p>
              <div className="grid grid-cols-2 gap-2">
                {ENERGY_LEVELS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm((f) => ({ ...f, energy: e }))}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${form.energy === e ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-2">Engagement</p>
              <div className="grid grid-cols-2 gap-2">
                {ENGAGEMENT.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm((f) => ({ ...f, engagement: e }))}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${form.engagement === e ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-1.5">Notes</p>
              <input
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. Chased laser for 5 min then lost interest"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none"
              />
            </div>

            <button
              onClick={addSession}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform"
            >
              Log session
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
