import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getTeacherDashboardData } from "../../services/teacherService";

export default function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalLessons: 0,
    totalViews: 0,
    totalStudents: 0,
    averageEnrollment: 0,
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const teacherId = user?._id || user?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!teacherId) {
        setError("לא נמצא מזהה מורה. נסי להתחבר מחדש.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getTeacherDashboardData(teacherId);

        setStats({
          totalLessons: data.stats?.totalLessons || 0,
          totalViews: data.stats?.totalViews || 0,
          totalStudents: data.stats?.totalStudents || 0,
          averageEnrollment: data.stats?.averageEnrollment || 0,
        });

        setLessons(data.lessons || []);
      } catch (err) {
        console.error("שגיאה בטעינת דשבורד מורה:", err);
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען נתוני מורה... ⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          שלום, המורה {user?.username || user?.name || "היקר"} 👋
        </h1>
        <p className="text-gray-400 mt-2">
          ברוך הבא ללוח הבקרה שלך. כאן מופיעים נתוני התוכן שהעלית למערכת.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-400 font-bold mb-1">
            שיעורים שהועלו
          </div>
          <div className="text-4xl font-black text-indigo-400">
            {stats.totalLessons}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-400 font-bold mb-1">
            סה״כ צפיות
          </div>
          <div className="text-4xl font-black text-cyan-400">
            {stats.totalViews}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-400 font-bold mb-1">
            תלמידים רשומים
          </div>
          <div className="text-4xl font-black text-emerald-400">
            {stats.totalStudents}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl">
          <div className="text-sm text-gray-400 font-bold mb-1">
            ממוצע הרשמה
          </div>
          <div className="text-4xl font-black text-yellow-400">
            {stats.averageEnrollment}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            שיעורים אחרונים שהעלית
          </h2>
        </div>

        {lessons.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-dashed border-white/10 rounded-2xl">
            עדיין לא העלית שיעורים. אפשר להתחיל דרך “העלאת תוכן”.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-3 pr-2">כותרת</th>
                  <th className="pb-3">נושא</th>
                  <th className="pb-3 text-center">צפיות</th>
                  <th className="pb-3 pl-2 text-left">תאריך יצירה</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-sm">
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-2 font-bold text-white">
                      {lesson.icon || "🎬"} {lesson.title}
                    </td>
                    <td className="py-4 text-gray-300">
                      {lesson.topic || "כללי"}
                    </td>
                    <td className="py-4 text-center text-cyan-400 font-bold">
                      {lesson.views || 0}
                    </td>
                    <td className="py-4 pl-2 text-left text-gray-400">
                      {lesson.createdAt
                        ? new Date(lesson.createdAt).toLocaleDateString("he-IL")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}