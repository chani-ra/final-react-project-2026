import React from 'react';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  // שולפים את המידע שהמשתמש הזין בהרשמה מה-Store
  // בגלל ששמרנו את זה ב-authSlice, זה נמצא בתוך state.auth
  const { userData } = useSelector((state) => state.auth);

  // למקרה שאין עדיין נתונים
  if (!userData) return <div className="text-white">טוען נתונים...</div>;

  const { name, interests, level } = userData;

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-12 text-white" dir="rtl">
      {/* כותרת מותאמת אישית */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">היי {name}! 👋</h1>
          <p className="text-gray-400 mt-2">איזה כיף לראות אותך. מוכנים ללמוד אנגלית בכיף?</p>
        </div>
        <div className="bg-white/10 p-4 rounded-full">רמה: {level}</div>
      </header>

      {/* אזור תוכן מרכזי */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* אזור הלימוד האישי (AI Driven) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">המסלול האישי שלך</h2>
            <div className="h-48 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/10">
              <p>ה-AI בונה עכשיו תרגול מיוחד בנושא: <strong>{interests.includes('dance') ? 'ריקוד ומוזיקה' : 'הנושאים שאת/ה אוהב/ת'}</strong></p>
            </div>
          </section>
          
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">המשימות שלי</h2>
            {/* כאן יופיעו הבוחן או המשימה שהמורה הזין */}
            <p className="text-gray-400">אין משימות פתוחות כרגע, בוא נתחיל לתרגל!</p>
          </section>
        </div>

        {/* צד: תכני השבוע */}
        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-900 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">✨ להיטי השבוע</h2>
            <ul className="space-y-3 font-semibold">
              <li className="bg-black/10 p-2 rounded-lg">🎶 שיר השבוע: "Dancing Queen"</li>
              <li className="bg-black/10 p-2 rounded-lg">🎬 תוכנית השבוע: "English Dance Stars"</li>
            </ul>
          </div>
          
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
            <h3 className="font-bold mb-2">צריך עזרה?</h3>
            <p className="text-sm text-gray-400 mb-4">שלח הודעה למורה או שאל את בולט ה-AI</p>
            <button className="bg-indigo-600 w-full py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">צ'אט עם בולט 🤖</button>
          </div>
        </aside>

      </div>
    </div>
  );
}