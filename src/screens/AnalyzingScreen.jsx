import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { analyzeVideo } from '../analysisService'

const STEPS = [
  'Sampling keyframes…',
  'Listening for vocalisations…',
  'Reading posture and motion…',
  'Synthesising read…',
]

/** Maps AnalysisError types to user-facing copy + next action. */
const ERROR_COPY = {
  NO_CAT: {
    icon: '🔍',
    title: 'No cat detected',
    body: 'Make sure your cat is clearly in frame — try zooming in a little.',
  },
  MULTIPLE_CATS: {
    icon: '🐱🐱',
    title: 'Multiple cats in view',
    body: 'Reads work best for one cat at a time. Try a clip with just one cat in frame.',
  },
  TOO_SHORT: {
    icon: '⏱',
    title: 'Clip too short',
    body: 'Aim for 3–5 seconds — long enough to catch a posture and a moment.',
  },
  UNREADABLE: {
    icon: '🌑',
    title: "Couldn't read this clip",
    body: 'The clip may be too dark, blurry, or noisy. Try better light or a steadier angle.',
  },
  GENERIC: {
    icon: '⚡',
    title: 'Analysis failed',
    body: 'Something went wrong. Check your connection and try again.',
  },
}

export default function AnalyzingScreen() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError]         = useState(null) // null | { type, icon, title, body }

  useEffect(() => {
    if (!state?.file) {
      navigate('/', { replace: true })
      return
    }

    let step = 0
    const interval = setInterval(() => {
      step = Math.min(step + 1, STEPS.length - 1)
      setStepIndex(step)
    }, 700)

    analyzeVideo(state.file)
      .then((result) => {
        clearInterval(interval)
        navigate('/result', {
          state: { result, catId: state.catId, catName: state.catName },
          replace: true,
        })
      })
      .catch((err) => {
        clearInterval(interval)
        const type = err?.type ?? 'GENERIC'
        setError({ type, ...ERROR_COPY[type] ?? ERROR_COPY.GENERIC })
      })

    return () => clearInterval(interval)
  }, [])

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-svh bg-surface flex flex-col items-center justify-center px-5 gap-8 page-enter">
        <div className="flex flex-col items-center gap-4 text-center max-w-xs">
          <span className="text-5xl">{error.icon}</span>
          <h2 className="text-xl font-semibold text-on-surface">{error.title}</h2>
          <p className="text-sm text-on-surface-muted leading-relaxed">{error.body}</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full py-3.5 rounded-full bg-primary-container text-white text-sm font-semibold active:scale-95 transition-transform shadow-sm"
          >
            Try a different clip
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-full text-sm text-on-surface-muted hover:text-on-surface transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  // ── Analysing state ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-svh bg-surface flex flex-col items-center justify-center px-5 gap-10 page-enter">
      {/* Pulsing indicator */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full bg-primary-container/20 animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="absolute w-24 h-24 rounded-full bg-primary-container/25 animate-pulse" />
        <span className="text-6xl z-10">🐱</span>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xl font-semibold text-on-surface">Reading the moment…</p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-400 ${
                i === stepIndex
                  ? 'bg-primary-container/15 text-on-surface'
                  : i < stepIndex
                  ? 'text-secondary opacity-60'
                  : 'text-on-surface-muted opacity-25'
              }`}
            >
              <span className="text-base w-4 text-center">
                {i < stepIndex ? '✓' : i === stepIndex ? '…' : '○'}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {state?.catName && (
        <p className="text-sm text-on-surface-muted">
          Analysing clip for <strong>{state.catName}</strong>
        </p>
      )}

      <p className="text-xs text-on-surface-muted/60 text-center max-w-xs">
        This is a behavioural read — not a diagnosis.
      </p>
    </div>
  )
}
