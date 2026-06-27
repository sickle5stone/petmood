import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoCalendar } from '../components/icons'

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
const LS_PASSPORT_KEY = (catId) => `petmood_passport_${catId}`

function catAgeFromDob(dob) {
  if (!dob) return null
  const ms = Date.now() - new Date(dob).getTime()
  const totalDays = Math.floor(ms / 86_400_000)
  const years = Math.floor(totalDays / 365.25)
  const months = Math.floor((totalDays % 365.25) / 30.44)
  return { years, months, totalDays }
}

function humanYears(catYears) {
  if (catYears < 2) return Math.round(catYears * 12)
  return 24 + (catYears - 2) * 4
}

const LIFE_STAGES = [
  { id: 'kitten', label: 'Kitten', range: '0–1 year', desc: 'Rapid growth, socialization, play. Vaccinations critical. Spay/neuter window.', color: '#fde68a' },
  { id: 'junior', label: 'Junior', range: '1–2 years', desc: 'Social maturity. Full energy. Establishing territory and routines.', color: '#bfdbfe' },
  { id: 'prime', label: 'Prime', range: '3–6 years', desc: 'Peak health and activity. Annual vet checks. Monitor weight.', color: '#ccebc7' },
  { id: 'mature', label: 'Mature', range: '7–10 years', desc: 'Beginning of senior changes. Biannual vet checks recommended. Dental care key.', color: '#e9d5ff' },
  { id: 'senior', label: 'Senior', range: '11–14 years', desc: 'Senior care phase. Kidney, thyroid, arthritis screening. Softer food options.', color: '#fed7aa' },
  { id: 'geriatric', label: 'Geriatric', range: '15+ years', desc: 'Exceptional longevity. Comfort and quality of life focus. Frequent vet visits.', color: '#fecaca' },
]

function getStage(years) {
  if (years === null) return null
  if (years < 1) return 'kitten'
  if (years < 2) return 'junior'
  if (years <= 6) return 'prime'
  if (years <= 10) return 'mature'
  if (years <= 14) return 'senior'
  return 'geriatric'
}

const MILESTONES = [
  { ageMonths: 2, label: 'First vaccinations due', category: 'Health' },
  { ageMonths: 4, label: 'Spay/neuter window', category: 'Health' },
  { ageMonths: 6, label: 'Full primary vaccination course', category: 'Health' },
  { ageMonths: 12, label: 'Social maturity reached', category: 'Development' },
  { ageMonths: 12, label: 'Switch to adult food', category: 'Nutrition' },
  { ageMonths: 36, label: 'Annual dental check', category: 'Dental' },
  { ageMonths: 84, label: 'Senior wellness panel recommended', category: 'Health' },
  { ageMonths: 132, label: 'Biannual vet visits recommended', category: 'Health' },
]

export default function LifeStageScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const passport = lsGet(LS_PASSPORT_KEY(cat.id)) ?? {}
  const ageData = catAgeFromDob(passport.dob)
  const currentStage = getStage(ageData?.years ?? null)
  const stageInfo = LIFE_STAGES.find((s) => s.id === currentStage)

  const upcomingMilestones = ageData ? MILESTONES.filter((m) => m.ageMonths > (ageData.years * 12 + ageData.months)).slice(0, 4) : []
  const _pastMilestones = ageData ? MILESTONES.filter((m) => m.ageMonths <= (ageData.years * 12 + ageData.months)) : []

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Life Stage & Longevity</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {/* Age card */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {ageData ? (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-surface-container flex-shrink-0">
                {cat.emoji}
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{ageData.years}y {ageData.months}m</p>
                <p className="text-sm text-on-surface-muted">≈ {humanYears(ageData.years)} human years</p>
                {stageInfo && (
                  <span className="inline-block mt-1 text-xs font-semibold px-3 py-0.5 rounded-full" style={{ background: stageInfo.color }}>
                    {stageInfo.label} stage
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-on-surface-muted">Add date of birth in Pet Passport to unlock age tracking.</p>
              <button onClick={() => navigate(`/passport/${catId}`)} className="mt-2 text-xs font-semibold text-primary-container">
                Open Pet Passport →
              </button>
            </div>
          )}
        </div>

        {/* Current stage card */}
        {stageInfo && (
          <div className="rounded-2xl p-5 border" style={{ background: stageInfo.color + '33', borderColor: stageInfo.color }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1">{stageInfo.label} · {stageInfo.range}</p>
            <p className="text-sm text-on-surface leading-relaxed">{stageInfo.desc}</p>
          </div>
        )}

        {/* Life stages timeline */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Life Stages</p>
          <div className="flex flex-col gap-2">
            {LIFE_STAGES.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${currentStage === stage.id ? 'ring-2 ring-primary-container' : 'opacity-60'}`}
                style={{ background: stage.color + '55' }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ background: currentStage === stage.id ? '#e89a3c' : stage.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-on-surface">{stage.label}</p>
                    <span className="text-xs text-on-surface-muted">{stage.range}</span>
                    {currentStage === stage.id && <span className="text-[10px] font-bold text-primary-container">NOW</span>}
                  </div>
                  <p className="text-xs text-on-surface-muted mt-0.5 leading-snug">{stage.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming milestones */}
        {upcomingMilestones.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Upcoming Milestones</p>
            <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              {upcomingMilestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-surface-container last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                    <IcoCalendar size={14} color="#e89a3c" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{m.label}</p>
                    <p className="text-xs text-on-surface-muted">{m.category} · at {m.ageMonths >= 12 ? `${Math.floor(m.ageMonths / 12)}y` : `${m.ageMonths}mo`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
