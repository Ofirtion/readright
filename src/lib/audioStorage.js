// audioStorage.js
// =================================
// Stores audio recordings of reading sessions in IndexedDB.
// Why IndexedDB? localStorage is capped at ~5-10MB, which is one short recording.
// IndexedDB supports gigabytes and works on every modern browser.
//
// Schema (one object store, "recordings"):
//   id (auto-increment, primary key)
//   sessionId   — links to the reading_session row in localStorage / Supabase
//   childId     — for fast filtering by child
//   storyId     — which story was read
//   storyTitle  — denormalized for display without lookup
//   blob        — the actual audio Blob (webm/opus)
//   mimeType    — for playback
//   duration    — in seconds
//   size        — in bytes
//   createdAt   — ISO datetime
//
// When we move to Supabase, we'll add an `uploaded` flag and a background
// sync job that pushes blobs to Supabase Storage and clears local copies
// once confirmed.

const DB_NAME = 'readright_audio';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        // Indexes for filtering — these are essentially "WHERE clauses" in IndexedDB
        store.createIndex('childId', 'childId', { unique: false });
        store.createIndex('sessionId', 'sessionId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

/**
 * Save a recording to IndexedDB.
 *
 * @param {Object} recording
 * @param {Blob}   recording.blob       The audio data
 * @param {string} recording.sessionId  Reading session ID (links to session row)
 * @param {string} recording.childId    Child ID
 * @param {string} recording.storyId    Story ID
 * @param {string} recording.storyTitle Story title (denormalized)
 * @param {number} recording.duration   Duration in seconds
 * @returns {Promise<number>} The new recording's ID
 */
export async function saveRecording({ blob, sessionId, childId, storyId, storyTitle, duration }) {
  if (!blob || blob.size === 0) {
    throw new Error('Empty audio blob');
  }

  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      sessionId: sessionId || null,
      childId,
      storyId,
      storyTitle: storyTitle || 'סיפור',
      blob,
      mimeType: blob.type || 'audio/webm',
      duration: duration || 0,
      size: blob.size,
      createdAt: new Date().toISOString(),
    };

    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get all recordings for a specific child, sorted newest-first.
 * @param {string} childId
 * @returns {Promise<Array>} Array of recording metadata (without the blob)
 */
export async function getRecordingsForChild(childId) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('childId');
    const req = index.getAll(childId);

    req.onsuccess = () => {
      const results = req.result || [];
      // Sort newest-first
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      // Strip blob from the listing to save memory — caller fetches individual blob when playing
      const stripped = results.map(({ blob, ...meta }) => meta);
      resolve(stripped);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get a single recording with its blob, ready for playback.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
export async function getRecording(id) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);

    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get a URL that can be played in an <audio> element.
 * Caller is responsible for calling URL.revokeObjectURL() when done.
 * @param {number} id
 * @returns {Promise<string|null>}
 */
export async function getRecordingPlaybackUrl(id) {
  const rec = await getRecording(id);
  if (!rec || !rec.blob) return null;
  return URL.createObjectURL(rec.blob);
}

/**
 * Delete a recording.
 * @param {number} id
 */
export async function deleteRecording(id) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Total storage used by recordings for one child (or all if childId is undefined).
 * @returns {Promise<number>} Bytes used
 */
export async function getStorageUsage(childId) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    let total = 0;
    const req = childId !== undefined
      ? store.index('childId').openCursor(IDBKeyRange.only(childId))
      : store.openCursor();

    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        total += cursor.value.size || 0;
        cursor.continue();
      } else {
        resolve(total);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Find the recording that belongs to a given sessionId.
 * @param {string} sessionId
 * @returns {Promise<Object|null>}
 */
export async function getRecordingBySession(sessionId) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('sessionId');
    const req = index.get(sessionId);

    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Format bytes as human-readable string in Hebrew.
 */
export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Format duration in seconds as M:SS.
 */
export function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
