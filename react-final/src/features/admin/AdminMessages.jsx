import React from 'react';

export default function AdminMessages() {
  return (
    <div className="space-y-6 max-w-4xl" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">💬 הודעות ופידבקים</h1>
        <p className="text-gray-400 mt-1">שליחת הודעות פוש גלובליות לכל משתמשי האתר או משוב אישי.</p>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">נמענים</label>
          <select className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none">
            <option>לכל המשתמשים (הודעה גלובלית)</option>
            <option>למורים בלבד</option>
            <option>לתלמידים בלבד</option>
            <option>הזנת שם משתמש ספציפי...</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">תוכן ההודעה</label>
          <textarea rows="4" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-500" placeholder="הקלד את הודעת המערכת או הפידבק כאן..."></textarea>
        </div>

        <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform w-full">
          שלח הודעה 🚀
        </button>
      </div>
    </div>
  );
}