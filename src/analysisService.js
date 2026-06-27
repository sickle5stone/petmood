/**
 * Analysis service: sends video data to a VLM and returns a structured read.
 *
 * Endpoint resolution (first match wins):
 *   1. VITE_ANALYSIS_API_URL   – preferred name
 *   2. VITE_ANALYSIS_ENDPOINT  – legacy alias (backward compat)
 *
 * When neither is set the service runs in mock mode — realistic sample
 * reads are returned after a short delay so the full UI flow can be
 * demonstrated without any backend.
 *
 * Production contract:
 *   POST multipart/form-data  { video: File }
 *   200 OK → JSON Read object (see Read schema below)
 *   non-2xx → JSON { "error": "<ERROR_CODE>" }
 *
 * Read schema:
 * {
 *   activity:      string,                    // "Loafing on the windowsill"
 *   feeling:       string,                    // "Relaxed and content"
 *   confidence:    "high" | "medium" | "low",
 *   evidence:      string[],                  // ["Loaf posture – weight settled", ...]
 *   keyframeCount: number,
 * }
 *
 * Error types (thrown as AnalysisError):
 *   NO_CAT          – no cat detected in the clip
 *   MULTIPLE_CATS   – more than one cat in frame
 *   TOO_SHORT       – clip under ~2 seconds
 *   UNREADABLE      – too dark, blurry, or corrupted
 *   GENERIC         – any other backend/network failure
 *
 * Dev / test hooks (mock mode only, no effect when a real endpoint is set):
 *   VITE_ANALYSIS_MOCK_ERROR=NO_CAT    – forces a specific typed error
 *   VITE_ANALYSIS_MOCK_INDEX=2         – returns a specific mock read (0–5)
 */

export class AnalysisError extends Error {
  /** @param {'NO_CAT'|'MULTIPLE_CATS'|'TOO_SHORT'|'UNREADABLE'|'GENERIC'} type */
  constructor(type, message) {
    super(message ?? type)
    this.name = 'AnalysisError'
    this.type = type
  }
}

const VALID_ERROR_TYPES = ['NO_CAT', 'MULTIPLE_CATS', 'TOO_SHORT', 'UNREADABLE', 'GENERIC']

const MOCK_READS = [
  {
    activity: 'Loafing on the windowsill',
    feeling: 'Relaxed and content',
    confidence: 'high',
    evidence: ['Loaf posture – weight fully settled', 'Soft purr at 0:02', 'Slow blink at 0:04'],
    keyframeCount: 3,
  },
  {
    activity: 'Alert at the window',
    feeling: 'Excited / mildly agitated',
    confidence: 'medium',
    evidence: ['Chirping vocalisation', 'Tail tip flick at 0:01', 'Focused gaze, dilated pupils'],
    keyframeCount: 4,
  },
  {
    activity: 'Grooming session',
    feeling: 'Calm and focused',
    confidence: 'high',
    evidence: ['Methodical grooming sequence', 'No vocalisations detected', 'Relaxed ear position'],
    keyframeCount: 3,
  },
  {
    activity: 'Resting in sunspot',
    feeling: 'Deeply relaxed',
    confidence: 'high',
    evidence: ['Fully reclined posture', 'Eyes half-closed', 'Slow, deep breathing'],
    keyframeCount: 2,
  },
  {
    activity: 'Play-hunting the curtain',
    feeling: 'Stimulated and playful',
    confidence: 'medium',
    evidence: ['Crouched pounce posture', 'Tail lashing side to side', 'Dilated pupils'],
    keyframeCount: 5,
  },
  {
    activity: 'Sitting and watching',
    feeling: 'Mildly alert — hard to read',
    confidence: 'low',
    evidence: ['Upright posture, ears forward', 'No vocalisation detected', 'Gaze direction unclear in clip'],
    keyframeCount: 2,
  },
]

/** Maps backend error codes to our typed error. */
const ERROR_CODE_MAP = {
  NO_CAT:        'NO_CAT',
  MULTIPLE_CATS: 'MULTIPLE_CATS',
  TOO_SHORT:     'TOO_SHORT',
  UNREADABLE:    'UNREADABLE',
}

const ANALYSIS_TIMEOUT_MS = 30_000

/**
 * Validates that a response from the analysis endpoint matches the Read schema.
 * Throws AnalysisError('GENERIC') on any mismatch so callers get a typed error.
 */
function validateReadResult(data) {
  if (!data || typeof data !== 'object') {
    throw new AnalysisError('GENERIC', 'Invalid analysis response: expected object')
  }
  if (typeof data.activity !== 'string' || !data.activity.trim()) {
    throw new AnalysisError('GENERIC', 'Invalid analysis response: missing activity')
  }
  if (typeof data.feeling !== 'string' || !data.feeling.trim()) {
    throw new AnalysisError('GENERIC', 'Invalid analysis response: missing feeling')
  }
  if (!['high', 'medium', 'low'].includes(data.confidence)) {
    throw new AnalysisError(
      'GENERIC',
      `Invalid analysis response: confidence must be high/medium/low, got "${data.confidence}"`
    )
  }
  if (!Array.isArray(data.evidence) || data.evidence.length === 0) {
    throw new AnalysisError('GENERIC', 'Invalid analysis response: evidence must be a non-empty array')
  }
  if (typeof data.keyframeCount !== 'number' || data.keyframeCount < 1) {
    throw new AnalysisError('GENERIC', 'Invalid analysis response: keyframeCount must be a positive number')
  }
  return data
}

export async function analyzeVideo(videoFile) {
  // Prefer VITE_ANALYSIS_API_URL; fall back to legacy VITE_ANALYSIS_ENDPOINT
  const endpoint =
    import.meta.env.VITE_ANALYSIS_API_URL ||
    import.meta.env.VITE_ANALYSIS_ENDPOINT ||
    ''

  // ── Mock mode ────────────────────────────────────────────────────────────────
  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 2800))

    // Dev test hook: force a specific error type via env var
    const mockError = import.meta.env.VITE_ANALYSIS_MOCK_ERROR
    if (mockError) {
      const type = VALID_ERROR_TYPES.includes(mockError) ? mockError : 'GENERIC'
      throw new AnalysisError(type, `[mock] Forced error: ${type}`)
    }

    // Dev test hook: return a specific mock read by index (0–5)
    const rawIndex = import.meta.env.VITE_ANALYSIS_MOCK_INDEX
    if (rawIndex !== undefined && rawIndex !== '') {
      const idx = Number(rawIndex)
      if (!isNaN(idx) && idx >= 0 && idx < MOCK_READS.length) {
        return MOCK_READS[idx]
      }
    }

    return MOCK_READS[Math.floor(Math.random() * MOCK_READS.length)]
  }

  // ── Real endpoint ─────────────────────────────────────────────────────────────
  const body = new FormData()
  body.append('video', videoFile)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS)

  let res
  try {
    res = await fetch(endpoint, { method: 'POST', body, signal: controller.signal })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new AnalysisError('GENERIC', 'Analysis timed out — please try again')
    }
    throw new AnalysisError('GENERIC', 'Network error — check your connection')
  } finally {
    clearTimeout(timer)
  }

  if (!res.ok) {
    let errorType = 'GENERIC'
    try {
      const json = await res.json()
      errorType = ERROR_CODE_MAP[json?.error] ?? 'GENERIC'
    } catch {}
    throw new AnalysisError(errorType, `Analysis failed (${res.status})`)
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new AnalysisError('GENERIC', 'Analysis returned a non-JSON response')
  }

  return validateReadResult(data)
}
