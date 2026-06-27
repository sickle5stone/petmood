import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoCheck, IcoAlertCircle } from '../components/icons'

const LS_KEY = (catId) => `petmood_environment_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const AUDIT_ITEMS = [
  { id: 'toxic_plants', category: 'Plants & Garden', label: 'No toxic plants in reach', risk: 'high', tip: 'Common toxics: lilies, pothos, aloe, monstera. Check ASPCA list.' },
  { id: 'secure_windows', category: 'Falls & Escapes', label: 'Windows have secure screens', risk: 'high', tip: 'High-rise syndrome risk. Even indoor cats can fall.' },
  { id: 'balcony_safe', category: 'Falls & Escapes', label: 'Balcony/patio secured or cat-proofed', risk: 'high', tip: 'Catios or netting prevent falls and escape.' },
  { id: 'string_hazards', category: 'Ingestion Hazards', label: 'Strings, ribbons, rubber bands stored away', risk: 'high', tip: 'Linear foreign bodies are a common surgical emergency.' },
  { id: 'small_items', category: 'Ingestion Hazards', label: 'Small items off the floor (coins, clips, pins)', risk: 'medium', tip: 'Cats may bat and swallow small objects.' },
  { id: 'chemicals_locked', category: 'Toxins', label: 'Cleaning products locked away', risk: 'high', tip: 'Many household cleaners are toxic if licked.' },
  { id: 'medications_secured', category: 'Toxins', label: 'Human medications secured', risk: 'high', tip: 'Ibuprofen, acetaminophen, and antidepressants can be fatal.' },
  { id: 'food_stored', category: 'Toxins', label: 'Toxic foods stored safely (grapes, onion, chocolate)', risk: 'high', tip: 'Raisins, onions, garlic, chocolate, xylitol are toxic.' },
  { id: 'litter_private', category: 'Wellbeing', label: 'Litter box in private, accessible location', risk: 'low', tip: 'One box per cat plus one extra is recommended.' },
  { id: 'water_fresh', category: 'Wellbeing', label: 'Fresh water always available', risk: 'low', tip: 'Running water fountains encourage hydration.' },
  { id: 'hiding_spots', category: 'Wellbeing', label: 'Safe hiding spots available', risk: 'low', tip: 'Boxes, tunnels, enclosed beds help stress management.' },
  { id: 'vertical_space', category: 'Wellbeing', label: 'Vertical territory (cat trees, shelves) available', risk: 'low', tip: 'Cats need height for security and enrichment.' },
  { id: 'scratching_post', category: 'Wellbeing', label: 'Multiple scratching surfaces available', risk: 'low', tip: 'Prevents furniture destruction and claw issues.' },
  { id: 'escape_proof', category: 'Falls & Escapes', label: 'Entry/exit doors are mindfully managed', risk: 'medium', tip: 'Airlock systems or cat-proof door habits prevent escapes.' },
  { id: 'noise_refuge', category: 'Stress', label: 'Quiet refuge available for loud events', risk: 'low', tip: 'Important for fireworks, parties, construction.' },
  { id: 'temperature', category: 'Stress', label: 'Temperature comfortable year-round', risk: 'low', tip: 'Cats tolerate 18–29°C (65–85°F). Watch for heat stress.' },
]

const RISK_COLORS = { high: '#fecaca', medium: '#fde68a', low: '#ccebc7' }
const RISK_LABELS = { high: 'High risk', medium: 'Medium risk', low: 'Low risk' }

const categories = [...new Set(AUDIT_ITEMS.map((i) => i.category))]

export default function EnvironmentAuditScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [checked, setChecked] = useState({})
  const [expanded, setExpanded] = useState(null)

  useEffect(() => { setChecked(lsGet(LS_KEY(cat.id)) ?? {}) }, [cat.id])

  function toggle(id) {
    const updated = { ...checked, [id]: !checked[id] }
    setChecked(updated)
    lsSet(LS_KEY(cat.id), updated)
  }

  const totalChecked = AUDIT_ITEMS.filter((i) => checked[i.id]).length
  const highRiskUnchecked = AUDIT_ITEMS.filter((i) => i.risk === 'high' && !checked[i.id])
  const score = Math.round((totalChecked / AUDIT_ITEMS.length) * 100)

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Environment Audit</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name}'s home safety</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {/* Score */}
        <div className="pm-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 60 60" className="-rotate-90 w-16 h-16">
                <circle cx="30" cy="30" r="24" fill="none" stroke="#f0edef" strokeWidth="6" />
                <circle cx="30" cy="30" r="24" fill="none" stroke={score >= 80 ? '#86efac' : score >= 50 ? '#fde68a' : '#fca5a5'} strokeWidth="6"
                  strokeDasharray={150.8} strokeDashoffset={150.8 * (1 - score / 100)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-on-surface">{score}%</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-on-surface">
                {score >= 80 ? 'Safe home' : score >= 50 ? 'Some risks remain' : 'Needs attention'}
              </p>
              <p className="text-caption text-on-surface-muted font-medium">{totalChecked} / {AUDIT_ITEMS.length} items cleared</p>
              {highRiskUnchecked.length > 0 && (
                <p className="text-xs text-red-600 font-medium mt-1">{highRiskUnchecked.length} high-risk items unchecked</p>
              )}
            </div>
          </div>
        </div>

        {/* High risk items highlighted */}
        {highRiskUnchecked.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <IcoAlertCircle size={16} color="#dc2626" />
              <p className="text-sm font-semibold text-red-800">High-priority items</p>
            </div>
            {highRiskUnchecked.map((item) => (
              <p key={item.id} className="text-xs text-red-700 py-0.5">• {item.label}</p>
            ))}
          </div>
        )}

        {/* Checklist by category */}
        {categories.map((cat_name) => {
          const items = AUDIT_ITEMS.filter((i) => i.category === cat_name)
          return (
            <div key={cat_name}>
              <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">{cat_name}</p>
              <div className="pm-card px-4">
                {items.map((item, i) => (
                  <div key={item.id}>
                    <div
                      className={`flex items-start gap-3 py-3 ${i < items.length - 1 ? 'border-b border-surface-container' : ''}`}
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all active:scale-90 border-2 ${
                          checked[item.id] ? 'bg-secondary-container border-secondary' : 'border-outline/40 hover:border-primary-container'
                        }`}
                      >
                        {checked[item.id] && <IcoCheck size={12} color="#5c8a5e" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${checked[item.id] ? 'text-on-surface-muted line-through' : 'text-on-surface'}`}>
                            {item.label}
                          </p>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: RISK_COLORS[item.risk] }}>
                            {RISK_LABELS[item.risk]}
                          </span>
                        </div>
                        {expanded === item.id && (
                          <p className="text-xs text-on-surface-muted mt-1 leading-relaxed">{item.tip}</p>
                        )}
                      </div>
                      <button
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        className="text-on-surface-muted/40 hover:text-on-surface-muted transition-colors px-1 pt-1"
                      >
                        <span className="text-xs">?</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
