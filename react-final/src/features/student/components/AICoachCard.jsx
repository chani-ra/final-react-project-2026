import React, { useEffect, useMemo, useState } from "react";
import {
  generateCoachPlan,
  getCoachHistory,
} from "../../../services/aiCoachService";
import { createManyTasks } from "../../../services/taskService";

export default function AICoachCard({ user }) {
  const [note, setNote] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [savingTasks, setSavingTasks] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const level = user?.englishLevel || user?.level || "beginner";
  const hobbies = user?.favoriteHobbies || user?.interests || [];
  const expectations = user?.expectations || [];
  const username = user?.username || user?.name || "תלמידה";

  // תוכנית גיבוי במקרה שה-AI לא זמין
  const fallbackPlan = useMemo(() => {
    return buildFallbackPlan({
      level,
      hobbies,
      expectations,
      username,
    });
  }, [level, hobbies, expectations, username]);

  const planToShow = currentPlan || fallbackPlan;
  const steps = planToShow?.steps || [];

  const storageKey = useMemo(() => {
    const userId = user?._id || user?.id || "guest";
    const focus = planToShow?.focus || "default-plan";
    return `coach-progress-${userId}-${focus}`;
  }, [user, planToShow]);

  const progressPercent =
    steps.length > 0
      ? Math.round((completedSteps.length / steps.length) * 100)
      : 0;

  const isPlanCompleted =
    steps.length > 0 && completedSteps.length === steps.length;

  // טעינת היסטוריית תוכניות מהשרת
  const loadHistory = async () => {
    try {
      setLoadingHistory(true);

      const data = await getCoachHistory();
      const safeHistory = Array.isArray(data) ? data : [];

      setHistory(safeHistory);

      if (safeHistory.length > 0 && !currentPlan) {
        setCurrentPlan(safeHistory[0].plan);
      }
    } catch (error) {
      console.error("Failed to load coach history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // טעינת התקדמות מקומית לתוכנית הנוכחית
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompletedSteps(saved ? JSON.parse(saved) : []);
    } catch {
      setCompletedSteps([]);
    }
  }, [storageKey]);

  // שמירת התקדמות מקומית
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedSteps));
  }, [completedSteps, storageKey]);

  // יצירת תוכנית לימוד בעזרת AI
  const handleGeneratePlan = async () => {
    if (!note.trim()) {
      setMessage({
        type: "error",
        text: "כתבי במשפט קצר במה את מסתבכת או מה תרצי לחזק היום.",
      });
      return;
    }

    try {
      setLoadingPlan(true);
      setMessage({ type: "", text: "" });
      setIsStudyMode(false);
      setCompletedSteps([]);

      const plan = await generateCoachPlan(note.trim());

      setCurrentPlan(plan);
      setNote("");

      setMessage({
        type: "success",
        text: "המאמן האישי בנה לך סדר לימוד חדש.",
      });

      await loadHistory();
    } catch (error) {
      setCurrentPlan(fallbackPlan);
      setIsStudyMode(false);

      setMessage({
        type: "error",
        text:
          error?.toString() ||
          "לא הצלחנו לקבל תוכנית מה-AI, לכן מוצגת תוכנית גיבוי חכמה.",
      });
    } finally {
      setLoadingPlan(false);
    }
  };

  // התחלת מצב לימוד פעיל בתוך הכרטיס
  const startStudyMode = () => {
    setIsStudyMode(true);

    setMessage({
      type: "success",
      text: "מעולה! התחילי לפי השלבים וסמני וי על כל משימה שביצעת.",
    });
  };

  // העברת שלבי התוכנית למסך המשימות
  const handleSendPlanToTasks = async () => {
    const currentSteps = planToShow?.steps || [];

    if (currentSteps.length === 0) {
      setMessage({
        type: "error",
        text: "אין שלבים בתוכנית שאפשר להעביר למשימות.",
      });
      return;
    }

    try {
      setSavingTasks(true);
      setMessage({ type: "", text: "" });

      const tasksToCreate = currentSteps.map((step, index) => ({
        title: `משימת Coach ${index + 1}`,
        description: step,
        type: "coach_task",
        source: "ai_coach",
        difficulty: "Easy",
        estimatedTime: "10 דקות",
        rewardXP: 50,
        coachPlanFocus: planToShow.focus || "תוכנית אישית מהמאמן",
      }));

      await createManyTasks({
        tasks: tasksToCreate,
        coachPlanFocus: planToShow.focus || "תוכנית אישית מהמאמן",
      });

      setMessage({
        type: "success",
        text: "המשימות נוספו בהצלחה למסך המשימות שלך.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setSavingTasks(false);
    }
  };

  // סימון / ביטול שלב שבוצע
  const toggleStep = (index) => {
    setCompletedSteps((prev) => {
      const exists = prev.includes(index);

      if (exists) {
        return prev.filter((item) => item !== index);
      }

      return [...prev, index];
    });
  };

  // איפוס התקדמות בתוכנית הנוכחית
  const resetProgress = () => {
    setCompletedSteps([]);

    setMessage({
      type: "success",
      text: "ההתקדמות אופסה. אפשר להתחיל מחדש.",
    });
  };

  // בחירת תוכנית מהיסטוריה
  const selectHistoryPlan = (item) => {
    setCurrentPlan(item.plan);
    setIsStudyMode(false);

    setMessage({
      type: "success",
      text: "טענתי לך תוכנית קודמת מההיסטוריה.",
    });
  };

  return (
    <section className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-950 shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black">🤖 המאמן האישי שלך</h2>

          <p className="text-sm font-semibold mt-1 opacity-80">
            כתבי מה קשה לך היום, וה-AI יבנה לך סדר לימוד אישי וקצר.
          </p>
        </div>

        <span className="bg-slate-950 text-white px-3 py-1 rounded-full text-xs font-black">
          AI Coach
        </span>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-2xl text-sm font-bold ${
            message.type === "success"
              ? "bg-emerald-900/20 text-emerald-950 border border-emerald-800/20"
              : "bg-red-900/20 text-red-950 border border-red-800/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-slate-950/10 rounded-3xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-black mb-2">
            במה את מסתבכת היום?
          </label>

          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="לדוגמה: קשה לי לזכור מילים / אני רוצה לדבר יותר בביטחון / אני לא יודעת מה ללמוד היום..."
            className="w-full bg-white/80 border border-white/30 rounded-2xl p-3 text-slate-950 placeholder:text-slate-500 outline-none focus:border-slate-950 resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleGeneratePlan}
          disabled={loadingPlan}
          className="w-full bg-slate-950 text-white hover:bg-slate-800 py-3 rounded-xl font-black transition-all disabled:opacity-60"
        >
          {loadingPlan ? "המאמן בונה תוכנית..." : "בנה לי סדר לימוד ✨"}
        </button>
      </div>

      {planToShow && (
        <div className="mt-5 bg-slate-950/10 rounded-3xl p-5 space-y-4">
          <div>
            <div className="text-xs font-black opacity-70 mb-1">
              המיקוד שלך להיום
            </div>

            <h3 className="text-xl font-black">
              {planToShow.focus || "תרגול קצר להיום"}
            </h3>
          </div>

          {planToShow.summary && (
            <div className="bg-white/30 rounded-2xl p-4">
              <div className="text-sm font-black mb-1">מה המאמן הבין:</div>

              <p className="text-sm font-semibold leading-relaxed">
                {planToShow.summary}
              </p>
            </div>
          )}

          {!isStudyMode ? (
            <PlanPreview
              plan={planToShow}
              savingTasks={savingTasks}
              onStart={startStudyMode}
              onSendToTasks={handleSendPlanToTasks}
            />
          ) : (
            <StudyChecklist
              steps={steps}
              completedSteps={completedSteps}
              progressPercent={progressPercent}
              isPlanCompleted={isPlanCompleted}
              savingTasks={savingTasks}
              onToggleStep={toggleStep}
              onReset={resetProgress}
              onSendToTasks={handleSendPlanToTasks}
            />
          )}

          {planToShow.tip && (
            <div className="bg-slate-950/10 rounded-2xl p-4">
              <div className="text-sm font-black mb-1">טיפ קטן:</div>

              <p className="text-sm font-semibold leading-relaxed">
                {planToShow.tip}
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-3">
            {planToShow.estimatedMinutes && (
              <div className="flex-1 bg-white/30 rounded-2xl p-3 text-center">
                <div className="text-xs font-black opacity-70">זמן משוער</div>

                <div className="text-lg font-black">
                  {planToShow.estimatedMinutes} דקות
                </div>
              </div>
            )}

            {planToShow.encouragement && (
              <div className="flex-[2] bg-slate-950 text-white rounded-2xl p-3">
                <div className="text-xs font-black text-yellow-300 mb-1">
                  עידוד אישי
                </div>

                <div className="text-sm font-semibold leading-relaxed">
                  {planToShow.encouragement}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 bg-slate-950/10 rounded-3xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-black">היסטוריה אחרונה</h3>

          <span className="text-xs font-bold opacity-70">
            {loadingHistory ? "טוען..." : `${history.length} רשומות`}
          </span>
        </div>

        {loadingHistory ? (
          <p className="text-sm font-semibold opacity-75">
            טוען תוכניות קודמות...
          </p>
        ) : history.length === 0 ? (
          <p className="text-sm font-semibold opacity-75">
            עדיין אין היסטוריה. כתבי בקשה ראשונה למאמן.
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.slice(0, 5).map((item) => (
              <button
                key={item._id || item.createdAt}
                type="button"
                onClick={() => selectHistoryPlan(item)}
                className="w-full text-right bg-white/25 hover:bg-white/40 rounded-2xl p-3 transition-all"
              >
                <div className="text-sm font-black line-clamp-1">
                  {item.plan?.focus || "תוכנית לימוד"}
                </div>

                <div className="text-xs font-semibold opacity-75 line-clamp-1 mt-1">
                  {item.note}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PlanPreview({ plan, savingTasks, onStart, onSendToTasks }) {
  return (
    <div className="bg-white/30 rounded-2xl p-4">
      <div className="text-sm font-black mb-2">סדר הלימוד שהמאמן בנה:</div>

      <ul className="space-y-2 text-sm font-semibold">
        {(plan.steps || []).map((step, index) => (
          <li key={`${step}-${index}`} className="flex gap-2">
            <span className="font-black">{index + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onStart}
        className="mt-4 w-full bg-slate-950 text-white hover:bg-slate-800 py-3 rounded-xl font-black transition-all"
      >
        התחילי ללמוד עכשיו 🚀
      </button>

      <button
        type="button"
        onClick={onSendToTasks}
        disabled={savingTasks}
        className="mt-3 w-full bg-white/30 hover:bg-white/40 text-slate-950 py-3 rounded-xl font-black transition-all disabled:opacity-60"
      >
        {savingTasks ? "מוסיף למשימות..." : "העבר למשימות שלי 📝"}
      </button>
    </div>
  );
}

function StudyChecklist({
  steps,
  completedSteps,
  progressPercent,
  isPlanCompleted,
  savingTasks,
  onToggleStep,
  onReset,
  onSendToTasks,
}) {
  return (
    <div className="bg-white/30 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-black">המשימות שלך עכשיו:</div>

        <div className="text-sm font-black">{progressPercent}%</div>
      </div>

      <div className="h-2 bg-slate-950/20 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-slate-950 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);

          return (
            <button
              key={`${step}-${index}`}
              type="button"
              onClick={() => onToggleStep(index)}
              className={`w-full text-right rounded-2xl p-4 border transition-all ${
                isCompleted
                  ? "bg-emerald-500/20 border-emerald-800/20"
                  : "bg-white/25 border-white/20 hover:bg-white/40"
              }`}
            >
              <div className="flex gap-3 items-start">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-black shrink-0 ${
                    isCompleted
                      ? "bg-emerald-700 text-white"
                      : "bg-slate-950/20 text-slate-950"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>

                <span
                  className={`text-sm font-semibold leading-relaxed ${
                    isCompleted ? "line-through opacity-70" : ""
                  }`}
                >
                  {step}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {isPlanCompleted && (
        <div className="mt-4 bg-emerald-700 text-white rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🏆</div>

          <div className="font-black">כל הכבוד! סיימת את סדר הלימוד.</div>

          <div className="text-sm opacity-90 mt-1">
            עכשיו אפשר לבקש מהמאמן תוכנית חדשה.
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onSendToTasks}
        disabled={savingTasks}
        className="mt-4 w-full bg-slate-950 text-white hover:bg-slate-800 py-3 rounded-xl font-black transition-all disabled:opacity-60"
      >
        {savingTasks ? "מוסיף למשימות..." : "העבר למשימות שלי 📝"}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 w-full bg-white/30 hover:bg-white/40 text-slate-950 py-3 rounded-xl font-black transition-all"
      >
        אפס התקדמות
      </button>
    </div>
  );
}

function buildFallbackPlan({ level, hobbies, expectations, username }) {
  if (expectations.includes("vocabulary")) {
    return {
      focus: "חיזוק אוצר מילים",
      summary: `${username}, לפי המטרות שלך כדאי להתמקד היום במילים שימושיות.`,
      steps: [
        "בחרי 5 מילים חדשות מתוך שיעור או שיר.",
        "כתבי ליד כל מילה פירוש קצר בעברית.",
        "כתבי משפט אחד באנגלית עם אחת מהמילים.",
      ],
      tip: "עדיף ללמוד מעט מילים ולהשתמש בהן מאשר ללמוד הרבה ולשכוח.",
      encouragement: "כל מילה חדשה שאת משתמשת בה באמת מחזקת אותך.",
      estimatedMinutes: 15,
    };
  }

  if (expectations.includes("grammar")) {
    return {
      focus: "תרגול דקדוק פשוט",
      summary: `${username}, היום כדאי לך לחזק משפטים בצורה רגועה וברורה.`,
      steps: [
        "בחרי משפט אחד באנגלית מתוך שיעור.",
        "סמני את הפועל המרכזי במשפט.",
        "נסי לכתוב את אותו משפט בזמן אחר.",
      ],
      tip: "בדקדוק, חזרה קטנה כל יום עובדת יותר טוב מלימוד ארוך מדי.",
      encouragement: "את לא צריכה לדעת הכול בבת אחת — כל משפט הוא התקדמות.",
      estimatedMinutes: 12,
    };
  }

  if (expectations.includes("confidence")) {
    return {
      focus: "ביטחון באנגלית",
      summary: `${username}, המטרה היום היא להוציא משפט בקול בלי לחץ.`,
      steps: [
        "בחרי משפט אחד קצר באנגלית.",
        "אמרי אותו בקול לאט פעמיים.",
        "בפעם השלישית אמרי אותו בקול טבעי יותר.",
      ],
      tip: "ביטחון מגיע מתרגול קטן וקבוע, לא משלמות.",
      encouragement: "גם משפט אחד בקול הוא ניצחון קטן.",
      estimatedMinutes: 10,
    };
  }

  if (hobbies.includes("art_music")) {
    return {
      focus: "למידה דרך מוזיקה",
      summary: `${username}, בגלל שאת אוהבת מוזיקה, נשתמש בזה כדי ללמוד בכיף.`,
      steps: [
        "האזיני לשיר השבוע.",
        "בחרי 3 מילים שחזרו בשיר.",
        "נסי לומר שורה אחת בקול.",
      ],
      tip: "מוזיקה עוזרת לזכור מילים כי היא מחברת אותן לקצב.",
      encouragement: "למידה דרך משהו שאת אוהבת היא דרך חכמה מאוד להתקדם.",
      estimatedMinutes: 15,
    };
  }

  if (level === "advanced") {
    return {
      focus: "כתיבה מתקדמת",
      summary: `${username}, ברמה שלך כדאי לחזק ניסוח ומשפטים מחוברים.`,
      steps: [
        "בחרי נושא שמעניין אותך.",
        "כתבי פסקה קצרה של 4 משפטים באנגלית.",
        "הוסיפי מילת קישור אחת כמו because או however.",
      ],
      tip: "ברמה מתקדמת, משפטים מחוברים עושים הבדל גדול.",
      encouragement: "יש לך בסיס טוב — עכשיו הזמן לשדרג ניסוח.",
      estimatedMinutes: 20,
    };
  }

  return {
    focus: "התחלה טובה להיום",
    summary: `${username}, היום כדאי להתחיל ממשימה קצרה וברורה.`,
    steps: [
      "בחרי שיעור אחד קצר לצפייה.",
      "כתבי 3 מילים חדשות שלמדת.",
      "אמרי בקול משפט אחד באנגלית.",
    ],
    tip: "צעד קטן ביום עדיף על עומס גדול שמפסיקים אחרי יומיים.",
    encouragement: "את בדרך טובה. העיקר להתחיל ולהמשיך בעקביות.",
    estimatedMinutes: 15,
  };
}