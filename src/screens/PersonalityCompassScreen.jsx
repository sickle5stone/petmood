import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoCompass } from '../components/icons'
import { getReadsLocal } from '../dataService'

const TRAITS = [
  { id: 'social', label: 'Sociability', low: 'Solitary', high: 'Social butterfly', lowDesc: 'Prefers alone time', highDesc: 'Seeks constant company' },
  { id: 'energy', label: 'Energy Level', low: 'Couch potato', high: 'Hyperactive', lowDesc: 'Loves sleeping', highDesc: 'Always on the move' },
  { id: 'curious', label: 'Curiosity', low: 'Indifferent', high: 'Explorer', lowDesc: 'Sticks to routine', highDesc: 'Investigates everything' },
  { id: 'affection', label: 'Affection', low: 'Independent', high: 'Velcro cat', lowDesc: 'On own terms', highDesc: 'Constant cuddles' },
  { id: 'vocal', label: 'Vocality', low: 'Silent type', high: 'Chatty', lowDesc: 'Rarely meows', highDesc: 'Talks constantly' },
  { id: 'playful', label: 'Playfulness', low: 'Dignified', high: 'Forever kitten', lowDesc: 'Mature, calm', highDesc: 'Always playing' },
  { id: 'brave', label: 'Bravery', low: 'Timid', high: 'Fearless', lowDesc: 'Hides from noise', highDesc: 'Approaches everything' },
  { id: 'adaptable', label: 'Adaptability', low: 'Creature of habit', high: 'Flexible', lowDesc: 'Hates change', highDesc: 'Adjusts easily' },
]

const LS_KEY = (catId) => `petmood_personality_${catId}`
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function TraitSlider({ trait, value, onChange }) {
  return (
    <div className="pm-card p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-on-surface">{trait.label}</p>
        <span className="text-xs font-semibold text-primary-container px-2 py-0.5 rounded-full bg-primary-container/10">
          {value <= 2 ? trait.low : value >= 8 ? trait.high : value <= 4 ? 'Mostly ' + trait.low : value >= 6 ? 'Mostly ' + trait.high : 'Balanced'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-on-surface-muted w-16 text-right leading-tight">{trait.lowDesc}</span>
        <div className="flex-1 relative">
          <input
            type="range" min={1} max={10} value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #e89a3c ${(value - 1) / 9 * 100}%, #f0edef ${(value - 1) / 9 * 100}%)`
            }}
          />
        </div>
        <span className="text-[10px] text-on-surface-muted w-16 leading-tight">{trait.highDesc}</span>
      </div>
    </div>
  )
}

export default function PersonalityCompassScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const defaultValues = Object.fromEntries(TRAITS.map((t) => [t.id, 5]))
  const [values, setValues] = useState(defaultValues)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const data = lsGet(LS_KEY(cat.id))
    if (data) { setValues(data.values ?? defaultValues); setNotes(data.notes ?? '') }
  }, [cat.id])

  function update(id, val) {
    const updated = { ...values, [id]: val }
    setValues(updated)
    lsSet(LS_KEY(cat.id), { values: updated, notes })
  }

  function saveNotes(n) {
    setNotes(n)
    lsSet(LS_KEY(cat.id), { values, notes: n })
  }

  // Auto-infer from reads
  const reads = getReadsLocal(cat.id)
  const inferredTraits = useMemo(() => {
    if (reads.length < 3) return null
    const playCount = reads.filter((r) => r.feeling?.toLowerCase().includes('play') || r.activity?.toLowerCase().includes('play')).length
    const calmCount = reads.filter((r) => r.feeling?.toLowerCase().includes('calm') || r.feeling?.toLowerCase().includes('relax')).length
    const activeCount = reads.filter((r) => r.feeling?.toLowerCase().includes('active')).length
    return {
      playfulness: Math.min(10, Math.round((playCount / reads.length) * 20) + 3),
      energy: Math.min(10, Math.round((activeCount / reads.length) * 20) + 3),
      calm: Math.min(10, Math.round((calmCount / reads.length) * 20) + 3),
    }
  }, [reads])

  const personalityType = useMemo(() => {
    const { social, energy, curious, affection } = values
    if (social >= 7 && affection >= 7) return { label: 'The Companion', desc: 'Deeply bonded, social, and affectionate.' }
    if (energy >= 7 && curious >= 7) return { label: 'The Explorer', desc: 'Energetic and always investigating new things.' }
    if (social <= 3 && energy <= 4) return { label: 'The Contemplative', desc: 'Independent, thoughtful, and self-sufficient.' }
    if (affection >= 7 && energy <= 4) return { label: 'The Gentle Soul', desc: 'Loving but calm — a true lap cat.' }
    if (curious >= 7 && energy >= 7) return { label: 'The Adventurer', desc: 'Fearless explorer with boundless curiosity.' }
    return { label: 'The Balanced Cat', desc: 'Adaptable and well-rounded across all traits.' }
  }, [values])

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Personality Compass</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name} · Trait mapping</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {/* Personality type card */}
        <div className="bg-gradient-to-br from-primary-container/15 to-secondary-container/10 rounded-3xl p-5 border border-primary-container/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-3xl">{cat.emoji}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-container">Personality Type</p>
              <p className="text-lg font-semibold text-on-surface">{personalityType.label}</p>
              <p className="text-xs text-on-surface-muted mt-0.5">{personalityType.desc}</p>
            </div>
          </div>
        </div>

        {inferredTraits && (
          <div className="bg-secondary-container/20 rounded-2xl p-4">
            <p className="text-xs font-semibold text-secondary mb-1">AI-inferred from your reads</p>
            <p className="text-caption text-on-surface-muted font-medium">
              Based on {reads.length} reads — playfulness ≈{inferredTraits.playfulness}/10, energy ≈{inferredTraits.energy}/10, calm ≈{inferredTraits.calm}/10.
              You can adjust sliders below.
            </p>
          </div>
        )}

        {/* Trait sliders */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Adjust Traits</p>
          <div className="flex flex-col gap-3">
            {TRAITS.map((trait) => (
              <TraitSlider key={trait.id} trait={trait} value={values[trait.id]} onChange={(v) => update(trait.id, v)} />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Personality Notes</p>
          <div className="pm-card p-4">
            <textarea
              value={notes}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder={`Write a profile for ${cat.name}...`}
              rows={4}
              className="w-full text-sm text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-muted/40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
