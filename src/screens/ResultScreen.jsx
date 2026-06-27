import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { saveRead, saveReadLocal } from '../dataService'
import { BackButton, Card, ConfidenceBadge, PillButton, SectionLabel, CatAvatar, MoodBadge, IconButton } from '../components/ui'
import FeedbackWidget from '../components/FeedbackWidget'
import NoteTagEditor from '../components/NoteTagEditor'
import { IcoShare } from '../components/icons'

function timeAgo(ts) {
  if (!ts) return 'just now'
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ResultScreen() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const result  = state?.result
  const catId   = state?.catId
  const catName = state?.catName ?? 'Your cat'

  const readId  = useRef(`read_${Date.now()}`).current
  const capturedAt = useRef(new Date().toISOString()).current

  const [saved, setSaved]           = useState(false)
  const [savedReadId, setSavedReadId] = useState(null)
  const [showTags, setShowTags]     = useState(false)

  useEffect(() => {
    if (!result) navigate('/', { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!result) return null

  async function handleSave() {
    if (saved) return
    setSaved(true)

    const localId = saveReadLocal(catId ?? 'demo', result, readId)
    setSavedReadId(localId)
    setShowTags(true)

    if (catId && !catId.startsWith('__') && !catId.startsWith('local_')) {
      saveRead(catId, result, readId).catch(() => {})
    }
  }

  const confidenceLabel = result.confidence === 'high' ? 'high' : result.confidence === 'medium' ? 'medium' : 'low'

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center justify-between py-4">
        <BackButton onClick={() => navigate('/')} />
        <div className="flex items-center gap-2.5">
          <CatAvatar name={catName} size="sm" />
          <span className="font-semibold text-on-surface tracking-tight">{catName}</span>
        </div>
        <IconButton
          label="Share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${catName}'s read`,
                text: `${result.activity} · ${result.feeling}`,
              })
            }
          }}
        >
          <IcoShare size={18} color="#524436" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <ConfidenceBadge confidence={result.confidence} />
        <span className="text-caption text-on-surface-muted">
          {result.keyframeCount} keyframes
        </span>
        <span className="text-caption text-on-surface-muted/70 ml-auto">
          {timeAgo(capturedAt)}
        </span>
      </div>

      <Card className="mb-4">
        <SectionLabel>Doing</SectionLabel>
        <h1 className="text-2xl font-semibold text-on-surface leading-snug tracking-tight mb-5">
          {result.activity}
        </h1>
        <div className="pm-divider mb-5" />
        <SectionLabel>Likely feeling</SectionLabel>
        <div className="flex items-center gap-2 mb-2">
          <MoodBadge feeling={result.feeling} size="lg" />
        </div>
        <p className="text-caption text-on-surface-muted">
          Confidence: {confidenceLabel} — interpret with context
        </p>
      </Card>

      <div className="pm-card-inset px-5 py-4 mb-5">
        <SectionLabel color="sage">Because</SectionLabel>
        <ul className="flex flex-col gap-2.5 mt-2">
          {result.evidence.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-caption text-on-surface-muted/80 mt-3 leading-snug">
          Based on visible posture, motion, and audio — not a medical diagnosis.
        </p>
      </div>

      {showTags && savedReadId && (
        <div className="mb-4 fade-in">
          <NoteTagEditor
            catId={catId ?? 'demo'}
            readId={savedReadId}
            onDone={() => setShowTags(false)}
          />
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <PillButton variant="ghost" className="flex-1" onClick={() => navigate('/')}>
          Read again
        </PillButton>
        <PillButton className="flex-1" onClick={handleSave} disabled={saved}>
          {saved ? 'Saved' : `Save to log`}
        </PillButton>
      </div>

      <div className="mb-4">
        <FeedbackWidget readId={readId} catId={catId ?? 'demo'} />
      </div>

      <button
        type="button"
        onClick={() => navigate('/history/' + catId)}
        className="flex flex-col items-center gap-1 pb-6 safe-bottom w-full active:scale-95 transition-transform duration-200 ease-smooth"
        aria-label="See history"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-on-surface-muted/45">
          <path d="M5 13L10 8L15 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-caption text-on-surface-muted/55 font-medium">
          See {catName}'s history
        </span>
      </button>
    </div>
  )
}
