import { useNavigate, useParams } from 'react-router-dom'
import {
  IcoShield, IcoStethoscope, IcoPill, IcoLeaf, IcoFlask,
  IcoPlay, IcoDumbbell, IcoBook, IcoBrain, IcoCompass, IcoCamera3,
  IcoHome, IcoScissors, IcoUsers, IcoPassport, IcoSprout,
  IcoMap, IcoLeash, IcoUser, IcoSparkles, IcoChevronRight, IcoHeartPulse
} from '../components/icons'

const SECTION_ITEMS = [
  {
    section: 'Health & Medical',
    color: '#fecaca',
    items: [
      { id: 'health', label: 'Health & Injury Log', desc: 'Track illness, injuries, symptoms', Icon: IcoHeartPulse, path: (id) => `/health/${id}` },
      { id: 'pharmacy', label: 'Pharmacy Log', desc: 'Medications & supplements', Icon: IcoPill, path: (id) => `/pharmacy/${id}` },
      { id: 'vet-summary', label: 'Vet-Ready Summary', desc: 'Pre-appointment brief', Icon: IcoStethoscope, path: (id) => `/vet-summary/${id}` },
      { id: 'emergency', label: 'Emergency Vault', desc: 'Contacts, ICE info', Icon: IcoShield, path: (id) => `/emergency/${id}` },
    ],
  },
  {
    section: 'Nutrition & Digestion',
    color: '#ccebc7',
    items: [
      { id: 'nutrition', label: 'Nutrition Lab', desc: 'Diet, portions, food log', Icon: IcoFlask, path: (id) => `/nutrition/${id}` },
      { id: 'litter', label: 'Litter & Digestive', desc: 'Elimination tracking', Icon: IcoLeaf, path: (id) => `/litter/${id}` },
    ],
  },
  {
    section: 'Behaviour & Training',
    color: '#e9d5ff',
    items: [
      { id: 'training', label: 'Training Session Log', desc: 'Sessions, cues, progress', Icon: IcoBook, path: (id) => `/training/${id}` },
      { id: 'bond', label: 'Bond & Friction Log', desc: 'Relationship moments', Icon: IcoUser, path: (id) => `/bond/${id}` },
      { id: 'behavior', label: 'Behavior Lab', desc: 'Pattern analysis', Icon: IcoBrain, path: (id) => `/behavior/${id}` },
      { id: 'personality', label: 'Personality Compass', desc: 'Trait mapping', Icon: IcoCompass, path: (id) => `/personality/${id}` },
      { id: 'leash', label: 'Leash Training Guide', desc: 'Outdoor confidence steps', Icon: IcoLeash, path: (id) => `/leash/${id}` },
    ],
  },
  {
    section: 'Activity & Play',
    color: '#bfdbfe',
    items: [
      { id: 'play-lab', label: 'Play Lab', desc: 'Session log & toy library', Icon: IcoPlay, path: (id) => `/play-lab/${id}` },
      { id: 'outdoor', label: 'Outdoor Confidence Map', desc: 'Exploration milestones', Icon: IcoMap, path: (id) => `/outdoor/${id}` },
    ],
  },
  {
    section: 'Life & Identity',
    color: '#fde68a',
    items: [
      { id: 'life-stage', label: 'Life Stage & Longevity', desc: 'Age milestones, projections', Icon: IcoSprout, path: (id) => `/life-stage/${id}` },
      { id: 'gallery', label: 'Cat Photo Gallery', desc: 'Photo timeline', Icon: IcoCamera3, path: (id) => `/gallery/${id}` },
      { id: 'passport', label: 'Pet Passport', desc: 'ID, vaccines, insurance', Icon: IcoPassport, path: (id) => `/passport/${id}` },
    ],
  },
  {
    section: 'Routines & Safety',
    color: '#f0edef',
    items: [
      { id: 'environment', label: 'Environment Audit', desc: 'Home hazard checklist', Icon: IcoHome, path: (id) => `/environment/${id}` },
      { id: 'cleaning', label: 'Cleaning Log', desc: 'Bowls, litter, spaces', Icon: IcoScissors, path: (id) => `/cleaning/${id}` },
      { id: 'sitter', label: 'Sitter Mode', desc: 'Handoff info for carers', Icon: IcoUsers, path: (id) => `/sitter/${id}` },
      { id: 'human-injury', label: 'Human Injury Log', desc: 'Scratches, bites from cat', Icon: IcoDumbbell, path: (id) => `/human-injury/${id}` },
    ],
  },
  {
    section: 'Stitch AI',
    color: 'linear-gradient(135deg, #e89a3c22, #9b59b622)',
    items: [
      { id: 'ai-companion', label: 'Stitch AI Companion', desc: 'Chat, ask, get insights', Icon: IcoSparkles, path: (id) => `/ai-companion/${id}` },
    ],
  },
]

function useCatId() {
  const { catId } = useParams() ?? {}
  if (catId) return catId
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('petmood_reads_'))
    if (keys.length > 0) return keys[0].replace('petmood_reads_', '')
  } catch {}
  return '__luna'
}

export default function MoreScreen({ cats }) {
  const navigate = useNavigate()
  const catId = useCatId()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-28">
      {/* Header */}
      <div className="px-5 py-4">
        <p className="text-xs text-on-surface-muted font-medium">{cat.name}'s Tools</p>
        <h1 className="text-xl font-semibold text-on-surface">All Features</h1>
      </div>

      <div className="flex flex-col gap-6 px-5">
        {SECTION_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">
              {group.section}
            </p>
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
              {group.items.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path(catId))}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-container/50 active:scale-[0.99] transition-all ${
                    i < group.items.length - 1 ? 'border-b border-surface-container' : ''
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: group.color }}
                  >
                    <item.Icon size={18} color="#1b1b1d" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface leading-snug">{item.label}</p>
                    <p className="text-[11px] text-on-surface-muted">{item.desc}</p>
                  </div>
                  <IcoChevronRight size={16} color="#857464" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
