// contentImport.js — pipeline for importing custom content into ReadRight
//
// Supports 3 sources:
//   1. Raw text (paste)
//   2. URL (fetch + extract main content)
//   3. File (image with OCR, or PDF)
//
// All sources flow through the same final pipeline:
//   raw text → niqqud (via Dicta) → story object with word metadata

// ============================================
// SOURCE 1: TEXT (paste)
// ============================================
// Just clean and return. The simplest source.
export function cleanRawText(text) {
  if (!text) return '';
  return text
    .trim()
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Collapse whitespace
    .replace(/[ \t]+/g, ' ')
    // Normalize line breaks (max 2 newlines = paragraph break)
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

// ============================================
// SOURCE 2: URL (fetch webpage)
// ============================================
// Fetches a webpage and tries to extract the main article text.
// Uses a CORS proxy since most sites block direct browser fetches.
export async function fetchUrlContent(url) {
  if (!url) throw new Error('No URL provided');

  // Validate URL
  let validUrl;
  try {
    validUrl = new URL(url);
  } catch {
    throw new Error('כתובת URL לא תקינה');
  }

  // Use a CORS proxy. For production, swap to a self-hosted proxy or
  // a server endpoint that does the fetch + extraction.
  // Free option used here: r.jina.ai which extracts readable text from any URL.
  const proxyUrl = `https://r.jina.ai/${validUrl.toString()}`;

  try {
    const response = await fetch(proxyUrl, {
      headers: { 'Accept': 'text/plain' }
    });

    if (!response.ok) {
      throw new Error(`שגיאה בטעינת הדף: ${response.status}`);
    }

    const text = await response.text();

    // Jina returns markdown-ish text. Strip common noise.
    return text
      .replace(/^Title:.*$/m, '')
      .replace(/^URL Source:.*$/m, '')
      .replace(/^Markdown Content:/m, '')
      .replace(/!\[.*?\]\(.*?\)/g, '') // images
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → just text
      .replace(/^#+\s*/gm, '') // headers
      .replace(/[*_`]/g, '')
      .trim();
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('לא הצלחנו לטעון את הדף. נסה לבדוק את הקישור.');
    }
    throw err;
  }
}

// ============================================
// SOURCE 3a: IMAGE OCR (using Tesseract.js)
// ============================================
// Lazy-loads Tesseract.js only when needed (it's ~5MB).
let tesseractWorker = null;

export async function extractTextFromImage(file, onProgress) {
  // Dynamically import to avoid bundling Tesseract on initial load
  const Tesseract = await import('https://esm.sh/tesseract.js@5.1.1');

  if (!tesseractWorker) {
    if (onProgress) onProgress({ phase: 'loading', percent: 0 });

    // Hebrew language requires the heb traineddata file
    tesseractWorker = await Tesseract.createWorker(['heb'], 1, {
      logger: (m) => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress({ phase: 'recognizing', percent: m.progress * 100 });
        }
      }
    });
  }

  if (onProgress) onProgress({ phase: 'recognizing', percent: 0 });

  const { data } = await tesseractWorker.recognize(file);
  return data.text;
}

// ============================================
// SOURCE 3b: PDF EXTRACTION
// ============================================
// Tries text-based extraction first (works for digital PDFs).
// Falls back to OCR per-page for scanned PDFs.
export async function extractTextFromPDF(file, onProgress) {
  const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379/build/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  let needsOCR = false;

  // First pass: try text extraction
  for (let i = 1; i <= pdf.numPages; i++) {
    if (onProgress) onProgress({ phase: 'extracting', percent: (i / pdf.numPages) * 100 });

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ').trim();

    if (pageText.length < 50 && i === 1) {
      // First page has very little text → probably scanned, switch to OCR
      needsOCR = true;
      break;
    }
    fullText += pageText + '\n\n';
  }

  if (needsOCR) {
    // OCR fallback: render each page to canvas and run Tesseract
    fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      if (onProgress) onProgress({ phase: 'ocr', percent: ((i - 1) / pdf.numPages) * 100, page: i, totalPages: pdf.numPages });

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const pageText = await extractTextFromImage(blob);
      fullText += pageText + '\n\n';
    }
  }

  return fullText.trim();
}

// ============================================
// HEBREW NIQQUD via Dicta Nakdan API
// ============================================
// Dicta offers a free API at https://nakdan-api.dicta.org.il
// Documented at https://api.dicta.org.il
export async function addNiqqud(text) {
  if (!text || text.trim().length === 0) return text;

  // Split into chunks if too long (API has limits)
  const MAX_CHUNK = 8000;
  const chunks = [];
  let currentChunk = '';

  for (const paragraph of text.split('\n\n')) {
    if ((currentChunk + paragraph).length > MAX_CHUNK) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  // Process each chunk through Dicta
  const niqqudParts = [];
  for (const chunk of chunks) {
    try {
      const response = await fetch('https://nakdan-5-1.loadbalancer.dicta.org.il/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'nakdan',
          genre: 'modern',
          data: chunk,
          addmorph: false,
          keepqq: false,
          newjson: true,
          nodageshdefmem: false,
          patachma: false,
          useTokenization: true,
        }),
      });

      if (!response.ok) {
        // Dicta failed — fall back to unvocalized text
        niqqudParts.push(chunk);
        continue;
      }

      const data = await response.json();

      // Dicta returns a structured response; reconstruct the text
      let result = '';
      for (const item of data) {
        if (typeof item === 'string') {
          result += item;
        } else if (item.options && item.options.length > 0) {
          // Use first option (highest confidence)
          result += item.options[0].w || item.options[0];
        } else if (item.w) {
          result += item.w;
        } else if (item.options === undefined && item.word) {
          result += item.word;
        }
      }

      niqqudParts.push(result || chunk);
    } catch (err) {
      // Network or API error — graceful fallback
      console.warn('Niqqud API failed for chunk, using unvocalized', err);
      niqqudParts.push(chunk);
    }
  }

  return niqqudParts.join('\n\n');
}

// ============================================
// PROCESSING: raw text → story object
// ============================================
// Converts raw (possibly niqqud-ed) text into the same structure
// used by the built-in stories: paragraphs[].words[]
//
// Each word is: { text: "בְּעֶרֶב", plain: "בערב", isPunct: false }
export function textToStory(rawText, withNiqqud, metadata = {}) {
  const cleanedText = cleanRawText(withNiqqud || rawText);
  if (!cleanedText) return null;

  const paragraphs = [];

  // Split into paragraphs by double newlines
  const paraTexts = cleanedText.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  for (const paraText of paraTexts) {
    const words = [];

    // Tokenize: split on whitespace, then separate punctuation from words
    const tokens = paraText.split(/\s+/);

    for (const token of tokens) {
      if (!token) continue;

      // Use a regex to split punctuation from the word body
      // Hebrew word chars: \u05D0-\u05EA = letters, \u05B0-\u05BC,\u05BF-\u05C7 = vowels/marks
      const matches = token.match(/[\u05D0-\u05EA\u05B0-\u05BC\u05BF-\u05C7]+|[^\u05D0-\u05EA\u05B0-\u05BC\u05BF-\u05C7\s]+/g) || [];

      for (const match of matches) {
        const isPunct = !/[\u05D0-\u05EA]/.test(match);
        if (isPunct) {
          words.push({ text: match, plain: match, isPunct: true });
        } else {
          // Strip niqqud to make plain version
          const plain = stripNiqqud(match);
          // Detect hard words (long, with niqqud)
          const isHard = plain.length >= 6;
          words.push({
            text: match,
            plain: plain,
            isHard: isHard || undefined,
          });
        }
      }
    }

    if (words.length > 0) {
      paragraphs.push({ words });
    }
  }

  // Count words (excluding punctuation)
  const wordCount = paragraphs.reduce(
    (acc, p) => acc + p.words.filter(w => !w.isPunct).length,
    0
  );

  // Estimate level by avg word length and total length
  const avgWordLength = wordCount > 0
    ? paragraphs.flatMap(p => p.words).filter(w => !w.isPunct).reduce((a, w) => a + w.plain.length, 0) / wordCount
    : 4;
  const estimatedLevel = Math.max(1, Math.min(5, Math.round(avgWordLength - 2)));

  // Estimate reading time (avg 60 WPM for level 1, scales up)
  const wpm = 30 + estimatedLevel * 10;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / wpm));

  return {
    id: 'custom-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    title: metadata.title || generateTitleFromText(cleanedText),
    subtitle: metadata.subtitle || 'תוכן מותאם אישית',
    level: metadata.level || estimatedLevel,
    category: 'custom',
    interests: metadata.interests || [],
    emoji: metadata.emoji || '📄',
    estimatedMinutes,
    paragraphs,
    isCustom: true,
    source: metadata.source, // 'paste' | 'url' | 'file'
    sourceUrl: metadata.sourceUrl,
    createdAt: new Date().toISOString(),
  };
}

// Helper: strip Hebrew niqqud (vowel points) from a string
function stripNiqqud(text) {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

// Helper: generate a title from first few words of text
function generateTitleFromText(text) {
  const firstLine = text.split('\n')[0].trim();
  const words = firstLine.split(/\s+/).slice(0, 5);
  let title = words.join(' ');
  if (title.length > 40) title = title.slice(0, 40) + '...';
  if (firstLine.length > title.length) title += '...';
  return stripNiqqud(title) || 'סיפור ללא כותרת';
}

// ============================================
// MAIN ENTRY POINT — orchestrates the full pipeline
// ============================================
// Returns a story object ready to be saved.
// onProgress callback receives { phase, percent, message } updates.
export async function importContent({ source, text, url, file, metadata, addNiqqudFlag = true, onProgress }) {
  let rawText = '';

  // Step 1: Get the text from the source
  if (source === 'paste') {
    if (onProgress) onProgress({ phase: 'processing', percent: 50, message: 'מעבד טקסט...' });
    rawText = cleanRawText(text);
  } else if (source === 'url') {
    if (onProgress) onProgress({ phase: 'fetching', percent: 20, message: 'טוען את הדף...' });
    rawText = await fetchUrlContent(url);
    if (onProgress) onProgress({ phase: 'cleaning', percent: 40, message: 'מנקה תוכן...' });
    rawText = cleanRawText(rawText);
  } else if (source === 'file') {
    if (!file) throw new Error('לא נבחר קובץ');

    if (file.type === 'application/pdf') {
      if (onProgress) onProgress({ phase: 'extracting', percent: 10, message: 'קורא PDF...' });
      rawText = await extractTextFromPDF(file, (p) => {
        if (onProgress) onProgress({
          phase: p.phase,
          percent: 10 + p.percent * 0.5,
          message: p.phase === 'ocr'
            ? `סורק עמוד ${p.page} מתוך ${p.totalPages}...`
            : 'קורא PDF...'
        });
      });
    } else if (file.type.startsWith('image/')) {
      if (onProgress) onProgress({ phase: 'ocr', percent: 10, message: 'מזהה טקסט מהתמונה...' });
      rawText = await extractTextFromImage(file, (p) => {
        if (onProgress) onProgress({
          phase: p.phase,
          percent: 10 + p.percent * 0.5,
          message: p.phase === 'loading' ? 'טוען מנוע OCR...' : 'מזהה טקסט...'
        });
      });
    } else {
      throw new Error('סוג קובץ לא נתמך. נסה PDF או תמונה.');
    }
    rawText = cleanRawText(rawText);
  } else {
    throw new Error('מקור לא ידוע');
  }

  if (!rawText || rawText.length < 10) {
    throw new Error('לא הצלחנו לחלץ טקסט מספיק. נסה מקור אחר.');
  }

  // Step 2: Add niqqud if requested
  let niqqudedText = rawText;
  if (addNiqqudFlag) {
    if (onProgress) onProgress({ phase: 'niqqud', percent: 65, message: 'מוסיף ניקוד...' });
    try {
      niqqudedText = await addNiqqud(rawText);
    } catch (err) {
      console.warn('Niqqud failed, using plain text:', err);
      niqqudedText = rawText;
    }
  }

  // Step 3: Convert to story structure
  if (onProgress) onProgress({ phase: 'building', percent: 90, message: 'בונה סיפור...' });
  const story = textToStory(rawText, niqqudedText, metadata);

  if (!story) {
    throw new Error('לא הצלחנו לבנות סיפור מהטקסט.');
  }

  if (onProgress) onProgress({ phase: 'done', percent: 100, message: 'מוכן!' });
  return story;
}
