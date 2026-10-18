import useTeacherStudents from "./useTeacherStudents.js";

export default function TeacherStudents() {
  const { students, loading, error, reload } = useTeacherStudents();

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">👥 חברי הקורסים שלי</h1>
        <p className="text-gray-400 mt-1">מעקב התקדמות, גילאים ופעילות אחרונה של התלמידים שלך.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
        {loading ? (
          <p className="p-6 text-gray-300" role="status">טוען תלמידים...</p>
        ) : error ? (
          <div className="p-6 text-gray-200" role="alert">
            <p>לא הצלחנו לטעון את תלמידי הקורסים.</p>
            <button type="button" onClick={reload} className="mt-3 rounded-lg bg-white/10 px-4 py-2 font-bold hover:bg-white/20">נסה שוב</button>
          </div>
        ) : students.length === 0 ? (
          <p className="p-6 text-gray-300">עדיין אין תלמידים רשומים לקורסים שלך.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-white/5 text-gray-400 text-sm font-semibold">
                <tr>
                  <th className="p-4">שם התלמיד/ה</th>
                  <th className="p-4">גיל</th>
                  <th className="p-4">קורס רשום</th>
                  <th className="p-4">התקדמות בקורס</th>
                  <th className="p-4">פעילות אחרונה</th>
                  <th className="p-4 text-left">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold">{student.name}</td>
                    <td className="p-4 text-gray-300 font-medium">{student.age} <span className="text-xs text-gray-500">שנים</span></td>
                    <td className="p-4 text-gray-400">{student.course}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3 w-full max-w-[150px]">
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-xs font-mono font-bold">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{student.lastActive}</td>
                    <td className="p-4 text-left">
                      <button type="button" disabled title="שליחת הודעה אישית עדיין אינה זמינה" className="bg-white/5 text-gray-400 text-xs px-3 py-1.5 rounded-lg font-bold cursor-not-allowed">
                        הודעה — לא זמין
                      </button>
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
