import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getReadsLocal, computeBaseline } from '../dataService'
import { BackButton } from '../components/ui'
import { IcoClipboard, IcoTarget, IcoCalendar, IcoBarChart as IcoBarChartIcon, IcoZap, IcoPawPrint, IcoMoon, IcoTrending } from '../components/icons'

const MOOD_COLORS = {
  Relaxed: '#ccebc7', Calm: '#ccebc7', Serene: '#ccebc7',
  Happy: '#fde68a', Playful: '#fde68a', Joyful: '#fde68a',
  Active: '#bfdbfe', Curious: '#e9d5ff',
  Anxious: '#fecaca', Stressed: '#fecaca',
  Tired: '#dcd9dc', Cozy: '#f0edef',
}

function getMoodColor(feeling) {
  if (!feeling) return '#f0edef'
  for (const [key, color] of Object.entries(MOOD_COLORS)) {
    if (feeling.toLowerCase().includes(key.toLowerCase())) return color
  }
  return '#f0edef'
}


function BarChart({ data, maxVal }) {
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map(({ label, value, color }) => {
        const height = maxVal > 0 ? Math.max(4, (value / maxVal) * 72) : 4
        return (
          <div key={label} className="flex flex-col items-center gap-1 flex-1">
            <div
              className="w-full rounded-t-lg transition-all duration-500"
              style={{ height, background: color }}
            />
            <span className="text-[10px] text-on-surface-muted truncate max-w-full text-center">{label.slice(0, 5)}</span>
          </div>
        )
      })}
    </div>
  )
}

function StatCard({ Icon, label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={14} color="#857464" />}
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-on-surface">{value}</p>
      {sub && <p className="text-xs text-on-surface-muted mt-0.5">{sub}</p>}
      {accent && <p className="text-xs text-secondary font-medium mt-1">{accent}</p>}
    </div>
  )
}

function TrendRow({ Icon, label, value, direction }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-surface-container last:border-0">
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
        {Icon && <Icon size={18} color="#857464" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on-surface">{label}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <span className="text-sm font-semibold text-on-surface">{value}</span>
        {direction === 'up' && <span className="text-secondary text-xs">↑</span>}
        {direction === 'down' && <span className="text-tertiary text-xs">↓</span>}
        {direction === 'stable' && <span className="text-on-surface-muted text-xs">→</span>}
      </div>
    </div>
  )
}

export default function MoodInsightsScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const [loading, setLoading] = useState(true)
  const [reads, setReads] = useState([])

  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  useEffect(() => {
    if (!cat?.id) { setLoading(false); return }
    const r = getReadsLocal(cat.id)
    setReads(r)
    setLoading(false)
  }, [cat?.id])

  const baseline = useMemo(() => computeBaseline(cat?.id), [cat?.id])

  // Feeling frequency distribution
  const feelingDist = useMemo(() => {
    const counts = {}
    for (const r of reads) {
      const f = r.feeling ?? 'Unknown'
      counts[f] = (counts[f] ?? 0) + 1
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value, color: getMoodColor(label) }))
  }, [reads])

  // Activity frequency
  const activityDist = useMemo(() => {
    const counts = {}
    for (const r of reads) {
      const a = r.activity ?? 'Unknown'
      counts[a] = (counts[a] ?? 0) + 1
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [reads])

  // Last 7 days reads
  const last7 = useMemo(() => {
    const cutoff = Date.now() - 7 * 86_400_000
    return reads.filter((r) => new Date(r.createdAt).getTime() > cutoff)
  }, [reads])

  const last30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 86_400_000
    return reads.filter((r) => new Date(r.createdAt).getTime() > cutoff)
  }, [reads])

  const avgConf = useMemo(() => {
    if (reads.length === 0) return null
    const map = { high: 3, medium: 2, low: 1 }
    const total = reads.reduce((s, r) => s + (map[r.confidence] ?? 2), 0)
    const avg = total / reads.length
    if (avg >= 2.5) return 'High'
    if (avg >= 1.8) return 'Medium'
    return 'Low'
  }, [reads])

  const maxFeelingCount = feelingDist[0]?.value ?? 1

  const timeOfDayBreakdown = useMemo(() => {
    const buckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 }
    for (const r of reads) {
      const h = new Date(r.createdAt).getHours()
      if (h >= 5 && h < 12) buckets.Morning++
      else if (h >= 12 && h < 17) buckets.Afternoon++
      else if (h >= 17 && h < 21) buckets.Evening++
      else buckets.Night++
    }
    const max = Math.max(...Object.values(buckets))
    const peak = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Morning'
    return { buckets, peak, max }
  }, [reads])

  if (loading) {
    return (
      <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter">
        <div className="flex items-center gap-3 px-5 py-4">
          <BackButton onClick={() => navigate(-1)} />
          <span className="font-semibold text-on-surface">{cat.name}'s Insights</span>
        </div>
        <div className="flex-1 flex flex-col gap-4 px-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const empty = reads.length === 0

  return (
    <div className="min-h-svh bg-surface flex flex-col pt-safe page-enter pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-on-surface">{cat.name}'s Insights</h1>
          <p className="text-xs text-on-surface-muted">Mood & Behaviour Trends</p>
        </div>
        <span className="text-xl">{cat.emoji}</span>
      </div>

      {empty ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center px-8 pb-20 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto">
            <IcoBarChartIcon size={28} color="#857464" />
          </div>
          <p className="text-lg font-semibold text-on-surface">Not enough data yet</p>
          <p className="text-sm text-on-surface-muted">Record at least 3–5 reads to unlock behavioural insights for {cat.name}.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-6 py-3 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform"
          >
            Start a read
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-5">
          {/* Overview stats */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Overview</p>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                Icon={IcoClipboard} label="Total Reads"
                value={reads.length}
                sub={`${last7.length} this week`}
              />
              {baseline?.topFeeling && (
                <StatCard
                  Icon={IcoPawPrint} label="Most Common Mood"
                  value={baseline.topFeeling.split(' ')[0]}
                  sub={`${baseline.topFeelingPct}% of reads`}
                  accent="Baseline mood"
                />
              )}
              {avgConf && (
                <StatCard
                  Icon={IcoTarget} label="Avg Read Quality"
                  value={avgConf}
                  sub="Across all reads"
                />
              )}
              {last30.length > 0 && (
                <StatCard
                  Icon={IcoCalendar} label="Last 30 Days"
                  value={last30.length}
                  sub="reads recorded"
                />
              )}
            </div>
          </div>

          {/* Feeling distribution bar chart */}
          {feelingDist.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Mood Distribution</p>
              <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                <BarChart data={feelingDist} maxVal={maxFeelingCount} />
                <div className="mt-4 flex flex-col gap-2">
                  {feelingDist.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: getMoodColor(label) }} />
                      <span className="text-sm text-on-surface flex-1">{label}</span>
                      <span className="text-sm font-semibold text-on-surface">{value}</span>
                      <span className="text-xs text-on-surface-muted w-8 text-right">
                        {Math.round((value / reads.length) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Behaviour trends */}
          {activityDist.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Behaviour Trends</p>
              <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  {activityDist.map(([activity, count], i) => (
                    <TrendRow
                      key={activity}
                      Icon={[IcoZap, IcoTarget, IcoMoon, IcoPawPrint, IcoTrending][i] ?? IcoPawPrint}
                      label={activity}
                      value={`${count} reads`}
                      direction={i === 0 ? 'up' : 'stable'}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Time-of-day pattern */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Time of Day Pattern</p>
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <p className="text-sm text-on-surface-muted mb-3">
                Most active recording time: <span className="font-semibold text-on-surface">{timeOfDayBreakdown.peak}</span>
              </p>
              <div className="flex gap-2">
                {Object.entries(timeOfDayBreakdown.buckets).map(([slot, count]) => {
                  const icons = { Morning: '🌅', Afternoon: '☀️', Evening: '🌇', Night: '🌙' }
                  const width = timeOfDayBreakdown.max > 0 ? Math.max(8, (count / timeOfDayBreakdown.max) * 100) : 8
                  return (
                    <div key={slot} className="flex-1 flex flex-col gap-1.5">
                      <span className="text-base text-center block">{icons[slot]}</span>
                      <div className="bg-surface-container rounded-full overflow-hidden h-1.5">
                        <div
                          className="h-full bg-primary-container rounded-full transition-all duration-700"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-on-surface-muted text-center">{slot.slice(0, 3)}</p>
                      <p className="text-[11px] font-semibold text-on-surface text-center">{count}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Confidence over time */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Recent Read Quality</p>
            <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {reads.slice(0, 10).reverse().map((r, _i) => {
                  const confColors = { high: '#ccebc7', medium: '#fde68a', low: '#fecaca' }
                  const confLabels = { high: 'H', medium: 'M', low: 'L' }
                  return (
                    <div key={r.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ background: confColors[r.confidence] ?? confColors.medium }}
                        title={r.confidence}
                      >
                        {confLabels[r.confidence] ?? 'M'}
                      </div>
                      <span className="text-[9px] text-on-surface-muted">
                        #{reads.length - reads.indexOf(r)}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-on-surface-muted/70 mt-2">H = High · M = Medium · L = Low confidence</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
