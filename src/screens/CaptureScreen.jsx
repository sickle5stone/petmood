import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CatChip, IconButton } from '../components/ui'
import { IcoPawPrint, IcoClock } from '../components/icons'

const DEFAULT_CATS = [
  { id: '__luna',  name: 'Luna' },
  { id: '__mochi', name: 'Mochi' },
]

function useLiveCamera() {
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)
  const [active, setActive]   = useState(false)
  const [denied, setDenied]   = useState(false)

  const start = useCallback(async () => {
    if (denied || active) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setActive(true)
    } catch {
      setDenied(true)
    }
  }, [denied, active])

  useEffect(() => {
    if (navigator.mediaDevices?.getUserMedia) {
      start()
    } else {
      setDenied(true)
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { videoRef, active, denied }
}

export default function CaptureScreen({ cats, onAddCat }) {
  const navigate = useNavigate()
  const fileRef  = useRef(null)

  const allCats = cats.length > 0 ? cats : DEFAULT_CATS

  const [selectedCat, setSelectedCat] = useState(allCats[0]?.id)
  const [addingCat, setAddingCat]     = useState(false)
  const [newCatName, setNewCatName]   = useState('')
  const [addingBusy, setAddingBusy]   = useState(false)

  const { videoRef, active: camActive, denied: camDenied } = useLiveCamera()

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const catName = allCats.find((c) => c.id === selectedCat)?.name
    navigate('/analyzing', { state: { file, catId: selectedCat, catName } })
  }

  function openCapture() {
    fileRef.current?.setAttribute('capture', 'environment')
    fileRef.current?.click()
  }

  function openUpload() {
    fileRef.current?.removeAttribute('capture')
    fileRef.current?.click()
  }

  async function handleAddCat() {
    if (!newCatName.trim() || addingBusy) return
    setAddingBusy(true)
    try {
      await onAddCat(newCatName.trim())
    } finally {
      setNewCatName('')
      setAddingCat(false)
      setAddingBusy(false)
    }
  }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container/20 to-secondary-container/30 flex items-center justify-center border border-border-subtle">
            <IcoPawPrint size={18} color="#895200" />
          </div>
          <div>
            <span className="text-base font-semibold text-on-surface tracking-tight">PetMood</span>
            <p className="text-caption text-on-surface-muted -mt-0.5">Daily check-in</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/history/' + selectedCat)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-caption font-semibold text-on-surface-muted bg-surface-container border border-border-subtle hover:bg-surface-container-high transition-all duration-200 ease-smooth active:scale-95"
        >
          <IcoClock size={14} color="#857464" />
          History
        </button>
      </div>

      {/* Cat selector */}
      <div className="mb-5">
        <p className="pm-label mb-3">Which cat?</p>
        <div className="flex flex-wrap gap-2">
          {allCats.map((cat) => (
            <CatChip
              key={cat.id}
              name={cat.name}
              active={selectedCat === cat.id}
              onClick={() => setSelectedCat(cat.id)}
            />
          ))}

          {addingCat ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCat()}
                placeholder="Cat's name"
                className="w-28 px-3 py-2 rounded-full text-sm bg-white border border-border outline-none focus:ring-2 focus:ring-primary-container/40"
              />
              <button
                type="button"
                onClick={handleAddCat}
                disabled={addingBusy}
                className="px-3 py-2 rounded-full text-sm bg-primary-container text-white font-semibold active:scale-95 transition-transform disabled:opacity-60"
              >
                {addingBusy ? '…' : 'Add'}
              </button>
              <IconButton
                label="Cancel"
                onClick={() => { setAddingCat(false); setNewCatName('') }}
                className="!w-8 !h-8 text-on-surface-muted"
              >
                <span className="text-sm">×</span>
              </IconButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingCat(true)}
              className="pm-chip pm-chip-idle border-dashed border-border"
            >
              + Add cat
            </button>
          )}
        </div>
      </div>

      {/* Viewfinder */}
      <div
        className="relative flex-1 min-h-0 rounded-4xl overflow-hidden bg-[#141414] flex items-center justify-center border border-black/20 shadow-card-lg"
        style={{ minHeight: 260, maxHeight: 380 }}
      >
        {!camDenied && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-smooth ${
              camActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none z-[1]" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className={`w-44 h-44 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors duration-500 ${
            camActive ? 'border-white/35' : 'border-white/25'
          }`}>
            {!camActive && (
              <p className="text-white/55 text-sm font-medium tracking-wide">Frame your cat</p>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <span className="text-white/45 text-caption font-semibold tracking-widest uppercase">3 – 5 sec</span>
        </div>
      </div>

      {/* Record CTA */}
      <div className="flex flex-col items-center gap-4 my-7">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-primary-container/30 record-ring" />
          <button
            type="button"
            onClick={openCapture}
            className="relative w-[4.5rem] h-[4.5rem] rounded-full bg-primary-container shadow-card-lg flex items-center justify-center active:scale-90 transition-transform duration-150 ease-smooth ring-4 ring-primary-container/25"
            aria-label="Record video"
          >
            <div className="w-9 h-9 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
          onClick={(e) => { e.target.value = '' }}
        />

        <button
          type="button"
          onClick={openUpload}
          className="text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors duration-200 underline-offset-4 hover:underline active:scale-95"
        >
          Or upload a clip
        </button>
      </div>

      <p className="text-center text-caption text-on-surface-muted pb-6 safe-bottom">
        Let your cat be natural — no need to pose
      </p>
    </div>
  )
}
