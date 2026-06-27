/** Shared mood colour mapping — no emoji, professional tone chips. */

const MOOD_PALETTE = [
  { keys: ['relaxed', 'calm', 'serene', 'cozy', 'zen'], color: '#8ba888', bg: '#eef5ed' },
  { keys: ['happy', 'playful', 'joyful', 'content'], color: '#e89a3c', bg: '#fdf3e8' },
  { keys: ['anxious', 'stressed', 'restless', 'agitated'], color: '#c45a42', bg: '#fceee9' },
  { keys: ['active', 'curious', 'alert'], color: '#5b8fc7', bg: '#edf4fb' },
  { keys: ['tired', 'sleepy', 'drowsy'], color: '#857464', bg: '#f0edef' },
]

export function getMoodStyle(feeling) {
  if (!feeling) {
    return { color: '#857464', bg: '#f0edef', label: 'Unknown' }
  }
  const lower = feeling.toLowerCase()
  for (const entry of MOOD_PALETTE) {
    if (entry.keys.some((k) => lower.includes(k))) {
      return { color: entry.color, bg: entry.bg, label: feeling }
    }
  }
  return { color: '#e89a3c', bg: '#fdf3e8', label: feeling }
}

export function getMoodDotColor(feeling) {
  return getMoodStyle(feeling).color
}
