import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { IcoCamera, IcoGrid, IcoTrending, IcoHeart, IcoClock, IcoMoreDots } from './icons'

const NAV_ITEMS = [
  {
    id: 'capture',
    label: 'Capture',
    Icon: IcoCamera,
    path: () => '/',
    matches: (p) => p === '/',
  },
  {
    id: 'dashboard',
    label: 'Today',
    Icon: IcoGrid,
    path: () => '/dashboard',
    matches: (p) => p === '/dashboard',
  },
  {
    id: 'insights',
    label: 'Insights',
    Icon: IcoTrending,
    path: (catId) => `/insights/${catId}`,
    matches: (p) => p.startsWith('/insights') || p.startsWith('/weekly'),
  },
  {
    id: 'care',
    label: 'Care',
    Icon: IcoHeart,
    path: (catId) => `/care/${catId}`,
    matches: (p) => p.startsWith('/care'),
  },
  {
    id: 'history',
    label: 'History',
    Icon: IcoClock,
    path: (catId) => `/history/${catId}`,
    matches: (p) => p.startsWith('/history') || p.startsWith('/passport') || p.startsWith('/weekly'),
  },
  {
    id: 'more',
    label: 'More',
    Icon: IcoMoreDots,
    path: (catId) => `/more/${catId}`,
    matches: (p) => p.startsWith('/more') || p.startsWith('/health') || p.startsWith('/pharmacy')
      || p.startsWith('/vet-summary') || p.startsWith('/emergency') || p.startsWith('/nutrition')
      || p.startsWith('/play-lab') || p.startsWith('/training') || p.startsWith('/bond')
      || p.startsWith('/behavior') || p.startsWith('/personality') || p.startsWith('/gallery')
      || p.startsWith('/environment') || p.startsWith('/cleaning') || p.startsWith('/sitter')
      || p.startsWith('/litter') || p.startsWith('/life-stage') || p.startsWith('/outdoor')
      || p.startsWith('/leash') || p.startsWith('/human-injury') || p.startsWith('/ai-companion'),
  },
]

function useCatId() {
  const { catId } = useParams() ?? {}
  if (catId) return catId
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('petmood_reads_'))
    if (keys.length > 0) return keys[0].replace('petmood_reads_', '')
  } catch {}
  return '__luna'
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const catId = useCatId()
  const path = location.pathname

  if (path === '/analyzing') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <div
        className="mx-auto w-full max-w-sm bg-white/92 backdrop-blur-xl border-t border-border shadow-nav pointer-events-auto rounded-t-3xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 6px)' }}
      >
        <div className="flex items-stretch justify-around px-1 pt-2 pb-1.5">
          {NAV_ITEMS.map((item) => {
            const active = item.matches(path)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path(catId))}
                className={`relative flex flex-col items-center justify-center gap-1 min-w-[3rem] px-2 py-2 rounded-2xl transition-all duration-200 ease-smooth active:scale-95 ${
                  active ? 'text-primary-container' : 'text-on-surface-muted'
                }`}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span className="absolute inset-x-2 top-1 bottom-1 rounded-xl bg-primary-container/10 -z-10" />
                )}
                <item.Icon size={22} color={active ? '#e89a3c' : '#857464'} />
                <span className={`text-2xs font-semibold tracking-wide ${active ? 'text-primary-container' : 'text-on-surface-muted'}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
