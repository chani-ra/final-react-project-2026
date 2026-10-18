import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { checkEssayWithAI } from "../../../services/aiService";
import SmartGuideBackButton from "../../../components/ui/SmartGuideBackButton";
import { useNotices } from "../../../components/ui/NoticeProvider";

const SAMPLE_PROMPTS = [
  {
    title: "היום שלי",
    text: "Today I learned English. I practiced new words and tried to write better sentences.",
  },
  {
    title: "המטרה שלי באנגלית",
    text: "I want to improve my English because it can help me speak with more confidence.",
  },
  {
    title: "תחביב שאני אוהבת",
    text: "I like listening to music because it makes me happy and helps me learn new words.",
  },
];

export default function WritingTrainer() {
  const { user } = useSelector((state) => state.auth);
  const notices = useNotices();

  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  // All feedback appears in the shared centered notice rather than above the form.
  React.useEffect(() => {
    if (!message.text) return;
    if (message.type === "error") notices.error(message.text);
    if (message.type === "success") notices.success(message.text, "בדיקת הכתיבה הושלמה");
  }, [message, notices]);

  const studentLevel = user?.englishLevel || user?.level || "beginner";

  const wordCount = useMemo(() => {
    return essay.trim() ? essay.trim().split(/\s+/).length : 0;
  }, [essay]);

  const scoreStyle = getScoreStyle(result?.score);

  const handleCheckEssay = async () => {
    const cleanEssay = essay.trim();

    if (!cleanEssay) {
      setMessage({
        type: "error",
        text: "כתבי קודם פסקה באנגלית לבדיקה.",
      });
      return;
    }

    if (wordCount < 5) {
      setMessage({
        type: "error",
        text: "כדאי לכתוב לפחות 5 מילים כדי לקבל משוב משמעותי.",
      });
      return;
    }

    try {
      setChecking(true);
      setMessage({ type: "", text: "" });
      setResult(null);

      const data = await checkEssayWithAI({
        text: cleanEssay,
        studentLevel,
      });

      const verifiedScore = Number(data?.score);
      if (data?.score == null || !Number.isFinite(verifiedScore) || verifiedScore < 0 || verifiedScore > 100 || !data?.generalFeedback?.trim()) {
        throw new Error("לא התקבלה בדיקת כתיבה מלאה. נסי שוב בעוד רגע.");
      }
      setResult({
        score: verifiedScore,
        generalFeedback:
          data?.generalFeedback || "לא התקבל משוב מפורט כרגע.",
        grammarCorrections: Array.isArray(data?.grammarCorrections)
          ? data.grammarCorrections
          : [],
      });

      setMessage({
        type: "success",
        text: "הכתיבה נבדקה בהצלחה.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setChecking(false);
    }
  };

  const handlePromptClick = (promptText) => {
    setEssay(promptText);
    setResult(null);
    setMessage({ type: "", text: "" });
  };

  const handleClear = () => {
    setEssay("");
    setResult(null);
    setMessage({ type: "", text: "" });
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
              writing trainer
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              מאמן כתיבה באנגלית
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              כתבי פסקה באנגלית, והמערכת תיתן ציון, משוב ותיקונים נקודתיים
              כדי שתדעי בדיוק מה לשפר.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:min-w-[260px]">
            <StatBox label="רמה" value={getLevelLabel(studentLevel)} tone="yellow" />
            <StatBox label="מילים" value={wordCount} tone="red" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <section
          className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  כתבי כאן את הפסקה שלך
                </h2>

                <p className="mt-1 text-sm font-semibold leading-6 text-white/55">
                  מומלץ להתחיל מ־3 עד 6 משפטים פשוטים וברורים.
                </p>
              </div>

              <div className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
                {wordCount} מילים
              </div>
            </div>

            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              rows="9"
              dir="ltr"
              placeholder="Example: Today I learned new English words. I want to speak better and feel more confident..."
              className="w-full resize-none rounded-[1.5rem] border-2 border-white/18 bg-slate-950/70 p-5 text-base font-semibold leading-8 text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/70 focus:bg-slate-950/80"
            />

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                onClick={handleCheckEssay}
                disabled={checking || !essay.trim()}
                className="flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-7 py-3.5 text-sm font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow:
                    checking || !essay.trim()
                      ? "none"
                      : "0 7px 0 rgba(89,15,20,0.42)",
                }}
              >
                {checking ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <SmallSpinner />
                    בודק כתיבה...
                  </span>
                ) : (
                  "בדיקת כתיבה"
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={checking}
                className="rounded-full border-2 border-white/18 bg-white/10 px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/16 disabled:opacity-60"
              >
                ניקוי
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <section
            className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
            style={{
              boxShadow:
                "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-xl font-black text-white">רעיונות לכתיבה</h2>

              <p className="mt-1 text-sm font-semibold leading-6 text-white/55">
                לחצי על נושא כדי להתחיל מהר.
              </p>

              <div className="mt-4 space-y-3">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.title}
                    type="button"
                    onClick={() => handlePromptClick(prompt.text)}
                    className="w-full rounded-[1.4rem] border-2 border-white/14 bg-white/10 p-4 text-right transition hover:border-yellow-300/45 hover:bg-white/16"
                  >
                    <div className="font-black text-yellow-300">
                      {prompt.title}
                    </div>

                    <div
                      className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-white/50"
                      dir="ltr"
                    >
                      {prompt.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border-2 border-red-300/30 bg-red-500/12 p-5 text-white">
            <h2 className="text-lg font-black text-red-100">טיפ כתיבה</h2>

            <p className="mt-2 text-sm font-semibold leading-7 text-white/65">
              לא צריך לכתוב מושלם מהתחלה. כתבי פשוט, בדקי, ואז שפרי לפי
              התיקונים.
            </p>
          </section>
        </aside>
      </div>

      {checking && (
        <section
          className="relative overflow-hidden rounded-[2rem] border-2 border-yellow-300/35 bg-slate-950/65 p-7 text-center text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <LoadingCircle />

          <h2 className="mt-5 text-2xl font-black">בודק את הכתיבה שלך</h2>

          <p className="mt-2 text-sm font-semibold leading-7 text-white/60">
            המערכת מחפשת נקודות חזקות, טעויות לשיפור ותיקונים מתאימים.
          </p>
        </section>
      )}

      {result && !checking && (
        <section
          className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl md:p-6"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  תוצאות בדיקת הכתיבה
                </h2>

                <p className="mt-1 text-sm font-semibold text-white/55">
                  הנה המשוב שהתקבל על הפסקה שלך.
                </p>
              </div>

              <div
                className={`flex h-24 w-24 flex-col items-center justify-center rounded-[1.7rem] border-2 ${scoreStyle.box}`}
              >
                <div className={`text-3xl font-black ${scoreStyle.text}`}>
                  {result.score}
                </div>

                <div className="text-xs font-black text-white/45">ציון</div>
              </div>
            </div>

            <div className="mb-5 rounded-[1.6rem] border border-yellow-300/25 bg-yellow-300/12 p-5">
              <div className="mb-2 text-sm font-black text-yellow-100">
                משוב כללי
              </div>

              <p className="text-base font-semibold leading-8 text-white/75">
                {result.generalFeedback}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-black text-white">
                תיקונים והסברים
              </h3>

              {result.grammarCorrections.length === 0 ? (
                <div className="rounded-[1.6rem] border-2 border-emerald-300/30 bg-emerald-400/12 p-5 text-sm font-black text-emerald-100">
                  לא נמצאו תיקונים מיוחדים. יפה מאוד!
                </div>
              ) : (
                <div className="space-y-3">
                  {result.grammarCorrections.map((item, index) => (
                    <CorrectionCard
                      key={`${item.mistake || "mistake"}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CorrectionCard({ item }) {
  return (
    <div className="rounded-[1.6rem] border-2 border-white/16 bg-white/10 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-black text-red-100">לפני</div>

          <div
            className="rounded-[1.2rem] border border-red-300/28 bg-red-500/12 p-3 text-sm font-semibold leading-6 text-red-100"
            dir="ltr"
          >
            {item.mistake || "—"}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-black text-emerald-100">אחרי</div>

          <div
            className="rounded-[1.2rem] border border-emerald-300/28 bg-emerald-400/12 p-3 text-sm font-semibold leading-6 text-emerald-100"
            dir="ltr"
          >
            {item.correction || "—"}
          </div>
        </div>
      </div>

      {item.explanation && (
        <p className="mt-3 text-sm font-semibold leading-7 text-white/58">
          {item.explanation}
        </p>
      )}
    </div>
  );
}

function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1.35rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

function LoadingCircle() {
  return (
    <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

function getScoreStyle(score = 0) {
  if (score >= 85) {
    return {
      text: "text-emerald-100",
      box: "border-emerald-300/35 bg-emerald-300/12",
    };
  }

  if (score >= 65) {
    return {
      text: "text-yellow-100",
      box: "border-yellow-300/35 bg-yellow-300/15",
    };
  }

  return {
    text: "text-red-100",
    box: "border-red-300/35 bg-red-500/15",
  };
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "מתחילים";
}