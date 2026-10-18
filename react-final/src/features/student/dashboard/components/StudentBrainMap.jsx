import useMessageNotice from "../../../../components/ui/useMessageNotice.js";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTasks } from "../../../../services/taskService";
import { getMyDictionaryWords } from "../../../../services/dictionaryService";
import { getMyChatConversations } from "../../../../services/chatService";
import { getMyCoursesProgressSummary } from "../../../../services/courseProgressService";
import { getUserQuizResults } from "../../../../services/quizService";
import { generateBrainMapWithAI } from "../../../../services/aiService";

export default function StudentBrainMap({ user }) {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [courseSummary, setCourseSummary] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMap, setAiMap] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

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

  const currentMap = normalizeBrainMap(aiMap || localBrainMap);
  const strongestSkill = getStrongestSkill(currentMap.skills);
  const weakestSkill = getWeakestSkill(currentMap.skills);

  const handleUpgradeWithAI = async () => {
    try {
      setAiLoading(true);
      setMessage({ type: "", text: "" });

      const brainMap = await generateBrainMapWithAI({
        level,
        stats: currentMap.stats,
        localSkills: currentMap.skills,
        latestConversation: conversations?.[0]?.lastMessage?.text || "",
      });

      setAiMap(brainMap);

      setMessage({
        type: "success",
        text: "הבריין־מאפ שודרג לפי AI.",
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
    const key = weakestSkill?.key;

    if (key === "vocabulary" || key === "reading") {
      navigate("/dictionary");
      return;
    }

    if (key === "speaking" || key === "listening") {
      navigate("/chat");
      return;
    }

    if (key === "writing" || key === "grammar") {
      navigate("/writing");
      return;
    }

    navigate("/tasks");
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/55 p-8 text-center text-white">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        <p className="mt-4 text-sm font-black text-white/70">
          טוען נתוני למידה...
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5 text-white" dir="rtl">
      <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/55 p-5 shadow-[0_22px_70px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.10)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100">
              brain map
            </div>

            <h2 className="text-3xl font-black text-white">מפת יכולות</h2>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/62">
              ניתוח אישי של תחומי האנגלית שלך לפי משימות, מילים, קורסים,
              שיחות ובחנים.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadData}
              className="rounded-full border-2 border-white/16 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16"
            >
              רענון נתונים
            </button>

            <button
              type="button"
              onClick={handleUpgradeWithAI}
              disabled={aiLoading}
              className="rounded-full border-2 border-yellow-300/50 bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {aiLoading ? "AI מנתח..." : "שדרוג עם AI"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <MiniStat label="משימות" value={currentMap.stats.totalTasks} />
          <MiniStat label="מילים" value={currentMap.stats.totalWords} />
          <MiniStat label="שיחות" value={currentMap.stats.conversations} />
          <MiniStat
            label="קורסים"
            value={`${currentMap.stats.averageCourseProgress}%`}
          />
          <MiniStat
            label="בחנים"
            value={`${currentMap.stats.averageQuizScore}%`}
          />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <BrainVisual skills={currentMap.skills} />

        <div className="space-y-5">
          <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/55 p-5 shadow-[0_22px_70px_rgba(3,31,61,0.28),inset_0_1px_0_rgba(255,255,255,0.10)]">
            <div className="text-xs font-black text-yellow-100">ניתוח חכם</div>

            <h3 className="mt-1 text-2xl font-black text-white">
              {currentMap.title}
            </h3>

            <p className="mt-3 text-sm font-semibold leading-7 text-white/62">
              {currentMap.summary}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InsightCard
              title="התחום החזק"
              value={strongestSkill?.label || "אין מספיק מידע"}
              text={strongestSkill?.reason || "המערכת עדיין אוספת נתונים."}
              tone="green"
            />

            <InsightCard
              title="התחום שכדאי לחזק"
              value={weakestSkill?.label || "אין מספיק מידע"}
              text={weakestSkill?.reason || "המערכת עדיין אוספת נתונים."}
              tone="yellow"
            />
          </div>

          <div className="rounded-[2rem] border-2 border-yellow-300/25 bg-yellow-300/12 p-5">
            <h3 className="text-xl font-black text-yellow-100">
              המלצה לפעולה עכשיו
            </h3>

            <p className="mt-2 text-sm font-semibold leading-7 text-white/68">
              {currentMap.recommendation}
            </p>

            <button
              type="button"
              onClick={handleRecommendedAction}
              className="mt-4 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:brightness-110"
            >
              חזקי עכשיו את התחום החלש
            </button>
          </div>
        </div>
      </div>

      <SkillBars skills={currentMap.skills} />
    </section>
  );
}

function BrainVisual({ skills }) {
  const safeSkills = skills.length ? skills : [];

  return (
    <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/55 p-5 shadow-[0_22px_70px_rgba(3,31,61,0.28),inset_0_1px_0_rgba(255,255,255,0.10)]">
      <div className="text-center">
        <div className="text-xs font-black text-yellow-100">learning brain</div>

        <h3 className="mt-1 text-xl font-black text-white">
          חלוקה לפי תחומים
        </h3>
      </div>

      <div className="relative mx-auto mt-5 h-[310px] w-[310px]">
        <div className="absolute inset-8 rounded-[42%] border border-yellow-300/18 bg-gradient-to-br from-yellow-300/12 via-white/8 to-red-500/12 shadow-inner" />

        <BrainBubble skill={safeSkills[0]} className="left-1/2 top-0 -translate-x-1/2" />
        <BrainBubble skill={safeSkills[1]} className="right-0 top-16" />
        <BrainBubble skill={safeSkills[2]} className="bottom-10 right-5" />
        <BrainBubble skill={safeSkills[3]} className="bottom-0 left-1/2 -translate-x-1/2" />
        <BrainBubble skill={safeSkills[4]} className="bottom-10 left-5" />
        <BrainBubble skill={safeSkills[5]} className="left-0 top-16" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-white/16 bg-slate-950 text-center shadow-xl">
            <div className="text-2xl font-black text-yellow-100">
              {averageSkillScore(safeSkills)}%
            </div>

            <div className="mt-1 text-[10px] font-black text-white/45">
              ממוצע
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrainBubble({ skill, className }) {
  const score = clampScore(skill?.score);

  return (
    <div
      className={`absolute flex h-24 w-24 flex-col items-center justify-center rounded-[1.4rem] border p-2 text-center shadow-lg ${getBubbleClass(
        score
      )} ${className}`}
    >
      <div className="text-[11px] font-black leading-tight">
        {skill?.label || "תחום"}
      </div>

      <div className="mt-1 text-xl font-black">{score}%</div>
    </div>
  );
}

function SkillBars({ skills }) {
  return (
    <div className="rounded-[2rem] border-2 border-white/18 bg-slate-950/55 p-5 shadow-[0_22px_70px_rgba(3,31,61,0.28),inset_0_1px_0_rgba(255,255,255,0.10)]">
      <h3 className="text-xl font-black text-white">פירוט לפי מיומנויות</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
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
    <div className="rounded-[1.4rem] border border-white/10 bg-white/8 p-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h4 className="font-black text-white">{skill.label}</h4>

          <p className="mt-1 text-xs font-semibold leading-5 text-white/45">
            {skill.reason}
          </p>
        </div>

        <span className="text-lg font-black text-yellow-100">{score}%</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={getBarClass(score)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({ title, value, text, tone }) {
  const className =
    tone === "green"
      ? "border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
      : "border-yellow-300/30 bg-yellow-300/12 text-yellow-100";

  return (
    <div className={`rounded-[1.6rem] border p-5 ${className}`}>
      <div className="text-xs font-black opacity-80">{title}</div>

      <h3 className="mt-1 text-xl font-black text-white">{value}</h3>

      <p className="mt-2 text-sm font-semibold leading-7 text-white/62">
        {text}
      </p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-[1.2rem] border border-white/12 bg-white/8 p-4 text-center">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs font-black text-white/45">{label}</div>
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
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const masteredWords = dictionaryWords.filter((word) => word.mastered);
  const courseStats = extractCourseStats(courseSummary);
  const quizStats = extractQuizStats(quizResults);

  const vocabularyScore = calculatePercent(
    masteredWords.length,
    dictionaryWords.length,
    45
  );

  const taskScore = calculatePercent(completedTasks.length, tasks.length, 45);
  const conversationScore = clampScore(35 + conversations.length * 10);
  const quizScore = quizStats.averageQuizScore || 45;
  const courseScore = courseStats.averageCourseProgress || 40;

  const skills = [
    {
      key: "vocabulary",
      label: "אוצר מילים",
      score: vocabularyScore,
      reason: `נמדד לפי ${dictionaryWords.length} מילים במילון האישי.`,
    },
    {
      key: "grammar",
      label: "דקדוק",
      score: clampScore(Math.round((quizScore + taskScore) / 2)),
      reason: "נמדד לפי בחנים ומשימות שבוצעו.",
    },
    {
      key: "speaking",
      label: "דיבור",
      score: conversationScore,
      reason: `נמדד לפי ${conversations.length} שיחות עם הצ׳אט הלימודי.`,
    },
    {
      key: "writing",
      label: "כתיבה",
      score: clampScore(Math.round((taskScore + quizScore) / 2)),
      reason: "נמדד לפי משימות כתיבה ותרגול.",
    },
    {
      key: "reading",
      label: "קריאה",
      score: clampScore(Math.round((courseScore + vocabularyScore) / 2)),
      reason: "נמדד לפי התקדמות בקורסים ואוצר מילים.",
    },
    {
      key: "listening",
      label: "האזנה",
      score: clampScore(courseStats.completedSongs ? 50 + courseStats.completedSongs * 8 : 38),
      reason: "נמדד לפי שירים ותרגולי האזנה בקורסים.",
    },
  ];

  const weakest = getWeakestSkill(skills);

  return {
    title: "מפת יכולות אישית",
    summary: `המפה נבנתה לפי הנתונים שנאספו במערכת וברמת ${getLevelLabel(
      level
    )}. היא מציגה תמונת מצב כללית של ההתקדמות שלך.`,
    recommendation: weakest
      ? `כדאי להתמקד עכשיו ב${weakest.label}, כי זה התחום עם הציון הנמוך ביותר כרגע.`
      : "כדאי להמשיך לתרגל בקביעות כדי לאסוף עוד נתונים.",
    skills,
    stats: {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalWords: dictionaryWords.length,
      masteredWords: masteredWords.length,
      conversations: conversations.length,
      averageCourseProgress: courseStats.averageCourseProgress,
      averageQuizScore: quizStats.averageQuizScore,
    },
  };
}

function normalizeBrainMap(map) {
  const safeSkills = Array.isArray(map?.skills) ? map.skills : [];

  return {
    title: map?.title || "מפת יכולות אישית",
    summary: map?.summary || "המערכת בנתה תמונת מצב לפי הנתונים הקיימים.",
    recommendation:
      map?.recommendation || "כדאי להמשיך לתרגל בקביעות ולחזק תחום אחד בכל פעם.",
    skills: safeSkills.map((skill, index) => ({
      key: skill.key || `skill-${index}`,
      label: skill.label || "תחום",
      score: clampScore(skill.score),
      reason: skill.reason || "הציון מבוסס על נתוני הלמידה במערכת.",
    })),
    stats: {
      totalTasks: Number(map?.stats?.totalTasks || 0),
      completedTasks: Number(map?.stats?.completedTasks || 0),
      totalWords: Number(map?.stats?.totalWords || 0),
      masteredWords: Number(map?.stats?.masteredWords || 0),
      conversations: Number(map?.stats?.conversations || 0),
      averageCourseProgress: Number(map?.stats?.averageCourseProgress || 0),
      averageQuizScore: Number(map?.stats?.averageQuizScore || 0),
    },
  };
}

function extractCourseStats(courseSummary) {
  return {
    averageCourseProgress: Number(
      courseSummary?.averageProgress ||
        courseSummary?.averageCourseProgress ||
        courseSummary?.progress ||
        0
    ),
    completedSongs: Number(courseSummary?.completedSongs || 0),
  };
}

function extractQuizStats(quizResults) {
  if (!Array.isArray(quizResults) || quizResults.length === 0) {
    return { averageQuizScore: 0 };
  }

  const sum = quizResults.reduce((total, item) => {
    const score = Number(item.score || 0);
    const totalQuestions = Number(item.totalQuestions || item.total || 100);

    if (!totalQuestions) return total;

    return total + Math.round((score / totalQuestions) * 100);
  }, 0);

  return {
    averageQuizScore: Math.round(sum / quizResults.length),
  };
}

function calculatePercent(value, total, fallback) {
  if (!total) return fallback;
  return clampScore(Math.round((value / total) * 100));
}

function clampScore(value) {
  const number = Number(value);

  if (Number.isNaN(number)) return 0;
  if (number < 0) return 0;
  if (number > 100) return 100;

  return Math.round(number);
}

function getStrongestSkill(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return null;

  return [...skills].sort((a, b) => clampScore(b.score) - clampScore(a.score))[0];
}

function getWeakestSkill(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return null;

  return [...skills].sort((a, b) => clampScore(a.score) - clampScore(b.score))[0];
}

function averageSkillScore(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return 0;

  const sum = skills.reduce((total, skill) => total + clampScore(skill.score), 0);

  return Math.round(sum / skills.length);
}

function getBubbleClass(score) {
  if (score >= 75) {
    return "border-emerald-300/35 bg-emerald-300/18 text-emerald-100";
  }

  if (score >= 50) {
    return "border-yellow-300/35 bg-yellow-300/18 text-yellow-100";
  }

  return "border-red-300/35 bg-red-500/18 text-red-100";
}

function getBarClass(score) {
  if (score >= 75) return "h-full rounded-full bg-emerald-300";
  if (score >= 50) return "h-full rounded-full bg-yellow-300";
  return "h-full rounded-full bg-red-400";
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