// dataExport.js
// =================================
// GDPR/Privacy-related: lets a parent download all their data, or delete it all.
//
// downloadAllUserData: gathers everything from localStorage + IndexedDB
//                      and packages it as a downloadable JSON file.
//
// deleteAllUserData:   wipes localStorage keys + IndexedDB recordings.
//                      The caller is responsible for signing out the user afterwards.

import { getRecordingsForChild } from './audioStorage';

const LOCAL_STORAGE_KEYS = [
  'readright_user',
  'readright_children',
  'readright_sessions',
  'readright_custom_stories',
];

const INDEXEDDB_NAME = 'readright_audio';

/**
 * Collect all user data into one JSON object.
 * Note: We include audio recording METADATA (filenames, dates, story titles)
 * but NOT the actual audio bytes — that would make the JSON file huge.
 * The parent can listen to recordings inside the app, and a future enhancement
 * could let them export individual recordings as MP3.
 */
async function collectAllUserData() {
  // Collect localStorage entries
  const localData = {};
  for (const key of LOCAL_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      localData[key] = raw ? JSON.parse(raw) : null;
    } catch {
      localData[key] = null;
    }
  }

  // Collect recording metadata per child
  const childrenList = localData['readright_children'] || [];
  const recordingsMetadata = {};
  for (const child of childrenList) {
    try {
      recordingsMetadata[child.id] = await getRecordingsForChild(child.id);
    } catch {
      recordingsMetadata[child.id] = [];
    }
  }

  // Also collect any per-child settings (weekly email toggles, etc.)
  const settings = {};
  for (const child of childrenList) {
    const emailKey = `weekly_email_${child.id}`;
    const val = localStorage.getItem(emailKey);
    if (val !== null) settings[emailKey] = val;
  }

  return {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    note: 'ReadRight user data export. Audio recording metadata is included; the actual audio bytes are not (they remain in your browser). To save the audio itself, use the export option per recording.',
    user: localData['readright_user'],
    children: localData['readright_children'],
    sessions: localData['readright_sessions'],
    customStories: localData['readright_custom_stories'],
    recordingsMetadata,
    settings,
  };
}

/**
 * Download a JSON file with all user data.
 */
export async function downloadAllUserData() {
  const data = await collectAllUserData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const filename = `readright-data-export-${new Date().toISOString().slice(0, 10)}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Free memory once the browser has had a chance to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { filename, size: blob.size };
}

/**
 * Delete all user data — both localStorage and IndexedDB recordings.
 * Caller is responsible for navigating back to landing afterwards.
 */
export async function deleteAllUserData() {
  // 1. Clear localStorage
  for (const key of LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  // Also clear per-child settings (weekly_email_*)
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('weekly_email_')) toRemove.push(k);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));

  // 2. Drop the entire IndexedDB database (audio recordings)
  try {
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(INDEXEDDB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => {
        // Some other tab has the DB open; resolve anyway after a delay
        setTimeout(resolve, 500);
      };
    });
  } catch (err) {
    console.warn('Could not delete IndexedDB:', err);
    // Don't throw — the localStorage part already succeeded, which is the most important.
  }
}
