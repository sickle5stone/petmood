import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/ui'
import { IcoBrain } from '../components/icons'
import { getReadsLocal, computeBaseline } from '../dataService'

const MOOD_COLORS = {
  Relaxed: '#ccebc7', Calm: '#ccebc7', Happy: '#fde68a', Playful: '#fde68a',
  Active: '#bfdbfe', Curious: '#e9d5ff', Anxious: '#fecaca', Stressed: '#fecaca',
  Tired: '#dcd9dc', Cozy: '#f0edef',
}

function getMoodColor(f) {
  if (!f) return '#f0edef'
  for (const [k, c] of Object.entries(MOOD_COLORS)) {
    if (f.toLowerCase().includes(k.toLowerCase())) return c
  }
  return '#f0edef'
}

function _heatmap(reads) {
  const map = {}
  for (const r of reads) {
    const d = new Date(r.createdAt)
    const hour = d.getHours()
    const dow = d.getDay()
    const key = `${dow}_${Math.floor(hour / 3)}`
    map[key] = (map[key] ?? 0) + 1
  }
  return map
}

function PatternCard({ title, value, desc, color }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-1">{title}</p>
      <p className="text-lg font-semibold text-on-surface" style={color ? { color } : {}}>{value}</p>
      <p className="text-xs text-on-surface-muted">{desc}</p>
    </div>
  )
}

export default function BehaviorLabScreen({ cats }) {
  const navigate = useNavigate()
  const { catId } = useParams()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna', emoji: '🐱' }]
  const cat = allCats.find((c) => c.id === catId) ?? allCats[0]

  const [reads, setReads] = useState([])
  useEffect(() => { setReads(getReadsLocal(cat.id)) }, [cat.id])

  const baseline = useMemo(() => computeBaseline(cat.id), [cat.id, reads])

  const timePatterns = useMemo(() => {
    if (reads.length < 3) return null
    const buckets = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 }
    const moodByTime = { Morning: {}, Afternoon: {}, Evening: {}, Night: {} }
    for (const r of reads) {
      const h = new Date(r.createdAt).getHours()
      let slot = h >= 5 && h < 12 ? 'Morning' : h >= 12 && h < 17 ? 'Afternoon' : h >= 17 && h < 21 ? 'Evening' : 'Night'
      buckets[slot]++
      moodByTime[slot][r.feeling ?? 'Unknown'] = (moodByTime[slot][r.feeling ?? 'Unknown'] ?? 0) + 1
    }
    const peakSlot = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0]
    const peakMood = moodByTime[peakSlot]
    const topMoodAtPeak = Object.entries(peakMood).sort((a, b) => b[1] - a[1])[0]?.[0]
    return { buckets, peakSlot, topMoodAtPeak }
  }, [reads])

  const moodStability = useMemo(() => {
    if (reads.length < 5) return null
    const recent = reads.slice(0, 7)
    const unique = new Set(recent.map((r) => r.feeling)).size
    if (unique <= 2) return { label: 'Very stable', color: '#5c8a5e', desc: `${unique} moods in last 7 reads` }
    if (unique <= 4) return { label: 'Moderately stable', color: '#e89a3c', desc: `${unique} moods in last 7 reads` }
    return { label: 'Variable moods', color: '#e57373', desc: `${unique} different moods in last 7 reads` }
  }, [reads])

  const activityCorrelation = useMemo(() => {
    const map = {}
    for (const r of reads) {
      if (!r.activity || !r.feeling) continue
      if (!map[r.activity]) map[r.activity] = []
      map[r.activity].push(r.feeling)
    }
    return Object.entries(map).map(([activity, moods]) => {
      const moodCounts = moods.reduce((acc, m) => { acc[m] = (acc[m] ?? 0) + 1; return acc }, {})
      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
      return { activity, topMood: topMood?.[0], count: moods.length }
    }).sort((a, b) => b.count - a.count).slice(0, 5)
  }, [reads])

  const hasEnoughData = reads.length >= 5

  return (
    <div className="pm-page pm-page-tight pb-nav">
      <div className="flex items-center gap-3 px-5 py-4">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1">
          <h1 className="font-semibold text-on-surface">Behavior Lab</h1>
          <p className="text-xs text-on-surface-muted">{cat.name} · Pattern analysis</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5">
        {!hasEnoughData ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
              <IcoBrain size={24} color="#7c3aed" />
            </div>
            <p className="text-sm font-semibold text-on-surface">Not enough data yet</p>
            <p className="text-xs text-on-surface-muted mt-1">Record at least 5 mood reads to unlock pattern analysis.</p>
            <button onClick={() => navigate('/')} className="mt-4 px-5 py-2 rounded-full bg-primary-container text-white text-sm font-semibold">
              Start a read
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <PatternCard title="Total Reads" value={reads.length} desc={`${baseline?.thisWeek ?? 0} this week`} />
              {moodStability && <PatternCard title="Mood Stability" value={moodStability.label} desc={moodStability.desc} color={moodStability.color} />}
              {timePatterns && <PatternCard title="Peak Activity" value={timePatterns.peakSlot} desc={`${timePatterns.buckets[timePatterns.peakSlot]} reads`} />}
              {timePatterns && timePatterns.topMoodAtPeak && <PatternCard title="Peak Mood" value={timePatterns.topMoodAtPeak} desc={`During ${timePatterns.peakSlot}`} />}
            </div>

            {activityCorrelation.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Activity → Mood Links</p>
                <div className="bg-white rounded-2xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  {activityCorrelation.map((item) => (
                    <div key={item.activity} className="flex items-center gap-3 py-3 border-b border-surface-container last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-on-surface truncate">{item.activity}</p>
                        <p className="text-xs text-on-surface-muted">{item.count} reads</p>
                      </div>
                      {item.topMood && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: getMoodColor(item.topMood) }} />
                          <span className="text-xs font-medium text-on-surface">{item.topMood}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {timePatterns && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">Daily Rhythm</p>
                <div className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                  <div className="flex gap-3">
                    {Object.entries(timePatterns.buckets).map(([slot, count]) => {
                      const max = Math.max(...Object.values(timePatterns.buckets))
                      const pct = max > 0 ? (count / max) * 100 : 0
                      return (
                        <div key={slot} className="flex-1 flex flex-col items-center gap-1.5">
                          <div className="w-full h-20 flex items-end justify-center">
                            <div className="w-full rounded-t-lg transition-all duration-700" style={{ height: `${Math.max(4, pct)}%`, background: '#e89a3c22', border: '1px solid #e89a3c44' }} />
                          </div>
                          <p className="text-[10px] text-on-surface-muted text-center">{slot.slice(0, 3)}</p>
                          <p className="text-xs font-semibold text-on-surface">{count}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
