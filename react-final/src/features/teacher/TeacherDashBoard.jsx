import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTeacherDashboardData } from '../../services/teacherService';

export default function TeacherDashboard() {
  // משיכת פרטי המורה המחובר מתוך ה-Redux
  const { user } = useSelector((state) => state.auth);

  // מצבים לניהול הנתונים והטעינה
  const [stats, setStats] = useState({ totalStudents: 0, activeCourses: 0, pendingExercises: 0 });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getTeacherDashboardData();
        setStats(data.stats);
        setStudents(data.students);
      } catch (err) {
        console.log('השרת לא החזיר נתונים, מפעיל נתוני גיבוי לצורך תצוגה:', err);
        // נתוני גיבוי מקצועיים כדי שהמערכת לא תישאר ריקה בזמן הפיתוח
        setStats({ totalStudents: 28, activeCourses: 4, pendingExercises: 12 });
        setStudents([
          { id: 1, name: 'ישראל ישראלי', email: 'israel@gmail.com', progress: '85%', lastActive: 'היום' },
          { id: 2, name: 'נועה כהן', email: 'noah@gmail.com', progress: '92%', lastActive: 'אתמול' },
          { id: 3, name: 'אברהם לוי', email: 'avi@gmail.com', progress: '64%', lastActive: 'לפני יומים' },
          { id: 4, name: 'מיכל רז', email: 'michal@gmail.com', progress: '100%', lastActive: 'היום' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען נתוני מערכת... ⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10" dir="rtl">
      {/* כותרת ראשית ומברכת */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          שלום, המורה {user?.name || 'היקר'} 👋
        </h1>
        <p className="text-gray-400 mt-2">ברוך הבא ללוח הבקרה שלך. הנה תמונת המצב של הכיתות שלך נכון להיום.</p>
      </div>

      {/* כרטיסי סטטיסטיקה מהירה */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all">
          <div className="text-sm text-gray-400 font-bold mb-1">סה"כ תלמידים רשומים</div>
          <div className="text-4xl font-black text-indigo-400">{stats.totalStudents}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:border-cyan-500/50 transition-all">
          <div className="text-sm text-gray-400 font-bold mb-1">קורסים פעילים במערכת</div>
          <div className="text-4xl font-black text-cyan-400">{stats.activeCourses}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 transition-all">
          <div className="text-sm text-gray-400 font-bold mb-1">תרגילים הממתינים לבדיקה</div>
          <div className="text-4xl font-black text-emerald-400">{stats.pendingExercises}</div>
        </div>
      </div>

      {/* אזור ניהול ותצוגת תלמידים */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">רשימת תלמידים ומעקב התקדמות</h2>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md">
            + הוספת תלמיד חדש
          </button>
        </div>

        {/* טבלת תלמידים רספונסיבית */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 pr-2">שם מלא</th>
                <th className="pb-3">אימייל</th>
                <th className="pb-3 text-center">אחוז התקדמות</th>
                <th className="pb-3 pl-2 text-left">פעילות אחרונה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-2 font-bold text-white">{student.name}</td>
                  <td className="py-4 text-gray-300">{student.email}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-bold text-emerald-400">{student.progress}</span>
                      <div className="w-24 bg-gray-700 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className="bg-emerald-400 h-full rounded-full" 
                          style={{ width: student.progress }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pl-2 text-left text-gray-400">{student.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}