/**
 * Data service abstraction for PetMood.
 * All persistence goes through this module — swap the implementation
 * (e.g. replace Firebase with Supabase) without touching any screen code.
 *
 * Firestore rule assumption (no-auth MVP):
 *   allow read, write: if true;
 * Set these rules in the Firebase console before sharing with any user.
 * Add auth guards before any public launch. See firestore.rules at repo root.
 *
 * Data model:
 *   cats/{catId}                          { name, breed?, emoji?, createdAt }
 *   cats/{catId}/reads/{readId}           { activity, feeling, confidence, evidence[],
 *                                           keyframeCount, tags?, createdAt }
 *   cats/{catId}/feedback/{feedbackId}    { readId, rating, note, createdAt }
 *   cats/{catId}/notes/{noteId}           { readId?, text, tags[], createdAt }
 *   cats/{catId}/baselines/{baselineId}   { periodStart, periodEnd, readCount,
 *                                           avgConfidence, topActivities[], topFeelings[],
 *                                           createdAt }  ← schema reserved; not yet computed
 *
 * localStorage keys (used as fallback / demo mode):
 *   petmood_reads_{catId}    – JSON array of read objects, newest first
 *   petmood_feedback         – JSON array of all feedback objects
 *   petmood_notes_{catId}    – JSON array of note objects, newest first
 */

import { getDb } from './firebase'

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_READS_KEY    = (catId) => `petmood_reads_${catId}`
const LS_FEEDBACK_KEY = 'petmood_feedback'
const LS_NOTES_KEY    = (catId) => `petmood_notes_${catId}`

function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ─── Firestore context helper ─────────────────────────────────────────────────

/**
 * Returns the Firestore db + SDK functions, or throws if Firebase is not
 * configured. Callers that want graceful degradation should `.catch()`.
 *
 * The dynamic import here means the Firestore SDK stays out of the initial
 * bundle (Vite splits it into a separate chunk).
 */
async function fctx() {
  const db = await getDb()
  if (!db) throw new Error('Firebase not configured')
  const sdk = await import('firebase/firestore')
  return { db, ...sdk }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true for cat IDs that must stay in localStorage only. */
function isLocalCat(catId) {
  return !catId || catId.startsWith('__') || catId.startsWith('local_')
}

// ─── Cats ─────────────────────────────────────────────────────────────────────

export async function getCats() {
  const { db, collection, getDocs, query, orderBy } = await fctx()
  const snap = await getDocs(query(collection(db, 'cats'), orderBy('createdAt', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addCat(name, emoji = '🐱') {
  const { db, collection, addDoc, serverTimestamp } = await fctx()
  const ref = await addDoc(collection(db, 'cats'), {
    name,
    emoji,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ─── Reads (Firestore) ────────────────────────────────────────────────────────

export async function getReads(catId) {
  const { db, collection, getDocs, query, orderBy } = await fctx()
  const snap = await getDocs(
    query(collection(db, 'cats', catId, 'reads'), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Saves a read to Firestore.
 * @param {string} catId
 * @param {object} read  – analysis result object
 * @param {string} [id]  – optional stable ID to use; auto-generated if omitted.
 *                         Pass the same ID used for feedback to ensure correlation.
 */
export async function saveRead(catId, read, id) {
  const { db, collection, doc, setDoc, serverTimestamp } = await fctx()
  const ref = id
    ? doc(db, 'cats', catId, 'reads', id)
    : doc(collection(db, 'cats', catId, 'reads'))
  await setDoc(ref, { ...read, createdAt: serverTimestamp() })
  return ref.id
}

// ─── Reads (localStorage fallback) ───────────────────────────────────────────

/**
 * Always saves to localStorage — used for demo cats and as a backup for
 * Firestore cats (optimistic write so the UI is instant).
 * @param {string} catId
 * @param {object} read
 * @param {string} [id]  – optional stable ID; auto-generated if omitted.
 *                         Pass the same ID used for feedback to ensure correlation.
 */
export function saveReadLocal(catId, read, id) {
  const key = LS_READS_KEY(catId)
  const existing = lsGet(key) ?? []
  const newRead = {
    ...read,
    id: id ?? `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
    tags: read.tags ?? [],
    note: read.note ?? '',
  }
  lsSet(key, [newRead, ...existing])
  return newRead.id
}

export function getReadsLocal(catId) {
  return lsGet(LS_READS_KEY(catId)) ?? []
}

/**
 * Merges fields into an existing local read by ID.
 * Used to attach tags and notes after a read is saved.
 * @param {string} catId
 * @param {string} readId
 * @param {Partial<{tags: string[], note: string}>} patch
 */
export function updateReadLocal(catId, readId, patch) {
  const key = LS_READS_KEY(catId)
  const reads = lsGet(key) ?? []
  const updated = reads.map((r) => r.id === readId ? { ...r, ...patch } : r)
  lsSet(key, updated)
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

/**
 * Save user feedback for a read.
 * @param {{ readId: string, catId: string, rating: 'accurate'|'useful'|'unsure'|'wrong', note?: string }} opts
 */
export async function saveFeedback({ readId, catId, rating, note = '' }) {
  const feedback = {
    readId,
    catId,
    rating,
    note,
    createdAt: new Date().toISOString(),
  }

  // Always persist locally first
  const existing = lsGet(LS_FEEDBACK_KEY) ?? []
  // Replace any prior feedback for the same readId (idempotent update)
  const updated = [feedback, ...existing.filter((f) => f.readId !== readId)]
  lsSet(LS_FEEDBACK_KEY, updated)

  // Best-effort Firestore save for real cats
  if (!isLocalCat(catId)) {
    try {
      const { db, collection, doc, setDoc, serverTimestamp } = await fctx()
      const ref = doc(collection(db, 'cats', catId, 'feedback'))
      await setDoc(ref, { ...feedback, createdAt: serverTimestamp() })
    } catch {}
  }
}

// ─── Notes (manual annotations on a cat's timeline) ──────────────────────────

/**
 * Save a free-text note, optionally linked to a specific read.
 * @param {{ catId: string, text: string, readId?: string, tags?: string[] }} opts
 */
export async function saveNote({ catId, text, readId = null, tags = [] }) {
  const note = {
    catId,
    text,
    readId,
    tags,
    createdAt: new Date().toISOString(),
  }

  // Always persist locally
  const key = LS_NOTES_KEY(catId)
  const existing = lsGet(key) ?? []
  lsSet(key, [{ ...note, id: `note_${Date.now()}` }, ...existing])

  // Best-effort Firestore save for real cats
  if (!isLocalCat(catId)) {
    try {
      const { db, collection, addDoc, serverTimestamp } = await fctx()
      await addDoc(collection(db, 'cats', catId, 'notes'), {
        ...note,
        createdAt: serverTimestamp(),
      })
    } catch {}
  }
}

export function getNotesLocal(catId) {
  return lsGet(LS_NOTES_KEY(catId)) ?? []
}

// ─── Baseline & "unusual for her" helpers (client-side) ──────────────────────

const MIN_READS_FOR_BASELINE = 5

/**
 * Compute a lightweight baseline summary from stored reads.
 * Returns null if fewer than MIN_READS_FOR_BASELINE reads exist.
 */
export function computeBaseline(catId) {
  const reads = getReadsLocal(catId)
  if (reads.length < MIN_READS_FOR_BASELINE) return null

  const feelingCounts = {}
  const activityCounts = {}
  for (const r of reads) {
    const f = r.feeling ?? 'Unknown'
    feelingCounts[f] = (feelingCounts[f] ?? 0) + 1
    const a = r.activity ?? 'Unknown'
    activityCounts[a] = (activityCounts[a] ?? 0) + 1
  }

  const topFeeling  = Object.entries(feelingCounts).sort((a, b) => b[1] - a[1])[0]
  const topActivity = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  const oneWeekAgo = Date.now() - 7 * 86_400_000
  const thisWeek   = reads.filter((r) => new Date(r.createdAt).getTime() > oneWeekAgo).length

  return {
    readCount:       reads.length,
    topFeeling:      topFeeling?.[0],
    topFeelingPct:   topFeeling ? Math.round((topFeeling[1] / reads.length) * 100) : 0,
    topActivity,
    thisWeek,
  }
}

/**
 * Returns a lightweight "unusual for her" signal, or null.
 * Compares the latest read's feeling against the established baseline.
 */
export function getUnusualSignal(catId) {
  const baseline = computeBaseline(catId)
  if (!baseline) return null

  const latest = getReadsLocal(catId)[0]
  if (!latest) return null

  if (
    baseline.topFeeling &&
    latest.feeling !== baseline.topFeeling &&
    baseline.topFeelingPct >= 40
  ) {
    return {
      type: 'feeling_change',
      message: `Usually "${baseline.topFeeling}" (${baseline.topFeelingPct}% of reads) — today showing "${latest.feeling}"`,
      caveat: "One observation isn't a pattern. Keep an eye on it.",
    }
  }

  return null
}

export async function getNotes(catId) {
  if (isLocalCat(catId)) return getNotesLocal(catId)
  try {
    const { db, collection, getDocs, query, orderBy } = await fctx()
    const snap = await getDocs(
      query(collection(db, 'cats', catId, 'notes'), orderBy('createdAt', 'desc'))
    )
    const remote = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    return remote.length > 0 ? remote : getNotesLocal(catId)
  } catch {
    return getNotesLocal(catId)
  }
}
