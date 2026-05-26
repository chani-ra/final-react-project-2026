import React, { useState } from 'react';

export default function AdminContent() {
  const [activeType, setActiveType] = useState('lessons'); // 'lessons' או 'songs'

  const [contentList, setContentList] = useState([
    { id: 1, type: 'lesson', title: 'חוקי ה-Past Simple', topic: 'Grammar', icon: '🧠', teacher: 'ישראל המורה', date: '22/05/2026' },
    { id: 2, type: 'song', title: 'Count on Me - Bruno Mars', topic: 'Vocabulary', icon: '🎵', teacher: 'רוני כהן', isWeekly: true },
    { id: 3, type: 'lesson', title: 'שיחת היכרות באנגלית', topic: 'Speaking', icon: '💬', teacher: 'ישראל המורה', date: '20/05/2026' },
  ]);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">🗂️ בקרת תוכן גלובלית</h1>
        <p className="text-gray-400 mt-1">ניהול מלא, פיקוח ובחירת שיר השבוע מתוך תכני המורים.</p>
      </div>

      {/* ניווט פנימי - סדר בעיניים */}
      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
        <button 
          onClick={() => setActiveType('lessons')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeType === 'lessons' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          🎬 שיעורים מוקלטים ({contentList.filter(c => c.type === 'lesson').length})
        </button>
        <button 
          onClick={() => setActiveType('songs')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeType === 'songs' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          🎵 שירים ומוזיקה ({contentList.filter(c => c.type === 'song').length})
        </button>
      </div>

      {/* הצגת התוכן בהתאם למה שנבחר */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
        <table className="w-full text-right">
          <thead className="bg-white/5 text-gray-400 text-sm">
            <tr>
              <th className="p-4 w-16 text-center">אייקון</th>
              <th className="p-4">כותרת</th>
              <th className="p-4">נושא (Topic)</th>
              <th className="p-4">מורה אחראי</th>
              <th className="p-4 text-left">פעולות מנהל</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white">
            {contentList.filter(c => (activeType === 'lessons' ? c.type === 'lesson' : c.type === 'song')).map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02]">
                <td className="p-4 text-center text-xl bg-white/5">{item.icon}</td>
                <td className="p-4 font-bold">{item.title}</td>
                <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded-lg text-xs font-mono text-yellow-400">{item.topic}</span></td>
                <td className="p-4 text-gray-400">{item.teacher}</td>
                <td className="p-4 text-left">
                  {item.type === 'song' ? (
                    <button className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${item.isWeekly ? 'bg-yellow-500 text-black shadow-lg font-black' : 'bg-white/10 hover:bg-white/20'}`}>
                      {item.isWeekly ? '🌟 שיר השבוע הנוכחי' : 'קבע כשיר השבוע'}
                    </button>
                  ) : (
                    <button className="px-4 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-bold transition-all">
                      הסר שיעור
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}