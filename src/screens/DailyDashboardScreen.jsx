import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getReadsLocal, computeBaseline } from '../dataService'
import { CatChip, CatAvatar, StatCard, MoodBadge, MoodDot, IconButton } from '../components/ui'
import { IcoCamera, IcoTrending, IcoClock, IcoCalendar, IcoClipboard, IcoTarget, IcoBarChart, IcoMoreDots, IcoHeartPulse, IcoShield, IcoPill } from '../components/icons'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getTodayReadings(catId) {
  const reads = getReadsLocal(catId)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return reads.filter((r) => new Date(r.createdAt) >= today)
}

function getWeekMoodMap(catId) {
  const reads = getReadsLocal(catId)
  const map = {}
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const dayLabel = DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
    const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999)
    const dayReads = reads.filter((r) => {
      const rd = new Date(r.createdAt)
      return rd >= d && rd <= dayEnd
    })
    map[dayLabel] = dayReads[0]?.feeling ?? null
  }
  return map
}

export default function DailyDashboardScreen({ cats }) {
  const navigate = useNavigate()
  const allCats = cats?.length > 0 ? cats : [{ id: '__luna', name: 'Luna' }]
  const [selectedCat, setSelectedCat] = useState(allCats[0])

  const [todayReads, setTodayReads] = useState([])
  const [weekMap, setWeekMap] = useState({})
  const [baseline, setBaseline] = useState(null)

  useEffect(() => {
    if (!selectedCat?.id) return
    setTodayReads(getTodayReadings(selectedCat.id))
    setWeekMap(getWeekMoodMap(selectedCat.id))
    setBaseline(computeBaseline(selectedCat.id))
  }, [selectedCat])

  const latestRead = todayReads[0]
  const currentMood = latestRead?.feeling ?? baseline?.topFeeling ?? null
  const currentActivity = latestRead?.activity ?? null

  const todayDate = new Date().toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="pm-page pb-nav">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-caption text-on-surface-muted font-medium">{todayDate}</p>
          <h1 className="pm-title">Today's Vibe</h1>
        </div>
        <IconButton label="New read" onClick={() => navigate('/')}>
          <IcoCamera size={20} color="#895200" />
        </IconButton>
      </div>

      {allCats.length > 1 && (
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allCats.map((cat) => (
              <CatChip
                key={cat.id}
                name={cat.name}
                active={selectedCat.id === cat.id}
                onClick={() => setSelectedCat(cat)}
                className="whitespace-nowrap"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mx-5 mb-5">
        <div className="pm-card-lg p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/25 via-transparent to-primary-container/8 pointer-events-none" />

          <div className="relative flex items-start gap-4">
            <CatAvatar name={selectedCat.name} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="pm-label text-primary-container mb-1.5">
                {selectedCat.name}'s vibe
              </p>
              {currentMood ? (
                <>
                  <MoodBadge feeling={currentMood} size="lg" />
                  {currentActivity && (
                    <p className="text-sm text-on-surface-muted mt-2 leading-relaxed">{currentActivity}</p>
                  )}
                  {!latestRead && (
                    <p className="text-caption text-on-surface-muted/70 mt-2">Based on recent history</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-on-surface tracking-tight">No reads yet today</p>
                  <p className="text-sm text-on-surface-muted mt-1">Start a read to see today's vibe</p>
                </>
              )}
            </div>
          </div>

          {!currentMood && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-5 w-full py-3 rounded-2xl bg-primary-container text-white text-sm font-semibold active:scale-[0.98] transition-transform duration-200 ease-smooth shadow-card"
            >
              Start first read
            </button>
          )}
        </div>
      </div>

      {todayReads.length > 0 && (
        <div className="px-5 mb-5">
          <p className="pm-label mb-3">Logged Today</p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard Icon={IcoClipboard} label="Reads" value={`${todayReads.length}`} subLabel={todayReads.length === 1 ? '1 observation' : `${todayReads.length} observations`} />
            {latestRead?.confidence && (
              <StatCard
                Icon={latestRead.confidence === 'high' ? IcoTarget : latestRead.confidence === 'medium' ? IcoBarChart : IcoClipboard}
                label="Confidence"
                value={latestRead.confidence.charAt(0).toUpperCase() + latestRead.confidence.slice(1)}
                subLabel="Latest read"
              />
            )}
            {baseline?.topActivity && (
              <StatCard Icon={IcoTarget} label="Top Activity" value={baseline.topActivity.split(' ')[0]} subLabel="Most frequent" />
            )}
            {baseline?.thisWeek != null && (
              <StatCard Icon={IcoCalendar} label="This Week" value={`${baseline.thisWeek}`} subLabel="total reads" />
            )}
          </div>
        </div>
      )}

      <div className="px-5 mb-5">
        <p className="pm-label mb-3">Weekly Mood Map</p>
        <div className="pm-card p-4">
          <div className="flex items-center justify-between gap-1">
            {DAYS.map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <MoodDot feeling={weekMap[day]} />
                <span className="text-2xs text-on-surface-muted font-medium">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {todayReads.length > 0 && (
        <div className="px-5 mb-5">
          <p className="pm-label mb-3">Today's Reads</p>
          <div className="flex flex-col gap-2.5">
            {todayReads.slice(0, 3).map((read) => (
              <div
                key={read.id}
                className="pm-card px-4 py-3.5 flex items-start gap-3 hover:shadow-card-hover transition-shadow duration-200"
              >
                <MoodBadge feeling={read.feeling} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface tracking-tight">{read.activity}</p>
                  {read.evidence?.length > 0 && (
                    <p className="text-caption text-on-surface-muted mt-1 truncate">
                      {read.evidence[0]}
                    </p>
                  )}
                </div>
                <span className="text-caption text-on-surface-muted flex-shrink-0 tabular-nums">
                  {new Date(read.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pb-2">
        <p className="pm-label mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { Icon: IcoCamera, label: 'New Read', desc: 'Capture a moment', path: '/' },
            { Icon: IcoTrending, label: 'Insights', desc: 'Mood trends', path: `/insights/${selectedCat.id}` },
            { Icon: IcoClock, label: 'History', desc: 'All reads', path: `/history/${selectedCat.id}` },
            { Icon: IcoCalendar, label: 'Weekly', desc: '7-day digest', path: `/weekly/${selectedCat.id}` },
            { Icon: IcoHeartPulse, label: 'Health Log', desc: 'Symptoms & injuries', path: `/health/${selectedCat.id}` },
            { Icon: IcoShield, label: 'Emergency', desc: 'ICE vault', path: `/emergency/${selectedCat.id}` },
            { Icon: IcoPill, label: 'Pharmacy', desc: 'Medications', path: `/pharmacy/${selectedCat.id}` },
            { Icon: IcoMoreDots, label: 'All Features', desc: 'Full tool suite', path: `/more/${selectedCat.id}` },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="pm-card px-4 py-4 text-left active:scale-[0.98] transition-all duration-200 ease-smooth hover:shadow-card-hover flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-surface-container border border-border-subtle flex items-center justify-center flex-shrink-0">
                <action.Icon size={18} color="#857464" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface tracking-tight">{action.label}</p>
                <p className="text-caption text-on-surface-muted mt-0.5">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
