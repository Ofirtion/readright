// ImportContent.jsx — page where parents can import their own content
// Three sources: paste text, URL, file upload (with OCR support)

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Link as LinkIcon, FileText, Image as ImageIcon, FileType,
  Sparkles, AlertCircle, CheckCircle, X, ArrowLeft, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../lib/theme';
import { importContent } from '../lib/contentImport';
import Layout from '../components/Layout';
import { canUseCustomContent } from '../lib/subscription';

const SOURCE_TABS = [
  { id: 'paste',  label: 'הדבקת טקסט',   icon: FileText, color: colors.sun },
  { id: 'url',    label: 'קישור לדף',      icon: LinkIcon, color: colors.rust },
  { id: 'file',   label: 'העלאת קובץ',    icon: Upload,    color: colors.green },
];

const STORY_EMOJIS = ['📄', '📚', '🦊', '🦁', '🐶', '🐱', '🦋', '🌳', '⭐', '🚀', '🏰', '🎈', '🌈', '🎨'];

export default function ImportContent({ onNavigate, childId }) {
  const { addCustomStory, getChild } = useAuth();
  const child = childId ? getChild(childId) : null;

  // Premium-only feature: send restricted users to paywall
  useEffect(() => {
    if (!canUseCustomContent()) {
      onNavigate('paywall', { reason: 'custom_story' });
    }
  }, [onNavigate]);

  const [source, setSource] = useState('paste');

  // Inputs per source
  const [pastedText, setPastedText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Story metadata
  const [storyTitle, setStoryTitle] = useState('');
  const [storyEmoji, setStoryEmoji] = useState('📄');
  const [addNiqqudFlag, setAddNiqqudFlag] = useState(true);

  // Pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, message: '' });
  const [error, setError] = useState(null);
  const [resultStory, setResultStory] = useState(null);

  // Editable level in preview (overrides auto-detected level)
  const [editedLevel, setEditedLevel] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (!storyTitle) {
      // Use filename (without extension) as default title
      setStoryTitle(file.name.replace(/\.[^.]+$/, ''));
    }
    // Auto-pick emoji based on file type
    if (file.type.startsWith('image/')) setStoryEmoji('📷');
    else if (file.type === 'application/pdf') setStoryEmoji('📚');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const canProcess = () => {
    if (isProcessing) return false;
    if (source === 'paste') return pastedText.trim().length >= 10;
    if (source === 'url') return urlInput.trim().length > 0;
    if (source === 'file') return selectedFile !== null;
    return false;
  };

  const handleProcess = async () => {
    setError(null);
    setResultStory(null);
    setIsProcessing(true);
    setProgress({ percent: 0, message: 'מתחיל...' });

    try {
      const story = await importContent({
        source,
        text: pastedText,
        url: urlInput,
        file: selectedFile,
        metadata: {
          title: storyTitle || undefined,
          emoji: storyEmoji,
          source: source,
          sourceUrl: source === 'url' ? urlInput : undefined,
        },
        addNiqqudFlag,
        onProgress: (p) => setProgress(p),
      });
      setResultStory(story);
      // Seed editable fields with auto-detected values
      setEditedLevel(story.level);
      setEditedTitle(story.title);
    } catch (err) {
      console.error('Import failed:', err);
      setError(err.message || 'שגיאה לא ידועה. נסה שוב.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!resultStory) return;
    // Apply user edits + bind to current child
    const finalStory = {
      ...resultStory,
      title: editedTitle || resultStory.title,
      level: editedLevel || resultStory.level,
      childId: childId,
    };
    await addCustomStory(finalStory);
    onNavigate('story-library', { childId });
  };

  const handleReset = () => {
    setResultStory(null);
    setError(null);
    setProgress({ percent: 0, message: '' });
    setEditedLevel(null);
    setEditedTitle('');
  };

  // If we have a result, show preview
  if (resultStory) {
    const wordCount = resultStory.paragraphs.reduce(
      (acc, p) => acc + p.words.filter(w => !w.isPunct).length, 0
    );
    const isLong = wordCount > 250;

    return (
      <Layout onNavigate={onNavigate} showBack>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Success header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: colors.greenLight }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: colors.green }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wider" style={{ color: colors.rust }}>
                הסיפור מוכן ✨
              </div>
              <h1
                className="text-3xl font-black"
                style={{ color: colors.navy, fontFamily: fonts.display }}
              >
                בדוק, ערוך, ושמור
              </h1>
              {child && (
                <div className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  הסיפור יישמר עבור <strong>{child.name}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Long-text warning */}
          {isLong && (
            <div
              className="rounded-2xl p-4 mb-4 flex items-start gap-3"
              style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.rust }} />
              <div className="text-sm" style={{ color: colors.navy }}>
                <strong>הטקסט ארוך יחסית ({wordCount} מילים).</strong> ילדים בדרך כלל
                מתעייפים אחרי 200-250 מילים. הילד יוכל לעצור בכל רגע ולחזור אחר כך —
                ההתקדמות תישמר.
              </div>
            </div>
          )}

          {/* Editable metadata card */}
          <div
            className="rounded-3xl p-6 mb-4"
            style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
          >
            <div className="text-xs font-bold mb-3" style={{ color: colors.textSecondary }}>
              ערוך פרטים (לא חובה)
            </div>

            {/* Title editor */}
            <div className="mb-4">
              <label className="text-xs font-bold mb-1 block" style={{ color: colors.navy }}>
                שם הסיפור
              </label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-base outline-none transition"
                style={{
                  backgroundColor: colors.cream,
                  border: `1.5px solid ${colors.border}`,
                  color: colors.navy,
                  fontFamily: fonts.display,
                }}
              />
            </div>

            {/* Level adjustment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold" style={{ color: colors.navy }}>
                  רמת קריאה
                </label>
                <div className="text-xs" style={{ color: colors.textSecondary }}>
                  המערכת הציעה: רמה {resultStory.level}
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setEditedLevel(lvl)}
                    className="flex-1 py-2.5 rounded-xl font-black text-base transition"
                    style={{
                      backgroundColor: editedLevel === lvl ? colors.navy : colors.cream,
                      color: editedLevel === lvl ? colors.sun : colors.textSecondary,
                      border: `1.5px solid ${editedLevel === lvl ? colors.navy : colors.border}`,
                      fontFamily: fonts.display,
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <div className="text-xs mt-2" style={{ color: colors.textMuted }}>
                {editedLevel === 1 && '🌱 כיתה א׳ · מתחילים · מילים קצרות'}
                {editedLevel === 2 && '🌿 כיתה ב׳ · מילים עם 2-3 הברות'}
                {editedLevel === 3 && '🌳 כיתות ג׳-ד׳ · משפטים מורכבים יותר'}
                {editedLevel === 4 && '🌲 כיתות ה׳-ו׳ · אוצר מילים מתקדם'}
                {editedLevel === 5 && '🏔️ כיתה ז׳+ · קריאה שוטפת'}
              </div>
            </div>
          </div>

          <StoryPreview story={{ ...resultStory, title: editedTitle, level: editedLevel || resultStory.level }} />

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSave}
              className="flex-1 py-4 rounded-full font-black text-base transition hover:scale-[1.02]"
              style={{ backgroundColor: colors.navy, color: colors.sun }}
            >
              שמור והוסף ל"הסיפורים שלי"
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 rounded-full font-bold text-sm transition"
              style={{
                backgroundColor: 'transparent',
                color: colors.textSecondary,
                border: `1.5px solid ${colors.border}`,
              }}
            >
              התחל מחדש
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout onNavigate={onNavigate} showBack>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-bold tracking-wider mb-2" style={{ color: colors.rust }}>
            הוספת תוכן מותאם אישית
          </div>
          <h1
            className="text-4xl font-black mb-3"
            style={{ color: colors.navy, fontFamily: fonts.display }}
          >
            הביאו את הסיפור שלכם
          </h1>
          <p className="text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            הדביקו טקסט, שתפו קישור לדף אינטרנט, או העלו תמונה / PDF. המערכת תוסיף ניקוד אוטומטית ותכין את הסיפור לקריאה.
          </p>

          {/* Child indicator */}
          {child && (
            <div
              className="mt-5 inline-flex items-center gap-3 px-4 py-2.5 rounded-full"
              style={{ backgroundColor: colors.sunLight, border: `1px solid ${colors.sun}` }}
            >
              <div className="text-2xl">{child.avatar_emoji || '👧'}</div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.rust }}>
                  מוסיף סיפור עבור
                </div>
                <div className="text-sm font-black" style={{ color: colors.navy }}>
                  {child.name} · רמה {child.reading_level}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Source tabs */}
        <div
          className="flex gap-2 p-1.5 rounded-2xl mb-6"
          style={{ backgroundColor: colors.creamDark }}
        >
          {SOURCE_TABS.map(tab => {
            const Icon = tab.icon;
            const active = source === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSource(tab.id)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                style={{
                  backgroundColor: active ? colors.cream : 'transparent',
                  color: active ? colors.navy : colors.textSecondary,
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Source input panels */}
        <div className="mb-6">
          {source === 'paste' && (
            <PasteInput value={pastedText} onChange={setPastedText} />
          )}
          {source === 'url' && (
            <UrlInput value={urlInput} onChange={setUrlInput} />
          )}
          {source === 'file' && (
            <FileInput
              file={selectedFile}
              onSelect={handleFileSelect}
              onDrop={handleDrop}
              onClear={() => setSelectedFile(null)}
              fileInputRef={fileInputRef}
            />
          )}
        </div>

        {/* Story options */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: colors.creamLight, border: `1px solid ${colors.border}` }}
        >
          <div className="font-bold mb-4 text-sm" style={{ color: colors.navy }}>
            פרטי הסיפור
          </div>

          <label className="block mb-4">
            <span className="text-xs font-bold mb-2 block" style={{ color: colors.textSecondary }}>
              כותרת הסיפור (אופציונלי)
            </span>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="ייווצר אוטומטית אם נשאיר ריק"
              className="w-full px-4 py-2.5 rounded-xl text-sm"
              style={{
                backgroundColor: colors.cream,
                border: `1.5px solid ${colors.border}`,
                color: colors.navy,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </label>

          <div className="mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: colors.textSecondary }}>
              אייקון לסיפור
            </div>
            <div className="flex gap-2 flex-wrap">
              {STORY_EMOJIS.map(em => (
                <button
                  key={em}
                  onClick={() => setStoryEmoji(em)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition"
                  style={{
                    backgroundColor: storyEmoji === em ? colors.sunLight : colors.cream,
                    border: `1.5px solid ${storyEmoji === em ? colors.sun : colors.border}`,
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={addNiqqudFlag}
              onChange={(e) => setAddNiqqudFlag(e.target.checked)}
              className="w-5 h-5 rounded"
              style={{ accentColor: colors.navy }}
            />
            <div>
              <div className="font-bold text-sm" style={{ color: colors.navy }}>
                הוסף ניקוד אוטומטית
              </div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>
                ⚡ ממונע על ידי Dicta Nakdan — מומלץ לילדים שלומדים לקרוא
              </div>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 p-4 rounded-2xl mb-6"
            style={{ backgroundColor: colors.rustLight }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.rust }} />
            <div className="flex-1 text-sm" style={{ color: colors.navy }}>
              {error}
            </div>
          </div>
        )}

        {/* Progress */}
        {isProcessing && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: colors.sunLight }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: colors.navy }}
              />
              <div className="font-bold text-sm" style={{ color: colors.navy }}>
                {progress.message || 'מעבד...'}
              </div>
              <div className="ml-auto font-mono text-sm font-bold" style={{ color: colors.navy }}>
                {Math.round(progress.percent || 0)}%
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress.percent || 0}%`,
                  backgroundColor: colors.navy,
                }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleProcess}
          disabled={!canProcess()}
          className="w-full py-4 rounded-full font-black text-base transition flex items-center justify-center gap-3"
          style={{
            backgroundColor: canProcess() ? colors.navy : colors.border,
            color: canProcess() ? colors.sun : colors.textMuted,
            cursor: canProcess() ? 'pointer' : 'not-allowed',
            transform: canProcess() ? 'scale(1)' : 'scale(1)',
          }}
        >
          <Sparkles className="w-5 h-5" />
          {isProcessing ? 'מעבד...' : 'יצירת הסיפור'}
        </button>
      </div>
    </Layout>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function PasteInput({ value, onChange }) {
  const charCount = value.length;
  return (
    <div>
      <div
        className="text-xs font-bold mb-2 flex justify-between"
        style={{ color: colors.textSecondary }}
      >
        <span>הדבק כאן את הטקסט שתרצה שהילד יקרא</span>
        <span style={{ color: charCount > 5000 ? colors.rust : colors.textSecondary }}>
          {charCount} תווים
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="דָּנָה הָלְכָה לַגַּן. בַּגַּן הָיָה כֶּלֶב חוּם וְקָטָן..."
        rows={10}
        className="w-full px-4 py-3 rounded-2xl text-base leading-relaxed"
        style={{
          backgroundColor: colors.creamLight,
          border: `1.5px solid ${colors.border}`,
          color: colors.navy,
          outline: 'none',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
      <div className="text-xs mt-2" style={{ color: colors.textMuted }}>
        💡 טיפ: כדי להגדיר פסקאות, השאר שורה ריקה בין פסקה לפסקה
      </div>
    </div>
  );
}

function UrlInput({ value, onChange }) {
  return (
    <div>
      <div className="text-xs font-bold mb-2" style={{ color: colors.textSecondary }}>
        קישור לדף אינטרנט (Wikipedia, מאמר חדשותי, סיפור באתר וכו')
      </div>
      <div className="relative">
        <LinkIcon
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: colors.textMuted, right: '16px' }}
        />
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://he.wikipedia.org/wiki/..."
          className="w-full py-3 rounded-2xl text-base"
          style={{
            paddingRight: '48px',
            paddingLeft: '16px',
            backgroundColor: colors.creamLight,
            border: `1.5px solid ${colors.border}`,
            color: colors.navy,
            outline: 'none',
            fontFamily: 'inherit',
            direction: 'ltr',
            textAlign: 'right',
          }}
        />
      </div>
      <div className="text-xs mt-2" style={{ color: colors.textMuted }}>
        💡 המערכת תחלץ את הטקסט הראשי מהדף, ללא תפריטים ופרסומות
      </div>
    </div>
  );
}

function FileInput({ file, onSelect, onDrop, onClear, fileInputRef }) {
  const [isDragging, setIsDragging] = useState(false);

  if (file) {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    return (
      <div
        className="rounded-2xl p-6 flex items-center gap-4"
        style={{
          backgroundColor: colors.creamLight,
          border: `1.5px solid ${colors.border}`,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isImage ? colors.rustLight : colors.sunLight }}
        >
          {isImage ? (
            <ImageIcon className="w-6 h-6" style={{ color: colors.rust }} />
          ) : (
            <FileType className="w-6 h-6" style={{ color: colors.sun }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-sm mb-1 truncate"
            style={{ color: colors.navy }}
          >
            {file.name}
          </div>
          <div className="text-xs" style={{ color: colors.textSecondary }}>
            {(file.size / 1024).toFixed(1)} KB · {isImage ? 'תמונה — יעבור OCR' : isPdf ? 'PDF — יחולץ טקסט' : file.type}
          </div>
        </div>
        <button
          onClick={onClear}
          className="w-9 h-9 rounded-full flex items-center justify-center transition"
          style={{ backgroundColor: colors.cream }}
        >
          <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { setIsDragging(false); onDrop(e); }}
      onClick={() => fileInputRef.current?.click()}
      className="rounded-2xl p-8 text-center cursor-pointer transition"
      style={{
        backgroundColor: isDragging ? colors.sunLight : colors.creamLight,
        border: `2px dashed ${isDragging ? colors.sun : colors.border}`,
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={onSelect}
        className="hidden"
      />
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: colors.cream }}
      >
        <Upload className="w-6 h-6" style={{ color: colors.navy }} />
      </div>
      <div
        className="font-black mb-1"
        style={{ color: colors.navy, fontFamily: fonts.display, fontSize: '20px' }}
      >
        גרור קובץ או לחץ לבחירה
      </div>
      <div className="text-sm mb-3" style={{ color: colors.textSecondary }}>
        תמונה (JPG/PNG) · PDF
      </div>
      <div className="text-xs" style={{ color: colors.textMuted }}>
        תמונות יעברו זיהוי טקסט אוטומטי (OCR) · ⚡ הכל קורה בדפדפן שלך
      </div>
    </div>
  );
}

function StoryPreview({ story }) {
  // Show first 2 paragraphs as preview, with stats
  const totalWords = story.paragraphs.reduce(
    (acc, p) => acc + p.words.filter(w => !w.isPunct).length,
    0
  );

  const previewParagraphs = story.paragraphs.slice(0, 2);
  const remaining = story.paragraphs.length - 2;

  return (
    <div>
      {/* Story header card */}
      <div
        className="rounded-3xl p-6 mb-4"
        style={{
          backgroundColor: colors.creamLight,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 text-4xl"
            style={{ backgroundColor: colors.sunLight }}
          >
            {story.emoji}
          </div>
          <div className="flex-1">
            <h2
              className="text-2xl font-black mb-1"
              style={{ color: colors.navy, fontFamily: fonts.display }}
            >
              {story.title}
            </h2>
            <div
              className="text-sm mb-3"
              style={{ color: colors.textSecondary }}
            >
              {story.subtitle}
            </div>
            <div className="flex gap-3 flex-wrap">
              <Stat label="רמה" value={story.level} />
              <Stat label="מילים" value={totalWords} />
              <Stat label="פסקאות" value={story.paragraphs.length} />
              <Stat label="זמן קריאה" value={`${story.estimatedMinutes} דק׳`} />
            </div>
          </div>
        </div>
      </div>

      {/* Text preview */}
      <div
        className="rounded-3xl p-6"
        style={{
          backgroundColor: colors.cream,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="text-xs font-bold mb-4 flex items-center gap-2"
          style={{ color: colors.textSecondary }}
        >
          תצוגה מקדימה של הטקסט:
        </div>
        <div
          className="space-y-4"
          style={{
            fontFamily: fonts.display,
            fontSize: '22px',
            lineHeight: 1.9,
            color: colors.navy,
          }}
        >
          {previewParagraphs.map((para, pIdx) => (
            <p key={pIdx}>
              {para.words.map((word, wIdx) => (
                <span key={wIdx}>
                  {word.text}
                  {!word.isPunct && ' '}
                </span>
              ))}
            </p>
          ))}
          {remaining > 0 && (
            <div
              className="text-sm pt-3"
              style={{
                color: colors.textMuted,
                fontFamily: 'inherit',
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              ... ועוד {remaining} פסקאות
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      className="px-3 py-1.5 rounded-full flex items-center gap-2"
      style={{ backgroundColor: colors.cream, border: `1px solid ${colors.border}` }}
    >
      <span className="text-xs font-bold" style={{ color: colors.textSecondary }}>
        {label}
      </span>
      <span className="text-sm font-black" style={{ color: colors.navy }}>
        {value}
      </span>
    </div>
  );
}
