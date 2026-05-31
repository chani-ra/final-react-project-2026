import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTasks } from "../../../services/taskService";
import { getMyDictionaryWords } from "../../../services/dictionaryService";
import { getMyChatConversations } from "../../../services/chatService";
import { getMyCoursesProgressSummary } from "../../../services/courseProgressService";
import { getUserQuizResults } from "../../../services/quizService";
import { generateBrainMapWithAI } from "../../../services/aiService";

export default function StudentBrainMap({ user }) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [courseSummary, setCourseSummary] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMap, setAiMap] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const level = user?.englishLevel || user?.level || "beginner";

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [
        tasksData,
        wordsData,
        conversationsData,
        coursesProgressData,
        quizResultsData,
      ] = await Promise.all([
        getMyTasks(),
        getMyDictionaryWords(),
        getMyChatConversations(),
        getMyCoursesProgressSummary(),
        getUserQuizResults(),
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setDictionaryWords(Array.isArray(wordsData) ? wordsData : []);
      setConversations(
        Array.isArray(conversationsData) ? conversationsData : []
      );
      setCourseSummary(coursesProgressData || null);

      setQuizResults(
        Array.isArray(quizResultsData?.quizResults)
          ? quizResultsData.quizResults
          : []
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
    loadData();
  }, []);

  const localBrainMap = useMemo(() => {
    return buildLocalBrainMap({
      level,
      tasks,
      dictionaryWords,
      conversations,
      courseSummary,
      quizResults,
    });
  }, [level, tasks, dictionaryWords, conversations, courseSummary, quizResults]);

  const currentMap = aiMap || localBrainMap;

  const strongestSkill = useMemo(() => {
    return getStrongestSkill(currentMap.skills);
  }, [currentMap.skills]);

  const weakestSkill = useMemo(() => {
    return getWeakestSkill(currentMap.skills);
  }, [currentMap.skills]);

  const handleUpgradeWithAI = async () => {
    try {
      setAiLoading(true);
      setMessage({ type: "", text: "" });

      const brainMap = await generateBrainMapWithAI({
        level,
        stats: localBrainMap.stats,
        localSkills: localBrainMap.skills,
        latestConversation: conversations?.[0]?.lastMessage?.text || "",
      });

      setAiMap(normalizeBrainMap(brainMap, localBrainMap));

      setMessage({
        type: "success",
        text: "מפת המוח שודרגה בעזרת AI.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleRecommendedAction = () => {
    const target = weakestSkill?.key;

    const paths = {
      vocabulary: "/dictionary",
      grammar: "/chat",
      writing: "/writing",
      speaking: "/chat",
      listening: "/courses",
      confidence: "/chat",
      courseProgress: "/courses",
    };

    navigate(paths[target] || "/dashboard", {
      state: { fromSmartPath: true },
    });
  };

  if (loading) {
    return (
      <section className="bg-white/5 border border-white/10 rounded-3xl p-5">
        <div className="animate-pulse text-gray-400 font-bold">
          בונה מפת יכולות חכמה... 🧠
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
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-400/20 flex items-center justify-center text-2xl shrink-0">
              🧠
            </div>

            <div>
              <div className="text-xs font-black text-purple-300 mb-1">
                English Brain Map
              </div>

              <h2 className="text-xl font-black text-white">
                מפת הלמידה החכמה שלך
              </h2>

              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                התחום החזק: {strongestSkill?.label || "עדיין נאסף מידע"} ·
                לחיזוק: {weakestSkill?.label || "עדיין נאסף מידע"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3">
            <BrainMiniScore value={currentMap.averageScore} />

            <div className="bg-yellow-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-black">
              {isOpen ? "סגירה ↑" : "פתחי מפה ↓"}
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

          <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-4">
            <p className="text-sm text-indigo-200 leading-relaxed">
              זו מפת למידה משוערת לפי הפעילות שלך באתר: קורסים, משימות, מילון,
              שיחות, כתיבה ובחנים. ככל שתשתמשי יותר במערכת — המפה תהיה מדויקת יותר.
            </p>
          </div>

          <CourseProgressInsight stats={currentMap.stats} />

          <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-5">
            <BrainVisual skills={currentMap.skills} />

            <div className="space-y-4">
              <div className="bg-slate-950/50 border border-white/10 rounded-3xl p-5">
                <div className="text-xs font-black text-purple-300 mb-1">
                  ניתוח חכם
                </div>

                <h3 className="text-lg font-black text-white mb-2">
                  {currentMap.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {currentMap.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InsightCard
                  title="התחום החזק"
                  value={strongestSkill?.label || "אין מספיק מידע"}
                  text={strongestSkill?.reason || "המערכת עדיין אוספת נתונים."}
                  color="emerald"
                />

                <InsightCard
                  title="התחום שכדאי לחזק"
                  value={weakestSkill?.label || "אין מספיק מידע"}
                  text={weakestSkill?.reason || "המערכת עדיין אוספת נתונים."}
                  color="yellow"
                />
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-3xl p-5">
                <h3 className="font-black text-yellow-300 mb-2">
                  המלצה לפעולה עכשיו
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {currentMap.recommendation}
                </p>

                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleRecommendedAction}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl transition-all"
                  >
                    חזקי את התחום החלש ✨
                  </button>

                  <button
                    type="button"
                    onClick={handleUpgradeWithAI}
                    disabled={aiLoading}
                    className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-60 text-white font-black py-3 rounded-xl transition-all"
                  >
                    {aiLoading ? "AI מנתח..." : "שדרגי עם AI 🧠"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <SkillBars skills={currentMap.skills} />
        </div>
      )}
    </section>
  );
}

function CourseProgressInsight({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <MiniStat
        label="ממוצע קורסים"
        value={`${stats.averageCourseProgress || 0}%`}
        color="text-yellow-400"
      />

      <MiniStat
        label="קורסים פעילים"
        value={stats.totalCourses || 0}
        color="text-indigo-300"
      />

      <MiniStat
        label="שירים שבוצעו"
        value={stats.completedSongs || 0}
        color="text-emerald-300"
      />

      <MiniStat
        label="שיעורים שבוצעו"
        value={stats.completedLessons || 0}
        color="text-purple-300"
      />

      <MiniStat
        label="ממוצע בחנים"
        value={`${stats.averageQuizScore || 0}%`}
        color="text-pink-300"
      />
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function BrainMiniScore({ value }) {
  return (
    <div className="bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2 text-center">
      <div className="text-lg font-black text-white">{value}%</div>
      <div className="text-[10px] text-gray-400">ממוצע</div>
    </div>
  );
}

function BrainVisual({ skills }) {
  const top = skills[0] || {};
  const right = skills[1] || {};
  const bottomRight = skills[2] || {};
  const bottom = skills[3] || {};
  const bottomLeft = skills[4] || {};
  const left = skills[5] || {};

  return (
    <div className="bg-slate-950/50 border border-white/10 rounded-3xl p-5">
      <div className="text-center mb-4">
        <div className="text-xs font-black text-purple-300 mb-1">
          מוח הלמידה
        </div>

        <h3 className="font-black text-white">חלוקה לפי תחומי אנגלית</h3>
      </div>

      <div className="relative mx-auto w-72 h-72">
        <div className="absolute inset-6 rounded-[45%] bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-300/20 shadow-inner" />

        <BrainBubble skill={top} className="top-0 left-1/2 -translate-x-1/2" />
        <BrainBubble skill={right} className="top-16 right-0" />
        <BrainBubble skill={bottomRight} className="bottom-10 right-5" />
        <BrainBubble
          skill={bottom}
          className="bottom-0 left-1/2 -translate-x-1/2"
        />
        <BrainBubble skill={bottomLeft} className="bottom-10 left-5" />
        <BrainBubble skill={left} className="top-16 left-0" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-slate-950 border border-white/10 flex flex-col items-center justify-center shadow-xl">
            <div className="text-3xl">🧠</div>

            <div className="text-[10px] text-gray-400 font-bold mt-1">
              English
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrainBubble({ skill, className }) {
  const score = Number(skill?.score) || 0;

  return (
    <div
      className={`absolute w-24 h-24 rounded-3xl border flex flex-col items-center justify-center text-center p-2 ${getScoreBubbleClass(
        score
      )} ${className}`}
    >
      <div className="text-[11px] font-black leading-tight">
        {skill?.label || "תחום"}
      </div>

      <div className="text-xl font-black mt-1">{score}%</div>
    </div>
  );
}

function SkillBars({ skills }) {
  return (
    <div className="bg-slate-950/50 border border-white/10 rounded-3xl p-5">
      <h3 className="font-black text-white mb-4">פירוט לפי תחומים</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <SkillBar key={skill.key} skill={skill} />
        ))}
      </div>
    </div>
  );
}

function SkillBar({ skill }) {
  const score = clampScore(skill.score);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-2 gap-4">
        <div>
          <h4 className="font-black text-white">{skill.label}</h4>

          <p className="text-xs text-gray-400 mt-1">{skill.reason}</p>
        </div>

        <span className="text-lg font-black text-yellow-400">{score}%</span>
      </div>

      <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getScoreBarClass(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({ title, value, text, color }) {
  const colorClass =
    color === "emerald"
      ? "border-emerald-500/20 text-emerald-300"
      : "border-yellow-500/20 text-yellow-300";

  return (
    <div className={`bg-slate-950/50 border rounded-3xl p-5 ${colorClass}`}>
      <div className="text-xs font-black opacity-80 mb-1">{title}</div>

      <h3 className="text-lg font-black text-white">{value}</h3>

      <p className="text-sm text-gray-400 mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function buildLocalBrainMap({
  level,
  tasks,
  dictionaryWords,
  conversations,
  courseSummary,
  quizResults,
}) {
  const totalWords = dictionaryWords.length;
  const masteredWords = dictionaryWords.filter((word) => word.mastered).length;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const conversationsCount = conversations.length;
  const latestConversationText =
    conversations?.[0]?.lastMessage?.text?.toLowerCase() || "";

  const courseStats = extractCourseStats(courseSummary);
  const quizStats = extractQuizStats(quizResults);

  const grammarSignal =
    latestConversationText.includes("grammar") ||
    latestConversationText.includes("past") ||
    latestConversationText.includes("perfect") ||
    latestConversationText.includes("דקדוק") ||
    latestConversationText.includes("עבר") ||
    latestConversationText.includes("הווה");

  const vocabularyScore = calculateVocabularyScore(totalWords, masteredWords);

  const taskCompletionScore = calculatePercent(completedTasks, totalTasks, 45);

  const courseProgressScore = courseStats.averageCourseProgress || 35;

  const quizScore =
    quizStats.totalQuizResults > 0 ? quizStats.averageQuizScore : 45;

  const conversationScore = Math.min(90, 30 + conversationsCount * 10);

  const listeningScore = clampScore(
    Math.round(
      courseStats.completedSongs > 0
        ? 45 + courseStats.completedSongs * 10 + courseProgressScore * 0.25
        : 30 + courseProgressScore * 0.25
    )
  );

  const grammarScore = clampScore(
    Math.round(
      quizStats.totalQuizResults > 0
        ? (quizScore + taskCompletionScore + courseProgressScore) / 3
        : grammarSignal
        ? (conversationScore + taskCompletionScore + courseProgressScore) / 3
        : (taskCompletionScore + courseProgressScore) / 2
    )
  );

  const writingScore = clampScore(
    Math.round(
      (taskCompletionScore +
        grammarScore +
        Math.min(85, 35 + courseStats.completedExercises * 10) +
        quizScore) /
        4
    )
  );

  const speakingScore = conversationScore;

  const confidenceScore = clampScore(
    Math.round(
      (conversationScore +
        taskCompletionScore +
        vocabularyScore +
        courseProgressScore +
        quizScore) /
        5
    )
  );

  const skills = [
    {
      key: "vocabulary",
      label: "אוצר מילים",
      score: vocabularyScore,
      reason:
        totalWords > 0
          ? `יש לך ${totalWords} מילים במילון, ומתוכן ${masteredWords} מסומנות כיודעת.`
          : "עדיין אין מספיק מילים במילון האישי.",
      path: "/dictionary",
    },
    {
      key: "grammar",
      label: "דקדוק",
      score: grammarScore,
      reason:
        quizStats.totalQuizResults > 0
          ? `הציון משלב גם ${quizStats.totalQuizResults} תוצאות בחנים, עם ממוצע ${quizStats.averageQuizScore}%.`
          : grammarSignal
          ? "בשיחות האחרונות עלה נושא דקדוקי, והציון משלב גם משימות והתקדמות קורסים."
          : "הציון מבוסס על משימות, התקדמות בקורסים ופעילות כללית.",
      path: "/chat",
    },
    {
      key: "writing",
      label: "כתיבה",
      score: writingScore,
      reason:
        courseStats.completedExercises > 0 || quizStats.totalQuizResults > 0
          ? `הציון משלב משימות, ${courseStats.completedExercises} תרגילים ו-${quizStats.totalQuizResults} בחנים.`
          : "הציון מבוסס כרגע על משימות ודקדוק. בהמשך יתחבר גם להיסטוריית מאמן הכתיבה.",
      path: "/writing",
    },
    {
      key: "speaking",
      label: "דיבור",
      score: speakingScore,
      reason:
        conversationsCount > 0
          ? `יש לך ${conversationsCount} שיחות עם בולט.`
          : "עדיין לא נעשו מספיק תרגולי שיחה עם בולט.",
      path: "/chat",
    },
    {
      key: "listening",
      label: "שמיעה",
      score: listeningScore,
      reason:
        courseStats.completedSongs > 0
          ? `סומנו ${courseStats.completedSongs} שירים כהושלמו בקורסים.`
          : "עדיין לא סומנו מספיק שירים או האזנות בקורסים.",
      path: "/courses",
    },
    {
      key: "confidence",
      label: "ביטחון",
      score: confidenceScore,
      reason:
        quizStats.totalQuizResults > 0
          ? `הציון משלב ביצוע משימות, התקדמות בקורסים, מילון, צ׳אט ותוצאות בחנים. ממוצע הבחנים שלך הוא ${quizStats.averageQuizScore}%.`
          : "הציון משלב ביצוע משימות, התקדמות בקורסים, מילון ושימוש בצ׳אט.",
      path: "/chat",
    },
  ];

  const averageScore = Math.round(
    skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length
  );

  const weakest = getWeakestSkill(skills);

  return {
    title: "מפת למידה משוערת לפי פעילות אמיתית",
    summary:
      "המפה משלבת נתונים מהמילון, משימות, שיחות עם בולט, התקדמות בקורסים ותוצאות בחנים. היא אינה מבחן רמה רשמי, אלא תמונת מצב חכמה של הלמידה שלך.",
    recommendation: getRecommendationByWeakestSkill(weakest?.key),
    skills,
    averageScore,
    stats: {
      totalWords,
      masteredWords,
      totalTasks,
      completedTasks,
      conversationsCount,
      level,
      ...courseStats,
      ...quizStats,
    },
  };
}

function extractCourseStats(courseSummary) {
  const progressList = Array.isArray(courseSummary?.progressList)
    ? courseSummary.progressList
    : [];

  const completedLessons = progressList.reduce(
    (sum, item) => sum + safeLength(item.completedLessons),
    0
  );

  const completedSongs = progressList.reduce(
    (sum, item) => sum + safeLength(item.completedSongs),
    0
  );

  const completedExercises = progressList.reduce(
    (sum, item) => sum + safeLength(item.completedExercises),
    0
  );

  const completedQuizzes = progressList.reduce(
    (sum, item) => sum + safeLength(item.completedQuizzes),
    0
  );

  return {
    totalCourses: courseSummary?.totalCourses || 0,
    completedCourses: courseSummary?.completedCourses || 0,
    averageCourseProgress: courseSummary?.averageProgress || 0,
    completedLessons,
    completedSongs,
    completedExercises,
    completedQuizzes,
  };
}

function extractQuizStats(quizResults = []) {
  const safeResults = Array.isArray(quizResults) ? quizResults : [];

  const totalQuizResults = safeResults.length;

  const passedQuizzes = safeResults.filter((result) => result.passed).length;

  const averageQuizScore =
    totalQuizResults > 0
      ? Math.round(
          safeResults.reduce(
            (sum, result) => sum + (Number(result.percentage) || 0),
            0
          ) / totalQuizResults
        )
      : 0;

  const latestQuizScore =
    totalQuizResults > 0
      ? Number(safeResults[0]?.percentage) || averageQuizScore
      : 0;

  return {
    totalQuizResults,
    passedQuizzes,
    averageQuizScore,
    latestQuizScore,
  };
}

function normalizeBrainMap(aiMap, localMap) {
  const safeSkills =
    Array.isArray(aiMap?.skills) && aiMap.skills.length > 0
      ? aiMap.skills.map((skill) => ({
          key: skill.key,
          label: skill.label,
          score: clampScore(skill.score),
          reason: skill.reason || "ניתוח AI לפי נתוני הלמידה שלך.",
        }))
      : localMap.skills;

  const averageScore = Math.round(
    safeSkills.reduce((sum, skill) => sum + skill.score, 0) / safeSkills.length
  );

  return {
    title: "מפת יכולות משודרגת עם AI",
    summary: aiMap?.summary || localMap.summary,
    recommendation: aiMap?.recommendation || localMap.recommendation,
    skills: safeSkills,
    averageScore,
    stats: localMap.stats,
  };
}

function calculateVocabularyScore(totalWords, masteredWords) {
  if (totalWords === 0) return 30;

  const masteryPart = calculatePercent(masteredWords, totalWords, 0);
  const sizeBonus = Math.min(25, totalWords * 3);

  return clampScore(Math.round(masteryPart * 0.75 + sizeBonus));
}

function calculatePercent(done, total, fallback = 0) {
  if (!total) return fallback;
  return clampScore(Math.round((done / total) * 100));
}

function clampScore(value) {
  const number = Number(value) || 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function safeLength(value) {
  return Array.isArray(value) ? value.length : 0;
}

function getStrongestSkill(skills = []) {
  if (!skills.length) return null;
  return [...skills].sort((a, b) => b.score - a.score)[0];
}

function getWeakestSkill(skills = []) {
  if (!skills.length) return null;
  return [...skills].sort((a, b) => a.score - b.score)[0];
}

function getRecommendationByWeakestSkill(key) {
  const recommendations = {
    vocabulary:
      "כדאי להוסיף 3 מילים חדשות למילון ולכתוב משפט אחד עם כל מילה.",
    grammar:
      "כדאי לפתוח את בולט ולבקש ממנו להסביר נושא דקדוקי אחד עם תרגול קצר.",
    writing:
      "כדאי לכתוב פסקה קצרה במאמן הכתיבה ולקבל משוב על המשפטים שלך.",
    speaking:
      "כדאי לפתוח שיחה קצרה עם בולט ולענות באנגלית אפילו במשפטים פשוטים.",
    listening:
      "כדאי להיכנס לקורס, להאזין לשיר אחד ולסמן אותו כהושלם.",
    confidence:
      "כדאי לתרגל שיחה קצרה עם בולט ולסמן משימה אחת כבוצעה.",
  };

  return recommendations[key] || "כדאי לבחור משימה אחת קטנה ולבצע אותה היום.";
}

function getScoreBubbleClass(score) {
  if (score >= 75) {
    return "bg-emerald-500/20 border-emerald-500/30 text-emerald-200";
  }

  if (score >= 50) {
    return "bg-yellow-500/20 border-yellow-500/30 text-yellow-100";
  }

  return "bg-red-500/20 border-red-500/30 text-red-100";
}

function getScoreBarClass(score) {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 50) return "bg-yellow-400";
  return "bg-red-400";
}