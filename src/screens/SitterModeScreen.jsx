import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoUsers, IcoShare } from '../components/icons'

const LS_VAULT_KEY = (catId) => `petmood_emergency_${catId}`
const LS_PASSPORT_KEY = (catId) => `petmood_passport_${catId}`
const LS_SITTER_KEY = (catId) => `petmood_sitter_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">{title}</p>
      <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">{children}</div>
    </div>
  )
}

function Field({ label, value, placeholder, onChange }) {
  return (
    <div className="flex items-start py-3 border-b border-surface-container last:border-0 gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted w-32 flex-shrink-0 pt-1">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 text-sm text-on-surface bg-transparent outline-none placeholder:text-on-surface-muted/40" />
    </div>
  )
}

function TextArea({ label, value, placeholder, onChange }) {
  return (
    <div className="py-3 border-b border-surface-container last:border-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">{label}</p>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full text-sm text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-muted/40" />
    </div>
  )
}

export default function SitterModeScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [info, setInfo] = useState({
    greeting: '',
    feedingTime: '', feedingAmount: '', feedingBrand: '',
    waterTip: '',
    playTip: '',
    litterLocation: '', litterFrequency: '',
    hidingSpots: '', fearNotes: '', medNotes: '', specialInstructions: '',
    vetPhone: '', ownerPhone: '',
  })
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const vault = lsGet(LS_VAULT_KEY(cat.id)) ?? {}
    const passport = lsGet(LS_PASSPORT_KEY(cat.id)) ?? {}
    const stored = lsGet(LS_SITTER_KEY(cat.id))
    setInfo(stored ?? {
      greeting: `Hi! I'm ${cat.name}.`,
      feedingTime: vault.feedingSchedule ?? '',
      feedingAmount: '', feedingBrand: '',
      waterTip: 'Please refill my water bowl once a day.',
      playTip: 'I love wand toys! 10-15 minutes twice a day is ideal.',
      litterLocation: '', litterFrequency: 'Scoop once a day',
      hidingSpots: '', fearNotes: '',
      medNotes: passport.notes ?? '',
      specialInstructions: vault.specialInstructions ?? '',
      vetPhone: vault.vetPhone ?? '',
      ownerPhone: vault.ownerPhone ?? '',
    })
  }, [cat.id, cat.name])

  function update(key, value) {
    setInfo((i) => ({ ...i, [key]: value }))
    setSaved(false)
  }

  function saveInfo() {
    lsSet(LS_SITTER_KEY(cat.id), info)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function shareCard() {
    const text = `🐱 SITTER GUIDE — ${cat.name}

${info.greeting}

FEEDING: ${info.feedingTime} | ${info.feedingAmount} of ${info.feedingBrand}
WATER: ${info.waterTip}
PLAY: ${info.playTip}

LITTER: ${info.litterLocation} | ${info.litterFrequency}

HIDING SPOTS: ${info.hidingSpots || 'Will show you'}
FEARS / STRESS: ${info.fearNotes || 'None known'}
MEDICATIONS: ${info.medNotes || 'None'}
SPECIAL NOTES: ${info.specialInstructions || 'None'}

CONTACTS:
Vet: ${info.vetPhone}
Owner: ${info.ownerPhone}`

    if (navigator.share) {
      navigator.share({ title: `${cat.name}'s Sitter Guide`, text })
    } else {
      navigator.clipboard?.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Sitter Mode</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}'s care guide</p>
        </div>
        <button onClick={saveInfo}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${saved ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-white'}`}>
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Share banner */}
      <div className="mx-5 mb-5 bg-gradient-to-br from-primary-container/15 to-secondary-container/10 rounded-2xl p-4 flex items-start gap-3 border border-primary-container/10">
        <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center flex-shrink-0">
          <IcoUsers size={18} color="#e89a3c" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-on-surface">Carer handoff card</p>
          <p className="text-xs text-on-surface-muted mt-0.5">Fill in below and share the card with your sitter or pet hotel.</p>
          <button onClick={shareCard} className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-primary-container active:scale-95 transition-transform">
            <IcoShare size={14} color="#e89a3c" />
            {copied ? 'Copied to clipboard' : 'Share sitter card'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
        <Section title="Introduction">
          <TextArea label="Greeting message" value={info.greeting} placeholder={`Hi! I'm ${cat.name}.`} onChange={(v) => update('greeting', v)} />
        </Section>

        <Section title="Feeding">
          <Field label="Schedule" value={info.feedingTime} placeholder="e.g. 8am and 6pm" onChange={(v) => update('feedingTime', v)} />
          <Field label="Amount" value={info.feedingAmount} placeholder="e.g. 80g per meal" onChange={(v) => update('feedingAmount', v)} />
          <Field label="Brand / Food" value={info.feedingBrand} placeholder="e.g. Royal Canin Indoor" onChange={(v) => update('feedingBrand', v)} />
          <TextArea label="Tips" value={info.waterTip} placeholder="e.g. Refill water once daily" onChange={(v) => update('waterTip', v)} />
        </Section>

        <Section title="Play & Enrichment">
          <TextArea label="Play tips" value={info.playTip} placeholder="Favourite toys, routines..." onChange={(v) => update('playTip', v)} />
        </Section>

        <Section title="Litter Box">
          <Field label="Location" value={info.litterLocation} placeholder="e.g. Bathroom, laundry room" onChange={(v) => update('litterLocation', v)} />
          <Field label="Cleaning" value={info.litterFrequency} placeholder="e.g. Scoop once daily" onChange={(v) => update('litterFrequency', v)} />
        </Section>

        <Section title="Personality & Safety">
          <TextArea label="Hiding spots" value={info.hidingSpots} placeholder="Where they hide when stressed..." onChange={(v) => update('hidingSpots', v)} />
          <TextArea label="Fears / stressors" value={info.fearNotes} placeholder="Loud noises, strangers, etc." onChange={(v) => update('fearNotes', v)} />
          <TextArea label="Medications" value={info.medNotes} placeholder="None / details if applicable" onChange={(v) => update('medNotes', v)} />
          <TextArea label="Special instructions" value={info.specialInstructions} placeholder="Anything the carer must know" onChange={(v) => update('specialInstructions', v)} />
        </Section>

        <Section title="Emergency Contacts">
          <Field label="Vet phone" value={info.vetPhone} placeholder="+1 555-0000" onChange={(v) => update('vetPhone', v)} />
          <Field label="Owner phone" value={info.ownerPhone} placeholder="Your number" onChange={(v) => update('ownerPhone', v)} />
        </Section>

        <button onClick={shareCard}
          className="w-full py-4 rounded-2xl bg-primary-container text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <IcoShare size={18} color="white" />
          Share sitter card
        </button>
      </div>
    </div>
  )
}
