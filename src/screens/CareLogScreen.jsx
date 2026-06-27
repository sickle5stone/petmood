import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CatAvatar, LinkRow } from '../components/ui'
import { IcoBowl, IcoDroplets, IcoPlay, IcoScissors, IcoMoon, IcoStethoscope, IcoClipboard, IcoFlask, IcoLeaf, IcoPill } from '../components/icons'

const LS_CARE_KEY = (catId) => `petmood_care_${catId}`

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function defaultGoals() {
  return { water: 0, meals: 0, play: 0, maxWater: 100, maxMeals: 3, maxPlay: 60 }
}

function loadCareData(catId) {
  const all = lsGet(LS_CARE_KEY(catId)) ?? {}
  const todayKey = new Date().toDateString()
  return {
    goals: all[todayKey]?.goals ?? defaultGoals(),
    log: all[todayKey]?.log ?? [],
  }
}

function saveCareData(catId, goals, log) {
  const all = lsGet(LS_CARE_KEY(catId)) ?? {}
  const todayKey = new Date().toDateString()
  all[todayKey] = { goals, log, savedAt: new Date().toISOString() }
  lsSet(LS_CARE_KEY(catId), all)
}

const ENTRY_TYPES = [
  { id: 'meal', Icon: IcoBowl, label: 'Meal', options: ['Dry food', 'Wet food', 'Treats', 'Other'] },
  { id: 'water', Icon: IcoDroplets, label: 'Water', options: ['Refilled bowl', 'Fountain cleaned', 'Low intake noted'] },
  { id: 'play', Icon: IcoPlay, label: 'Play', options: ['Laser session', 'Wand toy', 'Chase toy', 'Free play'] },
  { id: 'groom', Icon: IcoScissors, label: 'Grooming', options: ['Brush session', 'Nail trim', 'Bath', 'Eye/ear clean'] },
  { id: 'nap', Icon: IcoMoon, label: 'Nap/Rest', options: ['Short nap', 'Long sleep', 'Restless', 'Slept well'] },
  { id: 'vet', Icon: IcoStethoscope, label: 'Vet/Med', options: ['Medicine given', 'Vet visit', 'Weighed', 'Observation'] },
]

function GoalRing({ value, max, color, size = 60 }) {
  const pct = Math.min(value / max, 1)
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0edef" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

function GoalCard({ Icon, label, value, max, unit, color, onAdd }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-card border border-border flex items-center gap-4">
      <div className="relative flex items-center justify-center flex-shrink-0">
        <GoalRing value={value} max={max} color={color} />
        <div className="absolute">
          {Icon && <Icon size={18} color={color} />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted">{label}</p>
        <p className="text-xl font-semibold text-on-surface">
          {value}<span className="text-sm font-normal text-on-surface-muted"> / {max} {unit}</span>
        </p>
        <div className="mt-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
      <button
        onClick={onAdd}
        className="w-9 h-9 rounded-full border-2 border-dashed border-outline/40 flex items-center justify-center text-on-surface-muted hover:bg-surface-container hover:border-primary-container transition-all active:scale-90"
        aria-label={`Add ${label}`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2.5v9M2.5 7h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function LogEntry({ entry }) {
  const typeInfo = ENTRY_TYPES.find((t) => t.label === entry.type)
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
        {typeInfo?.Icon && <typeInfo.Icon size={15} color="#857464" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{entry.detail}</p>
        <p className="text-[11px] text-on-surface-muted">{entry.type}</p>
      </div>
      <span className="text-[11px] text-on-surface-muted flex-shrink-0">
        {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

export default function CareLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [goals, setGoals] = useState(defaultGoals())
  const [log, setLog] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState(null) // ENTRY_TYPES item
  const [addDetail, setAddDetail] = useState('')

  useEffect(() => {
    const data = loadCareData(cat.id)
    setGoals(data.goals)
    setLog(data.log)
  }, [cat.id])

  function commitEntry() {
    if (!addType || !addDetail) return
    const entry = {
      id: `care_${Date.now()}`,
      type: addType.label,
      Icon: addType.Icon,
      detail: addDetail,
      time: new Date().toISOString(),
    }
    // Update goals
    const newGoals = { ...goals }
    if (addType.id === 'meal') newGoals.meals = Math.min(newGoals.meals + 1, newGoals.maxMeals)
    if (addType.id === 'water') newGoals.water = Math.min(newGoals.water + 25, newGoals.maxWater)
    if (addType.id === 'play') newGoals.play = Math.min(newGoals.play + 15, newGoals.maxPlay)

    const newLog = [entry, ...log]
    setGoals(newGoals)
    setLog(newLog)
    saveCareData(cat.id, newGoals, newLog)
    setShowAdd(false)
    setAddType(null)
    setAddDetail('')
  }

  const todayStr = new Date().toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })

  // Next estimated feeding
  const mealTimes = log.filter((e) => e.type === 'Meal').map((e) => new Date(e.time))
  const lastMeal = mealTimes[0]
  const nextMeal = lastMeal ? new Date(lastMeal.getTime() + 8 * 3600_000) : null
  const minsToNextMeal = nextMeal ? Math.max(0, Math.round((nextMeal - Date.now()) / 60000)) : null

  return (
    <div className="pm-page pb-nav">
      <div className="flex items-center gap-3 py-4">
        <div className="flex-1 min-w-0">
          <h1 className="pm-title">Care Log</h1>
          <p className="text-caption text-on-surface-muted">{todayStr}</p>
        </div>
        <CatAvatar name={cat.name} size="md" />
      </div>

      <div className="flex flex-wrap gap-2 px-5 mb-4">
        <LinkRow Icon={IcoFlask} label="Nutrition" onClick={() => navigate(`/nutrition/${cat.id}`)} />
        <LinkRow Icon={IcoLeaf} label="Litter" onClick={() => navigate(`/litter/${cat.id}`)} />
        <LinkRow Icon={IcoPill} label="Pharmacy" onClick={() => navigate(`/pharmacy/${cat.id}`)} />
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {minsToNextMeal !== null && minsToNextMeal > 0 && (
          <div className="pm-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-border-subtle flex items-center justify-center flex-shrink-0">
              <IcoBowl size={22} color="#895200" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-container">Next Feeding</p>
              <p className="text-lg font-semibold text-on-surface">
                {minsToNextMeal >= 60
                  ? `${Math.floor(minsToNextMeal / 60)}h ${minsToNextMeal % 60}m`
                  : `${minsToNextMeal}m`}
              </p>
              <p className="text-caption text-on-surface-muted font-medium">{nextMeal?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        )}

        {/* Daily goals */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Daily Goals</p>
          <div className="flex flex-col gap-3">
            <GoalCard Icon={IcoDroplets} label="Hydration" value={goals.water} max={goals.maxWater} unit="%" color="#bfdbfe" onAdd={() => { setAddType(ENTRY_TYPES[1]); setAddDetail(ENTRY_TYPES[1].options[0]); setShowAdd(true) }} />
            <GoalCard Icon={IcoBowl} label="Meals" value={goals.meals} max={goals.maxMeals} unit="meals" color="#e89a3c" onAdd={() => { setAddType(ENTRY_TYPES[0]); setAddDetail(ENTRY_TYPES[0].options[0]); setShowAdd(true) }} />
            <GoalCard Icon={IcoPlay} label="Activity" value={goals.play} max={goals.maxPlay} unit="min" color="#ccebc7" onAdd={() => { setAddType(ENTRY_TYPES[2]); setAddDetail(ENTRY_TYPES[2].options[0]); setShowAdd(true) }} />
          </div>
        </div>

        {/* Today's log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted">Today's Log</p>
            <button
              onClick={() => { setShowAdd(true); setAddType(null); setAddDetail('') }}
              className="flex items-center gap-1 text-xs font-semibold text-primary-container active:scale-95 transition-transform"
            >
              + Add entry
            </button>
          </div>

          {log.length === 0 ? (
            <div className="pm-card p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-2">
                <IcoClipboard size={20} color="#857464" />
              </div>
              <p className="text-sm text-on-surface-muted">No entries yet today</p>
              <p className="text-xs text-on-surface-muted/70 mt-1">Tap the goal cards above or + Add entry</p>
            </div>
          ) : (
            <div className="pm-card px-4">
              {log.map((entry) => <LogEntry key={entry.id} entry={entry} />)}
            </div>
          )}
        </div>
      </div>

      {/* Add entry bottom sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 pb-safe shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log a care event</p>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setAddType(t); setAddDetail(t.options[0]) }}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl text-sm transition-all active:scale-95 ${
                    addType?.id === t.id
                      ? 'bg-primary-container text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-muted hover:bg-surface-container-high'
                  }`}
                >
                  <t.Icon size={20} color={addType?.id === t.id ? 'white' : '#857464'} />
                  <span className="text-[11px] font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Detail picker */}
            {addType && (
              <div className="mb-4">
                <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-2">Detail</p>
                <div className="flex flex-wrap gap-2">
                  {addType.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAddDetail(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all active:scale-95 ${
                        addDetail === opt
                          ? 'bg-primary-container text-white'
                          : 'bg-surface-container text-on-surface-muted'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={commitEntry}
              disabled={!addType || !addDetail}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
            >
              Log {addType?.label ?? 'entry'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
