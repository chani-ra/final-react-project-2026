import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getTodayDailyGuide,
  refreshTodayDailyGuide,
} from "../../../services/dailyGuideService";

const actionRoutes = {
  OPEN_CHAT: "/chat",
  OPEN_DICTIONARY: "/dictionary",
  OPEN_TASKS: "/tasks",
  OPEN_COURSES: "/courses",
  OPEN_WRITING: "/writing",
};

export default function SmartLearningPath({
  user,
}) {
  const navigate = useNavigate();

  const username =
    user?.username ||
    user?.name ||
    "תלמידה";

  const level =
    user?.englishLevel ||
    user?.level ||
    "beginner";

  const fallbackPlan = useMemo(() => {
    return buildFallbackPlan({
      username,
      level,
    });
  }, [username, level]);

  const [dailyPlan, setDailyPlan] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDailyGuide() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getTodayDailyGuide();

        if (!isMounted) {
          return;
        }

        const guide = response?.guide;

        if (!guide) {
          throw new Error(
            "Daily Guide was not returned"
          );
        }

        setDailyPlan(
          normalizeDailyGuide(guide)
        );
      } catch (error) {
        console.error(
          "❌ Daily Guide error:",
          error
        );

        if (!isMounted) {
          return;
        }

        setError(
          "לא הצלחנו לטעון כרגע את המדריך החכם. מוצגת תוכנית חלופית."
        );

        setDailyPlan(fallbackPlan);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDailyGuide();

    return () => {
      isMounted = false;
    };
  }, [fallbackPlan]);

  async function handleRefreshGuide() {
    try {
      setIsRefreshing(true);
      setError("");

      const response =
        await refreshTodayDailyGuide();

      const guide = response?.guide;

      if (!guide) {
        throw new Error(
          "Refreshed Daily Guide was not returned"
        );
      }

      const normalizedGuide =
        normalizeDailyGuide(guide);

      setDailyPlan(normalizedGuide);

      if (normalizedGuide.isFallback) {
        setError(
          "ה-AI אינו זמין כרגע, לכן נשארה תוכנית חלופית."
        );
      }
    } catch (error) {
      console.error(
        "❌ Daily Guide refresh error:",
        error
      );

      setError(
        "לא הצלחנו לרענן את המדריך כרגע."
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  if (isLoading) {
    return (
      <section
        className="space-y-5 text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/60 p-8 text-center backdrop-blur-xl">
          <div className="text-xl font-black text-white">
            מכינים לך את המדריך של היום...
          </div>

          <p className="mt-2 text-sm font-semibold text-white/55">
            המערכת בודקת את ההתקדמות שלך
            ובונה את הצעד הבא.
          </p>
        </div>
      </section>
    );
  }

  const plan =
    dailyPlan || fallbackPlan;

  return (
    <section
      className="space-y-5 text-white"
      dir="rtl"
    >
      {error && (
        <div className="rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3 text-sm font-bold text-yellow-100">
          {error}
        </div>
      )}

      <div
        className="rounded-[2rem] border-2 border-white/18 bg-slate-950/60 p-5 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="grid gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="rounded-[1.6rem] border border-white/12 bg-slate-950/45 p-5">
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100">
              daily guide
            </div>

            <h2
              className="text-3xl font-black leading-tight text-white"
              style={{
                textShadow:
                  "2px 2px 0 rgba(184,50,42,0.40), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              המדריך היומי
            </h2>

            <p className="mt-2 text-sm font-semibold leading-7 text-white/62">
              המערכת מנתחת את נתוני
              הלמידה שלך ומחליטה במה הכי
              כדאי להתמקד היום.
            </p>

            <div className="mt-5 rounded-[1.2rem] border border-yellow-300/30 bg-yellow-300/12 p-4">
              <div className="text-xs font-black text-yellow-100">
                המיקוד של היום
              </div>

              <div className="mt-1 text-xl font-black text-white">
                {plan.focus}
              </div>
            </div>

            <div className="mt-3 rounded-[1.2rem] border border-white/12 bg-white/8 p-4">
              <div className="text-xs font-black text-white/42">
                רמה
              </div>

              <div className="mt-1 text-lg font-black text-yellow-100">
                {getLevelLabel(level)}
              </div>
            </div>

            {plan.isFallback && (
              <div className="mt-3 rounded-[1.2rem] border border-orange-300/25 bg-orange-300/10 p-4">
                <div className="text-xs font-black text-orange-100">
                  תוכנית חלופית
                </div>

                <p className="mt-1 text-xs font-semibold leading-6 text-white/55">
                  כרגע מוצגת תוכנית בטוחה
                  שאינה מבוססת על ניתוח AI
                  מלא.
                </p>
              </div>
            )}

            {plan.isFallback && (
              <button
                type="button"
                onClick={handleRefreshGuide}
                disabled={isRefreshing}
                className="mt-4 w-full rounded-full border-2 border-yellow-300/35 bg-yellow-300/15 px-5 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRefreshing
                  ? "מנסים שוב..."
                  : "נסי שוב ליצור מדריך חכם"}
              </button>
            )}
            {!plan.isFallback && (
              <p className="mt-4 text-xs font-semibold text-white/40">
                התוכנית נשמרת להיום ומתעדכנת אוטומטית מחר.
              </p>
            )}
          </aside>

          <main className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/45 p-5">
              <h3 className="text-2xl font-black text-white">
                {username}, זה המסלול שלך
                להיום
              </h3>

              <p className="mt-2 text-sm font-semibold leading-7 text-white/62">
                {plan.reason}
              </p>
            </div>

            <div className="grid gap-3">
              {plan.steps.map(
                (step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="rounded-[1.3rem] border border-white/12 bg-white/8 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-300 text-sm font-black text-slate-950">
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white">
                          {step.title}
                        </h4>

                        <p className="mt-1 text-sm font-semibold leading-7 text-white/62">
                          {
                            step.description
                          }
                        </p>

                        <p className="mt-2 text-xs font-bold text-yellow-100/70">
                          כ־
                          {
                            step.estimatedMinutes
                          }{" "}
                          דקות
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleStepAction(
                          navigate,
                          step.action
                        )
                      }
                      className="mt-4 rounded-full border-2 border-white/16 bg-white/10 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/16"
                    >
                      מעבר לתרגול
                    </button>
                  </div>
                )
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.3rem] border border-yellow-300/30 bg-yellow-300/12 p-4">
                <div className="text-xs font-black text-yellow-100">
                  טיפ יומי
                </div>

                <p className="mt-1 text-sm font-semibold leading-7 text-white/70">
                  {plan.tip}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-red-300/30 bg-red-500/15 p-4">
                <div className="text-xs font-black text-red-100">
                  זמן מומלץ
                </div>

                <p className="mt-1 text-sm font-semibold leading-7 text-white/70">
                  {plan.estimatedMinutes} דקות
                  למסלול של היום.
                </p>
              </div>
            </div>

            {plan.encouragement && (
              <div className="rounded-[1.3rem] border border-white/12 bg-slate-950/45 p-4">
                <p className="text-sm font-bold leading-7 text-white/70">
                  {plan.encouragement}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function normalizeDailyGuide(guide) {
  return {
    focus:
      guide.focus ||
      "המשך התקדמות",

    reason:
      guide.reason ||
      "היום נמשיך לחזק את הלמידה שלך.",

    steps: Array.isArray(guide.steps)
      ? guide.steps
      : [],

    tip:
      guide.tip ||
      "גם תרגול קצר ועקבי מקדם אותך.",

    encouragement:
      guide.encouragement || "",

    estimatedMinutes:
      guide.estimatedMinutes || 20,

    isFallback:
      guide.isFallback || false,

    toolsUsed:
      guide.toolsUsed || [],
  };
}

function handleStepAction(
  navigate,
  action
) {
  const path = actionRoutes[action];

  if (!path) {
    console.warn(
      "Unknown Daily Guide action:",
      action
    );

    return;
  }

  navigate(path);
}

function buildFallbackPlan({
  username,
  level,
}) {
  const plans = [
    {
      focus: "אוצר מילים",

      reason: `${username}, היום כדאי לחזק מילים שימושיות ולנסות להכניס אותן למשפטים קצרים.`,

      steps: [
        {
          title: "חזרה על מילים",
          description:
            "בחרי 5 מילים מהמילון האישי וקראי אותן בקול.",
          action:
            "OPEN_DICTIONARY",
          estimatedMinutes: 5,
        },
        {
          title: "משפטים קצרים",
          description:
            "כתבי משפט אחד לכל מילה כדי שהמילה לא תישאר רק תרגום.",
          action:
            "OPEN_WRITING",
          estimatedMinutes: 5,
        },
        {
          title: "שימוש בדיבור",
          description:
            "נסי להשתמש בשתי מילים בתוך שיחה קצרה עם הצ׳אט.",
          action:
            "OPEN_CHAT",
          estimatedMinutes: 5,
        },
      ],

      tip:
        "מילה שנכנסת למשפט אישי נשמרת בזיכרון הרבה יותר טוב.",

      encouragement:
        "עוד תרגול קטן היום הוא עוד צעד קדימה.",

      estimatedMinutes: 15,
      isFallback: true,
    },

    {
      focus: "כתיבה",

      reason: `${username}, היום כדאי לתרגל כתיבה קצרה ולקבל משוב על משפטים פשוטים.`,

      steps: [
        {
          title: "בחירת נושא",
          description:
            "בחרי נושא אחד פשוט וכתבי עליו 4 משפטים באנגלית.",
          action:
            "OPEN_WRITING",
          estimatedMinutes: 6,
        },
        {
          title: "בדיקת ניסוח",
          description:
            "בדקי האם בכל משפט יש נושא ופועל ברורים.",
          action:
            "OPEN_WRITING",
          estimatedMinutes: 6,
        },
        {
          title: "שיפור קטן",
          description:
            "בחרי משפט אחד ושפרי אותו עם מילה מדויקת יותר.",
          action:
            "OPEN_DICTIONARY",
          estimatedMinutes: 6,
        },
      ],

      tip:
        "בכתיבה עדיף להתחיל ממשפטים קצרים וברורים מאשר משפטים ארוכים ומבלבלים.",

      encouragement:
        "לא צריך לכתוב הרבה כדי להשתפר — צריך לכתוב באופן עקבי.",

      estimatedMinutes: 18,
      isFallback: true,
    },

    {
      focus: "דיבור וביטחון",

      reason: `${username}, היום כדאי לתרגל תשובות קצרות כדי לבנות ביטחון באנגלית.`,

      steps: [
        {
          title: "שיחה קצרה",
          description:
            "פתחי שיחה עם הצ׳אט ועני במשפטים קצרים.",
          action:
            "OPEN_CHAT",
          estimatedMinutes: 5,
        },
        {
          title: "חזרה בקול",
          description:
            "בחרי 3 תשובות טובות וקראי אותן בקול.",
          action:
            "OPEN_CHAT",
          estimatedMinutes: 4,
        },
        {
          title: "שיפור ניסוח",
          description:
            "שפרי תשובה אחת והפכי אותה לטבעית יותר.",
          action:
            "OPEN_WRITING",
          estimatedMinutes: 5,
        },
      ],

      tip:
        "ביטחון בדיבור נבנה מחזרות קטנות, לא מקפיצה אחת גדולה.",

      encouragement:
        "כל תשובה שאת מצליחה לנסח מחזקת את הביטחון שלך.",

      estimatedMinutes: 14,
      isFallback: true,
    },
  ];

  const todayIndex =
    getDailyIndex(plans.length);

  const plan = plans[todayIndex];

  if (
    level === "advanced" ||
    level === "מתקדמים"
  ) {
    return {
      ...plan,

      estimatedMinutes:
        plan.estimatedMinutes + 5,

      tip: `${plan.tip} נסי להוסיף גם משפט אחד ברמה גבוהה יותר.`,
    };
  }

  return plan;
}

function getDailyIndex(length) {
  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return seed % length;
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

  return (
    labels[level] ||
    level ||
    "לא צוין"
  );
}