import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoFlask, IcoPlus, IcoDroplets } from '../components/icons'

const LS_KEY = (catId) => `petmood_nutrition_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const FOOD_TYPES = ['Dry kibble', 'Wet food', 'Raw diet', 'Freeze-dried', 'Treats', 'Supplement', 'Water']
const MEAL_NOTES = ['Ate all', 'Ate half', 'Ate little', 'Refused', 'Vomited after', 'Ate slowly']

function today() { return new Date().toDateString() }

function MealCard({ meal, onDelete }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
        <IcoFlask size={14} color="#16a34a" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{meal.brand || meal.foodType}</p>
        <p className="text-xs text-on-surface-muted">{meal.foodType} · {meal.portion}</p>
        {meal.note && <p className="text-xs text-on-surface-muted/70 mt-0.5">{meal.note}</p>}
      </div>
      <span className="text-[11px] text-on-surface-muted flex-shrink-0">
        {new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

export default function NutritionLabScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [meals, setMeals] = useState([])
  const [profile, setProfile] = useState({ weight: '', targetWeight: '', dailyCalories: '', waterGoal: '200', diet: '', allergies: '', brand: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ foodType: 'Wet food', brand: '', portion: '80g', note: 'Ate all' })
  const [waterMl, setWaterMl] = useState(0)

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id)) ?? {}
    setMeals(data.meals ?? [])
    setProfile(data.profile ?? { weight: '', targetWeight: '', dailyCalories: '', waterGoal: '200', diet: '', allergies: '', brand: '' })
    const todayWater = (data.waterLog ?? {})[today()] ?? 0
    setWaterMl(todayWater)
  }, [cat.id])

  function save(updatedMeals, updatedProfile, updatedWater) {
    const current = lsGet(LS_KEY(cat.id)) ?? {}
    const data = {
      meals: updatedMeals ?? meals,
      profile: updatedProfile ?? profile,
      waterLog: { ...(current.waterLog ?? {}), [today()]: updatedWater ?? waterMl },
    }
    lsSet(LS_KEY(cat.id), data)
  }

  function addMeal() {
    if (!form.portion.trim()) return
    const meal = { ...form, id: `meal_${Date.now()}`, time: new Date().toISOString() }
    const updated = [meal, ...meals]
    setMeals(updated)
    save(updated)
    setShowAdd(false)
  }

  function addWater(ml) {
    const updated = waterMl + ml
    setWaterMl(updated)
    save(meals, profile, updated)
  }

  const todayMeals = meals.filter((m) => new Date(m.time).toDateString() === today())
  const waterGoalMl = parseInt(profile.waterGoal) || 200
  const waterPct = Math.min((waterMl / waterGoalMl) * 100, 100)

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Nutrition Lab</h1>
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
        {/* Water tracker */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-3">
            <IcoDroplets size={16} color="#3b82f6" />
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted">Daily Water Intake</p>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-3xl font-bold text-on-surface">{waterMl}</span>
            <span className="text-sm text-on-surface-muted mb-1">/ {waterGoalMl} ml</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-300 rounded-full transition-all duration-500" style={{ width: `${waterPct}%` }} />
          </div>
          <div className="flex gap-2">
            {[25, 50, 100].map((ml) => (
              <button
                key={ml}
                onClick={() => addWater(ml)}
                className="flex-1 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold active:scale-95 transition-transform"
              >
                +{ml}ml
              </button>
            ))}
          </div>
        </div>

        {/* Today meals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted">Today's Meals ({todayMeals.length})</p>
            <button onClick={() => setShowAdd(true)} className="text-xs font-semibold text-primary-container">+ Log meal</button>
          </div>
          {todayMeals.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="text-sm text-on-surface-muted">No meals logged today</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {todayMeals.map((m) => <MealCard key={m.id} meal={m} />)}
            </div>
          )}
        </div>

        {/* Diet profile */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Diet Profile</p>
          <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            {[
              { label: 'Current Weight', key: 'weight', placeholder: 'e.g. 4.2 kg' },
              { label: 'Target Weight', key: 'targetWeight', placeholder: 'e.g. 4.0 kg' },
              { label: 'Daily Calories', key: 'dailyCalories', placeholder: 'e.g. 250 kcal' },
              { label: 'Water Goal (ml)', key: 'waterGoal', placeholder: '200' },
              { label: 'Primary Brand', key: 'brand', placeholder: 'e.g. Royal Canin Indoor' },
              { label: 'Diet Type', key: 'diet', placeholder: 'e.g. Grain-free, Low-fat' },
              { label: 'Food Allergies', key: 'allergies', placeholder: 'e.g. None / Fish' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex items-center py-3 border-b border-surface-container last:border-0 gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted w-28 flex-shrink-0">{label}</span>
                <input
                  value={profile[key] ?? ''}
                  onChange={(e) => {
                    const updated = { ...profile, [key]: e.target.value }
                    setProfile(updated)
                    save(meals, updated)
                  }}
                  placeholder={placeholder}
                  className="flex-1 text-sm text-on-surface bg-transparent outline-none placeholder:text-on-surface-muted/40"
                />
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        {meals.length > todayMeals.length && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Meal History</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {meals.filter((m) => new Date(m.time).toDateString() !== today()).slice(0, 15).map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-surface-container last:border-0">
                  <p className="text-sm text-on-surface flex-1">{m.brand || m.foodType} · {m.portion}</p>
                  <span className="text-[11px] text-on-surface-muted">
                    {new Date(m.time).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
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
            <p className="text-base font-semibold text-on-surface mb-4">Log a meal</p>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Type</p>
              <div className="flex flex-wrap gap-2">
                {FOOD_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, foodType: t }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.foodType === t ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Brand / Name</p>
              <input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                placeholder="e.g. Royal Canin"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none"
              />
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Portion</p>
              <input
                value={form.portion}
                onChange={(e) => setForm((f) => ({ ...f, portion: e.target.value }))}
                placeholder="e.g. 80g, 1 pouch"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none"
              />
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">How did it go?</p>
              <div className="flex flex-wrap gap-2">
                {MEAL_NOTES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setForm((f) => ({ ...f, note: n }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.note === n ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addMeal}
              className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform"
            >
              Log meal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
