# PetMood

A mobile-first web app for cat owners. Record a 3–5 second clip of your cat → get a grounded behavioural read → save to a per-cat log.

PetMood is not an emotion oracle. It reads observable signals (posture, motion, vocalisation) and returns a confidence-rated result with specific evidence. Interpret with context.

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
```

No `.env` needed — the app runs fully in mock mode without Firebase or an analysis endpoint.

## Environment

Copy `.env.example` → `.env` and fill in only the services you want:

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_*` | Firestore persistence. Without this, cats/reads are stored in localStorage only. |
| `VITE_ANALYSIS_API_URL` | VLM backend URL. Without this, mock reads are returned after ~2.8 s. |
| `VITE_ANALYSIS_ENDPOINT` | Legacy alias for `VITE_ANALYSIS_API_URL` — either works. |
| `VITE_ANALYSIS_MOCK_ERROR` | **Dev/test hook** — force a specific typed error in mock mode (`NO_CAT` \| `MULTIPLE_CATS` \| `TOO_SHORT` \| `UNREADABLE` \| `GENERIC`). No effect when a real endpoint is set. |
| `VITE_ANALYSIS_MOCK_INDEX` | **Dev/test hook** — return a specific mock read by index (0–5) instead of random. No effect when a real endpoint is set. |

## Stack

- React 19 + Vite 8
- React Router 7 (client-side routing)
- Tailwind CSS 3 (Warm Companion palette — surface, primary-container, secondary)
- Firebase/Firestore (optional, with localStorage fallback)
- No animation library — lightweight CSS keyframes only

## User Flow

```
CaptureScreen  →  (pick cat, record/upload)
AnalyzingScreen →  (steps + pulsing cat, 2.8 s mock or real VLM)
ResultScreen   →  (activity · feeling · evidence · save · feedback)
HistoryScreen  →  (timeline per cat, skeleton loading)
```

## Mock Analysis Endpoint

If you build a real VLM backend, it should:
- Accept `POST multipart/form-data` with a `video` field
- Return JSON matching this schema:

```json
{
  "activity": "Loafing on the windowsill",
  "feeling": "Relaxed and content",
  "confidence": "high",
  "evidence": ["Loaf posture – weight fully settled", "Slow blink at 0:04"],
  "keyframeCount": 3
}
```

On error, return a non-2xx status with a JSON body:
```json
{ "error": "NO_CAT" }
```

Supported error codes: `NO_CAT`, `MULTIPLE_CATS`, `TOO_SHORT`, `UNREADABLE`.

## Firestore Rules (no-auth MVP)

The MVP rules are in `firestore.rules` at the repo root. Deploy them with:
```bash
firebase deploy --only firestore:rules
```

The default rules allow all reads and writes (suitable for internal testing only). Add auth guards before any public launch — the rules file contains annotated TODOs for next steps.

---

## UX & Performance Acceptance Notes

These are non-negotiable for keeping early users:

### Transitions & Feedback
- Every screen entrance uses a 200 ms `pageEnter` CSS animation (fade + 6 px slide up). No flash screens.
- Button presses use `active:scale-95` / `active:scale-90` for instant tactile feedback — no async delay.
- History loads skeleton cards immediately; spinner is gone before content is painted.

### Saving is Optimistic
- ResultScreen shows "Saved ✓" the instant the user taps Save. `localStorage` write is synchronous; Firestore write runs silently in the background.
- This means saves feel instant even on slow connections.

### Error States (no blank screens)
- If `analyzeVideo` throws for any reason, `AnalyzingScreen` renders a typed error card (NO_CAT / MULTIPLE_CATS / TOO_SHORT / UNREADABLE / GENERIC) with a "Try a different clip" action.
- History never shows a spinner alone — skeleton cards appear while data loads.

### Result Framing
- Labels say "Observed doing" / "May suggest" — not "Doing" / "Feeling".
- Evidence section is labelled "Observable signals" with a footnote: *"Based on visible posture, motion, and audio — not a medical diagnosis."*
- Confidence badge copies: Good read / Fair read / Uncertain.

### Feedback Loop
- Every result shows a 4-option feedback widget (Spot on / Useful / Not sure / Off) plus optional note.
- Persisted immediately to `localStorage` (`petmood_feedback` key) and best-effort to Firestore.

### Demo Mode
- Default cats (Luna / Mochi with `__` prefix) store reads in `localStorage` keyed by cat ID.
- `local_` prefixed cats (added when Firestore is unavailable) also store in `localStorage`.
- History screen merges localStorage reads as fallback if Firestore returns empty.

### Bundle
- No Framer Motion / GSAP. All animations are CSS keyframes or Tailwind utilities.
- No icon library — inline SVGs only.

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # serve dist/ locally
npm run lint     # oxlint
```
