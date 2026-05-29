import React, { useEffect, useMemo, useState } from "react";
import { getDictionaryHelper } from "../../services/aiService";
import {
  addDictionaryWord,
  deleteDictionaryWord,
  getMyDictionaryWords,
  toggleDictionaryWordMastered,
} from "../../services/dictionaryService";
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";

export default function Dictionary() {
  const [words, setWords] = useState([]);

  const [form, setForm] = useState({
    word: "",
    translation: "",
    definition: "",
    example: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // טעינת המילון האישי מהשרת
  const loadWords = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getMyDictionaryWords();
      setWords(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const stats = useMemo(() => {
    const mastered = words.filter((word) => word.mastered).length;
    const practicing = words.length - mastered;

    return {
      total: words.length,
      mastered,
      practicing,
    };
  }, [words]);

  const filteredWords = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    return words.filter((word) => {
      const matchesSearch =
        !search ||
        word.word?.toLowerCase().includes(search) ||
        word.translation?.toLowerCase().includes(search);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "mastered" && word.mastered) ||
        (activeFilter === "practice" && !word.mastered);

      return matchesSearch && matchesFilter;
    });
  }, [words, searchQuery, activeFilter]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // בדיקה, תיקון ותרגום בעזרת AI
  const handleTranslate = async () => {
    if (!form.word.trim()) {
      setMessage({
        type: "error",
        text: "כתבי קודם מילה או ביטוי באנגלית לתרגום.",
      });
      return;
    }

    try {
      setTranslating(true);
      setMessage({ type: "", text: "" });

      const result = await getDictionaryHelper(form.word.trim());

      setForm((prev) => ({
        ...prev,
        word: result.correctedWord || prev.word,
        translation: result.translation || "",
        definition: result.definition || "",
        example: result.example || "",
      }));

      if (result.wasCorrected) {
        setMessage({
          type: "success",
          text: `מצאתי תיקון קטן: ${result.originalInput} → ${result.correctedWord}. אפשר לשמור את המילה המתוקנת.`,
        });
      } else {
        setMessage({
          type: "success",
          text: "המילה נבדקה, תורגמה והושלמה בעזרת AI.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setTranslating(false);
    }
  };

  // שמירת מילה חדשה במילון
  const handleSaveWord = async (e) => {
    e.preventDefault();

    if (!form.word.trim()) {
      setMessage({ type: "error", text: "חובה להזין מילה באנגלית." });
      return;
    }

    if (!form.translation.trim()) {
      setMessage({ type: "error", text: "חובה להזין תרגום לעברית." });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const savedWord = await addDictionaryWord({
        word: form.word.trim(),
        translation: form.translation.trim(),
        definition: form.definition.trim(),
        example: form.example.trim(),
      });

      setWords((prev) => [savedWord, ...prev]);

      setForm({
        word: "",
        translation: "",
        definition: "",
        example: "",
      });

      setMessage({
        type: "success",
        text: "המילה נשמרה במילון האישי שלך.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSaving(false);
    }
  };

  // סימון מילה כיודעת / בתרגול
  const handleToggleMastered = async (wordId) => {
    try {
      setActionLoadingId(wordId);

      const updatedWord = await toggleDictionaryWordMastered(wordId);

      setWords((prev) =>
        prev.map((word) => (word._id === wordId ? updatedWord : word))
      );
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  // מחיקת מילה מהמילון
  const handleDeleteWord = async (wordId) => {
    try {
      setActionLoadingId(wordId);

      await deleteDictionaryWord(wordId);

      setWords((prev) => prev.filter((word) => word._id !== wordId));

      setMessage({
        type: "success",
        text: "המילה נמחקה מהמילון.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <SmartGuideBackButton />

      <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              📓 המילון האישי שלי
            </h1>

            <p className="text-gray-400 mt-2">
              כתבי מילה או ביטוי באנגלית, תני ל־AI לבדוק, לתקן ולתרגם,
              ושמרי למילון האישי שלך.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 min-w-[320px]">
            <StatBox label="סה״כ" value={stats.total} />

            <StatBox
              label="יודעת"
              value={stats.mastered}
              color="text-emerald-400"
            />

            <StatBox
              label="בתרגול"
              value={stats.practicing}
              color="text-yellow-400"
            />
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-black mb-2">➕ הוספת מילה</h2>

          <p className="text-gray-400 text-sm mb-5">
            גם אם כתבת בטעות עם שגיאת כתיב, ה־AI ינסה לתקן לפני השמירה.
          </p>

          <form onSubmit={handleSaveWord} className="space-y-4">
            <TextInput
              label="מילה / ביטוי באנגלית"
              value={form.word}
              onChange={(value) => updateField("word", value)}
              placeholder="לדוגמה: beatiful / challenge"
              dir="ltr"
            />

            <button
              type="button"
              onClick={handleTranslate}
              disabled={translating || !form.word.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-all"
            >
              {translating
                ? "בודק ומתרגם בעזרת AI..."
                : "בדוק ותרגם בעזרת AI ✨"}
            </button>

            <TextInput
              label="תרגום לעברית"
              value={form.translation}
              onChange={(value) => updateField("translation", value)}
              placeholder="לדוגמה: אתגר"
            />

            <TextArea
              label="הסבר קצר באנגלית"
              value={form.definition}
              onChange={(value) => updateField("definition", value)}
              placeholder="Short English definition..."
              dir="ltr"
            />

            <TextArea
              label="משפט דוגמה"
              value={form.example}
              onChange={(value) => updateField("example", value)}
              placeholder="Example sentence..."
              dir="ltr"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-3 rounded-xl transition-all shadow-md"
            >
              {saving ? "שומר..." : "שמור במילון"}
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש במילון..."
                className="w-full md:max-w-md bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
              />

              <div className="flex gap-2">
                <FilterButton
                  label="הכל"
                  active={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                />

                <FilterButton
                  label="בתרגול"
                  active={activeFilter === "practice"}
                  onClick={() => setActiveFilter("practice")}
                />

                <FilterButton
                  label="יודעת"
                  active={activeFilter === "mastered"}
                  onClick={() => setActiveFilter("mastered")}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[35vh] flex items-center justify-center text-white font-bold text-xl">
              <div className="animate-pulse">טוען מילון... 📓</div>
            </div>
          ) : filteredWords.length === 0 ? (
            <EmptyDictionary />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWords.map((word) => (
                <WordCard
                  key={word._id}
                  word={word}
                  isLoading={actionLoadingId === word._id}
                  onToggle={() => handleToggleMastered(word._id)}
                  onDelete={() => handleDeleteWord(word._id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-white placeholder:text-gray-500"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-white placeholder:text-gray-500 resize-none"
      />
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        active
          ? "bg-yellow-400 text-slate-950"
          : "bg-slate-950/60 text-gray-300 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function WordCard({ word, isLoading, onToggle, onDelete }) {
  return (
    <div
      className={`border rounded-3xl p-5 transition-all ${
        word.mastered
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3
            className="text-2xl font-black text-yellow-400 tracking-wide"
            dir="ltr"
          >
            {word.word}
          </h3>

          <p className="text-lg font-bold text-white mt-1">
            {word.translation}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-black border shrink-0 ${
            word.mastered
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {word.mastered ? "יודעת" : "בתרגול"}
        </span>
      </div>

      {word.definition && (
        <p className="text-sm text-gray-400 leading-relaxed mb-3" dir="ltr">
          {word.definition}
        </p>
      )}

      {word.example && (
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3 mb-4">
          <div className="text-xs text-gray-500 mb-1">Example</div>

          <p className="text-sm text-gray-300 italic" dir="ltr">
            {word.example}
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-white/5 flex justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={isLoading}
          className={`flex-1 text-xs font-black px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${
            word.mastered
              ? "bg-white/5 text-gray-400 hover:bg-white/10"
              : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20"
          }`}
        >
          {word.mastered ? "החזרי לתרגול" : "אני יודעת ✓"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="text-xs font-black px-4 py-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-60"
        >
          מחיקה
        </button>
      </div>
    </div>
  );
}

function EmptyDictionary() {
  return (
    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
      <div className="text-6xl mb-4">📭</div>

      <h2 className="text-2xl font-black mb-2">אין מילים להצגה</h2>

      <p className="text-gray-400">
        בדקי מילה חדשה בעזרת AI ושמרי אותה במילון האישי.
      </p>
    </div>
  );
}