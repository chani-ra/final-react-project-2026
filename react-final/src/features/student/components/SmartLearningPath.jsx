import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SmartLearningPath({ user }) {
  const navigate = useNavigate();

  const username = user?.username || user?.name || "תלמידה";
  const level = user?.englishLevel || user?.level || "beginner";

  const dailyPlan = useMemo(() => {
    return buildDailyPlan({ username, level });
  }, [username, level]);

  return (
    <section className="space-y-5 text-white" dir="rtl">
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
              תוכנית קצרה להיום לפי הרמה שלך. המיקוד משתנה לפי התאריך, כדי לתת
              כיוון יומי ברור.
            </p>

            <div className="mt-5 rounded-[1.2rem] border border-yellow-300/30 bg-yellow-300/12 p-4">
              <div className="text-xs font-black text-yellow-100">
                המיקוד של היום
              </div>

              <div className="mt-1 text-xl font-black text-white">
                {dailyPlan.focus}
              </div>
            </div>

            <div className="mt-3 rounded-[1.2rem] border border-white/12 bg-white/8 p-4">
              <div className="text-xs font-black text-white/42">רמה</div>

              <div className="mt-1 text-lg font-black text-yellow-100">
                {getLevelLabel(level)}
              </div>
            </div>
          </aside>

          <main className="space-y-4">
            <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/45 p-5">
              <h3 className="text-2xl font-black text-white">
                {username}, זה המסלול שלך להיום
              </h3>

              <p className="mt-2 text-sm font-semibold leading-7 text-white/62">
                {dailyPlan.summary}
              </p>
            </div>

            <div className="grid gap-3">
              {dailyPlan.steps.map((step, index) => (
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
                        {step.text}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(step.path)}
                    className="mt-4 rounded-full border-2 border-white/16 bg-white/10 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/16"
                  >
                    מעבר לתרגול
                  </button>
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[1.3rem] border border-yellow-300/30 bg-yellow-300/12 p-4">
                <div className="text-xs font-black text-yellow-100">
                  טיפ יומי
                </div>

                <p className="mt-1 text-sm font-semibold leading-7 text-white/70">
                  {dailyPlan.tip}
                </p>
              </div>

              <div className="rounded-[1.3rem] border border-red-300/30 bg-red-500/15 p-4">
                <div className="text-xs font-black text-red-100">זמן מומלץ</div>

                <p className="mt-1 text-sm font-semibold leading-7 text-white/70">
                  {dailyPlan.minutes} דקות מספיקות להיום. העיקר להתמיד.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function buildDailyPlan({ username, level }) {
  const plans = [
    {
      focus: "אוצר מילים",
      summary: `${username}, היום כדאי לחזק מילים שימושיות ולנסות להכניס אותן למשפטים קצרים.`,
      steps: [
        {
          title: "חזרה על מילים",
          text: "בחרי 5 מילים מהמילון האישי וקראי אותן בקול.",
          path: "/dictionary",
        },
        {
          title: "משפטים קצרים",
          text: "כתבי משפט אחד לכל מילה כדי שהמילה לא תישאר רק תרגום.",
          path: "/writing",
        },
        {
          title: "שימוש בדיבור",
          text: "נסי להשתמש בשתי מילים בתוך שיחה קצרה עם הצ׳אט.",
          path: "/chat",
        },
      ],
      tip: "מילה שנכנסת למשפט אישי נשמרת בזיכרון הרבה יותר טוב.",
      minutes: 15,
    },
    {
      focus: "כתיבה",
      summary: `${username}, היום כדאי לתרגל כתיבה קצרה ולקבל משוב על משפטים פשוטים.`,
      steps: [
        {
          title: "בחירת נושא",
          text: "בחרי נושא אחד פשוט וכתבי עליו 4 משפטים באנגלית.",
          path: "/writing",
        },
        {
          title: "בדיקת ניסוח",
          text: "בדקי האם בכל משפט יש נושא ופועל ברורים.",
          path: "/writing",
        },
        {
          title: "שיפור קטן",
          text: "בחרי משפט אחד ושפרי אותו עם מילה מדויקת יותר.",
          path: "/dictionary",
        },
      ],
      tip: "בכתיבה עדיף להתחיל ממשפטים קצרים וברורים מאשר משפטים ארוכים ומבלבלים.",
      minutes: 18,
    },
    {
      focus: "דיבור וביטחון",
      summary: `${username}, היום כדאי לתרגל תשובות קצרות כדי לבנות ביטחון באנגלית.`,
      steps: [
        {
          title: "שיחה קצרה",
          text: "פתחי שיחה עם הצ׳אט ועני במשפטים קצרים.",
          path: "/chat",
        },
        {
          title: "חזרה בקול",
          text: "בחרי 3 תשובות טובות וקראי אותן בקול.",
          path: "/chat",
        },
        {
          title: "שיפור ניסוח",
          text: "שפרי תשובה אחת והפכי אותה לטבעית יותר.",
          path: "/writing",
        },
      ],
      tip: "ביטחון בדיבור נבנה מחזרות קטנות, לא מקפיצה אחת גדולה.",
      minutes: 12,
    },
  ];

  const todayIndex = getDailyIndex(plans.length);
  const plan = plans[todayIndex];

  if (level === "advanced" || level === "מתקדמים") {
    return {
      ...plan,
      minutes: plan.minutes + 5,
      tip: `${plan.tip} נסי להוסיף גם משפט אחד ברמה גבוהה יותר.`,
    };
  }

  return plan;
}

function getDailyIndex(length) {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

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

  return labels[level] || level || "לא צוין";
}