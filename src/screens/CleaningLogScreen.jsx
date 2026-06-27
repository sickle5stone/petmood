import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoScissors, IcoPlus, IcoCheck } from '../components/icons'

const LS_KEY = (catId) => `petmood_cleaning_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const TASKS = [
  { id: 'litter_scoop', label: 'Scoop litter box', frequency: 'Daily', icon: 'leaf' },
  { id: 'litter_full', label: 'Full litter change', frequency: 'Weekly', icon: 'leaf' },
  { id: 'food_bowl', label: 'Clean food bowl', frequency: 'Daily', icon: 'bowl' },
  { id: 'water_bowl', label: 'Clean water bowl / fountain', frequency: 'Every 2 days', icon: 'droplet' },
  { id: 'bed_wash', label: 'Wash cat bed', frequency: 'Monthly', icon: 'home' },
  { id: 'toy_clean', label: 'Clean / disinfect toys', frequency: 'Weekly', icon: 'play' },
  { id: 'scratch_vac', label: 'Vacuum scratcher', frequency: 'Weekly', icon: 'scissors' },
  { id: 'carrier_clean', label: 'Clean carrier', frequency: 'Monthly', icon: 'box' },
  { id: 'window', label: 'Clean window/perch area', frequency: 'Monthly', icon: 'sun' },
  { id: 'hair', label: 'Lint roll furniture', frequency: 'Weekly', icon: 'scissors' },
]

function daysSince(dateStr) {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
}

function TaskRow({ task, lastDone, onDone }) {
  const days = daysSince(lastDone)
  const overdue = days !== null && days > 7
  return (
    <div className="flex items-center gap-3 py-3 border-b border-surface-container last:border-0">
      <button
        onClick={onDone}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 border-2 ${
          lastDone && days === 0 ? 'bg-secondary-container border-secondary' : 'border-outline/40 hover:border-primary-container'
        }`}
      >
        {lastDone && days === 0 && <IcoCheck size={14} color="#5c8a5e" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{task.label}</p>
        <p className="text-xs text-on-surface-muted">{task.frequency}</p>
      </div>
      <span className={`text-[11px] font-medium flex-shrink-0 ${overdue ? 'text-red-500' : 'text-on-surface-muted'}`}>
        {days === null ? 'Never' : days === 0 ? 'Done today' : `${days}d ago`}
      </span>
    </div>
  )
}

export default function CleaningLogScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [log, setLog] = useState({})
  const [customTasks, setCustomTasks] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id)) ?? {}
    setLog(data.log ?? {})
    setCustomTasks(data.custom ?? [])
  }, [cat.id])

  function save(l, c) {
    lsSet(LS_KEY(cat.id), { log: l ?? log, custom: c ?? customTasks })
  }

  function markDone(taskId) {
    const updated = { ...log, [taskId]: new Date().toISOString() }
    setLog(updated)
    save(updated)
  }

  function addCustom() {
    if (!newTask.trim()) return
    const updated = [...customTasks, { id: `custom_${Date.now()}`, label: newTask.trim(), frequency: 'As needed' }]
    setCustomTasks(updated)
    save(log, updated)
    setNewTask('')
    setShowAdd(false)
  }

  const allTasks = [...TASKS, ...customTasks]
  const doneTodayCount = allTasks.filter((t) => {
    const days = daysSince(log[t.id])
    return days === 0
  }).length

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Cleaning Log</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}'s space</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform">
          <IcoPlus size={16} color="white" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
              <IcoScissors size={20} color="#857464" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-on-surface">{doneTodayCount} / {allTasks.length} done today</p>
              <div className="mt-1.5 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container rounded-full transition-all duration-500"
                  style={{ width: `${allTasks.length > 0 ? (doneTodayCount / allTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Cleaning Tasks</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {allTasks.map((task) => (
              <TaskRow key={task.id} task={task} lastDone={log[task.id]} onDone={() => markDone(task.id)} />
            ))}
          </div>
        </div>
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
            <p className="text-base font-semibold text-on-surface mb-4">Add custom task</p>
            <input autoFocus value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="e.g. Clean cat door, Wipe down crate"
              className="w-full px-4 py-3 rounded-xl bg-surface-container text-on-surface text-sm outline-none mb-4" />
            <button onClick={addCustom} className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Add task
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
