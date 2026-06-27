import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton, CatAvatar } from '../components/ui'
import { IcoSyringe, IcoShare } from '../components/icons'

const LS_PASSPORT_KEY = (catId) => `petmood_passport_${catId}`

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

function defaultPassport(catName) {
  return {
    name: catName ?? 'Luna',
    breed: '',
    dob: '',
    weight: '',
    colour: '',
    gender: '',
    neutered: false,
    microchipId: '',
    insurancePolicy: '',
    insuranceProvider: '',
    vaccinations: [
      { name: 'Rabies', status: 'Up to date', due: '' },
      { name: 'FVRCP', status: 'Up to date', due: '' },
      { name: 'FeLV', status: '', due: '' },
    ],
    notes: '',
  }
}

function InfoRow({ label, value, placeholder, onEdit }) {
  return (
    <div className="flex items-center py-3 border-b border-surface-container last:border-0 gap-3">
      <span className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted w-28 flex-shrink-0">{label}</span>
      <span className={`flex-1 text-sm ${value ? 'text-on-surface font-medium' : 'text-on-surface-muted/40 italic'}`}>
        {value || placeholder}
      </span>
      {onEdit && (
        <button onClick={onEdit} className="text-xs text-primary-container font-semibold active:scale-95 transition-transform">
          Edit
        </button>
      )}
    </div>
  )
}

const VAX_STATUS_COLORS = {
  'Up to date': 'bg-secondary-container text-secondary',
  'Due soon': 'bg-amber-100 text-amber-800',
  'Overdue': 'bg-red-100 text-red-700',
  '': 'bg-surface-container text-on-surface-muted',
}

export default function PetPassportScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [passport, setPassport] = useState(() => defaultPassport(cat.name))
  const [editField, setEditField] = useState(null) // { key, label, value }
  const [tempVal, setTempVal] = useState('')

  useEffect(() => {
    const saved = lsGet(LS_PASSPORT_KEY(cat.id))
    if (saved) setPassport(saved)
    else setPassport(defaultPassport(cat.name))
  }, [cat.id, cat.name])

  function savePassport(updated) {
    setPassport(updated)
    lsSet(LS_PASSPORT_KEY(cat.id), updated)
  }

  function startEdit(key, label, value) {
    setEditField({ key, label, value })
    setTempVal(value ?? '')
  }

  function commitEdit() {
    if (!editField) return
    const updated = { ...passport, [editField.key]: tempVal }
    savePassport(updated)
    setEditField(null)
    setTempVal('')
  }

  function toggleNeutered() {
    savePassport({ ...passport, neutered: !passport.neutered })
  }

  function updateVax(i, field, val) {
    const updated = passport.vaccinations.map((v, idx) => idx === i ? { ...v, [field]: val } : v)
    savePassport({ ...passport, vaccinations: updated })
  }

  const completionFields = ['breed', 'dob', 'weight', 'colour', 'microchipId']
  const filled = completionFields.filter((f) => passport[f]).length
  const completionPct = Math.round((filled / completionFields.length) * 100)

  return (
    <div className="pm-page pm-page-tight pb-nav">
      {/* Header */}
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <h1 className="pm-title !text-lg leading-snug">{cat.name}'s Passport</h1>
          <p className="text-caption text-on-surface-muted font-medium">Essential records & documents</p>
        </div>
        <CatAvatar name={cat.name} size="md" />
      </div>

      <div className="flex flex-col gap-5 pb-6">
        {/* Passport hero */}
        <div className="bg-gradient-to-br from-primary-container/15 via-secondary-container/10 to-transparent rounded-3xl p-5 border border-primary-container/10">
          <div className="flex items-center gap-4">
            <CatAvatar name={cat.name} size="lg" className="!w-20 !h-20 !text-3xl" />
            <div className="flex-1 min-w-0">
              <p className="text-xl font-semibold text-on-surface">{cat.name}</p>
              {passport.breed && <p className="text-sm text-on-surface-muted">{passport.breed}</p>}
              {passport.dob && (
                <p className="text-xs text-on-surface-muted mt-0.5">
                  Born {new Date(passport.dob).toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
                </div>
                <span className="text-[10px] text-on-surface-muted font-medium">{completionPct}% complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Basic Info</p>
          <div className="pm-card px-4">
            <InfoRow label="Breed" value={passport.breed} placeholder="Add breed" onEdit={() => startEdit('breed', 'Breed', passport.breed)} />
            <InfoRow label="Date of Birth" value={passport.dob} placeholder="Add DOB" onEdit={() => startEdit('dob', 'Date of Birth (YYYY-MM-DD)', passport.dob)} />
            <InfoRow label="Weight" value={passport.weight ? `${passport.weight} kg` : ''} placeholder="Add weight" onEdit={() => startEdit('weight', 'Weight (kg)', passport.weight)} />
            <InfoRow label="Colour" value={passport.colour} placeholder="Add colour" onEdit={() => startEdit('colour', 'Colour / markings', passport.colour)} />
            <InfoRow label="Gender" value={passport.gender} placeholder="Add gender" onEdit={() => startEdit('gender', 'Gender', passport.gender)} />
            <div className="flex items-center py-3 border-b border-surface-container last:border-0 gap-3">
              <span className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted w-28">Neutered</span>
              <button
                onClick={toggleNeutered}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${passport.neutered ? 'bg-secondary' : 'bg-surface-container-high'}`}
                role="switch"
                aria-checked={passport.neutered}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${passport.neutered ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
              <span className="text-sm text-on-surface-muted">{passport.neutered ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Identity & insurance */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Identity & Insurance</p>
          <div className="pm-card px-4">
            <div className="flex items-center py-3 border-b border-surface-container gap-3">
              <span className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted w-28">Microchip ID</span>
              <span className={`flex-1 text-sm font-mono ${passport.microchipId ? 'text-on-surface font-medium' : 'text-on-surface-muted/40 italic'}`}>
                {passport.microchipId || 'Not set'}
              </span>
              <button onClick={() => startEdit('microchipId', 'Microchip ID', passport.microchipId)} className="text-xs text-primary-container font-semibold active:scale-95 transition-transform">Edit</button>
            </div>
            <InfoRow label="Insurance" value={passport.insuranceProvider} placeholder="Provider" onEdit={() => startEdit('insuranceProvider', 'Insurance Provider', passport.insuranceProvider)} />
            <div className="flex items-center py-3 gap-3">
              <span className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted w-28">Policy #</span>
              <span className={`flex-1 text-sm font-mono ${passport.insurancePolicy ? 'text-on-surface font-medium' : 'text-on-surface-muted/40 italic'}`}>
                {passport.insurancePolicy || 'Not set'}
              </span>
              <button onClick={() => startEdit('insurancePolicy', 'Policy Number', passport.insurancePolicy)} className="text-xs text-primary-container font-semibold active:scale-95 transition-transform">Edit</button>
            </div>
          </div>
        </div>

        {/* Vaccinations */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Vaccinations</p>
          <div className="pm-card px-4">
            {passport.vaccinations.map((vax, i) => (
              <div key={i} className="flex items-center py-3 border-b border-surface-container last:border-0 gap-3">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                  <IcoSyringe size={18} color="#857464" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">{vax.name}</p>
                  {vax.due && <p className="text-[11px] text-on-surface-muted">Due {vax.due}</p>}
                </div>
                <select
                  value={vax.status}
                  onChange={(e) => updateVax(i, 'status', e.target.value)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${VAX_STATUS_COLORS[vax.status] ?? VAX_STATUS_COLORS['']}`}
                >
                  {['Up to date', 'Due soon', 'Overdue', ''].map((s) => (
                    <option key={s} value={s}>{s || 'Unknown'}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <p className="text-2xs font-semibold uppercase tracking-label text-on-surface-muted mb-3">Vet Notes</p>
          <div className="pm-card p-4">
            <textarea
              value={passport.notes}
              onChange={(e) => savePassport({ ...passport, notes: e.target.value })}
              placeholder="Add notes for your vet — allergies, conditions, medication..."
              rows={4}
              className="w-full text-sm text-on-surface bg-transparent outline-none resize-none placeholder:text-on-surface-muted/40"
            />
          </div>
        </div>

        {/* Share / export hint */}
        <div className="bg-gradient-to-br from-primary-container/10 to-secondary-container/10 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center flex-shrink-0">
            <IcoShare size={18} color="#e89a3c" />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Vet-ready summary</p>
            <p className="text-xs text-on-surface-muted leading-relaxed mt-0.5">
              Use the Share button to send {cat.name}'s passport details to your vet before an appointment.
            </p>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${cat.name}'s Pet Passport`,
                    text: `Name: ${passport.name}\nBreed: ${passport.breed}\nMicrochip: ${passport.microchipId}\nInsurance: ${passport.insuranceProvider} ${passport.insurancePolicy}\nNotes: ${passport.notes}`,
                  })
                }
              }}
              className="mt-2 text-xs font-semibold text-primary-container active:scale-95 transition-transform"
            >
              Share passport →
            </button>
          </div>
        </div>
      </div>

      {/* Edit field bottom sheet */}
      {editField && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setEditField(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            <p className="text-sm font-semibold text-on-surface mb-3">{editField.label}</p>
            <input
              autoFocus
              value={tempVal}
              onChange={(e) => setTempVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
              className="w-full px-4 py-3 rounded-2xl bg-surface-container text-on-surface text-sm outline-none ring-2 ring-primary-container mb-4"
              placeholder={`Enter ${editField.label.toLowerCase()}...`}
            />
            <div className="flex gap-3">
              <button onClick={() => setEditField(null)} className="flex-1 py-3 rounded-full text-sm text-on-surface-muted border border-outline/40">
                Cancel
              </button>
              <button onClick={commitEdit} className="flex-1 py-3 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
