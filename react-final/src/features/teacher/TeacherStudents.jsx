import React from 'react';

export default function TeacherStudents() {
  const students = [
    { id: 1, name: 'דניאל רדקליף', grade: 'ט\'1', average: 92, status: 'מצוין' },
    { id: 2, name: 'נועה לוי', grade: 'ט\'2', average: 65, status: 'זקוק לעזרה' },
    { id: 3, name: 'שירה כהן', grade: 'ט\'1', average: 88, status: 'טוב מאוד' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold">👥 ניהול תלמידים</h1>
        <p className="text-gray-400 mt-2">מעקב אחר התקדמות התלמידים בכיתות שלך.</p>
      </div>
      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-black/20 border-b border-white/10 text-gray-400 text-sm">
            <tr>
              <th className="p-4">שם התלמיד</th>
              <th className="p-4">כיתה</th>
              <th className="p-4">ממוצע ציונים</th>
              <th className="p-4">סטטוס</th>
              <th className="p-4">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-white/5 transition-all">
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4 text-gray-300">{s.grade}</td>
                <td className="p-4 font-bold text-emerald-400">{s.average}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'מצוין' ? 'bg-emerald-500/20 text-emerald-400' : s.status === 'זקוק לעזרה' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors">צפה בפרופיל</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}