import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCourses,
  getRecommendedCourses,
  enrollInCourse,
} from "../../services/courseService";

export default function Courses() {
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("myCourses");

  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCourses();
      setMyCourses(data.courses || []);
    } catch (err) {
      console.error("שגיאה בטעינת הקורסים שלי:", err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      setActionMessage("");

      const data = await getRecommendedCourses();
      setRecommendedCourses(data.courses || []);
    } catch (err) {
      console.error("שגיאה בטעינת קורסים מומלצים:", err);
      setActionMessage(err.toString());
    } finally {
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  const handleRecommendedTab = async () => {
    setActiveTab("recommended");

    if (recommendedCourses.length === 0) {
      await loadRecommendedCourses();
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setActionMessage("");

      await enrollInCourse(courseId);

      setActionMessage("נרשמת לקורס בהצלחה 🎉");

      await loadMyCourses();
      await loadRecommendedCourses();

      setActiveTab("myCourses");
    } catch (err) {
      setActionMessage(err.toString());
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      beginner: "מתחילים",
      intermediate: "בינוני",
      advanced: "מתקדמים",
    };

    return labels[level] || level || "לא צוין";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      grammar: "דקדוק",
      vocabulary: "אוצר מילים",
      conversation: "שיחה",
      reading: "קריאה",
      listening: "האזנה",
      general: "כללי",
    };

    return labels[category] || category || "כללי";
  };

  const getCourseContentStats = (course) => {
    const lessons = course.lessons?.length || 0;
    const exercises = course.exercises?.length || 0;
    const quizzes = course.quizzes?.length || 0;
    const songs = course.songs?.length || 0;

    return { lessons, exercises, quizzes, songs };
  };

  const CourseCard = ({ course, isRecommended = false }) => {
    const stats = getCourseContentStats(course);

    return (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-yellow-400/30 transition-all flex flex-col justify-between h-full shadow-lg">
        <div>
          <div className="flex justify-between items-start mb-4 gap-3">
            <span className="bg-yellow-400/10 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-400/20">
              {getCategoryLabel(course.category)}
            </span>

            <span className="bg-white/10 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
              רמה: {getLevelLabel(course.level)}
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-3 text-white">
            {course.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed min-h-[60px]">
            {course.description || "אין תיאור לקורס זה עדיין."}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-black/20 border border-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">🎬</div>
              <div className="text-sm font-bold">{stats.lessons}</div>
              <div className="text-xs text-gray-400">שיעורים</div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">📝</div>
              <div className="text-sm font-bold">{stats.exercises}</div>
              <div className="text-xs text-gray-400">תרגילים</div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">🧠</div>
              <div className="text-sm font-bold">{stats.quizzes}</div>
              <div className="text-xs text-gray-400">בחנים</div>
            </div>

            <div className="bg-black/20 border border-white/5 rounded-2xl p-3 text-center">
              <div className="text-xl mb-1">🎵</div>
              <div className="text-sm font-bold">{stats.songs}</div>
              <div className="text-xs text-gray-400">שירים</div>
            </div>
          </div>

          {course.instructorId && (
            <div className="mt-5 text-xs text-gray-500">
              מורה/יוצר הקורס:{" "}
              <span className="text-gray-300 font-bold">
                {course.instructorId.username ||
                  course.instructorId.email ||
                  "לא ידוע"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          {isRecommended ? (
            <button
              onClick={() => handleEnroll(course._id)}
              className="w-full py-3 rounded-xl font-bold transition-all shadow-md bg-yellow-400 text-slate-950 hover:bg-yellow-300"
            >
              הצטרפות לקורס 🚀
            </button>
          ) : (
            <button
              onClick={() => navigate(`/course/${course._id}`)}
              className="w-full py-3 rounded-xl font-bold transition-all shadow-md bg-indigo-600 text-white hover:bg-indigo-500"
            >
              המשך ללמוד
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הקורסים שלך... 📚</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📚 הקורסים שלי</h1>
          <p className="text-gray-400 mt-2">
            כאן מופיעים הקורסים שנרשמת אליהם, כולל הקורס האישי שנבנה עבורך.
          </p>
        </div>

        <button
          onClick={handleRecommendedTab}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          + חפש קורסים מומלצים
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-4 font-bold">
          {error}
        </div>
      )}

      {actionMessage && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 rounded-2xl p-4 font-bold">
          {actionMessage}
        </div>
      )}

      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("myCourses")}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === "myCourses"
              ? "border-yellow-400 text-yellow-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          הקורסים שלי ({myCourses.length})
        </button>

        <button
          onClick={handleRecommendedTab}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === "recommended"
              ? "border-indigo-400 text-indigo-400"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          מומלצים עבורי ({recommendedCourses.length})
        </button>
      </div>

      {activeTab === "myCourses" && (
        <>
          {myCourses.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">אין לך עדיין קורסים</h2>
              <p className="text-gray-400 mb-6">
                אפשר להתחיל מקורס מומלץ או להמתין שהמערכת תיצור לך מסלול אישי.
              </p>

              <button
                onClick={handleRecommendedTab}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 rounded-xl"
              >
                הצג קורסים מומלצים
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "recommended" && (
        <>
          {recommendedLoading ? (
            <div className="text-center py-16 text-gray-400 font-bold animate-pulse">
              טוען קורסים מומלצים...
            </div>
          ) : recommendedCourses.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold mb-2">
                אין כרגע קורסים מומלצים
              </h2>
              <p className="text-gray-400">
                אחרי שמורים יעלו קורסים ציבוריים, הם יופיעו כאן לפי ההתאמה שלך.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendedCourses.map((course) => (
                <CourseCard key={course._id} course={course} isRecommended />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}