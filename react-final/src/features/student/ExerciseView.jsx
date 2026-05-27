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

  // טעינת פרטי התרגיל מהשרת
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

  // סימון התרגיל כהושלם
  const handleCompleteExercise = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await markExerciseCompleted(exerciseId);

      setMessage({
        type: "success",
        text: "מעולה! התרגיל סומן כהושלם ✅",
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את התרגיל... 📝</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-3xl font-bold">
        התרגיל לא נמצא.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" dir="rtl">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-yellow-400 font-bold mb-6"
        >
          ← חזרה לקורס
        </button>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex gap-2 mb-4">
              <span className="bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 px-3 py-1 rounded-full text-sm font-bold">
                תרגיל
              </span>

              <span className="bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-sm font-bold">
                {exercise.type || "practice"}
              </span>
            </div>

            <h1 className="text-4xl font-black text-white mb-4">
              {exercise.title}
            </h1>

            <p className="text-gray-300 leading-relaxed max-w-3xl">
              {exercise.description || "אין תיאור לתרגיל זה."}
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 rounded-3xl p-6 min-w-[180px] text-center h-fit">
            <div className="text-4xl mb-2">📝</div>
            <div className="font-black">תרגול אישי</div>
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-black text-yellow-400 mb-4">
            הוראות התרגיל
          </h2>

          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5 text-gray-300 leading-relaxed whitespace-pre-line">
            {exercise.instructions ||
              "קראי את ההנחיות, כתבי תשובה קצרה, וסמני את התרגיל כהושלם."}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              התשובה שלי
            </label>

            <textarea
              rows="8"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="כתבי כאן את התשובה שלך..."
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={handleCompleteExercise}
              disabled={saving}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-4 rounded-2xl transition-all"
            >
              {saving ? "שומר..." : "סיימתי את התרגיל ✅"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
            >
              חזרה בלי שמירה
            </button>
          </div>
        </div>

        <aside className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-black mb-4">📎 חומרי עזר</h2>

          {!exercise.materials?.length ? (
            <p className="text-gray-400 text-sm">
              אין חומרי עזר מצורפים לתרגיל הזה.
            </p>
          ) : (
            <div className="space-y-3">
              {exercise.materials.map((material, index) => (
                <div
                  key={`${material}-${index}`}
                  className="bg-slate-950/60 border border-white/10 rounded-2xl p-4"
                >
                  <div className="text-sm font-bold text-white">
                    חומר עזר {index + 1}
                  </div>

                  <div className="text-gray-400 text-sm mt-1 break-all">
                    {material}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
            <h3 className="font-bold text-indigo-300 mb-2">טיפ קטן:</h3>

            <p className="text-gray-300 text-sm leading-relaxed">
              נסי לכתוב תשובה קצרה וברורה. גם אם היא לא מושלמת — עצם הכתיבה
              באנגלית מחזקת ביטחון ושטף.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}