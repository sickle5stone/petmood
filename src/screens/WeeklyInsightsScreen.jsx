import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReadsLocal, computeBaseline } from '../dataService'
import { BackButton, CatAvatar, MoodBadge, EmptyState, StatCard } from '../components/ui'
import { IcoCalendar, IcoSparkles, IcoTarget, IcoTrending, IcoStar, IcoPawPrint } from '../components/icons'

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekLabel() {
  const now = new Date()
  const start = new Date(now); start.setDate(start.getDate() - 6)
  const fmt = (d) => d.toLocaleDateString('default', { month: 'short', day: 'numeric' })
  return `${fmt(start)} – ${fmt(now)}`
}

function FindingCard({ Icon, title, detail, badge, badgeColor = 'bg-secondary-container text-secondary' }) {
  return (
    <div className="pm-card p-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-surface-container border border-border-subtle flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon size={18} color="#857464" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-sm font-semibold text-on-surface tracking-tight">{title}</p>
            {badge && (
              <span className={`px-2 py-0.5 rounded-full text-2xs font-semibold ${badgeColor}`}>{badge}</span>
            )}
          </div>
          <p className="text-caption text-on-surface-muted leading-relaxed">{detail}</p>
        </div>
      </div>
    </div>
  )
}

function DayRow({ day, reads }) {
  const primary = reads[0]
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
      <span className="text-2xs font-semibold text-on-surface-muted w-8 flex-shrink-0">{day}</span>
      {primary ? (
        <>
          <MoodBadge feeling={primary.feeling} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-on-surface font-medium truncate tracking-tight">{primary.feeling}</p>
            <p className="text-caption text-on-surface-muted truncate">{primary.activity}</p>
          </div>
          {reads.length > 1 && (
            <span className="text-caption text-on-surface-muted flex-shrink-0">+{reads.length - 1}</span>
          )}
        </>
      ) : (
        <p className="text-sm text-on-surface-muted/50 italic">No reads</p>
      )}
    </div>
  )
}

export default function WeeklyInsightsScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const [loading, setLoading] = useState(true)
  const [reads, setReads] = useState([])

  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  useEffect(() => {
    const r = getReadsLocal(cat.id)
    setReads(r)
    setLoading(false)
  }, [cat?.id])

  const baseline = useMemo(() => computeBaseline(cat?.id), [cat?.id])

  const last7 = useMemo(() => {
    const cutoff = Date.now() - 7 * 86_400_000
    return reads.filter((r) => new Date(r.createdAt).getTime() > cutoff)
  }, [reads])

  const prev7 = useMemo(() => {
    const end = Date.now() - 7 * 86_400_000
    const start = end - 7 * 86_400_000
    return reads.filter((r) => {
      const t = new Date(r.createdAt).getTime()
      return t >= start && t < end
    })
  }, [reads])

  // Per-day breakdown for last 7 days
  const dayBreakdown = useMemo(() => {
    const now = new Date()
    const result = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
      const end = new Date(d); end.setHours(23, 59, 59, 999)
      const dayLabel = DAYS_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1]
      const dayReads = reads.filter((r) => {
        const rd = new Date(r.createdAt)
        return rd >= d && rd <= end
      })
      result.push({ day: dayLabel, reads: dayReads })
    }
    return result
  }, [reads])

  // Dominant mood this week
  const weekMoodDist = useMemo(() => {
    const counts = {}
    for (const r of last7) {
      const f = r.feeling ?? 'Unknown'
      counts[f] = (counts[f] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [last7])

  const dominantMood = weekMoodDist[0]?.[0]
  const moodChange = prev7.length > 0 && last7.length > 0
    ? last7.length > prev7.length ? 'up' : last7.length < prev7.length ? 'down' : 'stable'
    : null

  const uniqueMoods = new Set(last7.map((r) => r.feeling)).size
  const highConfReads = last7.filter((r) => r.confidence === 'high').length

  const findings = useMemo(() => {
    const f = []
    if (dominantMood) {
      f.push({
        Icon: IcoPawPrint,
        title: `Dominant mood: ${dominantMood}`,
        detail: `${dominantMood} appeared ${weekMoodDist[0][1]} time${weekMoodDist[0][1] !== 1 ? 's' : ''} this week — the most common state observed.`,
        badge: `${weekMoodDist[0][1]} reads`,
        badgeColor: 'bg-secondary-container text-secondary',
      })
    }
    if (uniqueMoods > 3) {
      f.push({
        Icon: IcoSparkles,
        title: 'Varied emotional range',
        detail: `${cat.name} showed ${uniqueMoods} distinct moods this week. Variation is normal — watch for patterns.`,
        badge: `${uniqueMoods} moods`,
        badgeColor: 'bg-amber-100 text-amber-800',
      })
    }
    if (highConfReads > 0) {
      f.push({
        Icon: IcoTarget,
        title: 'High-confidence reads',
        detail: `${highConfReads} of this week's reads had high confidence — reliable behavioural data to build on.`,
        badge: `${highConfReads} high`,
        badgeColor: 'bg-secondary-container text-secondary',
      })
    }
    if (moodChange === 'up') {
      f.push({
        Icon: IcoTrending,
        title: 'More active this week',
        detail: `You recorded ${last7.length} reads this week vs ${prev7.length} the week before. Great consistency!`,
        badge: 'Trending up',
        badgeColor: 'bg-secondary-container text-secondary',
      })
    }
    if (f.length === 0) {
      f.push({
        Icon: IcoStar,
        title: 'Keep building your baseline',
        detail: `The more reads you log, the more accurate the weekly insights become. Aim for 3+ reads this week.`,
        badgeColor: '',
      })
    }
    return f
  }, [last7, prev7, dominantMood, weekMoodDist, uniqueMoods, highConfReads, moodChange, cat.name])

  return (
    <div className="pm-page pb-nav">
      <div className="flex items-center gap-3 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <h1 className="pm-title">Weekly Digest</h1>
          <p className="text-caption text-on-surface-muted">{getWeekLabel()}</p>
        </div>
        <CatAvatar name={cat.name} size="md" />
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 pb-6">
          {[1, 2, 3].map((i) => <div key={i} className="pm-card-inset h-24 animate-pulse" />)}
        </div>
      ) : last7.length === 0 ? (
        <EmptyState
          icon={IcoCalendar}
          title="No reads this week yet"
          description={`Record ${cat.name}'s moments throughout the week to unlock your weekly digest.`}
          actionLabel="Start a read"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="flex flex-col gap-5 pb-6">
          <div className="pm-card-lg p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/20 to-transparent pointer-events-none" />
            <div className="relative">
              <p className="pm-label text-primary-container mb-2">Stitch Weekly Digest</p>
              <div className="flex items-start gap-3 mb-2">
                {dominantMood && <MoodBadge feeling={dominantMood} size="lg" />}
                <div>
                  <p className="text-xl font-semibold text-on-surface tracking-tight">{last7.length} reads logged</p>
                  <p className="text-sm text-on-surface-muted">
                    {dominantMood ? `Mostly ${dominantMood}` : 'This week'}
                  </p>
                </div>
              </div>
              {moodChange && (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={moodChange === 'up' ? 'text-secondary' : moodChange === 'down' ? 'text-tertiary' : 'text-on-surface-muted'}>
                    {moodChange === 'up' ? '↑' : moodChange === 'down' ? '↓' : '→'}
                  </span>
                  <span className="text-caption text-on-surface-muted font-medium">
                    {moodChange === 'up' ? `${last7.length - prev7.length} more reads than last week` :
                     moodChange === 'down' ? `${prev7.length - last7.length} fewer reads than last week` :
                     'Same pace as last week'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Reads" value={`${last7.length}`} />
            <StatCard label="Moods seen" value={`${uniqueMoods}`} />
            <StatCard label="High conf." value={`${highConfReads}`} />
          </div>

          <div>
            <p className="pm-label mb-3">Key Findings</p>
            <div className="flex flex-col gap-3">
              {findings.map((f, i) => (
                <FindingCard key={i} {...f} />
              ))}
            </div>
          </div>

          <div>
            <p className="pm-label mb-3">Day by Day</p>
            <div className="pm-card px-4">
              {dayBreakdown.map(({ day, reads: dayReads }) => (
                <DayRow key={day} day={day} reads={dayReads} />
              ))}
            </div>
          </div>

          <div className="pm-card-inset p-4 bg-gradient-to-br from-primary-container/8 to-secondary-container/15 border-primary-container/15">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-container/15 flex items-center justify-center flex-shrink-0">
                <IcoSparkles size={18} color="#895200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">Stitch Suggestion</p>
                <p className="text-xs text-on-surface-muted leading-relaxed">
                  {baseline?.topFeeling
                    ? `${cat.name}'s baseline mood is ${baseline.topFeeling}. Continue logging daily to build a more detailed health picture for your vet.`
                    : `Keep up the reads! Once you have 5+ observations, Stitch will generate a personalised baseline and vet-ready summary for ${cat.name}.`}
                </p>
                <button
                  onClick={() => navigate(`/insights/${cat.id}`)}
                  className="mt-3 text-xs font-semibold text-primary-container flex items-center gap-1"
                >
                  View full insights →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
