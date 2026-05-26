import React from 'react';

export default function TeacherGrading() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold">✅ בדיקת משימות</h1>
        <p className="text-gray-400 mt-2">מטלות שהוגשו על ידי תלמידים וממתינות לציון ומשוב מצידך.</p>
      </div>
      
      <div className="space-y-4">
        {/* כרטיסיה של משימה שממתינה לבדיקה */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-yellow-500/10 transition-all">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">ממתין לבדיקה</span>
              <span className="text-gray-400 text-xs">הוגש היום, 14:30</span>
            </div>
            <h3 className="text-xl font-bold text-white">חיבור: חופשת החלומות שלי</h3>
            <p className="text-sm text-gray-400 mt-1">תלמיד: <strong className="text-white">דניאל רדקליף</strong> | כיתה: ט'1</p>
          </div>
          <button className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg">
            בדוק ומתן משוב
          </button>
        </div>
      </div>
    </div>
  );
}