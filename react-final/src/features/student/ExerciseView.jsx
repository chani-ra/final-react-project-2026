import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getExerciseById,
  markExerciseCompleted,
} from "../../services/exerciseService";

export default function ExerciseView() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadExercise = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getExerciseById(exerciseId);
      setExercise(data.exercise || data);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  const handleCompleteExercise = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await markExerciseCompleted(exerciseId);

      setMessage({
        type: "success",
        text: "מעולה! התרגיל סומן כהושלם.",
      });

      setTimeout(() => {
        navigate(-1);
      }, 900);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את התרגיל...
        </div>
      </main>
    );
  }

  if (!exercise) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6" dir="rtl">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-red-300/35 bg-[#123c6b]/78 p-7 text-white shadow-[0_28px_80px_rgba(3,31,61,0.38)] backdrop-blur-xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white transition hover:bg-white/22"
          >
            ×
          </button>

          <div className="max-w-2xl">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-red-300/35 bg-red-500/16 text-3xl">
              !
            </div>

            <h1 className="text-3xl font-black text-red-100">
              התרגיל לא נמצא
            </h1>

            <p className="mt-3 text-base font-bold leading-relaxed text-white/72">
              לא הצלחנו למצוא את התרגיל המבוקש.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-7 rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-7 py-3 font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              חזרה לקורס
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white shadow-lg transition hover:bg-white/22"
          aria-label="סגירת תרגיל"
        >
          ×
        </button>

        <div className="relative z-10 p-4 md:p-5">
          <header className="mb-4 pl-14">
            <button
              type="button"
              onClick={handleClose}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-black text-white/82 transition hover:bg-white/16 hover:text-white"
            >
              <span>→</span>
              <span>חזרה לקורס</span>
            </button>

            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-3 py-1 text-xs font-black text-[#ffe89a]">
                תרגיל
              </span>

              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-black text-white/72">
                {exercise.type || "practice"}
              </span>
            </div>

            <h1
              className="text-2xl font-black leading-tight md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
              }}
            >
              {exercise.title || "תרגיל ללא כותרת"}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-4xl text-sm font-bold leading-relaxed text-white/66">
              {exercise.description || "אין תיאור לתרגיל זה."}
            </p>
          </header>

          {message.text && (
            <div
              className={`mb-4 rounded-[1.5rem] px-5 py-4 text-sm font-black shadow-[0_12px_32px_rgba(3,31,61,0.16)] ${
                message.type === "success"
                  ? "border border-emerald-300/28 bg-emerald-400/14 text-emerald-100"
                  : "border border-red-300/30 bg-red-500/16 text-red-100"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[1.72fr_0.58fr]">
            <section className="overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">הוראות התרגיל</h2>
                  <p className="text-[11px] font-bold text-white/55">
                    קראי את ההוראות, כתבי תשובה, וסמני שסיימת.
                  </p>
                </div>

                <div className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-black text-white/70">
                  Exercise mode
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-white/14 bg-[#123c6b]/54 p-4 text-sm font-bold leading-relaxed text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] whitespace-pre-line">
                {exercise.instructions ||
                  "קראי את ההנחיות, כתבי תשובה קצרה, וסמני את התרגיל כהושלם."}
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-black text-white">
                  התשובה שלי
                </label>

                <textarea
                  rows="7"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="כתבי כאן את התשובה שלך..."
                  className="w-full resize-none rounded-[1.6rem] border border-white/20 p-4 text-sm font-bold leading-relaxed caret-[#ffd439] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_10px_26px_rgba(3,31,61,0.16)] transition placeholder:text-white/40 focus:border-[#ffd439]/65 focus:ring-4 focus:ring-[#ffd439]/12"
                  style={{
                    backgroundColor: "rgba(6, 31, 54, 0.92)",
                    color: "#ffffff",
                  }}
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCompleteExercise}
                  disabled={saving}
                  className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                >
                  {saving ? "שומר..." : "סיימתי את התרגיל"}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16"
                >
                  חזרה בלי שמירה
                </button>
              </div>
            </section>

            <aside className="space-y-3">
              <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <h2 className="text-lg font-black">חומרי עזר</h2>

                {!exercise.materials?.length ? (
                  <div className="mt-3 rounded-xl border border-white/12 bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/62">
                    אין חומרי עזר מצורפים לתרגיל הזה.
                  </div>
                ) : (
                  <div className="mt-3 max-h-[190px] space-y-2 overflow-y-auto pr-1">
                    {exercise.materials.map((material, index) => (
                      <div
                        key={`${material}-${index}`}
                        className="rounded-xl border border-white/12 bg-white/8 px-3 py-3"
                      >
                        <div className="text-xs font-black text-white">
                          חומר עזר {index + 1}
                        </div>

                        <div className="mt-1 break-all text-[11px] font-bold text-white/56">
                          {material}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffd439]/24 bg-[#ffd439]/14 text-lg text-[#ffd439]">
                    ✎
                  </div>

                  <h2 className="text-lg font-black text-white">טיפ קטן</h2>
                </div>

                <p className="rounded-xl bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/74">
                  כתבי תשובה קצרה וברורה. גם אם היא לא מושלמת, עצם הכתיבה
                  באנגלית מחזקת ביטחון ושטף.
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
                <div className="text-xs font-bold text-white/56">מצב תרגול</div>
                <div className="mt-1 text-xl font-black text-white">
                  תרגול אישי
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/16">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a]" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}