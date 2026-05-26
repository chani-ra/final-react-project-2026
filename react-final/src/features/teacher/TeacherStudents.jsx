import React, { useState } from 'react';

export default function TeacherStudents() {
  const [students, setStudents] = useState([
    { id: 1, name: 'נועם לוי', age: 12, email: 'noam@gmail.com', course: 'אנגלית למתחילים', progress: 85, lastActive: 'היום' },
    { id: 2, name: 'איתי כהן', age: 15, email: 'itay@gmail.com', course: 'דקדוק מתקדם', progress: 40, lastActive: 'אתמול' },
    { id: 3, name: 'שירה אברהם', age: 11, email: 'shira@gmail.com', course: 'אנגלית למתחילים', progress: 100, lastActive: 'לפני 3 ימים' },
    { id: 4, name: 'מיכל יוסף', age: 16, email: 'michal@gmail.com', course: 'אנגלית עסקית', progress: 12, lastActive: 'לפני שבוע' },
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">👥 חברי הקורסים שלי</h1>
        <p className="text-gray-400 mt-1">מעקב התקדמות, גילאים ופעילות אחרונה של התלמידים שלך.</p>
      </div>

      {/* טבלת תלמידים */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
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
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono font-bold">{student.progress}%</span>
                  </div>
                </td>
                <td className="p-4 text-gray-400">{student.lastActive}</td>
                <td className="p-4 text-left">
                  <button className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg font-bold transition-all">
                    שלח הודעה 💬
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}