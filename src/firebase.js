/**
 * Firebase lazy initialiser.
 *
 * `getDb()` returns a Firestore db instance, or `null` when
 * VITE_FIREBASE_PROJECT_ID is not set (demo / local-only mode).
 *
 * The Firebase SDK is dynamically imported on the first call so it stays
 * out of the initial JS bundle — Vite automatically splits it into a
 * separate chunk that loads only when Firestore is first needed.
 */

let _promise = null

export function getDb() {
  if (_promise) return _promise
  _promise = _init()
  return _promise
}

async function _init() {
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) return null

  const [{ initializeApp }, { getFirestore }] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
  ])

  const app = initializeApp({
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  })

  return getFirestore(app)
}
