import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, Mic, MicOff, Volume2, Star, Flame, Pause, Play,
  ChevronRight, Sparkles, RotateCcw, Lightbulb,
  CheckCircle2, AlertCircle, AlertTriangle, Radio, Coffee, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import { getStoryById, countWords } from '../data/stories';
import { saveRecording } from '../lib/audioStorage';
import { canReadStory, canAccessChild } from '../lib/subscription';
import { trackReadingCompleted } from '../lib/analytics';
import { detectDevice } from '../lib/deviceDetect';
import DeviceWarning from '../components/DeviceWarning';

// ============================================
// FEEDBACK MESSAGES
// ============================================

const ENCOURAGEMENTS = [
  { text: "וואו, יפה מאוד!", emoji: "✨" },
  { text: "קצב מצוין!", emoji: "🚀" },
  { text: "מדהים!", emoji: "💫" },
  { text: "המשיכי כך!", emoji: "🌟" },
  { text: "פנטסטי!", emoji: "🎯" },
];

const HARD_WORD_PRAISE = [
  { text: 'וואו! קראת את "{word}" מצוין!', emoji: "🌟" },
  { text: 'איזו מילה קשה כבשת! "{word}"', emoji: "💪" },
];

// ============================================
// HEBREW NORMALIZATION
// ============================================

const stripNiqqud = (str) => str.replace(/[\u0591-\u05C7]/g, '');

const normalize = (str) => {
  return stripNiqqud(str)
    .replace(/[״"'.,!?;:()\[\]{}]/g, '')
    .replace(/[\u05BE\u05F3\u05F4]/g, '')
    .trim()
    .toLowerCase();
};

const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

const matchScore = (heard, expected) => {
  const h = normalize(heard);
  const e = normalize(expected);
  if (!h || !e) return 99;
  if (h === e) return 0;
  if (h.includes(e) || e.includes(h)) return 0.5;
  const dist = levenshtein(h, e);
  return dist / Math.max(h.length, e.length);
};

const classifyMatch = (heard, expected, alternates = []) => {
  const score = matchScore(heard, expected);
  if (score === 0) return 'perfect';
  if (score <= 0.5) return 'close';
  for (const alt of alternates) {
    if (matchScore(heard, alt) <= 0.5) return 'close';
  }
  if (score <= 0.4) return 'phonetic';
  return 'wrong';
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function Reading({ onNavigate, childId, storyId }) {
  const { getChild, getChildren, addSession, getCustomStory } = useAuth();
  const child = getChild(childId);
  // Find story in either built-in library or user's custom stories
  const story = getStoryById(storyId) || getCustomStory(storyId);

  // Subscription gate: restricted_free users can only read FREE_STORY_ID
  // with their first-created child.
  useEffect(() => {
    if (!child || !story) return;
    if (!canAccessChild(childId, getChildren())) {
      onNavigate('paywall', { reason: 'extra_child' });
      return;
    }
    if (!canReadStory(storyId)) {
      onNavigate('paywall', { reason: 'extra_story', storyId });
    }
  }, [childId, storyId, child, story, onNavigate, getChildren]);

  // Build flat word list from story
  const FLAT_WORDS = React.useMemo(() => {
    if (!story) return [];
    const flat = [];
    story.paragraphs.forEach((para, pIdx) => {
      para.words.forEach((word, wIdx) => {
        flat.push({ ...word, pIdx, wIdx, flatIdx: flat.length });
      });
    });
    return flat;
  }, [story]);

  const TOTAL_WORDS = React.useMemo(() => FLAT_WORDS.filter(w => !w.isPunct).length, [FLAT_WORDS]);

  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [wordStates, setWordStates] = useState(() => FLAT_WORDS.map(() => 'pending'));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [errorBubble, setErrorBubble] = useState(null);
  const [coachMessage, setCoachMessage] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [points, setPoints] = useState(0);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [micPermission, setMicPermission] = useState('unknown');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState([]);
  const [hints, setHints] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);
  const [tickTime, setTickTime] = useState(Date.now());
  const [emotionalState, setEmotionalState] = useState('focused');
  const [sessionSaved, setSessionSaved] = useState(false);

  // Refs
  const recognitionRef = useRef(null);
  const currentIdxRef = useRef(0);
  const wordStatesRef = useRef(wordStates);
  const audioContextRef = useRef(null);
  const audioStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const processedTranscriptsRef = useRef(new Set());
  const lastWordTimeRef = useRef(Date.now());
  const isRecordingRef = useRef(false);

  // Audio recording (saved to IndexedDB at session end)
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(null);

  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { wordStatesRef.current = wordStates; }, [wordStates]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  // Tick for live time
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => setTickTime(Date.now()), 250);
    return () => clearInterval(id);
  }, [isRecording]);

  const elapsedSeconds = startTime ? Math.max(1, (tickTime - startTime) / 1000) : 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const correctWords = completedWords - errors.length;
  const wcpm = elapsedMinutes > 0.05 ? Math.round(correctWords / elapsedMinutes) : 0;
  const accuracy = completedWords > 0 ? Math.round((correctWords / completedWords) * 100) : 100;

  // Browser check
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setBrowserSupported(false);
  }, []);

  // Initialize starting index past leading punctuation
  useEffect(() => {
    let idx = 0;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) idx++;
    setCurrentIdx(idx);
  }, [FLAT_WORDS]);

  // ============================================
  // AUDIO LEVEL MONITORING + RECORDING
  // ============================================
  const startAudioLevelMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(Math.min(100, (avg / 128) * 100));
        if (isRecordingRef.current) requestAnimationFrame(updateLevel);
      };
      updateLevel();
      setMicPermission('granted');

      // ============================================
      // START AUDIO RECORDING (saved to IndexedDB at session end)
      // ============================================
      // We reuse the same stream that's already being analyzed for levels —
      // no need to call getUserMedia again. MediaRecorder produces webm/opus
      // on most platforms — but iOS Safari only supports MP4/AAC, and
      // claims to support "audio/webm" via isTypeSupported() while actually
      // failing to record into it. This is the #1 cause of "no recording on
      // iPhone/iPad" — and it's exactly what we're guarding against here.
      try {
        audioChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();

        // MediaRecorder simply doesn't exist on very old iOS Safari (<14.3).
        // We surface this loudly to the parent rather than silently failing.
        if (typeof MediaRecorder === 'undefined') {
          throw new Error('MEDIARECORDER_UNAVAILABLE');
        }

        // Detect iOS to put MP4 first (the only codec it can actually record into).
        // Don't trust isTypeSupported alone on iOS — it lies for webm.
        const ua = navigator.userAgent || '';
        const isIOS = /iPad|iPhone|iPod/.test(ua) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad pretending to be macOS
        const isAndroid = /Android/.test(ua);

        // Order matters here. We try the most-likely-to-work format first per platform.
        const mimeOptions = isIOS
          ? ['audio/mp4', 'audio/aac', 'audio/mp4;codecs=mp4a.40.2', '']
          : isAndroid
          ? ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', '']
          : ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4', ''];

        // Empty string = "let the browser choose" — last-resort fallback.
        const mimeType = mimeOptions.find(m =>
          m === '' || MediaRecorder.isTypeSupported(m)
        );

        // mimeType could be '' (browser default) — that's fine, just pass undefined
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        // Loud error surfacing: if onerror fires, the recording is dead. Tell the user.
        recorder.onerror = (e) => {
          console.error('MediaRecorder error:', e);
          setErrorMessage('המכשיר לא הצליח להתחיל הקלטה. נסה דפדפן אחר או בדוק את הרשאות המיקרופון.');
        };

        // start(timeslice) emits a chunk every timeslice ms. iOS Safari is
        // picky here: passing too-small a timeslice causes silent failure.
        // 1000ms is safe everywhere.
        recorder.start(1000);
        mediaRecorderRef.current = recorder;

        // Sanity check: after 1.5 seconds, verify we've actually gotten data.
        // If chunks is still empty, something is wrong silently — tell the user.
        setTimeout(() => {
          if (mediaRecorderRef.current === recorder && audioChunksRef.current.length === 0) {
            console.warn('No audio chunks received after 1.5s — recording is likely broken');
            // Don't blow up the speech-recognition flow; just inform the parent
            // so they can investigate (and the recording won't silently appear missing).
            setErrorMessage('הקלטה לא נשמרת. ייתכן שהדפדפן הזה לא תומך — נסה Chrome או Safari עדכני.');
          }
        }, 1500);
      } catch (recordErr) {
        // Recording failure is non-fatal for speech recognition, but the
        // PARENT must know. The previous version logged silently — that's
        // exactly the bug we got reported on iPhone/iPad.
        console.error('Could not start audio recording:', recordErr);
        mediaRecorderRef.current = null;
        if (recordErr.message === 'MEDIARECORDER_UNAVAILABLE') {
          setErrorMessage('הדפדפן הזה לא תומך בהקלטת אודיו. נסה Chrome או Safari עדכני (iOS 14.3+).');
        } else {
          setErrorMessage('לא ניתן להתחיל הקלטה במכשיר הזה. הקריאה תעבוד אבל ההקלטה לא תישמר.');
        }
      }

      return true;
    } catch (err) {
      setMicPermission('denied');
      setErrorMessage('הדפדפן לא הצליח לגשת למיקרופון.');
      return false;
    }
  };

  // Stop the recorder and resolve with the final Blob (or null if no data).
  // We have to wait for one last `dataavailable` event after calling stop().
  const finalizeRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      const handleStop = () => {
        const chunks = audioChunksRef.current;
        if (!chunks || chunks.length === 0) {
          resolve(null);
          return;
        }
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: mimeType });
        const duration = recordingStartTimeRef.current
          ? (Date.now() - recordingStartTimeRef.current) / 1000
          : 0;
        resolve({ blob, duration });
      };

      recorder.addEventListener('stop', handleStop, { once: true });
      try {
        recorder.stop();
      } catch (err) {
        // Already stopped or invalid state
        resolve(null);
      }
    });
  };

  const stopAudioMonitoring = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(t => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  };

  const requestMicPermissionOnly = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicPermission('granted');
      return true;
    } catch (err) {
      setMicPermission('denied');
      setErrorMessage('הדפדפן לא הצליח לגשת למיקרופון.');
      return false;
    }
  };

  const handleStartApp = async () => {
    setIsRequestingMic(true);
    await requestMicPermissionOnly();
    setIsRequestingMic(false);
    setHasStarted(true);
  };

  // ============================================
  // PROCESS HEARD WORD
  // ============================================
  const processWord = useCallback((heardWord) => {
    let idx = currentIdxRef.current;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) idx++;
    if (idx >= FLAT_WORDS.length) return;

    const candidates = [
      { word: FLAT_WORDS[idx], idx, distance: 0 },
      idx + 1 < FLAT_WORDS.length && !FLAT_WORDS[idx + 1].isPunct ? { word: FLAT_WORDS[idx + 1], idx: idx + 1, distance: 1 } : null,
      idx + 2 < FLAT_WORDS.length && !FLAT_WORDS[idx + 2].isPunct ? { word: FLAT_WORDS[idx + 2], idx: idx + 2, distance: 2 } : null,
    ].filter(Boolean);

    let bestMatch = null;
    let bestScore = 99;
    for (const cand of candidates) {
      const matchType = classifyMatch(heardWord, cand.word.plain, cand.word.alternates);
      const score = matchScore(heardWord, cand.word.plain);
      if (score < bestScore) {
        bestScore = score;
        bestMatch = { ...cand, matchType };
      }
    }

    if (!bestMatch || bestMatch.matchType === 'wrong') return;

    setWordStates(prev => {
      const ns = [...prev];
      for (let i = idx; i < bestMatch.idx; i++) {
        if (!FLAT_WORDS[i].isPunct && ns[i] === 'pending') ns[i] = 'skipped';
      }
      if (bestMatch.matchType === 'perfect' || bestMatch.matchType === 'close') {
        ns[bestMatch.idx] = 'correct';
      } else if (bestMatch.matchType === 'phonetic') {
        ns[bestMatch.idx] = 'phonetic-error';
      }
      return ns;
    });

    if (bestMatch.distance > 0) {
      for (let i = idx; i < bestMatch.idx; i++) {
        if (!FLAT_WORDS[i].isPunct) {
          setErrors(e => [...e, { type: 'skipped', word: FLAT_WORDS[i].plain, timestamp: Date.now() }]);
          setCompletedWords(c => c + 1);
        }
      }
    }

    setCompletedWords(c => c + 1);

    if (bestMatch.matchType === 'perfect' || bestMatch.matchType === 'close') {
      setPoints(p => p + 1);
      lastWordTimeRef.current = Date.now();

      const expectedWord = FLAT_WORDS[idx];
      if (expectedWord.isHard && Math.random() < 0.7) {
        const praise = HARD_WORD_PRAISE[Math.floor(Math.random() * HARD_WORD_PRAISE.length)];
        setFeedback({
          text: praise.text.replace('{word}', bestMatch.word.text),
          emoji: praise.emoji,
        });
        setPoints(p => p + 2);
        setTimeout(() => setFeedback(null), 2200);
      } else if (Math.random() < 0.15) {
        const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setFeedback(enc);
        setTimeout(() => setFeedback(null), 1400);
      }
    } else if (bestMatch.matchType === 'phonetic') {
      setErrors(e => [...e, { type: 'phonetic', word: bestMatch.word.plain, heard: heardWord, timestamp: Date.now() }]);
      setErrorBubble({
        idx: bestMatch.idx,
        type: 'החלפה פונטית',
        expected: bestMatch.word.text,
        heard: heardWord,
      });
      setTimeout(() => setErrorBubble(null), 3500);
    }

    let newIdx = bestMatch.idx + 1;
    while (newIdx < FLAT_WORDS.length && FLAT_WORDS[newIdx].isPunct) newIdx++;
    setCurrentIdx(newIdx);

    if (newIdx >= FLAT_WORDS.length) {
      setTimeout(() => {
        stopRecording();
        setShowComplete(true);
        setPoints(p => p + 25);
      }, 800);
    }
  }, [FLAT_WORDS]);

  // Save session + audio when complete
  useEffect(() => {
    if (showComplete && !sessionSaved && completedWords > 0) {
      const sessionData = {
        child_id: childId,
        story_id: storyId,
        story_title: story?.title || 'סיפור',
        wcpm,
        accuracy,
        total_words: TOTAL_WORDS,
        correct_words: correctWords,
        errors_count: errors.length,
        hints_used: hints,
        duration_seconds: Math.round(elapsedSeconds),
        completed: true,
        errors_detail: errors.map(e => ({ type: e.type, word: e.word, heard: e.heard })),
      };
      // addSession returns the row; we use its id to link the audio blob.
      Promise.resolve(addSession(sessionData)).then(async (savedSession) => {
        // The mock auth returns { data, error } in v0.2+; older returns the row directly.
        const sessionRow = savedSession?.data || savedSession;
        const sessionId = sessionRow?.id || `session-${Date.now()}`;

        // Track analytics — fire-and-forget, no PII
        trackReadingCompleted({
          storyId,
          storyTitle: story?.title,
          wcpm,
          accuracy,
          durationSeconds: Math.round(elapsedSeconds),
          level: story?.level,
        });

        // Finalize the recording and save to IndexedDB. Non-blocking: even if this
        // fails, the session metrics are already persisted.
        try {
          const result = await finalizeRecording();
          if (result && result.blob && result.blob.size > 0) {
            await saveRecording({
              blob: result.blob,
              sessionId,
              childId,
              storyId,
              storyTitle: story?.title || 'סיפור',
              duration: result.duration || elapsedSeconds,
            });
          }
        } catch (err) {
          console.warn('Could not save recording:', err);
        }
      });
      setSessionSaved(true);
    }
  }, [showComplete, sessionSaved, completedWords, wcpm, accuracy, TOTAL_WORDS, correctWords, errors, hints, elapsedSeconds, childId, storyId, story, addSession]);

  // Stuck detection
  useEffect(() => {
    if (!isRecording) return;
    const checkStuck = setInterval(() => {
      if (Date.now() - lastWordTimeRef.current > 5000) {
        const idx = currentIdxRef.current;
        if (idx < FLAT_WORDS.length && wordStatesRef.current[idx] === 'pending' && !FLAT_WORDS[idx].isPunct) {
          setWordStates(prev => {
            const ns = [...prev];
            if (ns[idx] === 'pending') ns[idx] = 'stuck';
            return ns;
          });
          if (!showHint) {
            setShowHint({ idx });
            setHints(h => h + 1);
          }
        }
      }
    }, 1000);
    return () => clearInterval(checkStuck);
  }, [isRecording, showHint, FLAT_WORDS]);

  // Hide hint on word change
  useEffect(() => {
    if (showHint && showHint.idx !== currentIdx) {
      setShowHint(null);
      setWordStates(prev => {
        const ns = [...prev];
        if (ns[showHint.idx] === 'stuck') ns[showHint.idx] = 'correct';
        return ns;
      });
    }
  }, [currentIdx, showHint]);

  // Emotional state
  useEffect(() => {
    if (!isRecording) return;
    const check = setInterval(() => {
      const recentErrors = errors.filter(e => Date.now() - e.timestamp < 15000).length;
      if (recentErrors >= 3) setEmotionalState('frustrated');
      else if (completedWords > 15 && (errors.length / completedWords) < 0.05) setEmotionalState('thriving');
      else setEmotionalState('focused');
    }, 4000);
    return () => clearInterval(check);
  }, [isRecording, errors, completedWords]);

  // ============================================
  // SPEECH RECOGNITION
  // ============================================
  const startRecording = async () => {
    if (!browserSupported) return;
    setErrorMessage(null);
    const ok = await startAudioLevelMonitoring();
    if (!ok) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    // Match speech recognition to the story's language, not the UI language.
    // A child reading a Hebrew story should always be recognized in he-IL,
    // even if the parent set the UI to English (and vice versa).
    recognition.lang = story?.language === 'en' ? 'en-US' : 'he-IL';

    // Android Chrome handles continuous mode poorly — it often returns no
    // results at all when continuous:true. We use non-continuous + restart loop.
    // Desktop and iOS handle continuous fine.
    const device = detectDevice();
    const useContinuous = !device.isAndroid;
    recognition.continuous = useContinuous;

    // Interim results: also unreliable on Android. We turn them off there.
    // On desktop they give nice live highlight feedback.
    recognition.interimResults = !device.isAndroid;
    recognition.maxAlternatives = 3;

    // Track how many results we've received — if zero after 5 seconds of
    // active recording, we surface a warning. This is the SILENT FAILURE
    // case that the user reported.
    let resultsReceivedCount = 0;
    const startedAt = Date.now();

    recognition.onresult = (event) => {
      resultsReceivedCount++;
      let interim = '';
      let finals = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finals.push({ text: transcript, idx: i });
        else interim += transcript;
      }
      setInterimTranscript(interim);

      finals.forEach(f => {
        const key = `${f.idx}-${f.text}`;
        if (processedTranscriptsRef.current.has(key)) return;
        processedTranscriptsRef.current.add(key);
        setLastFinalTranscript(f.text);
        const words = f.text.trim().split(/\s+/);
        words.forEach((w, i) => {
          if (w.length > 0) setTimeout(() => processWord(w), i * 100);
        });
      });
    };

    recognition.onerror = (event) => {
      // 'no-speech' is fine — recognition timed out waiting for sound.
      // We restart in onend.
      if (event.error === 'no-speech' || event.error === 'aborted') return;

      // Fatal errors: stop recording and surface a message.
      // We set both the state and the ref because the ref is what onend
      // checks to decide whether to restart.
      const stopFatally = (msg) => {
        setErrorMessage(msg);
        isRecordingRef.current = false;
        setIsRecording(false);
      };

      if (event.error === 'not-allowed') {
        setMicPermission('denied');
        stopFatally('גישה למיקרופון נחסמה. אפשר אותה בהגדרות הדפדפן.');
      } else if (event.error === 'language-not-supported') {
        const lang = story?.language === 'en' ? 'אנגלית' : 'עברית';
        stopFatally(`הדפדפן לא תומך בזיהוי דיבור ב${lang}. נסה Chrome או Edge עדכניים.`);
      } else if (event.error === 'network') {
        // Network errors on Android are often transient — don't stop, just inform
        setErrorMessage('בעיית רשת בזיהוי הדיבור. בדוק את חיבור האינטרנט.');
      } else if (event.error === 'audio-capture') {
        stopFatally('בעיית גישה למיקרופון. ודא שאף אפליקציה אחרת לא משתמשת במיקרופון.');
      } else {
        console.error('Speech recognition error:', event.error);
        setErrorMessage(`שגיאת זיהוי דיבור: ${event.error}. נסה לרענן את הדף.`);
      }
    };

    // Restart on end — but with backoff on Android to avoid infinite loops
    // when the recognizer is failing immediately.
    let consecutiveImmediateEnds = 0;
    let lastEndAt = 0;
    recognition.onend = () => {
      if (!isRecordingRef.current) return;

      const now = Date.now();
      const timeSinceLastEnd = now - lastEndAt;
      lastEndAt = now;

      // If onend keeps firing back-to-back (<300ms gap), the recognizer
      // is failing to start. After 3 such fast-fails, give up and warn.
      if (timeSinceLastEnd < 300) {
        consecutiveImmediateEnds++;
      } else {
        consecutiveImmediateEnds = 0;
      }

      if (consecutiveImmediateEnds >= 3) {
        setErrorMessage('זיהוי הדיבור נכשל בדפדפן הזה. נסה Chrome במחשב, או Safari ב-iPhone.');
        isRecordingRef.current = false;
        setIsRecording(false);
        return;
      }

      // Restart with a small delay (helps Android stability)
      try {
        if (device.isAndroid) {
          setTimeout(() => {
            if (isRecordingRef.current && recognitionRef.current === recognition) {
              try { recognition.start(); } catch (e) {}
            }
          }, 100);
        } else {
          recognition.start();
        }
      } catch (e) {
        // start() throws if recognition is already running — that's OK
      }
    };

    recognitionRef.current = recognition;
    processedTranscriptsRef.current = new Set();

    try {
      recognition.start();
      setIsRecording(true);
      if (!startTime) setStartTime(Date.now());
      lastWordTimeRef.current = Date.now();

      // SAFETY NET: if no results after 6 seconds and the user is actively
      // recording, something is silently broken. Surface a clear message
      // with a fix path. This is the bug the user reported on Android.
      setTimeout(() => {
        if (
          recognitionRef.current === recognition &&
          isRecordingRef.current &&
          resultsReceivedCount === 0
        ) {
          setErrorMessage(
            device.isAndroid
              ? 'זיהוי הדיבור לא מצליח לעבוד באנדרואיד. מומלץ לפתוח את האפליקציה במחשב נייח.'
              : 'זיהוי הדיבור לא מקבל תוצאות. ודא שאתה מדבר לתוך המיקרופון ושיש חיבור אינטרנט.'
          );
        }
      }, 6000);
    } catch (err) {
      setErrorMessage('שגיאה בהפעלת זיהוי הדיבור. נסה לרענן את הדף.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      isRecordingRef.current = false;
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    stopAudioMonitoring();
    setInterimTranscript('');
  };

  // Discards the in-progress recording without saving it.
  // Used when the user resets or navigates away mid-reading.
  const discardRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try { recorder.stop(); } catch (e) {}
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    recordingStartTimeRef.current = null;
  };

  const resetReading = () => {
    discardRecording();
    stopRecording();
    setWordStates(FLAT_WORDS.map(() => 'pending'));
    let idx = 0;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) idx++;
    setCurrentIdx(idx);
    setShowHint(null);
    setFeedback(null);
    setErrorBubble(null);
    setShowComplete(false);
    setSessionSaved(false);
    setStartTime(null);
    setErrors([]);
    setHints(0);
    setCompletedWords(0);
    setPoints(0);
    setInterimTranscript('');
    setLastFinalTranscript('');
    setErrorMessage(null);
    processedTranscriptsRef.current = new Set();
  };

  useEffect(() => () => { discardRecording(); stopRecording(); }, []);

  // ============================================
  // STYLES
  // ============================================
  const wordClass = (state, isCurrent, isPunct) => {
    if (isPunct) return { color: colors.navy };
    const base = {
      padding: '4px 8px',
      borderRadius: '10px',
      margin: '0 2px',
      display: 'inline-block',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
    };
    if (state === 'correct') return { ...base, backgroundColor: colors.green, color: colors.cream, fontWeight: 600 };
    if (state === 'phonetic-error') return { ...base, backgroundColor: colors.rustLight, color: colors.rust, fontWeight: 600 };
    if (state === 'skipped') return { ...base, backgroundColor: colors.creamDark, color: colors.textMuted, textDecoration: 'line-through' };
    if (state === 'stuck') return { ...base, backgroundColor: colors.sun, color: colors.navy, animation: 'pulse-stuck 1.2s infinite', fontWeight: 700 };
    if (isCurrent) return { ...base, backgroundColor: '#FFF8E1', color: colors.navy, boxShadow: `0 0 0 2px ${colors.sun}`, fontWeight: 700 };
    return { ...base, color: colors.navy };
  };

  const totalProgress = (completedWords / TOTAL_WORDS) * 100;
  const emotionalColor = { focused: colors.navy, thriving: colors.green, frustrated: colors.rust }[emotionalState];
  const emotionalLabel = { focused: 'ממוקדת', thriving: 'בשיא', frustrated: 'מתאמצת' }[emotionalState];
  const emotionalIcon = {
    focused: <CheckCircle2 className="w-4 h-4" />,
    thriving: <Zap className="w-4 h-4" />,
    frustrated: <AlertCircle className="w-4 h-4" />
  }[emotionalState];

  // Guards
  if (!story || !child) {
    return (
      <div dir="rtl" style={{ backgroundColor: colors.cream, minHeight: '100vh' }} className="flex items-center justify-center p-6">
        <div className="text-center">
          <p style={{ color: colors.textSecondary }}>סיפור או פרופיל לא נמצא</p>
          <button onClick={() => onNavigate('home')} className="mt-4 px-6 py-2 rounded-full" style={{ backgroundColor: colors.navy, color: colors.sun }}>חזרה לבית</button>
        </div>
      </div>
    );
  }

  if (!browserSupported) {
    return (
      <div dir="rtl" style={{ backgroundColor: colors.cream, fontFamily: fonts.body, minHeight: '100vh' }} className="flex items-center justify-center p-6">
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <div className="max-w-lg rounded-3xl p-10 text-center" style={{ backgroundColor: colors.creamLight, border: `2px solid ${colors.rust}` }}>
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: colors.rust }} />
          <h1 className="text-3xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>הדפדפן לא תומך</h1>
          <p className="text-base mb-4" style={{ color: colors.textSecondary }}>
            זיהוי הדיבור דורש Chrome או Edge.
          </p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (!hasStarted) {
    return (
      <div dir="rtl" style={{ backgroundColor: colors.cream, fontFamily: fonts.body, minHeight: '100vh' }} className="flex items-center justify-center p-6 relative overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse-mic { 0%, 100% { box-shadow: 0 0 0 0 rgba(196, 69, 54, 0.4); transform: scale(1); } 50% { box-shadow: 0 0 0 24px rgba(196, 69, 54, 0); transform: scale(1.05); } }
          @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .pulse-mic { animation: pulse-mic 2s ease-in-out infinite; }
          .float-slow { animation: float-slow 4s ease-in-out infinite; }
          .fade-in { animation: fade-in 0.6s ease-out backwards; }
        `}</style>

        <div className="absolute top-[10%] right-[8%] text-6xl opacity-30 float-slow">📚</div>
        <div className="absolute bottom-[15%] left-[10%] text-5xl opacity-30 float-slow" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${colors.sun} 0%, transparent 70%)` }} />

        <div className="relative max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-8 fade-in" style={{ backgroundColor: colors.sunLight, fontSize: '64px' }}>
            {child.avatar_emoji}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 fade-in" style={{ color: colors.navy, fontFamily: fonts.display, animationDelay: '0.2s' }}>
            שלום {child.name}!
          </h1>
          <p className="text-xl mb-3 fade-in" style={{ color: colors.textSecondary, animationDelay: '0.3s' }}>
            הסיפור היום: <span className="font-bold" style={{ color: colors.navy }}>{story.title}</span>
          </p>
          <p className="text-sm mb-12 fade-in" style={{ color: colors.textSecondary, animationDelay: '0.35s' }}>
            {TOTAL_WORDS} מילים • ~{story.estimatedMinutes} דק׳ קריאה
          </p>

          <div className="rounded-3xl p-8 mb-8 fade-in" style={{ backgroundColor: colors.creamLight, border: `2px solid ${colors.border}`, animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 pulse-mic" style={{ backgroundColor: colors.rust }}>
                <Mic className="w-8 h-8" style={{ color: colors.cream }} />
              </div>
              <div className="text-right flex-1">
                <div className="text-sm font-bold mb-1" style={{ color: colors.rust }}>שלב ראשון</div>
                <div className="text-xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>צריכה את המיקרופון</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-right" style={{ color: colors.textSecondary }}>
              כשתקראי את הסיפור בקול, אני אקשיב לך, אעודד אותך, ואעזור לך כשמילה תהיה קשה.
            </p>
            <div className="mt-4 pt-4 text-xs text-right" style={{ borderTop: `1px solid ${colors.border}`, color: colors.textMuted }}>
              💡 ההורה יוכל להאזין להקלטות מאוחר יותר בדשבורד. ההקלטות נשמרות במחשב שלך בלבד.
            </div>
          </div>

          <button onClick={handleStartApp} disabled={isRequestingMic} className="group inline-flex items-center gap-4 px-12 py-6 rounded-full text-xl font-black transition hover:scale-105 shadow-2xl disabled:opacity-50" style={{ backgroundColor: colors.green, color: colors.cream }}>
            {isRequestingMic ? <><div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px', borderTopColor: 'transparent' }}/>מבקשת גישה...</> : <><Mic className="w-6 h-6"/>בואי נתחיל!</>}
          </button>
        </div>
      </div>
    );
  }

  // Main reading UI
  return (
    <div dir="rtl" style={{ backgroundColor: colors.cream, fontFamily: fonts.body, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse-stuck { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,165,36,0.7); } 50% { transform: scale(1.08); box-shadow: 0 0 0 12px rgba(245,165,36,0); } }
        @keyframes slide-up { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes mic-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(196, 69, 54, 0.6); } 50% { box-shadow: 0 0 0 12px rgba(196, 69, 54, 0); } }
        @keyframes recording-dot { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .anim-slide-up { animation: slide-up 0.5s ease-out; }
        .anim-pop { animation: pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .mic-recording { animation: mic-pulse 1.5s infinite; }
        .recording-dot { animation: recording-dot 1s infinite; }
      `}</style>

      {/* Complete overlay */}
      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(26, 43, 74, 0.85)', backdropFilter: 'blur(8px)' }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', top: '-20px', left: `${Math.random() * 100}%`, width: '12px', height: '12px', backgroundColor: [colors.sun, colors.rust, colors.green, colors.sunLight][i % 4], borderRadius: i % 2 === 0 ? '50%' : '2px', animation: `confetti ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s infinite` }} />
          ))}
          <div className="relative max-w-2xl mx-4 rounded-3xl p-12 text-center anim-pop" style={{ backgroundColor: colors.cream, boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
            <div className="text-8xl mb-4 anim-float">🎉</div>
            <h2 className="text-6xl font-black mb-3" style={{ color: colors.navy, fontFamily: fonts.display }}>סִיַּמְתְּ!</h2>
            <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>קראת סיפור שלם של {TOTAL_WORDS} מילים!</p>
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((s, i) => (
                <Star key={i} className={`fill-current ${i === 1 ? 'w-20 h-20' : 'w-14 h-14'}`} style={{ color: colors.sun }}/>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.sunLight }}>
                <div className="text-3xl font-black" style={{ color: colors.navy }}>{wcpm}</div>
                <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>WCPM</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.greenLight }}>
                <div className="text-3xl font-black" style={{ color: '#5A8A4A' }}>{accuracy}%</div>
                <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>דיוק</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: colors.rustLight }}>
                <div className="text-3xl font-black" style={{ color: colors.rust }}>+{points + 25}</div>
                <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>נקודות</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#E0E5F0' }}>
                <div className="text-3xl font-black" style={{ color: colors.navy }}>{Math.floor(elapsedSeconds / 60)}:{String(Math.floor(elapsedSeconds) % 60).padStart(2, '0')}</div>
                <div className="text-xs font-bold" style={{ color: colors.textSecondary }}>זמן</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={resetReading} className="px-6 py-3 rounded-full font-bold transition hover:scale-105" style={{ backgroundColor: colors.navy, color: colors.sun }}>
                <RotateCcw className="w-4 h-4 inline ml-2"/>קראי שוב
              </button>
              <button onClick={() => onNavigate('story-library')} className="px-6 py-3 rounded-full font-bold transition hover:scale-105" style={{ backgroundColor: colors.green, color: colors.cream }}>
                <BookOpen className="w-4 h-4 inline ml-2"/>סיפור אחר
              </button>
              <button onClick={() => onNavigate('dashboard')} className="px-6 py-3 rounded-full font-bold transition hover:scale-105" style={{ backgroundColor: colors.rust, color: colors.cream }}>
                ראה התקדמות 📊
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 239, 0.92)', borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={() => { stopRecording(); onNavigate('story-library'); }} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition hover:bg-black/5" style={{ color: colors.navy }}>
            <ChevronRight className="w-4 h-4" />חזרה
          </button>
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.rust }}>
                <div className="w-2 h-2 rounded-full bg-white recording-dot"/>
                <span className="text-xs font-bold" style={{ color: colors.cream }}>REC</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: emotionalColor + '15', color: emotionalColor }}>
              {emotionalIcon}{emotionalLabel}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: colors.navy }}>
              <Star className="w-4 h-4 fill-current" style={{ color: colors.sun }}/>
              <span className="text-sm font-bold" style={{ color: colors.cream }}>{points}</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: colors.sunLight }}>
              {child.avatar_emoji}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
            <div className="h-full transition-all duration-500" style={{ width: `${totalProgress}%`, background: `linear-gradient(90deg, ${colors.sun}, ${colors.rust})` }}/>
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: colors.textSecondary }}>
            <span className="font-bold">{completedWords} / {TOTAL_WORDS} מילים</span>
            <span>{story.title}</span>
          </div>
        </div>
      </header>

      {errorMessage && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 rounded-2xl flex items-start gap-3 anim-slide-up" style={{ backgroundColor: colors.rustLight, border: `1px solid ${colors.rust}` }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.rust }}/>
            <div className="text-sm flex-1" style={{ color: colors.navy }}>{errorMessage}</div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Device warning - shows for Android/Firefox where speech recognition is unreliable */}
        <DeviceWarning context="reading" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 relative">
          <div className="rounded-3xl p-5 mb-4 flex items-center gap-4" style={{ backgroundColor: colors.sunLight }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: colors.cream }}>
              {story.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold mb-0.5" style={{ color: colors.rust }}>סיפור מותאם ל{child.name}</div>
              <h1 className="text-2xl font-black truncate" style={{ color: colors.navy, fontFamily: fonts.display }}>{story.title}</h1>
            </div>
          </div>

          <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden mb-32 lg:mb-40" style={{ backgroundColor: colors.creamLight, border: `2px solid ${colors.border}`, minHeight: '500px' }}>
            <div className="relative z-10 text-2xl md:text-[1.6rem] leading-[2.6] font-medium" style={{ color: colors.navy, fontFamily: fonts.display }}>
              {story.paragraphs.map((para, pIdx) => {
                const paraStartIdx = FLAT_WORDS.findIndex(w => w.pIdx === pIdx);
                return (
                  <div key={pIdx} className="mb-6 relative">
                    <span className="absolute -right-12 top-0 text-3xl opacity-50 anim-float" style={{ animationDelay: `${pIdx * 0.3}s` }}>{para.illustration}</span>
                    <p>
                      {para.words.map((word, wIdx) => {
                        const flatIdx = paraStartIdx + wIdx;
                        const state = wordStates[flatIdx];
                        const isCurrent = currentIdx === flatIdx && isRecording;
                        return (
                          <span key={wIdx} style={wordClass(state, isCurrent, word.isPunct)}>{word.text}</span>
                        );
                      })}
                    </p>
                    {errorBubble && FLAT_WORDS[errorBubble.idx] && FLAT_WORDS[errorBubble.idx].pIdx === pIdx && (
                      <div className="mt-3 inline-flex items-start gap-3 p-3 rounded-2xl anim-slide-up" style={{ backgroundColor: colors.rustLight, border: `1px solid ${colors.rust}` }}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.rust }}/>
                        <div className="text-sm">
                          <div className="font-bold" style={{ color: colors.rust }}>{errorBubble.type}</div>
                          <div style={{ color: colors.navy }}>הציפי: <span className="font-bold">"{errorBubble.expected}"</span> • שמעתי: <span className="font-bold">"{errorBubble.heard}"</span></div>
                        </div>
                      </div>
                    )}
                    {showHint && FLAT_WORDS[showHint.idx] && FLAT_WORDS[showHint.idx].pIdx === pIdx && (
                      <div className="mt-3 inline-flex items-center gap-3 p-4 rounded-2xl anim-slide-up shadow-lg" style={{ backgroundColor: colors.sun }}>
                        <Lightbulb className="w-6 h-6" style={{ color: colors.navy }}/>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.navy }}>רמז פונטי:</div>
                          <div className="text-2xl font-black" style={{ color: colors.navy, fontFamily: fonts.display }}>
                            {FLAT_WORDS[showHint.idx].hint}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/*
            STICKY recording controls bar.
            Pinned to the bottom of the viewport so:
              (1) The kid always sees what to do — never has to scroll
              (2) The parent sees mic level + transcript without scrolling away from the text
              (3) On mobile, where viewports are short, this is critical
            The mb-24/lg:mb-32 above provides space so the bar doesn't cover the last paragraph.
          */}
        </div>

        <aside className="lg:col-span-4 space-y-4 mb-32 lg:mb-40">
          <div className="rounded-3xl p-5" style={{ backgroundColor: colors.navy, color: colors.cream }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isRecording ? colors.green : colors.textMuted }}/>
                <span className="text-xs font-bold">{isRecording ? 'LIVE' : 'OFF'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-4xl font-black" style={{ fontFamily: fonts.display }}>{wcpm}</div>
                <div className="text-[10px]" style={{ color: colors.textMuted }}>WCPM</div>
              </div>
              <div>
                <div className="text-4xl font-black" style={{ color: colors.green, fontFamily: fonts.display }}>{accuracy}%</div>
                <div className="text-[10px]" style={{ color: colors.textMuted }}>דיוק</div>
              </div>
              <div>
                <div className="text-2xl font-black">{Math.floor(elapsedSeconds / 60)}:{String(Math.floor(elapsedSeconds) % 60).padStart(2, '0')}</div>
                <div className="text-[10px]" style={{ color: colors.textMuted }}>זמן</div>
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: colors.sun }}>{errors.length}</div>
                <div className="text-[10px]" style={{ color: colors.textMuted }}>טעויות</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-5" style={{ backgroundColor: colors.sunLight }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.sun }}>
                <Volume2 className="w-5 h-5" style={{ color: colors.navy }}/>
              </div>
              <div>
                <div className="text-sm font-black" style={{ color: colors.navy }}>מאיה החברה</div>
                <div className="text-[10px]" style={{ color: colors.textSecondary }}>מאמנת קולית</div>
              </div>
            </div>
            {feedback ? (
              <div className="anim-pop p-3 rounded-2xl flex items-start gap-2" style={{ backgroundColor: colors.navy }}>
                <span className="text-2xl">{feedback.emoji}</span>
                <span className="text-sm font-bold flex-1" style={{ color: colors.sun }}>{feedback.text}</span>
              </div>
            ) : (
              <div className="text-sm italic" style={{ color: colors.textSecondary }}>
                {isRecording ? 'מקשיבה לך...' : 'מוכנה כשתהיי מוכנה!'}
              </div>
            )}
          </div>
        </aside>
        </div>
      </main>

      {/* =============================================================
          STICKY RECORDING BAR — fixed to bottom of viewport
          =============================================================
          The child should NEVER have to scroll to find the record button.
          On mobile especially, the story text is long and the button
          used to be below the fold. This bar solves that:
            - Always visible
            - Big tap target (the green/red mic button)
            - Live mic-level indicator (parent sees if mic is working)
            - Live transcript ("what the browser heard")
          Hidden during the completion overlay so it doesn't compete with
          the celebration confetti.
      */}
      {!showComplete && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30"
          style={{
            backgroundColor: 'rgba(26, 43, 74, 0.97)',
            backdropFilter: 'blur(12px)',
            borderTop: `1px solid rgba(245,165,36,0.3)`,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)', // iOS notch safety
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">

              {/* Transcript / status — visible left side (RTL: right side) */}
              <div className="flex-1 min-w-0">
                {isRecording ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <Radio className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.sun }}/>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        מקשיבה...
                      </span>
                    </div>
                    <div
                      className="text-sm md:text-base truncate"
                      style={{ color: colors.cream, fontFamily: fonts.display, minHeight: '20px' }}
                    >
                      {interimTranscript ? (
                        <span style={{ color: colors.sunLight, opacity: 0.8 }}>{interimTranscript}</span>
                      ) : lastFinalTranscript ? (
                        <span>{lastFinalTranscript}</span>
                      ) : (
                        <span style={{ color: colors.textMuted, fontStyle: 'italic' }}>
                          דברי לתוך המיקרופון...
                        </span>
                      )}
                    </div>
                    {/* Mic level indicator */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div
                          className="h-full transition-all duration-100"
                          style={{
                            width: `${audioLevel}%`,
                            backgroundColor: audioLevel > 60 ? colors.green : audioLevel > 30 ? colors.sun : colors.rust,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: colors.sun }}>
                      מוכן/ה?
                    </div>
                    <div className="text-sm md:text-base" style={{ color: colors.cream, fontFamily: fonts.display }}>
                      לחצי על הכפתור הירוק וקראי את הסיפור
                    </div>
                  </div>
                )}
              </div>

              {/* Reset button — hidden on small screens to save space */}
              <button
                onClick={resetReading}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition hover:scale-105 flex-shrink-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: colors.cream,
                  border: `1px solid rgba(255,255,255,0.2)`,
                }}
                title="התחל מחדש"
              >
                <RotateCcw className="w-3.5 h-3.5"/>
                <span className="hidden md:inline">מחדש</span>
              </button>

              {/* The Big Mic Button — the main action */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={showComplete}
                className={`flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-black transition hover:scale-105 shadow-lg disabled:opacity-50 flex-shrink-0 ${isRecording ? 'mic-recording' : ''}`}
                style={{
                  backgroundColor: isRecording ? colors.rust : colors.green,
                  color: colors.cream,
                }}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 md:w-6 md:h-6"/>
                    <span className="hidden sm:inline">עצור</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 md:w-6 md:h-6"/>
                    <span>התחילי</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
