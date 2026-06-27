import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoStethoscope, IcoShare, IcoCheck } from '../components/icons'

const LS_PASSPORT_KEY = (catId) => `petmood_passport_${catId}`
const LS_HEALTH_KEY = (catId) => `petmood_health_${catId}`
const LS_PHARMACY_KEY = (catId) => `petmood_pharmacy_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }

function age(dob) {
  if (!dob) return null
  const ms = Date.now() - new Date(dob).getTime()
  const years = Math.floor(ms / (365.25 * 86_400_000))
  const months = Math.floor((ms % (365.25 * 86_400_000)) / (30.44 * 86_400_000))
  if (years > 0) return `${years}y ${months}m`
  return `${months} months`
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="pm-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-container">
        <Icon size={16} color="#e89a3c" />
        <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted">{title}</p>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start py-2.5 border-b border-surface-container last:border-0 gap-2">
      <span className="text-xs text-on-surface-muted w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className={`flex-1 text-sm ${value ? 'text-on-surface font-medium' : 'text-on-surface-muted/40 italic'}`}>
        {value || '—'}
      </span>
    </div>
  )
}

export default function VetSummaryScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [passport, setPassport] = useState(null)
  const [health, setHealth] = useState([])
  const [meds, setMeds] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPassport(lsGet(LS_PASSPORT_KEY(cat.id)))
    setHealth(lsGet(LS_HEALTH_KEY(cat.id)) ?? [])
    setMeds(lsGet(LS_PHARMACY_KEY(cat.id)) ?? [])
  }, [cat.id])

  const p = passport ?? {}
  const activeMeds = meds.filter((m) => !m.paused)
  const recentHealth = health.filter((h) => !h.resolvedAt).slice(0, 5)
  const vaxDue = p.vaccinations?.filter((v) => v.status === 'Due soon' || v.status === 'Overdue') ?? []

  function buildText() {
    const lines = [
      `PATIENT: ${p.name || cat.name}`,
      `Breed: ${p.breed || 'Unknown'} | Age: ${age(p.dob) || 'Unknown'} | Weight: ${p.weight ? p.weight + 'kg' : 'Unknown'}`,
      `Gender: ${p.gender || 'Unknown'} | Neutered: ${p.neutered ? 'Yes' : 'No'}`,
      `Microchip: ${p.microchipId || 'Not recorded'}`,
      '',
      'ACTIVE MEDICATIONS:',
      activeMeds.length > 0 ? activeMeds.map((m) => `  • ${m.name} ${m.dose} — ${m.frequency}`).join('\n') : '  None',
      '',
      'ACTIVE HEALTH ISSUES:',
      recentHealth.length > 0 ? recentHealth.map((h) => `  • ${h.title} (${h.type}, ${h.severity})`).join('\n') : '  None',
      '',
      'VACCINATIONS NEEDING ATTENTION:',
      vaxDue.length > 0 ? vaxDue.map((v) => `  • ${v.name}: ${v.status}`).join('\n') : '  All up to date',
      '',
      `NOTES: ${p.notes || 'None'}`,
    ]
    return lines.join('\n')
  }

  function share() {
    const text = buildText()
    if (navigator.share) {
      navigator.share({ title: `${cat.name}'s Vet Summary`, text })
    } else {
      navigator.clipboard?.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="pm-title !text-lg leading-snug">Vet-Ready Summary</h1>
          <p className="text-caption text-on-surface-muted font-medium">{cat.name}</p>
        </div>
        <button
          onClick={share}
          className="pm-add-btn"
        >
          {copied ? <IcoCheck size={16} color="white" /> : <IcoShare size={16} color="white" />}
        </button>
      </div>

      <div className="flex flex-col gap-4 pb-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-container/15 to-secondary-container/10 rounded-3xl p-5 flex items-center gap-4 border border-primary-container/10">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-4xl">
            {cat.emoji}
          </div>
          <div>
            <p className="text-lg font-semibold text-on-surface">{p.name || cat.name}</p>
            {p.breed && <p className="text-sm text-on-surface-muted">{p.breed}</p>}
            <p className="text-xs text-on-surface-muted mt-0.5">
              {age(p.dob) ? `${age(p.dob)} old` : 'Age unknown'} · {p.weight ? `${p.weight}kg` : 'Weight unknown'}
            </p>
            {p.neutered && <p className="text-xs text-secondary font-medium mt-1">Neutered / Spayed</p>}
          </div>
        </div>

        {vaxDue.length > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">Vaccinations needing attention</p>
            {vaxDue.map((v, i) => (
              <p key={i} className="text-xs text-amber-700">{v.name}: <span className="font-semibold">{v.status}</span></p>
            ))}
          </div>
        )}

        <SectionCard title="Identity" icon={IcoStethoscope}>
          <Row label="Microchip" value={p.microchipId} />
          <Row label="Gender" value={p.gender ? `${p.gender}${p.neutered ? ', Neutered' : ''}` : null} />
          <Row label="Colour" value={p.colour} />
          <Row label="Insurance" value={p.insuranceProvider ? `${p.insuranceProvider} · ${p.insurancePolicy || 'N/A'}` : null} />
        </SectionCard>

        <SectionCard title="Active Medications" icon={IcoStethoscope}>
          {activeMeds.length === 0 ? (
            <p className="py-3 text-sm text-on-surface-muted/60 italic">None currently active</p>
          ) : (
            activeMeds.map((m) => (
              <div key={m.id} className="py-2.5 border-b border-surface-container last:border-0">
                <p className="text-sm font-medium text-on-surface">{m.name} {m.dose}</p>
                <p className="text-caption text-on-surface-muted font-medium">{m.frequency}{m.purpose ? ` · ${m.purpose}` : ''}</p>
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Active Health Issues" icon={IcoStethoscope}>
          {recentHealth.length === 0 ? (
            <p className="py-3 text-sm text-on-surface-muted/60 italic">No active issues</p>
          ) : (
            recentHealth.map((h) => (
              <div key={h.id} className="py-2.5 border-b border-surface-container last:border-0">
                <p className="text-sm font-medium text-on-surface">{h.title}</p>
                <p className="text-xs text-on-surface-muted capitalize">{h.type} · {h.severity}</p>
                {h.notes && <p className="text-xs text-on-surface-muted/70 mt-0.5">{h.notes}</p>}
              </div>
            ))
          )}
        </SectionCard>

        {p.vaccinations?.length > 0 && (
          <SectionCard title="Vaccinations" icon={IcoStethoscope}>
            {p.vaccinations.map((v, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-surface-container last:border-0">
                <p className="text-sm text-on-surface">{v.name}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  v.status === 'Up to date' ? 'bg-secondary-container text-secondary' :
                  v.status === 'Due soon' ? 'bg-amber-100 text-amber-800' :
                  v.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-surface-container text-on-surface-muted'
                }`}>
                  {v.status || 'Unknown'}
                </span>
              </div>
            ))}
          </SectionCard>
        )}

        {p.notes && (
          <SectionCard title="Vet Notes" icon={IcoStethoscope}>
            <p className="py-3 text-sm text-on-surface leading-relaxed">{p.notes}</p>
          </SectionCard>
        )}

        <button
          onClick={share}
          className="w-full py-4 rounded-2xl bg-primary-container text-white font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <IcoShare size={18} color="white" />
          {copied ? 'Copied to clipboard' : 'Share with vet'}
        </button>
      </div>
    </div>
  )
}
