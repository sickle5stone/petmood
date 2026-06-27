import { useNavigate, useParams } from 'react-router-dom'
import {
  IcoShield, IcoStethoscope, IcoPill, IcoLeaf, IcoFlask,
  IcoPlay, IcoDumbbell, IcoBook, IcoBrain, IcoCompass, IcoCamera3,
  IcoHome, IcoScissors, IcoUsers, IcoPassport, IcoSprout,
  IcoMap, IcoLeash, IcoUser, IcoSparkles, IcoChevronRight, IcoHeartPulse, IcoChevronLeft
} from '../components/icons'
import { CatAvatar } from '../components/ui'

/** Infrequent & specialized tools — not in bottom nav. Reach via Today or profile. */
const SECTION_ITEMS = [
  {
    section: 'Health & vet',
    subtitle: 'When something seems off or before appointments',
    color: '#fceee9',
    items: [
      { id: 'health', label: 'Health & Injury Log', desc: 'Symptoms, injuries, observations', Icon: IcoHeartPulse, path: (id) => `/health/${id}` },
      { id: 'pharmacy', label: 'Pharmacy Log', desc: 'Medications & supplements', Icon: IcoPill, path: (id) => `/pharmacy/${id}` },
      { id: 'vet-summary', label: 'Vet-Ready Summary', desc: 'Pre-appointment brief', Icon: IcoStethoscope, path: (id) => `/vet-summary/${id}` },
      { id: 'emergency', label: 'Emergency Vault', desc: 'ICE contacts & critical info', Icon: IcoShield, path: (id) => `/emergency/${id}` },
    ],
  },
  {
    section: 'Daily care',
    subtitle: 'Also linked from the Care tab',
    color: '#eef5ed',
    items: [
      { id: 'nutrition', label: 'Nutrition Lab', desc: 'Diet, portions, food log', Icon: IcoFlask, path: (id) => `/nutrition/${id}` },
      { id: 'litter', label: 'Litter & Digestive', desc: 'Elimination tracking', Icon: IcoLeaf, path: (id) => `/litter/${id}` },
    ],
  },
  {
    section: 'Behaviour & training',
    subtitle: 'Patterns, cues, and personality',
    color: '#f3ecfb',
    items: [
      { id: 'training', label: 'Training Session Log', desc: 'Sessions, cues, progress', Icon: IcoBook, path: (id) => `/training/${id}` },
      { id: 'bond', label: 'Bond & Friction Log', desc: 'Relationship moments', Icon: IcoUser, path: (id) => `/bond/${id}` },
      { id: 'behavior', label: 'Behavior Lab', desc: 'Activity ↔ mood patterns', Icon: IcoBrain, path: (id) => `/behavior/${id}` },
      { id: 'personality', label: 'Personality Compass', desc: 'Trait profile', Icon: IcoCompass, path: (id) => `/personality/${id}` },
    ],
  },
  {
    section: 'Admin & occasional',
    subtitle: 'Less frequent — gallery, sitter handoff, environment',
    color: '#f0edef',
    items: [
      { id: 'passport', label: 'Pet Passport', desc: 'ID, vaccines, insurance', Icon: IcoPassport, path: (id) => `/passport/${id}` },
      { id: 'gallery', label: 'Photo Gallery', desc: 'Moments timeline', Icon: IcoCamera3, path: (id) => `/gallery/${id}` },
      { id: 'sitter', label: 'Sitter Mode', desc: 'Carer handoff card', Icon: IcoUsers, path: (id) => `/sitter/${id}` },
      { id: 'life-stage', label: 'Life Stage', desc: 'Age & milestones', Icon: IcoSprout, path: (id) => `/life-stage/${id}` },
      { id: 'environment', label: 'Environment Audit', desc: 'Home safety checklist', Icon: IcoHome, path: (id) => `/environment/${id}` },
      { id: 'cleaning', label: 'Cleaning Log', desc: 'Bowls, litter, spaces', Icon: IcoScissors, path: (id) => `/cleaning/${id}` },
      { id: 'play-lab', label: 'Play Lab', desc: 'Play sessions & toys', Icon: IcoPlay, path: (id) => `/play-lab/${id}` },
      { id: 'outdoor', label: 'Outdoor Confidence', desc: 'Exploration milestones', Icon: IcoMap, path: (id) => `/outdoor/${id}` },
      { id: 'leash', label: 'Leash Training', desc: 'Outdoor steps guide', Icon: IcoLeash, path: (id) => `/leash/${id}` },
      { id: 'human-injury', label: 'Human Injury Log', desc: 'Scratches & bites', Icon: IcoDumbbell, path: (id) => `/human-injury/${id}` },
      { id: 'ai-companion', label: 'Stitch AI Companion', desc: 'Chat about your cat', Icon: IcoSparkles, path: (id) => `/ai-companion/${id}` },
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
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  return (
    <div className="pm-page pb-nav">
      <div className="px-5 py-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="pm-icon-btn !w-9 !h-9"
          aria-label="Back to Today"
        >
          <IcoChevronLeft size={20} color="#1b1b1d" />
        </button>
        <CatAvatar name={cat.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-caption text-on-surface-muted font-medium">Occasional tools</p>
          <h1 className="pm-title">All Tools</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-5">
        {SECTION_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="pm-label mb-0.5">{group.section}</p>
            {group.subtitle && (
              <p className="text-caption text-on-surface-muted mb-2">{group.subtitle}</p>
            )}
            <div className="pm-card overflow-hidden p-0">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.path(catId))}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-container/50 active:scale-[0.995] transition-all duration-150 border-b border-border-subtle last:border-0"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border border-border-subtle"
                    style={{ background: group.color }}
                  >
                    <item.Icon size={18} color="#524436" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface leading-snug tracking-tight">{item.label}</p>
                    <p className="text-caption text-on-surface-muted">{item.desc}</p>
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
