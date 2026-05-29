import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createManyTasks, getMyTasks } from "../../../services/taskService";
import { getMyDictionaryWords } from "../../../services/dictionaryService";
import { getMyChatConversations } from "../../../services/chatService";

export default function SmartLearningPath({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingTasks, setSavingTasks] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const username = user?.username || user?.name || "תלמידה";
  const level = user?.englishLevel || user?.level || "beginner";

  const loadLearningData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [tasksData, wordsData, conversationsData] = await Promise.all([
        getMyTasks(),
        getMyDictionaryWords(),
        getMyChatConversations(),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setDictionaryWords(Array.isArray(wordsData) ? wordsData : []);
      setConversations(
        Array.isArray(conversationsData) ? conversationsData : []
      );
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLearningData();
  }, []);

  useEffect(() => {
    if (location.state?.openSmartPath) {
      setIsOpen(true);
    }
  }, [location.state]);

  const learningPath = useMemo(() => {
    return buildSmartPath({
      username,
      level,
      tasks,
      dictionaryWords,
      conversations,
    });
  }, [username, level, tasks, dictionaryWords, conversations]);

  const handleSendPathToTasks = async () => {
    try {
      setSavingTasks(true);
      setMessage({ type: "", text: "" });

      const tasksToCreate = learningPath.steps.map((step, index) => ({
        title: `מסלול חכם ${index + 1}: ${step.title}`,
        description: step.text,
        type: "coach_task",
        source: "ai_coach",
        difficulty: step.difficulty || "Easy",
        estimatedTime: step.estimatedTime || "10 דקות",
        rewardXP: step.rewardXP || 50,
        coachPlanFocus: learningPath.focus,
      }));

      await createManyTasks({
        tasks: tasksToCreate,
        coachPlanFocus: learningPath.focus,
      });

      setMessage({
        type: "success",
        text:
          "המסלול הפך למשימות לביצוע. עכשיו תוכלי לפתוח את מסך המשימות ולסמן כל שלב שסיימת.",
      });

      await loadLearningData();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setSavingTasks(false);
    }
  };

  const navigateFromSmartPath = (path) => {
    navigate(path, {
      state: { fromSmartPath: true },
    });
  };

  if (loading) {
    return (
      <section className="bg-white/5 border border-white/10 rounded-3xl p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-indigo-300 font-black mb-1">
              🧠 מסלול חכם
            </div>

            <div className="text-gray-400 text-sm animate-pulse">
              בונה עבורך מסלול למידה...
            </div>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-white/10 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 text-right hover:bg-white/[0.03] transition-all"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-400/20 flex items-center justify-center text-2xl shrink-0">
              🧠
            </div>

            <div>
              <div className="text-xs font-black text-indigo-300 mb-1">
                Smart Learning Path
              </div>

              <h2 className="text-xl font-black text-white">
                המדריך החכם שלך להיום
              </h2>

              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                {learningPath.focus} · {learningPath.shortReason}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            <div className="hidden md:flex gap-2">
              <SmallPill
                label="משימות"
                value={learningPath.stats.pendingTasks}
              />
              <SmallPill
                label="מילים"
                value={learningPath.stats.practiceWords}
              />
              <SmallPill
                label="שיחות"
                value={learningPath.stats.conversations}
              />
            </div>

            <div className="bg-yellow-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-black">
              {isOpen ? "סגירה ↑" : "פתחי מדריך ↓"}
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-white/10 p-5 space-y-5">
          {message.text && (
            <div
              className={`p-4 rounded-2xl font-bold ${
                message.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                  : "bg-red-500/10 border border-red-500/30 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MiniStat
              label="משימות פתוחות"
              value={learningPath.stats.pendingTasks}
              color="text-yellow-400"
            />

            <MiniStat
              label="מילים בתרגול"
              value={learningPath.stats.practiceWords}
              color="text-emerald-400"
            />

            <MiniStat
              label="שיחות עם בולט"
              value={learningPath.stats.conversations}
              color="text-indigo-300"
            />
          </div>

          <div className="bg-slate-950/50 border border-white/10 rounded-3xl p-5">
            <div className="text-xs font-black text-indigo-300 mb-1">
              למה זה מתאים לך?
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {learningPath.reason}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-black text-white">
              סדר הלימוד המומלץ:
            </h3>

            {learningPath.steps.map((step, index) => (
              <PathStep
                key={`${step.title}-${index}`}
                index={index}
                step={step}
                onNavigate={() => navigateFromSmartPath(step.path)}
              />
            ))}
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-3xl p-5">
            <h3 className="font-black text-yellow-300 mb-2">
              להפוך את המסלול למשימות?
            </h3>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              אם תלחצי כאן, כל שלב במסלול החכם יתווסף למסך “המשימות שלי”.
              שם תוכלי לסמן מה ביצעת ולעקוב אחרי ההתקדמות.
            </p>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={handleSendPathToTasks}
                disabled={savingTasks}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-3 rounded-xl transition-all"
              >
                {savingTasks
                  ? "מוסיף למשימות..."
                  : "הפכי את המסלול למשימות לביצוע 📝"}
              </button>

              <button
                type="button"
                onClick={() => navigateFromSmartPath("/tasks")}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-3 rounded-xl transition-all"
              >
                פתחי את המשימות שלי
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={loadLearningData}
            className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-3 rounded-xl transition-all"
          >
            רענן מדריך 🔄
          </button>
        </div>
      )}
    </section>
  );
}

function SmallPill({ label, value }) {
  return (
    <div className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-center min-w-16">
      <div className="text-sm font-black text-white">{value}</div>
      <div className="text-[10px] text-gray-400">{label}</div>
    </div>
  );
}

function MiniStat({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function PathStep({ step, index, onNavigate }) {
  return (
    <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4">
      <div className="flex gap-4">
        <div className="w-9 h-9 bg-yellow-400 text-slate-950 rounded-2xl flex items-center justify-center font-black shrink-0">
          {index + 1}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-black text-white">{step.title}</h4>

            <span className="text-xs text-gray-400">
              ⏱️ {step.estimatedTime}
            </span>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNavigate}
        className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all md:self-center shrink-0"
      >
        {step.buttonText}
      </button>
    </div>
  );
}

function buildSmartPath({
  username,
  level,
  tasks,
  dictionaryWords,
  conversations,
}) {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const reviewTasks = tasks.filter((task) => task.status === "review");
  const practiceWords = dictionaryWords.filter((word) => !word.mastered);
  const masteredWords = dictionaryWords.filter((word) => word.mastered);

  const latestConversationText =
    conversations?.[0]?.lastMessage?.text?.toLowerCase() || "";

  const hasGrammarSignal =
    latestConversationText.includes("past") ||
    latestConversationText.includes("perfect") ||
    latestConversationText.includes("grammar") ||
    latestConversationText.includes("דקדוק") ||
    latestConversationText.includes("עבר") ||
    latestConversationText.includes("הווה");

  const hasVocabularyNeed = practiceWords.length >= 3;
  const hasOpenTasks = pendingTasks.length > 0;

  let focus = "חיזוק למידה יומית מאוזנת";
  let shortReason = "משימה, מילים, כתיבה ותרגול קצר";
  let reason = `${username}, בניתי לך מסלול קצר שמשלב משימה, מילים, כתיבה ותרגול עם בולט.`;

  if (hasGrammarSignal) {
    focus = "דקדוק + כתיבה + תרגול משפטים";
    shortReason = "השיחה האחרונה שלך מצביעה על צורך בדקדוק";
    reason =
      "ראיתי שבשיחה האחרונה עם בולט עלה נושא דקדוקי, לכן כדאי לחזק היום הבנה של זמנים, לתרגל כתיבה קצרה ולבנות משפטים באנגלית.";
  } else if (hasVocabularyNeed) {
    focus = "אוצר מילים פעיל + כתיבה";
    shortReason = "יש מילים במילון שעדיין בתרגול";
    reason =
      "יש לך כמה מילים במילון שעדיין נמצאות בתרגול, ולכן כדאי להפוך אותן למשפטים שימושיים ולתרגל איתן כתיבה קצרה.";
  } else if (hasOpenTasks) {
    focus = "סגירת משימות פתוחות";
    shortReason = "יש משימות שממתינות לביצוע";
    reason =
      "יש לך משימות פתוחות שממתינות לביצוע, ולכן כדאי להתחיל מהן כדי להתקדם בצורה מסודרת.";
  } else if (reviewTasks.length > 0) {
    focus = "חזרה קלה והמשך רצף";
    shortReason = "יש משימות שכבר נשלחו לבדיקה";
    reason =
      "יש משימות שכבר נשלחו לבדיקה, אז היום מתאים לחזרה קלה, כתיבה קצרה והמשך רצף בלי עומס.";
  }

  const steps = [];

  if (hasOpenTasks) {
    steps.push({
      title: "פתחי משימה אחת",
      text: "בחרי משימה אחת פתוחה ובצעי אותה עד הסוף.",
      path: "/tasks",
      buttonText: "למשימות",
      estimatedTime: "10–20 דקות",
      difficulty: "Medium",
      rewardXP: 80,
    });
  } else {
    steps.push({
      title: "בקשי תוכנית קצרה",
      text: "בקשי מהמאמן האישי לבנות לך סדר לימוד קצר להיום.",
      path: "/dashboard",
      buttonText: "לדשבורד",
      estimatedTime: "5 דקות",
      difficulty: "Easy",
      rewardXP: 40,
    });
  }

  if (practiceWords.length > 0) {
    const wordsText = practiceWords
      .slice(0, 3)
      .map((word) => word.word)
      .join(", ");

    steps.push({
      title: "חזרה על מילים",
      text: `חזרי על 3 מילים מהמילון שלך: ${wordsText}. נסי לכתוב משפט עם אחת מהן.`,
      path: "/dictionary",
      buttonText: "למילון",
      estimatedTime: "7 דקות",
      difficulty: "Easy",
      rewardXP: 50,
    });
  } else {
    steps.push({
      title: "הוסיפי מילה חדשה",
      text: "הוסיפי מילה אחת חדשה למילון האישי בעזרת AI.",
      path: "/dictionary",
      buttonText: "למילון",
      estimatedTime: "5 דקות",
      difficulty: "Easy",
      rewardXP: 40,
    });
  }

  steps.push({
    title: "תרגול כתיבה קצר",
    text: "כתבי פסקה קצרה באנגלית וקבלי ציון, משוב ותיקונים ממאמן הכתיבה.",
    path: "/writing",
    buttonText: "למאמן כתיבה",
    estimatedTime: "10 דקות",
    difficulty: level === "advanced" ? "Medium" : "Easy",
    rewardXP: 70,
  });

  if (hasGrammarSignal) {
    steps.push({
      title: "תרגול דקדוק עם בולט",
      text: "בקשי מבולט להסביר את הנושא הדקדוקי ולתת לך 2 משפטים לתרגול.",
      path: "/chat",
      buttonText: "פתחי צ׳אט",
      estimatedTime: "10 דקות",
      difficulty: level === "advanced" ? "Medium" : "Easy",
      rewardXP: 70,
    });
  } else {
    steps.push({
      title: "שיחה קצרה באנגלית",
      text: "כתבי לבולט: Ask me one easy English question and wait for my answer.",
      path: "/chat",
      buttonText: "תרגול עם בולט",
      estimatedTime: "8 דקות",
      difficulty: "Easy",
      rewardXP: 60,
    });
  }

  steps.push({
    title: "סיכום קטן",
    text: "כתבי לעצמך משפט אחד באנגלית על מה שלמדת היום.",
    path: "/tasks",
    buttonText: "למשימות",
    estimatedTime: "5 דקות",
    difficulty: "Easy",
    rewardXP: 50,
  });

  return {
    focus,
    shortReason,
    reason,
    steps,
    stats: {
      pendingTasks: pendingTasks.length,
      reviewTasks: reviewTasks.length,
      practiceWords: practiceWords.length,
      masteredWords: masteredWords.length,
      conversations: conversations.length,
    },
  };
}