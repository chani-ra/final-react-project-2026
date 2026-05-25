import React from 'react';
import { useSelector } from 'react-redux';

export default function StudentDashboard() {
  const authState = useSelector((state) => state.auth);
  const userData = authState.user;

  if (!userData || !userData.name) {
    return <div className="text-white p-10">טוען נתונים...</div>;
  }

  const { name, interests = [], level } = userData;

  // מנוע משימות "חכם" (AI Simulation)
  const getPersonalizedTasks = (level, interests) => {
    let tasks = [];
    if (interests.includes('dance')) {
      tasks.push({ title: "🎶 Dancing Queen", desc: "הקשיבי לשיר ורשמי 3 משפטים על התחושה שלך." });
    }
    if (interests.includes('games')) {
      tasks.push({ title: "🎮 Gaming Vocab", desc: "למדי 5 מונחים מעולם הגיימינג באנגלית." });
    }
    // הוספת משימה כללית לפי רמה
    tasks.push({ 
      title: level === 'advanced' ? "כתיבה יצירתית" : "אוצר מילים בסיסי", 
      desc: level === 'advanced' ? "כתבי פסקה על החלומות שלך." : "תרגלי 5 מילים חדשות ליום-יום." 
    });
    return tasks;
  };

  const myTasks = getPersonalizedTasks(level, interests);

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-12 text-white" dir="rtl">
      {/* Header */}
      <header className="mb-10 flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-4xl font-bold">היי {name}! 👋</h1>
          <p className="text-gray-400 mt-2">איזה כיף לראות אותך. מוכנים ללמוד אנגלית בכיף?</p>
        </div>
        <div className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg">רמה: {level}</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">המסלול האישי שלך ✨</h2>
            <div className="h-48 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/10">
              <p>ה-AI בונה עכשיו תרגול מיוחד בנושא: <strong>{interests.join(', ')}</strong></p>
            </div>
          </section>
          
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">המשימות שלי</h2>
            <div className="grid gap-4">
              {myTasks.map((task, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-xl flex items-start gap-4">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="font-bold text-yellow-400">{task.title}</h4>
                    <p className="text-sm text-gray-300">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-900 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">✨ להיטי השבוע</h2>
            <ul className="space-y-3 font-semibold">
              <li className="bg-black/10 p-2 rounded-lg cursor-pointer hover:bg-black/20">🎶 שיר: "Dancing Queen"</li>
              <li className="bg-black/10 p-2 rounded-lg cursor-pointer hover:bg-black/20">🎬 סדרה: "English Dance Stars"</li>
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