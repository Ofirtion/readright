import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BookOpen, Mic, MicOff, Volume2, Star, Flame, Pause, Play,
  ChevronRight, Sparkles, Heart, Trophy, Award, Zap,
  RotateCcw, Settings, Lightbulb, ChevronUp, ChevronDown,
  CheckCircle2, AlertCircle, Coffee, AlertTriangle, Radio
} from 'lucide-react';

// ============================================
// FULL STORY (260+ words) — Hebrew with full niqqud
// ============================================

const STORY = {
  title: "דָּנָה וְהֶחָתוּל מֵהֶחָלָל",
  subtitle: "הַרְפַּתְקָה בְּכוֹכָב הַשַּׁעֲשׁוּעִים",
  level: "כיתה ג'",
  emoji: "🐱",
  estimatedMinutes: 4,
  paragraphs: [
    {
      illustration: "🌳",
      text: "בערב אחד, כשדנה שיחקה בגן השעשועים, היא שמעה רעש מוזר.",
      words: [
        { text: "בְּעֶרֶב", plain: "בערב", hint: "בְּ-עֶ-רֶב" },
        { text: "אֶחָד", plain: "אחד", hint: "אֶ-חָד" },
        { text: ",", plain: ",", isPunct: true },
        { text: "כְּשֶׁדָּנָה", plain: "כשדנה", hint: "כְּ-שֶׁ-דָּ-נָה" },
        { text: "שִׂחֲקָה", plain: "שיחקה", hint: "שִׂ-חֲ-קָה" },
        { text: "בְּגַן", plain: "בגן", hint: "בְּ-גַן" },
        { text: "הַשַּׁעֲשׁוּעִים", plain: "השעשועים", hint: "הַ-שַׁ-עֲ-שׁוּ-עִים", isHard: true },
        { text: ",", plain: ",", isPunct: true },
        { text: "הִיא", plain: "היא", hint: "הִיא" },
        { text: "שָׁמְעָה", plain: "שמעה", hint: "שָׁמְ-עָה" },
        { text: "רַעַשׁ", plain: "רעש", hint: "רַ-עַשׁ" },
        { text: "מוּזָר", plain: "מוזר", hint: "מוּ-זָר" },
        { text: ".", plain: ".", isPunct: true }
      ]
    },
    {
      illustration: "✨",
      text: "בין השיחים התגלה חתול קטן, כחול כמו שמיים. עיניו נצצו כמו כוכבים.",
      words: [
        { text: "בֵּין", plain: "בין", hint: "בֵּין" },
        { text: "הַשִּׂיחִים", plain: "השיחים", hint: "הַ-שִׂי-חִים" },
        { text: "הִתְגַּלָּה", plain: "התגלה", hint: "הִתְ-גַּ-לָּה", isHard: true },
        { text: "חָתוּל", plain: "חתול", hint: "חָ-תוּל" },
        { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
        { text: ",", plain: ",", isPunct: true },
        { text: "כָּחוֹל", plain: "כחול", hint: "כָּ-חוֹל" },
        { text: "כְּמוֹ", plain: "כמו", hint: "כְּ-מוֹ" },
        { text: "שָׁמַיִם", plain: "שמיים", hint: "שָׁ-מַ-יִם", alternates: ["שמים"] },
        { text: ".", plain: ".", isPunct: true },
        { text: "עֵינָיו", plain: "עיניו", hint: "עֵי-נָיו" },
        { text: "נָצְצוּ", plain: "נצצו", hint: "נָצְ-צוּ" },
        { text: "כְּמוֹ", plain: "כמו", hint: "כְּ-מוֹ" },
        { text: "כּוֹכָבִים", plain: "כוכבים", hint: "כּוֹ-כָ-בִים", isHard: true },
        { text: ".", plain: ".", isPunct: true }
      ]
    },
    {
      illustration: "💬",
      text: "שלום חתול קטן, לחשה דנה. החתול פתח את פיו, ובמקום מיאו יצאו ממנו מילים!",
      words: [
        { text: "\"שָׁלוֹם", plain: "שלום", hint: "שָׁ-לוֹם" },
        { text: "חָתוּל", plain: "חתול", hint: "חָ-תוּל" },
        { text: "קָטָן\"", plain: "קטן", hint: "קָ-טָן" },
        { text: ",", plain: ",", isPunct: true },
        { text: "לָחֲשָׁה", plain: "לחשה", hint: "לָ-חֲ-שָׁה" },
        { text: "דָּנָה", plain: "דנה", hint: "דָּ-נָה" },
        { text: ".", plain: ".", isPunct: true },
        { text: "הַחָתוּל", plain: "החתול", hint: "הַ-חָ-תוּל" },
        { text: "פָּתַח", plain: "פתח", hint: "פָּ-תַח" },
        { text: "אֶת", plain: "את", hint: "אֶת" },
        { text: "פִּיו", plain: "פיו", hint: "פִּיו" },
        { text: ",", plain: ",", isPunct: true },
        { text: "וּבִמְקוֹם", plain: "ובמקום", hint: "וּ-בִמְ-קוֹם" },
        { text: "מְיָאוּ", plain: "מיאו", hint: "מְ-יָאוּ" },
        { text: "יָצְאוּ", plain: "יצאו", hint: "יָצְ-אוּ" },
        { text: "מִמֶּנּוּ", plain: "ממנו", hint: "מִ-מֶּ-נּוּ", isHard: true },
        { text: "מִלִּים", plain: "מילים", hint: "מִ-לִּים", alternates: ["מלים"] },
        { text: "!", plain: "!", isPunct: true }
      ]
    },
    {
      illustration: "🚀",
      text: "שמי זוזו, אמר החתול. באתי מכוכב רחוק, ואני צריך עזרה. ספינת החלל שלי התקלקלה!",
      words: [
        { text: "\"שְׁמִי", plain: "שמי", hint: "שְׁ-מִי" },
        { text: "זוּזוּ\"", plain: "זוזו", hint: "זוּ-זוּ" },
        { text: ",", plain: ",", isPunct: true },
        { text: "אָמַר", plain: "אמר", hint: "אָ-מַר" },
        { text: "הַחָתוּל", plain: "החתול", hint: "הַ-חָ-תוּל" },
        { text: ".", plain: ".", isPunct: true },
        { text: "\"בָּאתִי", plain: "באתי", hint: "בָּא-תִי" },
        { text: "מִכּוֹכָב", plain: "מכוכב", hint: "מִ-כּוֹ-כָב" },
        { text: "רָחוֹק", plain: "רחוק", hint: "רָ-חוֹק" },
        { text: ",", plain: ",", isPunct: true },
        { text: "וַאֲנִי", plain: "ואני", hint: "וַ-אֲ-נִי" },
        { text: "צָרִיךְ", plain: "צריך", hint: "צָ-רִיךְ" },
        { text: "עֶזְרָה", plain: "עזרה", hint: "עֶזְ-רָה" },
        { text: ".", plain: ".", isPunct: true },
        { text: "סְפִינַת", plain: "ספינת", hint: "סְ-פִי-נַת", isHard: true },
        { text: "הֶחָלָל", plain: "החלל", hint: "הֶ-חָ-לָל" },
        { text: "שֶׁלִּי", plain: "שלי", hint: "שֶׁ-לִּי" },
        { text: "הִתְקַלְקְלָה", plain: "התקלקלה", hint: "הִתְ-קַלְ-קְ-לָה", isHard: true },
        { text: "!\"", plain: "!", isPunct: true }
      ]
    },
    {
      illustration: "🤝",
      text: "דנה לא פחדה. היא אהבה הרפתקאות. בוא איתי, היא אמרה. נמצא פתרון ביחד.",
      words: [
        { text: "דָּנָה", plain: "דנה", hint: "דָּ-נָה" },
        { text: "לֹא", plain: "לא", hint: "לֹא" },
        { text: "פָּחֲדָה", plain: "פחדה", hint: "פָּ-חֲ-דָה" },
        { text: ".", plain: ".", isPunct: true },
        { text: "הִיא", plain: "היא", hint: "הִיא" },
        { text: "אָהֲבָה", plain: "אהבה", hint: "אָ-הֲ-בָה" },
        { text: "הַרְפַּתְקָאוֹת", plain: "הרפתקאות", hint: "הַרְ-פַּתְ-קָ-אוֹת", isHard: true },
        { text: ".", plain: ".", isPunct: true },
        { text: "\"בּוֹא", plain: "בוא", hint: "בּוֹא" },
        { text: "אִתִּי\"", plain: "איתי", hint: "אִ-תִּי", alternates: ["אתי"] },
        { text: ",", plain: ",", isPunct: true },
        { text: "הִיא", plain: "היא", hint: "הִיא" },
        { text: "אָמְרָה", plain: "אמרה", hint: "אָמְ-רָה" },
        { text: ".", plain: ".", isPunct: true },
        { text: "\"נִמְצָא", plain: "נמצא", hint: "נִמְ-צָא" },
        { text: "פִּתְרוֹן", plain: "פתרון", hint: "פִּתְ-רוֹן" },
        { text: "בְּיַחַד\"", plain: "ביחד", hint: "בְּ-יַ-חַד" },
        { text: ".", plain: ".", isPunct: true }
      ]
    },
    {
      illustration: "🌟",
      text: "הם בדקו את הספינה ותיקנו אותה. לפני שזוזו טס חזרה, הוא נתן לדנה כוכב קטן וזוהר. תודה, חברה אמיתית.",
      words: [
        { text: "הֵם", plain: "הם", hint: "הֵם" },
        { text: "בָּדְקוּ", plain: "בדקו", hint: "בָּדְ-קוּ" },
        { text: "אֶת", plain: "את", hint: "אֶת" },
        { text: "הַסְּפִינָה", plain: "הספינה", hint: "הַ-סְּ-פִי-נָה" },
        { text: "וְתִקְּנוּ", plain: "ותיקנו", hint: "וְ-תִ-קְּ-נוּ", alternates: ["ותקנו"] },
        { text: "אוֹתָהּ", plain: "אותה", hint: "אוֹ-תָהּ" },
        { text: ".", plain: ".", isPunct: true },
        { text: "לִפְנֵי", plain: "לפני", hint: "לִפְ-נֵי" },
        { text: "שֶׁזוּזוּ", plain: "שזוזו", hint: "שֶׁ-זוּ-זוּ" },
        { text: "טָס", plain: "טס", hint: "טָס" },
        { text: "חֲזָרָה", plain: "חזרה", hint: "חֲ-זָ-רָה" },
        { text: ",", plain: ",", isPunct: true },
        { text: "הוּא", plain: "הוא", hint: "הוּא" },
        { text: "נָתַן", plain: "נתן", hint: "נָ-תַן" },
        { text: "לְדָנָה", plain: "לדנה", hint: "לְ-דָ-נָה" },
        { text: "כּוֹכָב", plain: "כוכב", hint: "כּוֹ-כָב" },
        { text: "קָטָן", plain: "קטן", hint: "קָ-טָן" },
        { text: "וְזוֹהֵר", plain: "וזוהר", hint: "וְ-זוֹ-הֵר", isHard: true },
        { text: ".", plain: ".", isPunct: true },
        { text: "\"תּוֹדָה", plain: "תודה", hint: "תּוֹ-דָה" },
        { text: ",", plain: ",", isPunct: true },
        { text: "חֲבֵרָה", plain: "חברה", hint: "חֲ-בֵ-רָה" },
        { text: "אֲמִתִּית\"", plain: "אמיתית", hint: "אֲ-מִ-תִּית", alternates: ["אמתית"] },
        { text: ".", plain: ".", isPunct: true }
      ]
    }
  ]
};

// ============================================
// FLATTEN words for matching
// ============================================
const FLAT_WORDS = [];
STORY.paragraphs.forEach((para, pIdx) => {
  para.words.forEach((word, wIdx) => {
    FLAT_WORDS.push({ ...word, pIdx, wIdx, flatIdx: FLAT_WORDS.length });
  });
});

const TOTAL_WORDS = FLAT_WORDS.filter(w => !w.isPunct).length;

// ============================================
// HEBREW TEXT NORMALIZATION & SIMILARITY
// ============================================

// Strip niqqud (Hebrew vowel points)
const stripNiqqud = (str) => str.replace(/[\u0591-\u05C7]/g, '');

// Strip punctuation and normalize
const normalize = (str) => {
  return stripNiqqud(str)
    .replace(/[״"'.,!?;:()\[\]{}]/g, '')
    .replace(/[\u05BE\u05F3\u05F4]/g, '') // Hebrew punctuation
    .trim()
    .toLowerCase();
};

// Levenshtein distance
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

// Match score: 0 = perfect, higher = worse
const matchScore = (heard, expected) => {
  const h = normalize(heard);
  const e = normalize(expected);
  if (!h || !e) return 99;
  if (h === e) return 0;
  // Check substring (often ASR returns partial / extra)
  if (h.includes(e) || e.includes(h)) return 0.5;
  const dist = levenshtein(h, e);
  return dist / Math.max(h.length, e.length);
};

// Determine match type based on score
const classifyMatch = (heard, expected, alternates = []) => {
  const score = matchScore(heard, expected);
  if (score === 0) return 'perfect';
  if (score <= 0.5) return 'close'; // very small typo
  // Check alternates (common spelling variations)
  for (const alt of alternates) {
    if (matchScore(heard, alt) <= 0.5) return 'close';
  }
  if (score <= 0.4) return 'phonetic'; // misread but similar
  return 'wrong';
};

// ============================================
// FEEDBACK MESSAGES
// ============================================

const ENCOURAGEMENTS = [
  { text: "וואו, יפה מאוד!", emoji: "✨" },
  { text: "קצב מצוין!", emoji: "🚀" },
  { text: "מדהים!", emoji: "💫" },
  { text: "המשיכי כך!", emoji: "🌟" },
  { text: "פנטסטי!", emoji: "🎯" },
  { text: "איזו קריאה רהוטה!", emoji: "📖" },
  { text: "כיף לשמוע אותך!", emoji: "🎵" },
];

const HARD_WORD_PRAISE = [
  { text: 'וואו! קראת את "{word}" מצוין!', emoji: "🌟" },
  { text: 'איזו מילה קשה כבשת! "{word}" — כל הכבוד!', emoji: "💪" },
  { text: '"{word}" זאת מילה ארוכה ומאתגרת!', emoji: "🎉" },
];

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [hasStarted, setHasStarted] = useState(false); // welcome gate
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [wordStates, setWordStates] = useState(() =>
    FLAT_WORDS.map(() => 'pending')
  );
  const [currentIdx, setCurrentIdx] = useState(0); // current expected word (flat index)
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [errorBubble, setErrorBubble] = useState(null);
  const [coachMessage, setCoachMessage] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [points, setPoints] = useState(47);
  const [streak] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [emotionalState, setEmotionalState] = useState('focused');
  const [showBreakSuggestion, setShowBreakSuggestion] = useState(false);
  const [liveLog, setLiveLog] = useState([]);

  // Speech Recognition state
  const [browserSupported, setBrowserSupported] = useState(true);
  const [micPermission, setMicPermission] = useState('unknown'); // unknown | granted | denied
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastFinalTranscript, setLastFinalTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Metrics
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState([]);
  const [corrections, setCorrections] = useState(0);
  const [hints, setHints] = useState(0);
  const [completedWords, setCompletedWords] = useState(0);
  const [tickTime, setTickTime] = useState(Date.now());

  // Refs
  const recognitionRef = useRef(null);
  const liveLogRef = useRef([]);
  const currentIdxRef = useRef(0);
  const wordStatesRef = useRef(wordStates);
  const audioContextRef = useRef(null);
  const audioStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const processedTranscriptsRef = useRef(new Set()); // dedupe
  const stuckTimerRef = useRef(null);
  const lastWordTimeRef = useRef(Date.now());
  const isRecordingRef = useRef(false);

  // keep refs synced
  useEffect(() => { currentIdxRef.current = currentIdx; }, [currentIdx]);
  useEffect(() => { wordStatesRef.current = wordStates; }, [wordStates]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  // Tick for live time display
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => setTickTime(Date.now()), 250);
    return () => clearInterval(id);
  }, [isRecording]);

  // Computed metrics
  const elapsedSeconds = startTime ? Math.max(1, (tickTime - startTime) / 1000) : 0;
  const elapsedMinutes = elapsedSeconds / 60;
  const correctWords = completedWords - errors.length;
  const wcpm = elapsedMinutes > 0.05 ? Math.round(correctWords / elapsedMinutes) : 0;
  const accuracy = completedWords > 0 ? Math.round((correctWords / completedWords) * 100) : 100;

  const pushLog = useCallback((entry) => {
    const newEntry = { ...entry, id: Date.now() + Math.random(), time: Date.now() };
    liveLogRef.current = [newEntry, ...liveLogRef.current].slice(0, 10);
    setLiveLog([...liveLogRef.current]);
  }, []);

  // ============================================
  // BROWSER COMPATIBILITY CHECK
  // ============================================
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setBrowserSupported(false);
    }
  }, []);

  // ============================================
  // AUDIO LEVEL VISUALIZATION
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
        if (isRecordingRef.current) {
          requestAnimationFrame(updateLevel);
        }
      };
      updateLevel();
      setMicPermission('granted');
      return true;
    } catch (err) {
      console.error('Mic access error:', err);
      setMicPermission('denied');
      setErrorMessage('הדפדפן לא הצליח לגשת למיקרופון. ודא/י שאישרת גישה.');
      return false;
    }
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

  // ============================================
  // PROCESS HEARD WORDS
  // ============================================
  const processWord = useCallback((heardWord) => {
    const expected = FLAT_WORDS[currentIdxRef.current];
    if (!expected) return;

    // Skip past punctuation tokens automatically
    let idx = currentIdxRef.current;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) {
      idx++;
    }
    if (idx >= FLAT_WORDS.length) return;

    const expectedWord = FLAT_WORDS[idx];

    // Try to match heard word against expected (or look ahead 2 words for tolerance)
    const candidates = [
      { word: expectedWord, idx, distance: 0 },
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

    if (!bestMatch || bestMatch.matchType === 'wrong') {
      // Heard something but doesn't match anything nearby
      pushLog({ type: 'unmatched', word: heardWord, message: `שמעתי: "${heardWord}" — לא תואם` });
      return;
    }

    // Mark words from currentIdx up to (and including) bestMatch.idx
    setWordStates(prev => {
      const ns = [...prev];
      for (let i = idx; i < bestMatch.idx; i++) {
        // Skipped words = error (unless punct)
        if (!FLAT_WORDS[i].isPunct && ns[i] === 'pending') {
          ns[i] = 'skipped';
        }
      }
      // The matched word
      if (bestMatch.matchType === 'perfect') {
        ns[bestMatch.idx] = 'correct';
      } else if (bestMatch.matchType === 'close') {
        ns[bestMatch.idx] = 'correct';
      } else if (bestMatch.matchType === 'phonetic') {
        ns[bestMatch.idx] = 'phonetic-error';
      }
      return ns;
    });

    // Track skipped words as errors
    if (bestMatch.distance > 0) {
      for (let i = idx; i < bestMatch.idx; i++) {
        if (!FLAT_WORDS[i].isPunct) {
          setErrors(e => [...e, { type: 'skipped', word: FLAT_WORDS[i].plain, timestamp: Date.now() }]);
          setCompletedWords(c => c + 1);
          pushLog({ type: 'error-skip', word: FLAT_WORDS[i].plain, message: `דילוג על "${FLAT_WORDS[i].plain}"` });
        }
      }
    }

    // Update for the matched word
    setCompletedWords(c => c + 1);
    if (bestMatch.matchType === 'perfect' || bestMatch.matchType === 'close') {
      setPoints(p => p + 1);
      lastWordTimeRef.current = Date.now();

      // Hard word praise
      if (expectedWord.isHard && Math.random() < 0.7) {
        const praise = HARD_WORD_PRAISE[Math.floor(Math.random() * HARD_WORD_PRAISE.length)];
        setFeedback({
          text: praise.text.replace('{word}', bestMatch.word.text),
          emoji: praise.emoji,
          type: 'big-win'
        });
        setPoints(p => p + 2);
        pushLog({ type: 'hard-word', word: bestMatch.word.plain, message: `קראה מילה קשה!` });
        setTimeout(() => setFeedback(null), 2200);
      } else if (Math.random() < 0.15) {
        const enc = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setFeedback({ ...enc, type: 'encouragement' });
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
      pushLog({ type: 'error-phonetic', word: bestMatch.word.plain, heard: heardWord, message: `שגיאה פונטית` });
      setTimeout(() => setErrorBubble(null), 3500);
    }

    // Advance pointer
    let newIdx = bestMatch.idx + 1;
    while (newIdx < FLAT_WORDS.length && FLAT_WORDS[newIdx].isPunct) newIdx++;
    setCurrentIdx(newIdx);

    // Check completion
    if (newIdx >= FLAT_WORDS.length) {
      setTimeout(() => {
        stopRecording();
        setShowComplete(true);
        setPoints(p => p + 25);
      }, 800);
    }
  }, [pushLog]);

  // ============================================
  // STUCK DETECTION (no progress for 5s)
  // ============================================
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
            pushLog({ type: 'stuck', word: FLAT_WORDS[idx].plain, message: 'מתקשה במילה' });
          }
        }
      }
    }, 1000);
    return () => clearInterval(checkStuck);
  }, [isRecording, showHint, pushLog]);

  // Hide hint when current word changes
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

  // ============================================
  // EMOTIONAL ADAPTATION
  // ============================================
  useEffect(() => {
    if (!isRecording) return;
    const checkEmotion = setInterval(() => {
      const recentErrors = errors.filter(e => Date.now() - e.timestamp < 15000).length;
      const errorRate = completedWords > 0 ? errors.length / completedWords : 0;

      if (recentErrors >= 3 || errorRate > 0.3) {
        setEmotionalState('frustrated');
        if (!showBreakSuggestion) {
          setShowBreakSuggestion(true);
          setCoachMessage({
            type: 'support',
            text: "שמתי לב שהמילים האחרונות היו מאתגרות. רוצה הפסקה קצרה?",
          });
        }
      } else if (errorRate < 0.05 && completedWords > 15) {
        setEmotionalState('thriving');
      } else {
        setEmotionalState('focused');
      }
    }, 4000);
    return () => clearInterval(checkEmotion);
  }, [isRecording, errors, completedWords, showBreakSuggestion]);

  // ============================================
  // SPEECH RECOGNITION SETUP
  // ============================================
  // Request mic permission only (without starting recording)
  const requestMicPermissionOnly = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Immediately stop the stream — we just wanted permission
      stream.getTracks().forEach(t => t.stop());
      setMicPermission('granted');
      return true;
    } catch (err) {
      console.error('Mic permission error:', err);
      setMicPermission('denied');
      setErrorMessage('הדפדפן לא הצליח לגשת למיקרופון. אישור: הגדרות הדפדפן → אתר → מיקרופון.');
      return false;
    }
  };

  const handleStartApp = async () => {
    setIsRequestingMic(true);
    const ok = await requestMicPermissionOnly();
    setIsRequestingMic(false);
    if (ok || micPermission === 'denied') {
      // Enter app even if denied, so user can see UI and instructions
      setHasStarted(true);
    }
  };

  const startRecording = async () => {
    if (!browserSupported) return;
    setErrorMessage(null);

    // Request mic + start audio level monitoring
    const ok = await startAudioLevelMonitoring();
    if (!ok) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'he-IL';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      console.log('Recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finals = [];
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finals.push({ text: transcript, idx: i });
        } else {
          interim += transcript;
        }
      }
      setInterimTranscript(interim);

      // Process each FINAL result individually (only once)
      finals.forEach(f => {
        const key = `${f.idx}-${f.text}`;
        if (processedTranscriptsRef.current.has(key)) return;
        processedTranscriptsRef.current.add(key);

        setLastFinalTranscript(f.text);

        // Split into words and process each
        const words = f.text.trim().split(/\s+/);
        words.forEach((w, i) => {
          if (w.length > 0) {
            // Slight delay between words for visual flow
            setTimeout(() => processWord(w), i * 100);
          }
        });
      });
    };

    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      if (event.error === 'no-speech') {
        // ignore
        return;
      }
      if (event.error === 'audio-capture') {
        setErrorMessage('בעיה בגישה למיקרופון. בדוק/י את ההגדרות.');
      } else if (event.error === 'not-allowed') {
        setErrorMessage('גישה למיקרופון נחסמה. אישור: הגדרות הדפדפן → אתר → מיקרופון.');
        setMicPermission('denied');
      } else if (event.error === 'network') {
        setErrorMessage('בעיית רשת בזיהוי הדיבור. נסה/י שוב.');
      } else if (event.error === 'language-not-supported') {
        setErrorMessage('הדפדפן הזה לא תומך בעברית. נסה/י Chrome.');
      }
    };

    recognition.onend = () => {
      // Auto-restart if still recording (browser sometimes stops after silence)
      if (isRecordingRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Could not restart:', e);
        }
      }
    };

    recognitionRef.current = recognition;
    processedTranscriptsRef.current = new Set();

    try {
      recognition.start();
      setIsRecording(true);
      if (!startTime) setStartTime(Date.now());
      lastWordTimeRef.current = Date.now();
    } catch (err) {
      console.error('Start error:', err);
      setErrorMessage('שגיאה בהפעלת זיהוי הדיבור.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      isRecordingRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    stopAudioMonitoring();
    setInterimTranscript('');
  };

  const resetReading = () => {
    stopRecording();
    setWordStates(FLAT_WORDS.map(() => 'pending'));
    setCurrentIdx(0);
    setShowHint(null);
    setFeedback(null);
    setErrorBubble(null);
    setShowComplete(false);
    setEmotionalState('focused');
    setShowBreakSuggestion(false);
    setStartTime(null);
    setErrors([]);
    setCorrections(0);
    setHints(0);
    setCompletedWords(0);
    setInterimTranscript('');
    setLastFinalTranscript('');
    setErrorMessage(null);
    liveLogRef.current = [];
    setLiveLog([]);
    processedTranscriptsRef.current = new Set();
    // Skip leading punct
    let idx = 0;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) idx++;
    setCurrentIdx(idx);
  };

  // Cleanup on unmount
  useEffect(() => () => {
    stopRecording();
  }, []);

  // Initialize starting index past leading punctuation
  useEffect(() => {
    let idx = 0;
    while (idx < FLAT_WORDS.length && FLAT_WORDS[idx].isPunct) idx++;
    setCurrentIdx(idx);
  }, []);

  // ============================================
  // RENDER HELPERS
  // ============================================
  const wordClass = (state, isCurrent, isPunct) => {
    if (isPunct) return { color: '#1A2B4A' };
    const base = {
      padding: '4px 8px',
      borderRadius: '10px',
      margin: '0 2px',
      display: 'inline-block',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
    };
    if (state === 'correct') return { ...base, backgroundColor: '#7FB069', color: '#FAF6EF', fontWeight: 600 };
    if (state === 'phonetic-error') return { ...base, backgroundColor: '#FFE5DC', color: '#C44536', fontWeight: 600 };
    if (state === 'skipped') return { ...base, backgroundColor: '#F5F1E7', color: '#8A95A8', textDecoration: 'line-through' };
    if (state === 'stuck') return { ...base, backgroundColor: '#F5A524', color: '#1A2B4A', animation: 'pulse-stuck 1.2s ease-in-out infinite', boxShadow: '0 0 0 0 rgba(245,165,36,0.7)', fontWeight: 700 };
    if (isCurrent) return { ...base, backgroundColor: '#FFF8E1', color: '#1A2B4A', boxShadow: '0 0 0 2px #F5A524', fontWeight: 700 };
    return { ...base, color: '#1A2B4A' };
  };

  const totalProgress = (completedWords / TOTAL_WORDS) * 100;

  const emotionalColor = {
    focused: '#1A2B4A',
    thriving: '#7FB069',
    frustrated: '#C44536',
  }[emotionalState];

  const emotionalLabel = {
    focused: 'ממוקדת',
    thriving: 'בשיא',
    frustrated: 'מתאמצת',
  }[emotionalState];

  const emotionalIcon = {
    focused: <CheckCircle2 className="w-4 h-4" />,
    thriving: <Zap className="w-4 h-4" />,
    frustrated: <AlertCircle className="w-4 h-4" />,
  }[emotionalState];

  // ============================================
  // RENDER
  // ============================================

  // Browser not supported
  if (!browserSupported) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#FAF6EF', fontFamily: '"Heebo", system-ui, sans-serif', minHeight: '100vh' }} className="flex items-center justify-center p-6">
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <div className="max-w-lg rounded-3xl p-10 text-center" style={{ backgroundColor: '#FFFCF5', border: '2px solid #C44536' }}>
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" style={{ color: '#C44536' }} />
          <h1 className="text-3xl font-black mb-3" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>
            הדפדפן לא תומך
          </h1>
          <p className="text-base mb-4" style={{ color: '#4A5568' }}>
            זיהוי הדיבור דורש Chrome או Edge על מחשב/אנדרואיד. Safari ו-Firefox לא תומכים בעברית בזיהוי דיבור.
          </p>
          <p className="text-sm" style={{ color: '#4A5568' }}>
            במוצר האמיתי נשתמש ב-Whisper מותאם בצד השרת — שעובד בכל דפדפן.
          </p>
        </div>
      </div>
    );
  }

  // Welcome / mic permission gate
  if (!hasStarted) {
    return (
      <div dir="rtl" style={{ backgroundColor: '#FAF6EF', fontFamily: '"Heebo", system-ui, sans-serif', minHeight: '100vh' }} className="flex items-center justify-center p-6 relative overflow-hidden">
        <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes pulse-mic { 0%, 100% { box-shadow: 0 0 0 0 rgba(196, 69, 54, 0.4); transform: scale(1); } 50% { box-shadow: 0 0 0 24px rgba(196, 69, 54, 0); transform: scale(1.05); } }
          @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes fade-in { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .pulse-mic { animation: pulse-mic 2s ease-in-out infinite; }
          .float-slow { animation: float-slow 4s ease-in-out infinite; }
          .fade-in { animation: fade-in 0.6s ease-out backwards; }
        `}</style>

        {/* Decorative floating elements */}
        <div className="absolute top-[10%] right-[8%] text-6xl opacity-30 float-slow">📚</div>
        <div className="absolute bottom-[15%] left-[10%] text-5xl opacity-30 float-slow" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-[20%] left-[15%] text-4xl opacity-20 float-slow" style={{ animationDelay: '2s' }}>🌟</div>
        <div className="absolute bottom-[25%] right-[12%] text-5xl opacity-25 float-slow" style={{ animationDelay: '0.5s' }}>🎈</div>

        {/* Sun gradient background */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #F5A524 0%, transparent 70%)' }} />

        <div className="relative max-w-2xl w-full text-center fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-12 fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#1A2B4A' }}>
              <BookOpen className="w-7 h-7" style={{ color: '#F5A524' }}/>
            </div>
            <span className="text-3xl font-black tracking-tight" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>ReadRight</span>
          </div>

          {/* Avatar */}
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-8 fade-in" style={{ backgroundColor: '#FCE9CC', fontSize: '64px', animationDelay: '0.3s' }}>
            👧🏼
          </div>

          {/* Greeting */}
          <h1 className="text-5xl md:text-6xl font-black mb-4 fade-in" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif', animationDelay: '0.4s' }}>
            שָׁלוֹם דָּנָה!
          </h1>
          <p className="text-xl mb-12 fade-in" style={{ color: '#4A5568', animationDelay: '0.5s' }}>
            מוכנה לסיפור חדש על חתול מהחלל? <span className="inline-block">🚀</span>
          </p>

          {/* Mic explanation card */}
          <div className="rounded-3xl p-8 mb-8 fade-in" style={{ backgroundColor: '#FFFCF5', border: '2px solid #E8DFD0', animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 pulse-mic" style={{ backgroundColor: '#C44536' }}>
                <Mic className="w-8 h-8" style={{ color: '#FAF6EF' }}/>
              </div>
              <div className="text-right flex-1">
                <div className="text-sm font-bold mb-1" style={{ color: '#C44536' }}>שלב ראשון</div>
                <div className="text-xl font-black" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>
                  צריכה את המיקרופון שלך
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-right" style={{ color: '#4A5568' }}>
              כשתקראי את הסיפור בקול, אני אקשיב לך, אעודד אותך, ואעזור לך כשמילה תהיה קשה. <span className="font-bold" style={{ color: '#1A2B4A' }}>אני לא שומרת הקלטות</span> — רק שומעת ומיד שוכחת.
            </p>
          </div>

          {/* Privacy reassurance */}
          <div className="grid grid-cols-3 gap-3 mb-8 fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8DFD0' }}>
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs font-bold" style={{ color: '#1A2B4A' }}>פרטי לחלוטין</div>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8DFD0' }}>
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-bold" style={{ color: '#1A2B4A' }}>פידבק מיידי</div>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8DFD0' }}>
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-xs font-bold" style={{ color: '#1A2B4A' }}>בדיוק בקצב שלך</div>
            </div>
          </div>

          {/* Big start button */}
          <button
            onClick={handleStartApp}
            disabled={isRequestingMic}
            className="group inline-flex items-center gap-4 px-12 py-6 rounded-full text-xl font-black transition hover:scale-105 shadow-2xl disabled:opacity-50 fade-in"
            style={{ backgroundColor: '#7FB069', color: '#FAF6EF', animationDelay: '0.8s' }}
          >
            {isRequestingMic ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px', borderTopColor: 'transparent' }}/>
                מבקשת גישה...
              </>
            ) : (
              <>
                <Mic className="w-6 h-6"/>
                בואי נתחיל!
              </>
            )}
          </button>

          <p className="text-xs mt-6 fade-in" style={{ color: '#4A5568', animationDelay: '0.9s' }}>
            הדפדפן ישאל אישור — לחצי "אפשר" כדי שאוכל לשמוע אותך
          </p>

          {errorMessage && (
            <div className="mt-6 p-4 rounded-2xl flex items-start gap-3" style={{ backgroundColor: '#FFE5DC', border: '1px solid #C44536' }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C44536' }}/>
              <div className="text-sm text-right flex-1" style={{ color: '#1A2B4A' }}>{errorMessage}</div>
              <button onClick={() => { setErrorMessage(null); setHasStarted(true); }} className="text-xs font-bold whitespace-nowrap" style={{ color: '#C44536' }}>
                המשך בכל זאת
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ backgroundColor: '#FAF6EF', fontFamily: '"Heebo", system-ui, sans-serif', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Heebo:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulse-stuck {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245,165,36,0.7); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 12px rgba(245,165,36,0); }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196, 69, 54, 0.6); }
          50% { box-shadow: 0 0 0 12px rgba(196, 69, 54, 0); }
        }
        @keyframes recording-dot {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
        .anim-slide-up { animation: slide-up 0.5s ease-out; }
        .anim-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        .anim-pop { animation: pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55); }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .mic-recording { animation: mic-pulse 1.5s ease-in-out infinite; }
        .recording-dot { animation: recording-dot 1s ease-in-out infinite; }

        .grain-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* COMPLETE OVERLAY */}
      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(26, 43, 74, 0.85)', backdropFilter: 'blur(8px)' }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '-20px',
              left: `${Math.random() * 100}%`,
              width: '12px',
              height: '12px',
              backgroundColor: ['#F5A524', '#C44536', '#7FB069', '#FCE9CC'][i % 4],
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              animation: `confetti ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s infinite`,
            }} />
          ))}
          <div className="relative max-w-2xl mx-4 rounded-3xl p-12 text-center anim-pop" style={{ backgroundColor: '#FAF6EF', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
            <div className="text-8xl mb-4 anim-float">🎉</div>
            <h2 className="text-6xl font-black mb-3" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>
              סִיַּמְתְּ!
            </h2>
            <p className="text-xl mb-8" style={{ color: '#4A5568' }}>קראת סיפור שלם של {TOTAL_WORDS} מילים!</p>
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3].map((s, i) => (
                <Star key={i} className={`fill-current ${i === 1 ? 'w-20 h-20' : 'w-14 h-14'}`} style={{ color: '#F5A524' }}/>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FCE9CC' }}>
                <div className="text-3xl font-black" style={{ color: '#1A2B4A' }}>{wcpm}</div>
                <div className="text-xs font-bold" style={{ color: '#4A5568' }}>WCPM</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#D8E8D0' }}>
                <div className="text-3xl font-black" style={{ color: '#5A8A4A' }}>{accuracy}%</div>
                <div className="text-xs font-bold" style={{ color: '#4A5568' }}>דיוק</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FFE5DC' }}>
                <div className="text-3xl font-black" style={{ color: '#C44536' }}>+25</div>
                <div className="text-xs font-bold" style={{ color: '#4A5568' }}>נקודות</div>
              </div>
              <div className="p-4 rounded-2xl" style={{ backgroundColor: '#E0E5F0' }}>
                <div className="text-3xl font-black" style={{ color: '#1A2B4A' }}>{Math.floor(elapsedSeconds / 60)}:{String(Math.floor(elapsedSeconds) % 60).padStart(2, '0')}</div>
                <div className="text-xs font-bold" style={{ color: '#4A5568' }}>זמן</div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={resetReading} className="px-8 py-3 rounded-full font-bold transition hover:scale-105" style={{ backgroundColor: '#1A2B4A', color: '#F5A524' }}>
                <RotateCcw className="w-4 h-4 inline ml-2"/> קראי שוב
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: 'rgba(250, 246, 239, 0.92)', borderBottom: '1px solid #E8DFD0' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold transition hover:bg-black/5" style={{ color: '#1A2B4A' }}>
              <ChevronRight className="w-4 h-4" /> חזרה
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1A2B4A' }}>
                <BookOpen className="w-4 h-4" style={{ color: '#F5A524' }}/>
              </div>
              <span className="text-lg font-black tracking-tight" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>ReadRight</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#C44536' }}>
                <div className="w-2 h-2 rounded-full bg-white recording-dot"/>
                <span className="text-xs font-bold" style={{ color: '#FAF6EF' }}>REC</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition" style={{ backgroundColor: emotionalColor + '15', color: emotionalColor }}>
              {emotionalIcon}
              {emotionalLabel}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#FCE9CC' }}>
              <Flame className="w-4 h-4" style={{ color: '#C44536' }}/>
              <span className="text-sm font-bold" style={{ color: '#1A2B4A' }}>{streak}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#1A2B4A' }}>
              <Star className="w-4 h-4 fill-current" style={{ color: '#F5A524' }}/>
              <span className="text-sm font-bold" style={{ color: '#FAF6EF' }}>{points}</span>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2" style={{ backgroundColor: '#FCE9CC', borderColor: '#1A2B4A' }}>
              👧🏼
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto px-6 pb-3">
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8DFD0' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, #F5A524, #C44536)' }}/>
          </div>
          <div className="flex justify-between text-xs mt-1.5" style={{ color: '#4A5568' }}>
            <span className="font-bold">{completedWords} / {TOTAL_WORDS} מילים • {Math.round(totalProgress)}%</span>
            <span>{STORY.title}</span>
          </div>
        </div>
      </header>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 rounded-2xl flex items-start gap-3 anim-slide-up" style={{ backgroundColor: '#FFE5DC', border: '1px solid #C44536' }}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C44536' }}/>
            <div className="text-sm flex-1" style={{ color: '#1A2B4A' }}>{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-xs font-bold" style={{ color: '#C44536' }}>×</button>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* STORY AREA */}
        <div className="lg:col-span-8 relative">
          {/* Story header */}
          <div className="rounded-3xl p-5 mb-4 flex items-center gap-4 anim-slide-up" style={{ backgroundColor: '#FCE9CC' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: '#FAF6EF' }}>
              {STORY.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold mb-0.5" style={{ color: '#C44536' }}>סיפור #14 • נוצר עבור דנה</div>
              <h1 className="text-2xl font-black truncate" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>{STORY.title}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: '#1A2B4A', color: '#F5A524' }}>{STORY.level}</span>
                <span className="text-xs" style={{ color: '#4A5568' }}>~{STORY.estimatedMinutes} דק׳</span>
                <span className="text-xs" style={{ color: '#4A5568' }}>•</span>
                <span className="text-xs" style={{ color: '#4A5568' }}>{TOTAL_WORDS} מילים</span>
              </div>
            </div>
          </div>

          {/* Story text */}
          <div className="relative rounded-3xl p-8 md:p-10 grain-bg overflow-hidden" style={{ backgroundColor: '#FFFCF5', border: '2px solid #E8DFD0', minHeight: '500px' }}>
            <div className="relative z-10 text-2xl md:text-[1.6rem] leading-[2.6] font-medium" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif', letterSpacing: '0.01em' }}>
              {STORY.paragraphs.map((para, pIdx) => {
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
                          <span key={wIdx} style={wordClass(state, isCurrent, word.isPunct)}>
                            {word.text}
                          </span>
                        );
                      })}
                    </p>

                    {/* Inline error bubble */}
                    {errorBubble && FLAT_WORDS[errorBubble.idx] && FLAT_WORDS[errorBubble.idx].pIdx === pIdx && (
                      <div className="mt-3 inline-flex items-start gap-3 p-3 rounded-2xl anim-slide-up" style={{ backgroundColor: '#FFE5DC', border: '1px solid #C44536' }}>
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C44536' }}/>
                        <div className="text-sm">
                          <div className="font-bold" style={{ color: '#C44536' }}>{errorBubble.type}</div>
                          <div style={{ color: '#1A2B4A' }}>
                            הציפי: <span className="font-bold">"{errorBubble.expected}"</span> • שמעתי: <span className="font-bold">"{errorBubble.heard}"</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hint popup */}
                    {showHint && FLAT_WORDS[showHint.idx] && FLAT_WORDS[showHint.idx].pIdx === pIdx && (
                      <div className="mt-3 inline-flex items-center gap-3 p-4 rounded-2xl anim-slide-up shadow-lg" style={{ backgroundColor: '#F5A524' }}>
                        <Lightbulb className="w-6 h-6" style={{ color: '#1A2B4A' }}/>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#1A2B4A' }}>רמז פונטי:</div>
                          <div className="text-2xl font-black" style={{ color: '#1A2B4A', fontFamily: '"Frank Ruhl Libre", serif' }}>
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

          {/* Live transcript display */}
          {(isRecording || interimTranscript || lastFinalTranscript) && (
            <div className="mt-4 p-4 rounded-2xl anim-slide-up" style={{ backgroundColor: '#1A2B4A' }}>
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4" style={{ color: '#F5A524' }}/>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8A95A8' }}>מה הדפדפן שומע</span>
              </div>
              <div className="text-lg" style={{ color: '#FAF6EF', fontFamily: '"Frank Ruhl Libre", serif', minHeight: '32px' }}>
                {interimTranscript ? (
                  <span style={{ color: '#FCE9CC', opacity: 0.7 }}>{interimTranscript}</span>
                ) : lastFinalTranscript ? (
                  <span>{lastFinalTranscript}</span>
                ) : (
                  <span style={{ color: '#8A95A8', fontStyle: 'italic' }}>מקשיבה...</span>
                )}
              </div>
              {isRecording && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2D4A7C' }}>
                    <div className="h-full transition-all duration-100" style={{ width: `${audioLevel}%`, backgroundColor: audioLevel > 60 ? '#7FB069' : audioLevel > 30 ? '#F5A524' : '#C44536' }}/>
                  </div>
                  <span className="text-[10px]" style={{ color: '#8A95A8' }}>עוצמת מיקרופון</span>
                </div>
              )}
            </div>
          )}

          {/* CONTROLS */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <button onClick={resetReading} className="px-5 py-3 rounded-full text-sm font-bold transition hover:scale-105 flex items-center gap-2" style={{ border: '2px solid #1A2B4A', color: '#1A2B4A' }}>
              <RotateCcw className="w-4 h-4"/> מחדש
            </button>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={showComplete}
              className={`group flex items-center gap-3 px-10 py-5 rounded-full text-lg font-black transition hover:scale-105 shadow-2xl disabled:opacity-50 ${isRecording ? 'mic-recording' : ''}`}
              style={{ backgroundColor: isRecording ? '#C44536' : '#7FB069', color: '#FAF6EF' }}
            >
              {isRecording ? (
                <><MicOff className="w-6 h-6"/> עצור מיקרופון</>
              ) : (
                <><Mic className="w-6 h-6"/> התחילי לקרוא בקול</>
              )}
            </button>
          </div>

          <div className="text-center mt-3 text-xs" style={{ color: '#4A5568' }}>
            🎤 קוראת בקול את הסיפור • הדפדפן ינתח כל מילה בזמן אמת • Chrome / Edge מומלץ
          </div>

          {micPermission === 'denied' && (
            <div className="mt-4 p-4 rounded-2xl text-sm" style={{ backgroundColor: '#FFE5DC', color: '#C44536' }}>
              <strong>גישה למיקרופון נדחתה.</strong> כדי להפעיל: לחץ/י על אייקון המנעול ליד כתובת האתר → אפשר/י מיקרופון → רענן/י את הדף.
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Live metrics */}
          <div className="rounded-3xl p-5" style={{ backgroundColor: '#1A2B4A', color: '#FAF6EF' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isRecording ? '#7FB069' : '#8A95A8', boxShadow: isRecording ? '0 0 8px #7FB069' : 'none' }}/>
                <span className="text-xs font-bold tracking-wider">{isRecording ? 'LIVE' : 'OFF'}</span>
              </div>
              <span className="text-[10px]" style={{ color: '#8A95A8' }}>מנוע ניתוח קריאה</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-4xl font-black" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>{wcpm}</div>
                <div className="text-[10px]" style={{ color: '#8A95A8' }}>WCPM</div>
              </div>
              <div>
                <div className="text-4xl font-black" style={{ color: '#7FB069', fontFamily: '"Frank Ruhl Libre", serif' }}>{accuracy}%</div>
                <div className="text-[10px]" style={{ color: '#8A95A8' }}>דיוק</div>
              </div>
              <div>
                <div className="text-2xl font-black">{Math.floor(elapsedSeconds / 60)}:{String(Math.floor(elapsedSeconds) % 60).padStart(2, '0')}</div>
                <div className="text-[10px]" style={{ color: '#8A95A8' }}>זמן קריאה</div>
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: '#F5A524' }}>{hints}</div>
                <div className="text-[10px]" style={{ color: '#8A95A8' }}>רמזים</div>
              </div>
            </div>

            <div className="border-t pt-3 mt-4" style={{ borderColor: '#2D4A7C' }}>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#8A95A8' }}>פירוט אירועים</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-black" style={{ color: '#7FB069' }}>{correctWords}</div>
                  <div className="text-[9px]" style={{ color: '#8A95A8' }}>נכון</div>
                </div>
                <div>
                  <div className="text-lg font-black" style={{ color: '#F5A524' }}>{hints}</div>
                  <div className="text-[9px]" style={{ color: '#8A95A8' }}>רמזים</div>
                </div>
                <div>
                  <div className="text-lg font-black" style={{ color: '#C44536' }}>{errors.length}</div>
                  <div className="text-[9px]" style={{ color: '#8A95A8' }}>טעויות</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coach voice */}
          <div className="rounded-3xl p-5" style={{ backgroundColor: '#FCE9CC' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5A524' }}>
                <Volume2 className="w-5 h-5" style={{ color: '#1A2B4A' }}/>
              </div>
              <div>
                <div className="text-sm font-black" style={{ color: '#1A2B4A' }}>מאיה החברה</div>
                <div className="text-[10px]" style={{ color: '#4A5568' }}>המאמנת הקולית שלך</div>
              </div>
            </div>

            {feedback ? (
              <div className="anim-pop p-3 rounded-2xl flex items-start gap-2" style={{ backgroundColor: '#1A2B4A' }}>
                <span className="text-2xl">{feedback.emoji}</span>
                <span className="text-sm font-bold flex-1" style={{ color: '#F5A524' }}>{feedback.text}</span>
              </div>
            ) : coachMessage ? (
              <div className="anim-slide-up p-3 rounded-2xl" style={{ backgroundColor: '#C44536' }}>
                <div className="flex items-start gap-2">
                  <Coffee className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#FAF6EF' }}/>
                  <div className="text-sm" style={{ color: '#FAF6EF' }}>{coachMessage.text}</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => { setCoachMessage(null); stopRecording(); }} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#FAF6EF', color: '#C44536' }}>
                    הפסקה קצרה
                  </button>
                  <button onClick={() => setCoachMessage(null)} className="flex-1 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'transparent', color: '#FAF6EF', border: '1px solid #FAF6EF' }}>
                    אני בסדר
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm italic" style={{ color: '#4A5568' }}>
                {isRecording ? 'מקשיבה לך...' : 'מוכנה כשתהיי מוכנה!'}
              </div>
            )}
          </div>

          {/* Live activity feed */}
          <div className="rounded-3xl p-5" style={{ backgroundColor: '#FAF6EF', border: '1px solid #E8DFD0' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-black uppercase tracking-wider" style={{ color: '#1A2B4A' }}>זרם אירועים חי</div>
              <div className="text-[10px]" style={{ color: '#4A5568' }}>{liveLog.length}</div>
            </div>

            {liveLog.length === 0 ? (
              <div className="text-center py-8 text-sm italic" style={{ color: '#8A95A8' }}>
                אירועי הקריאה יופיעו כאן בזמן אמת
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-hidden">
                {liveLog.map((entry, i) => {
                  const config = {
                    'stuck': { icon: '⏸', color: '#F5A524', bg: '#FCE9CC' },
                    'hard-word': { icon: '★', color: '#7FB069', bg: '#D8E8D0' },
                    'error-phonetic': { icon: '!', color: '#C44536', bg: '#FFE5DC' },
                    'error-skip': { icon: '↷', color: '#C44536', bg: '#FFE5DC' },
                    'unmatched': { icon: '?', color: '#8A95A8', bg: '#F5F1E7' },
                  }[entry.type] || { icon: '•', color: '#1A2B4A', bg: '#F5F1E7' };

                  return (
                    <div key={entry.id} className="anim-slide-in-right flex items-start gap-2 p-2 rounded-xl" style={{ backgroundColor: config.bg, opacity: 1 - (i * 0.07) }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ backgroundColor: config.color, color: '#FAF6EF' }}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: '#1A2B4A' }}>{entry.message}</div>
                        {entry.word && <div className="text-[10px] truncate" style={{ color: '#4A5568' }}>"{entry.word}"{entry.heard && ` ← "${entry.heard}"`}</div>}
                      </div>
                      <div className="text-[9px] flex-shrink-0" style={{ color: '#8A95A8' }}>
                        {Math.floor((Date.now() - entry.time) / 1000)}s
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
