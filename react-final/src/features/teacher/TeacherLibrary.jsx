import React from 'react';

export default function TeacherLibrary() {
  const myContent = [
    { id: 1, type: 'video', title: 'מבוא לדקדוק באנגלית', date: 'היום', views: 45 },
    { id: 2, type: 'audio', title: 'שיר אותיות ה-ABC', date: 'אתמול', views: 112 },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold">📂 הספרייה שלי</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myContent.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${item.type === 'video' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {item.type === 'video' ? '🎬' : '🎵'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400">הועלה: {item.date} • {item.views} צפיות</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}