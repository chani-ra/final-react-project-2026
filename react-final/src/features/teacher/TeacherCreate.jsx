import React from 'react';

export default function TeacherCreate() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">✨ יצירת תוכן חדש</h1>
          <p className="text-gray-400 mt-2">היעזר בבינה מלאכותית ליצירת מערכי שיעור ומטלות בהתאמה אישית.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* יצירה עם AI */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-indigo-500/30 space-y-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <h2 className="text-2xl font-bold text-indigo-400">🤖 מחולל משימות AI</h2>
          <div>
            <label className="block text-sm text-gray-400 mb-2">נושא המשימה</label>
            <input type="text" placeholder="לדוגמה: אוצר מילים לחורף, או עבר פשוט..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-indigo-400 outline-none text-white transition-all" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">רמת קושי</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none text-white appearance-none">
              <option value="easy" className="text-black">מתחילים (A1-A2)</option>
              <option value="medium" className="text-black">בינוני (B1-B2)</option>
              <option value="hard" className="text-black">מתקדמים (C1-C2)</option>
            </select>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
            <span>צור משימה אוטומטית</span>
            <span>✨</span>
          </button>
        </div>

        {/* יצירה ידנית */}
        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/10 space-y-4 opacity-60">
          <h2 className="text-2xl font-bold text-gray-300">📝 יצירה ידנית</h2>
          <p className="text-sm text-gray-400 leading-relaxed">כאן תוכלי להזין שאלות ותשובות בעצמך, ללא עזרת ה-AI. אופציה זו מאפשרת שליטה מלאה על התוכן.</p>
          <button className="w-full bg-white/10 hover:bg-white/20 font-bold py-4 rounded-xl transition-all text-gray-300 mt-4">
            פתח עורך שאלות ידני
          </button>
        </div>
      </div>
    </div>
  );
}