import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { checkEssayWithAI } from "../../services/aiService";
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";

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

  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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

      setResult({
        score: Number(data?.score) || 0,
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
    <div className="space-y-7" dir="rtl">
      <SmartGuideBackButton />

      <section className="bg-white/5 border border-white/10 rounded-3xl p-7">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-black mb-3">
              ✍️ Writing Trainer
            </div>

            <h1 className="text-3xl font-black text-white">
              מאמן כתיבה באנגלית
            </h1>

            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed">
              כתבי פסקה באנגלית, והמערכת תיתן לך ציון, משוב ותיקונים נקודתיים
              כדי שתדעי בדיוק מה לשפר.
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 px-5 py-4 rounded-2xl font-black h-fit">
            רמה: {getLevelLabel(studentLevel)}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
        <section className="xl:col-span-2 bg-slate-900/50 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-white">
                כתבי כאן את הפסקה שלך
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                אפשר לכתוב חופשי. הכי טוב להתחיל מ־3–6 משפטים פשוטים.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold text-gray-300 h-fit">
              {wordCount} מילים
            </div>
          </div>

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            rows="12"
            dir="ltr"
            placeholder="Example: Today I learned new English words. I want to speak better and feel more confident..."
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-white placeholder:text-gray-500 outline-none focus:border-yellow-400 resize-none leading-relaxed"
          />

          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <button
              type="button"
              onClick={handleCheckEssay}
              disabled={checking || !essay.trim()}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-3 rounded-xl transition-all"
            >
              {checking ? "בודק כתיבה..." : "בדקי לי את הכתיבה ✨"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={checking}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-60 text-white font-black py-3 px-6 rounded-xl transition-all"
            >
              ניקוי
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-black text-white mb-2">
              רעיונות לכתיבה
            </h2>

            <p className="text-gray-400 text-sm mb-4">
              לחצי על נושא כדי להתחיל מהר.
            </p>

            <div className="space-y-3">
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt.title}
                  type="button"
                  onClick={() => handlePromptClick(prompt.text)}
                  className="w-full text-right bg-slate-950/60 hover:bg-slate-950 border border-white/10 rounded-2xl p-4 transition-all"
                >
                  <div className="font-black text-yellow-400">
                    {prompt.title}
                  </div>

                  <div className="text-xs text-gray-400 mt-1" dir="ltr">
                    {prompt.text}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="font-black text-white mb-2">טיפ כתיבה</h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              אל תנסי לכתוב מושלם. כתבי פשוט וברור. אחר כך תני למערכת להראות
              לך איך לשפר.
            </p>
          </section>
        </aside>
      </div>

      {result && (
        <section className="bg-white/5 border border-white/10 rounded-3xl p-7">
          <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">
                תוצאות בדיקת הכתיבה
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                הנה המשוב שהתקבל על הפסקה שלך.
              </p>
            </div>

            <div
              className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center border ${scoreStyle.box}`}
            >
              <div className={`text-3xl font-black ${scoreStyle.text}`}>
                {result.score}
              </div>

              <div className="text-xs text-gray-400">ציון</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-5 mb-5">
            <div className="text-sm font-black text-yellow-400 mb-2">
              משוב כללי
            </div>

            <p className="text-gray-300 leading-relaxed">
              {result.generalFeedback}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-black text-white mb-4">
              תיקונים והסברים
            </h3>

            {result.grammarCorrections.length === 0 ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl p-5 font-bold">
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
        </section>
      )}
    </div>
  );
}

function CorrectionCard({ item }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-xs font-black text-red-300 mb-1">לפני</div>

          <div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-200"
            dir="ltr"
          >
            {item.mistake || "—"}
          </div>
        </div>

        <div>
          <div className="text-xs font-black text-emerald-300 mb-1">אחרי</div>

          <div
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-200"
            dir="ltr"
          >
            {item.correction || "—"}
          </div>
        </div>
      </div>

      {item.explanation && (
        <p className="text-sm text-gray-400 leading-relaxed">
          {item.explanation}
        </p>
      )}
    </div>
  );
}

function getScoreStyle(score = 0) {
  if (score >= 85) {
    return {
      text: "text-emerald-400",
      box: "bg-emerald-500/10 border-emerald-500/30",
    };
  }

  if (score >= 65) {
    return {
      text: "text-yellow-400",
      box: "bg-yellow-500/10 border-yellow-500/30",
    };
  }

  return {
    text: "text-red-400",
    box: "bg-red-500/10 border-red-500/30",
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