import useMessageNotice from "../../components/ui/useMessageNotice";
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
  useMessageNotice(message);

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
          text: `מצאתי תיקון קטן: ${result.originalInput} → ${result.correctedWord}.`,
        });
      } else {
        setMessage({
          type: "success",
          text: "המילה נבדקה ותורגמה בהצלחה.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setTranslating(false);
    }
  };

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
        text: "המילה נשמרה במילון האישי.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSaving(false);
    }
  };

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
    <div className="space-y-5" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              מילון אישי
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              המילים שלי באנגלית
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              כתבי מילה או ביטוי, תני למערכת לבדוק ולתרגם, ושמרי למילון האישי
              כדי לחזור ולתרגל.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[330px]">
            <StatBox label="סה״כ" value={stats.total} tone="yellow" />
            <StatBox label="יודעת" value={stats.mastered} tone="green" />
            <StatBox label="בתרגול" value={stats.practicing} tone="red" />
          </div>
        </div>
      </section>



      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        <section
          className="relative h-fit overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-2xl font-black">הוספת מילה</h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
              אפשר להכניס מילה, לבדוק אותה, ואז לשמור.
            </p>

            <form onSubmit={handleSaveWord} className="mt-5 space-y-4">
              <TextInput
                label="מילה / ביטוי באנגלית"
                value={form.word}
                onChange={(value) => updateField("word", value)}
                placeholder="challenge"
                dir="ltr"
              />

              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating || !form.word.trim()}
                className="w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow:
                    translating || !form.word.trim()
                      ? "none"
                      : "0 6px 0 rgba(89,15,20,0.42)",
                }}
              >
                {translating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <SmallSpinner />
                    בודק ומתרגם...
                  </span>
                ) : (
                  "בדוק ותרגם"
                )}
              </button>

              <TextInput
                label="תרגום לעברית"
                value={form.translation}
                onChange={(value) => updateField("translation", value)}
                placeholder="תרגום"
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
                className="w-full rounded-full border-2 border-yellow-300/70 bg-yellow-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:brightness-105 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <DarkSpinner />
                    שומר...
                  </span>
                ) : (
                  "שמור במילון"
                )}
              </button>
            </form>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש במילון..."
                className="w-full rounded-full border-2 border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15 md:max-w-md"
              />

              <div className="flex flex-wrap gap-2">
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

            {loading ? (
              <LoadingState />
            ) : filteredWords.length === 0 ? (
              <EmptyDictionary />
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
          </div>
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1.35rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-white/70">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-[1.2rem] border-2 border-white/18 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-white/70">
        {label}
      </label>

      <textarea
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full resize-none rounded-[1.2rem] border-2 border-white/18 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
      />
    </div>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-2 text-xs font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {label}
    </button>
  );
}

function WordCard({ word, isLoading, onToggle, onDelete }) {
  return (
    <article
      className={`rounded-[1.7rem] border-2 p-4 transition ${
        word.mastered
          ? "border-emerald-300/28 bg-emerald-400/10"
          : "border-white/16 bg-white/10 hover:border-yellow-300/38 hover:bg-white/13"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className="truncate text-2xl font-black tracking-wide text-yellow-300"
            dir="ltr"
          >
            {word.word}
          </h3>

          <p className="mt-1 text-base font-black text-white">
            {word.translation}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${
            word.mastered
              ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-100"
              : "border-red-300/35 bg-red-500/12 text-red-100"
          }`}
        >
          {word.mastered ? "יודעת" : "בתרגול"}
        </span>
      </div>

      {word.definition && (
        <p className="mb-3 text-sm font-semibold leading-6 text-white/55" dir="ltr">
          {word.definition}
        </p>
      )}

      {word.example && (
        <div className="mb-4 rounded-[1.2rem] border border-white/10 bg-slate-950/55 p-3">
          <div className="mb-1 text-xs font-black text-white/35">Example</div>

          <p className="text-sm font-semibold italic leading-6 text-white/65" dir="ltr">
            {word.example}
          </p>
        </div>
      )}

      <div className="flex gap-3 border-t border-white/8 pt-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={isLoading}
          className={`flex-1 rounded-full border px-4 py-2 text-xs font-black transition disabled:opacity-60 ${
            word.mastered
              ? "border-white/16 bg-white/8 text-white/60 hover:bg-white/12"
              : "border-yellow-300/55 bg-yellow-300 px-4 text-slate-950 hover:brightness-105"
          }`}
        >
          {isLoading ? "מעדכן..." : word.mastered ? "החזירי לתרגול" : "אני יודעת"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-full border border-red-300/30 bg-red-500/12 px-4 py-2 text-xs font-black text-red-100 transition hover:bg-red-500/22 disabled:opacity-60"
        >
          מחיקה
        </button>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black text-white">
          טוען את המילון...
        </p>
      </div>
    </div>
  );
}

function EmptyDictionary() {
  return (
    <div className="rounded-[1.8rem] border-2 border-dashed border-white/20 bg-white/8 p-8 text-center">
      <h2 className="text-2xl font-black text-white">אין מילים להצגה</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
        בדקי מילה חדשה ושמרי אותה במילון האישי.
      </p>
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

function DarkSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
  );
}