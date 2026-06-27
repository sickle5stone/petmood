import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoShield } from '../components/icons'

const LS_KEY = (catId) => `petmood_emergency_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

function defaultVault(catName) {
  return {
    vetName: '', vetPhone: '', vetAddress: '',
    emergencyVetName: '', emergencyVetPhone: '', emergencyVetAddress: '',
    ownerName: '', ownerPhone: '', ownerAltPhone: '',
    sitterName: '', sitterPhone: '',
    allergies: '', medications: '', conditions: '',
    bloodType: '', microchipId: '',
    feedingSchedule: '', feedingNotes: '',
    specialInstructions: '',
    insuranceProvider: '', policyNumber: '', insurancePhone: '',
    catName: catName ?? 'Cat',
  }
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">{title}</p>
      <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, placeholder, onChange }) {
  return (
    <div className="flex items-start py-3 border-b border-surface-container last:border-0 gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted w-32 flex-shrink-0 pt-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm text-on-surface bg-transparent outline-none placeholder:text-on-surface-muted/40"
      />
    </div>
  )
}

function TextArea({ label, value, placeholder, onChange }) {
  return (
    <div className="py-3 border-b border-surface-container last:border-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full text-sm text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-muted/40"
      />
    </div>
  )
}

export default function EmergencyVaultScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [vault, setVault] = useState(() => defaultVault(cat.name))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = lsGet(LS_KEY(cat.id))
    if (stored) setVault(stored)
    else setVault(defaultVault(cat.name))
  }, [cat.id, cat.name])

  function update(key, value) {
    setVault((v) => ({ ...v, [key]: value }))
    setSaved(false)
  }

  function saveVault() {
    lsSet(LS_KEY(cat.id), vault)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function share() {
    const text = `🆘 EMERGENCY INFO for ${vault.catName}

VET: ${vault.vetName} — ${vault.vetPhone}
EMERGENCY VET: ${vault.emergencyVetName} — ${vault.emergencyVetPhone}
OWNER: ${vault.ownerName} — ${vault.ownerPhone}

ALLERGIES: ${vault.allergies || 'None known'}
MEDICATIONS: ${vault.medications || 'None'}
CONDITIONS: ${vault.conditions || 'None'}
MICROCHIP: ${vault.microchipId || 'Unknown'}

FEEDING: ${vault.feedingSchedule}
SPECIAL INSTRUCTIONS: ${vault.specialInstructions}`

    if (navigator.share) navigator.share({ title: `${vault.catName} Emergency Info`, text })
    else navigator.clipboard?.writeText(text)
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Emergency Vault</h1>
          <p className="text-xs text-on-surface-muted">{cat.name}</p>
        </div>
        <button
          onClick={saveVault}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${saved ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-white'}`}
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* ICE banner */}
      <div className="mx-5 mb-5 bg-red-50 rounded-2xl p-4 flex items-start gap-3 border border-red-100">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <IcoShield size={20} color="#dc2626" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-800">In Case of Emergency</p>
          <p className="text-xs text-red-700/80 mt-0.5 leading-relaxed">Keep this filled in so any carer has instant access to critical info.</p>
          <button onClick={share} className="mt-2 text-xs font-semibold text-red-700 underline">Share / copy ICE card</button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
        <Section title="Primary Vet">
          <Field label="Clinic Name" value={vault.vetName} placeholder="Dr. Chen Animal Clinic" onChange={(v) => update('vetName', v)} />
          <Field label="Phone" value={vault.vetPhone} placeholder="+1 555-0000" onChange={(v) => update('vetPhone', v)} />
          <Field label="Address" value={vault.vetAddress} placeholder="123 Vet Street" onChange={(v) => update('vetAddress', v)} />
        </Section>

        <Section title="Emergency Vet (24h)">
          <Field label="Clinic Name" value={vault.emergencyVetName} placeholder="24h Animal Emergency" onChange={(v) => update('emergencyVetName', v)} />
          <Field label="Phone" value={vault.emergencyVetPhone} placeholder="+1 555-9999" onChange={(v) => update('emergencyVetPhone', v)} />
          <Field label="Address" value={vault.emergencyVetAddress} placeholder="456 Emergency Ave" onChange={(v) => update('emergencyVetAddress', v)} />
        </Section>

        <Section title="Owner Contacts">
          <Field label="Name" value={vault.ownerName} placeholder="Your name" onChange={(v) => update('ownerName', v)} />
          <Field label="Phone" value={vault.ownerPhone} placeholder="Primary number" onChange={(v) => update('ownerPhone', v)} />
          <Field label="Alt Phone" value={vault.ownerAltPhone} placeholder="Backup number" onChange={(v) => update('ownerAltPhone', v)} />
          <Field label="Sitter / Carer" value={vault.sitterName} placeholder="Sitter name" onChange={(v) => update('sitterName', v)} />
          <Field label="Sitter Phone" value={vault.sitterPhone} placeholder="Sitter number" onChange={(v) => update('sitterPhone', v)} />
        </Section>

        <Section title="Medical Info">
          <Field label="Microchip ID" value={vault.microchipId} placeholder="15-digit ID" onChange={(v) => update('microchipId', v)} />
          <TextArea label="Allergies" value={vault.allergies} placeholder="None known / list any" onChange={(v) => update('allergies', v)} />
          <TextArea label="Medications" value={vault.medications} placeholder="Current meds & doses" onChange={(v) => update('medications', v)} />
          <TextArea label="Conditions" value={vault.conditions} placeholder="Chronic conditions, history" onChange={(v) => update('conditions', v)} />
        </Section>

        <Section title="Care Instructions">
          <Field label="Feeding Schedule" value={vault.feedingSchedule} placeholder="Twice daily at 8am & 6pm" onChange={(v) => update('feedingSchedule', v)} />
          <TextArea label="Feeding Notes" value={vault.feedingNotes} placeholder="Food brand, portion size, treats" onChange={(v) => update('feedingNotes', v)} />
          <TextArea label="Special Instructions" value={vault.specialInstructions} placeholder="Hiding spots, fears, quirks, medication timing" onChange={(v) => update('specialInstructions', v)} />
        </Section>

        <Section title="Insurance">
          <Field label="Provider" value={vault.insuranceProvider} placeholder="Insurance company" onChange={(v) => update('insuranceProvider', v)} />
          <Field label="Policy #" value={vault.policyNumber} placeholder="Policy number" onChange={(v) => update('policyNumber', v)} />
          <Field label="Claims Phone" value={vault.insurancePhone} placeholder="Claims line" onChange={(v) => update('insurancePhone', v)} />
        </Section>

        <button
          onClick={saveVault}
          className="w-full py-4 rounded-2xl bg-primary-container text-white font-semibold active:scale-95 transition-transform"
        >
          {saved ? 'Saved successfully' : 'Save emergency vault'}
        </button>
      </div>
    </div>
  )
}
