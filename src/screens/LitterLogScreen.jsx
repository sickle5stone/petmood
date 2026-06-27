import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoLeaf, IcoPlus, IcoDroplets } from '../components/icons'

const LS_KEY = (catId) => `petmood_litter_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const ENTRY_TYPES = [
  { id: 'urinate', label: 'Urinated', color: '#bfdbfe' },
  { id: 'defecate', label: 'Defecated', color: '#ccebc7' },
  { id: 'clean', label: 'Box Cleaned', color: '#f0edef' },
  { id: 'issue', label: 'Digestive Issue', color: '#fecaca' },
  { id: 'change', label: 'Litter Changed', color: '#fde68a' },
]

const URINE_NOTES = ['Normal', 'Frequent', 'Straining', 'Blood noted', 'Outside box', 'Low output']
const STOOL_NOTES = ['Normal', 'Soft/Loose', 'Hard/Dry', 'Diarrhea', 'Vomiting', 'No output today']
const ISSUE_NOTES = ['Vomiting (food)', 'Vomiting (hairball)', 'Not eating', 'Constipation', 'Blood in stool', 'Excessive gas']

function getOptions(typeId) {
  if (typeId === 'urinate') return URINE_NOTES
  if (typeId === 'defecate') return STOOL_NOTES
  if (typeId === 'issue') return ISSUE_NOTES
  return ['Done']
}

function today() {
  return new Date().toDateString()
}

function EntryRow({ entry }) {
  const typeInfo = ENTRY_TYPES.find((t) => t.id === entry.type) ?? ENTRY_TYPES[0]
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeInfo.color }}>
        {entry.type === 'urinate' ? <IcoDroplets size={14} color="#1b1b1d" /> : <IcoLeaf size={14} color="#1b1b1d" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{typeInfo.label}</p>
        <p className="text-xs text-on-surface-muted">{entry.note}</p>
      </div>
      <span className="text-[11px] text-on-surface-muted flex-shrink-0">
        {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

export default function LitterLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [log, setLog] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [type, setType] = useState('urinate')
  const [note, setNote] = useState('Normal')

  useEffect(() => { setLog(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(updated) { setLog(updated); lsSet(LS_KEY(cat.id), updated) }

  function addEntry() {
    save([{ id: `litter_${Date.now()}`, type, note, time: new Date().toISOString() }, ...log])
    setShowAdd(false)
  }

  const todayLog = log.filter((e) => new Date(e.time).toDateString() === today())
  const pastLog = log.filter((e) => new Date(e.time).toDateString() !== today())

  const todayStats = {
    urine: todayLog.filter((e) => e.type === 'urinate').length,
    stool: todayLog.filter((e) => e.type === 'defecate').length,
    issues: todayLog.filter((e) => e.type === 'issue').length,
  }

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Litter & Digestive</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
        <button
          onClick={() => { setType('urinate'); setNote('Normal'); setShowAdd(true) }}
          className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform"
        >
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Today summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Urine', value: todayStats.urine, color: '#bfdbfe' },
            { label: 'Stool', value: todayStats.stool, color: '#ccebc7' },
            { label: 'Issues', value: todayStats.issues, color: '#fecaca' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-center">
              <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: color }}>
                <span className="text-sm font-bold text-on-surface">{value}</span>
              </div>
              <p className="text-xs text-on-surface-muted font-medium">{label} today</p>
            </div>
          ))}
        </div>

        {/* Quick log buttons */}
        <div className="grid grid-cols-2 gap-2">
          {ENTRY_TYPES.slice(0, 4).map((t) => (
            <button
              key={t.id}
              onClick={() => { setType(t.id); setNote(getOptions(t.id)[0]); setShowAdd(true) }}
              className="py-3 rounded-2xl text-sm font-semibold active:scale-95 transition-all"
              style={{ background: t.color }}
            >
              + {t.label}
            </button>
          ))}
        </div>

        {/* Today's log */}
        {todayLog.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Today</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {todayLog.map((e) => <EntryRow key={e.id} entry={e} />)}
            </div>
          </div>
        )}

        {/* Past entries grouped by date */}
        {pastLog.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Previous</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {pastLog.slice(0, 20).map((e) => <EntryRow key={e.id} entry={e} />)}
            </div>
          </div>
        )}

        {log.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3">
              <IcoLeaf size={24} color="#16a34a" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No entries yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Track litter box usage to spot digestive health patterns.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setShowAdd(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-base font-semibold text-on-surface mb-4">Log litter event</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {ENTRY_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setType(t.id); setNote(getOptions(t.id)[0]) }}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${type === t.id ? 'ring-2 ring-primary-container' : ''}`}
                  style={{ background: t.color }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Note</p>
              <div className="flex flex-wrap gap-2">
                {getOptions(type).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setNote(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${note === opt ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addEntry}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform"
            >
              Log entry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
