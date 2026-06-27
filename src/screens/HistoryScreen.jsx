import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReads, getReadsLocal, computeBaseline, getUnusualSignal } from '../dataService'
import { PillButton, SkeletonTimelineItem, CatAvatar, StatChip, MoodBadge, LinkRow } from '../components/ui'
import { IcoClipboard, IcoPassport, IcoGrid } from '../components/icons'
import BaselineSummary from '../components/BaselineSummary'

const CONFIDENCE_BORDER = {
  high:   'border-l-4 border-secondary',
  medium: 'border-l-4 border-primary-container',
  low:    'border-l-4 border-tertiary-container',
}

function formatTime(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const now   = new Date()
  const diff  = now - date
  const oneDay = 86_400_000
  if (diff < oneDay && now.getDate() === date.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 2 * oneDay) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
  return (
    date.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

export default function HistoryScreen({ cats }) {
  const { catId } = useParams()
  const navigate  = useNavigate()
  const [reads, setReads]     = useState([])
  const [loading, setLoading] = useState(true)

  const cat     = cats.find((c) => c.id === catId)
  const catName = cat?.name ?? 'Your cat'

  useEffect(() => {
    if (!catId) { setLoading(false); return }

    async function load() {
      try {
        if (catId.startsWith('__') || catId.startsWith('local_')) {
          setReads(getReadsLocal(catId))
        } else {
          const remote = await getReads(catId)
          if (remote.length > 0) {
            setReads(remote)
          } else {
            setReads(getReadsLocal(catId))
          }
        }
      } catch {
        setReads(getReadsLocal(catId))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [catId])

  // Derived synchronously from localStorage — cheap enough to skip memoisation
  const baseline = computeBaseline(catId)
  const unusual  = getUnusualSignal(catId)

  // Stats for the top strip (matches Stitch "12 reads / Avg: Relaxed / This week: 4")
  const statsChips = (() => {
    if (reads.length === 0) return []
    const chips = [`${reads.length} read${reads.length !== 1 ? 's' : ''}`]
    if (baseline?.topFeeling) {
      chips.push(`Avg: ${baseline.topFeeling.split(' ')[0]}`)
    }
    if (baseline?.thisWeek != null) {
      chips.push(`This week: ${baseline.thisWeek}`)
    }
    return chips
  })()

  return (
    <div className="pm-page pm-page-tight pb-nav">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4">
        <span className="font-semibold text-on-surface tracking-tight">{catName}'s Reads</span>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-primary-container active:scale-95 transition-transform"
        >
          + Read now
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <CatAvatar name={catName} size="xl" />
        <div className="flex-1 min-w-0">
          <p className="text-xl font-semibold text-on-surface tracking-tight">{catName}</p>
          {cat?.breed && (
            <p className="text-sm text-on-surface-muted">{cat.breed}</p>
          )}
          {statsChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {statsChips.map((chip) => (
                <StatChip key={chip} label={chip} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <LinkRow Icon={IcoPassport} label="Pet Passport" onClick={() => navigate(`/passport/${catId}`)} />
        <LinkRow Icon={IcoGrid} label="All Tools" onClick={() => navigate(`/more/${catId}`)} />
      </div>

      {baseline && (
        <div className="mb-5 fade-in">
          <BaselineSummary baseline={baseline} unusual={unusual} catName={catName} />
        </div>
      )}

      {/* Timeline */}
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonTimelineItem />
          <SkeletonTimelineItem />
          <SkeletonTimelineItem />
        </div>
      ) : reads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center pb-20">
          <div className="w-14 h-14 rounded-2xl bg-surface-container border border-border-subtle flex items-center justify-center">
            <IcoClipboard size={24} color="#857464" />
          </div>
          <p className="text-on-surface font-semibold text-lg tracking-tight">No reads yet</p>
          <p className="text-sm text-on-surface-muted max-w-xs">
            Record a 3–5 second clip of {catName} to get your first behavioural read.
          </p>
          <PillButton onClick={() => navigate('/')}>Start a read</PillButton>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-on-surface">Recent reads</p>
            <p className="text-xs text-on-surface-muted">
              {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="relative flex flex-col gap-4 pb-4">
            {/* Timeline spine */}
            <div className="absolute left-[5px] top-2 bottom-2 w-px border-l-2 border-dashed border-outline/40" />

            {reads.map((read) => (
              <div key={read.id} className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-primary-container mt-1.5 flex-shrink-0 z-10" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-on-surface-muted mb-1">{formatTime(read.createdAt)}</p>
                  <div
                    className={`pm-card px-4 py-3 ${
                      CONFIDENCE_BORDER[read.confidence] ?? CONFIDENCE_BORDER.medium
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-on-surface leading-snug tracking-tight">
                        {read.activity}
                      </p>
                      <MoodBadge feeling={read.feeling} size="sm" />
                    </div>
                    {read.evidence?.length > 0 && (
                      <p className="text-xs text-on-surface-muted mt-1 truncate">
                        {read.evidence.join(' · ')}
                      </p>
                    )}
                    {/* Tags row */}
                    {read.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {read.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-medium text-on-surface-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {read.note && (
                      <p className="text-xs text-on-surface-muted/70 mt-1.5 italic leading-snug">
                        "{read.note}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
