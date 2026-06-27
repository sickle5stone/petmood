import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { analyzeVideo } from '../analysisService'
import { ProgressStep, PillButton, CatAvatar } from '../components/ui'
import { IcoPawPrint, IcoUsers, IcoClock, IcoMoon, IcoAlertCircle } from '../components/icons'

const STEPS = [
  'Sampling keyframes',
  'Listening for vocalisations',
  'Reading posture and motion',
  'Synthesising read',
]

const ERROR_COPY = {
  NO_CAT: {
    Icon: IcoPawPrint,
    title: 'No cat detected',
    body: 'Make sure your cat is clearly in frame — try zooming in a little.',
  },
  MULTIPLE_CATS: {
    Icon: IcoUsers,
    title: 'Multiple cats in view',
    body: 'Reads work best for one cat at a time. Try a clip with just one cat in frame.',
  },
  TOO_SHORT: {
    Icon: IcoClock,
    title: 'Clip too short',
    body: 'Aim for 3–5 seconds — long enough to catch a posture and a moment.',
  },
  UNREADABLE: {
    Icon: IcoMoon,
    title: "Couldn't read this clip",
    body: 'The clip may be too dark, blurry, or noisy. Try better light or a steadier angle.',
  },
  GENERIC: {
    Icon: IcoAlertCircle,
    title: 'Analysis failed',
    body: 'Something went wrong. Check your connection and try again.',
  },
}

export default function AnalyzingScreen() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [error, setError] = useState(null)

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    const ErrIcon = error.Icon
    return (
      <div className="pm-page pm-page-tight flex flex-col items-center justify-center gap-8">
        <div className="pm-card-lg p-8 flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-2xl bg-tertiary-container/15 border border-border-subtle flex items-center justify-center">
            <ErrIcon size={28} color="#964735" />
          </div>
          <h2 className="text-xl font-semibold text-on-surface tracking-tight">{error.title}</h2>
          <p className="text-sm text-on-surface-muted leading-relaxed">{error.body}</p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <PillButton className="w-full" onClick={() => navigate('/', { replace: true })}>
            Try a different clip
          </PillButton>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-full text-sm font-medium text-on-surface-muted hover:text-on-surface transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pm-page pm-page-tight flex flex-col items-center justify-center gap-10 pb-nav">
      <div className="relative flex items-center justify-center">
        <span className="absolute w-28 h-28 rounded-full bg-primary-container/15 record-ring" />
        <span className="absolute w-20 h-20 rounded-full bg-primary-container/20 animate-pulse" />
        <CatAvatar name={state?.catName ?? '?'} size="lg" className="!w-20 !h-20 !text-2xl z-10" />
      </div>

      <div className="flex flex-col items-center gap-5 text-center w-full max-w-xs">
        <div>
          <p className="pm-label text-primary-container mb-1">Analysing</p>
          <p className="text-xl font-semibold text-on-surface tracking-tight">Reading the moment…</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {STEPS.map((label, i) => (
            <ProgressStep
              key={label}
              label={label}
              status={i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'pending'}
            />
          ))}
        </div>
      </div>

      {state?.catName && (
        <p className="text-sm text-on-surface-muted">
          Clip for <span className="font-semibold text-on-surface">{state.catName}</span>
        </p>
      )}

      <p className="text-caption text-on-surface-muted/70 text-center max-w-xs">
        Behavioural read — not a diagnosis
      </p>
    </div>
  )
}
