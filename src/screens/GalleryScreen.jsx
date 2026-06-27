import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoCamera3, IcoPlus, IcoX } from '../components/icons'

const LS_KEY = (catId) => `petmood_gallery_${catId}`

function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch { return null } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const TAGS = ['Happy', 'Sleepy', 'Playful', 'Cute', 'Milestone', 'Silly', 'Cozy', 'Outdoor', 'Vet visit', 'First time']

function PhotoCard({ photo, onDelete }) {
  return (
    <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container group">
      <img src={photo.dataUrl} alt={photo.caption || 'Cat photo'} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {photo.caption && <p className="text-white text-xs font-medium truncate">{photo.caption}</p>}
        {photo.tag && <span className="text-white/80 text-[10px]">{photo.tag}</span>}
      </div>
      <button onClick={() => onDelete(photo.id)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <IcoX size={12} color="white" />
      </button>
    </div>
  )
}

export default function GalleryScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [photos, setPhotos] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [tag, setTag] = useState('')
  const [viewPhoto, setViewPhoto] = useState(null)
  const fileRef = useRef()

  useEffect(() => { setPhotos(lsGet(LS_KEY(cat.id)) ?? []) }, [cat.id])

  function save(updated) { setPhotos(updated); lsSet(LS_KEY(cat.id), updated) }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setPreview(ev.target.result); setShowAdd(true) }
    reader.readAsDataURL(file)
  }

  function addPhoto() {
    if (!preview) return
    save([{ id: `photo_${Date.now()}`, dataUrl: preview, caption, tag, date: new Date().toISOString() }, ...photos])
    setPreview(null); setCaption(''); setTag(''); setShowAdd(false)
  }

  function deletePhoto(id) { save(photos.filter((p) => p.id !== id)) }

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Photo Gallery</h1>
          <p className="text-xs text-on-surface-muted">{cat.name} · {photos.length} photos</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center active:scale-95 transition-transform"
        >
          <IcoPlus size={16} color="white" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="px-5">
        {photos.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
              <IcoCamera3 size={24} color="#92400e" />
            </div>
            <p className="text-sm font-semibold text-on-surface">No photos yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Build a visual timeline of {cat.name}'s life.</p>
            <button onClick={() => fileRef.current?.click()} className="mt-4 px-5 py-2 rounded-full bg-primary-container text-white text-sm font-semibold">
              Add first photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p) => <PhotoCard key={p.id} photo={p} onDelete={deletePhoto} />)}
          </div>
        )}
      </div>

      {/* Full-screen viewer */}
      {viewPhoto && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={() => setViewPhoto(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center z-10">
            <IcoX size={18} color="white" />
          </button>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={viewPhoto.dataUrl} alt={viewPhoto.caption || ''} className="max-w-full max-h-full object-contain rounded-2xl" />
          </div>
          {viewPhoto.caption && (
            <div className="p-4 text-center">
              <p className="text-white font-medium">{viewPhoto.caption}</p>
              {viewPhoto.tag && <p className="text-white/60 text-sm">{viewPhoto.tag}</p>}
            </div>
          )}
        </div>
      )}

      {/* Add photo sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => { setShowAdd(false); setPreview(null) }}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-surface rounded-t-3xl p-5 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-[slideUp_0.22s_ease-out]"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,16px)+16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-outline/30 mx-auto mb-5" />
            {preview && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-surface-container">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1.5">Caption</p>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface outline-none" />
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-2">Tag</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button key={t} onClick={() => setTag(t === tag ? '' : t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${tag === t ? 'bg-primary-container text-white' : 'bg-surface-container text-on-surface-muted'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={addPhoto} className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform">
              Save photo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
