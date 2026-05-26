import React from 'react';

export default function TeacherLibrary() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold">📂 ספריית התכנים</h1>
        <p className="text-gray-400 mt-2">כל חומרי הלימוד, המבחנים והמצגות ששמרת בעבר במערכת.</p>
      </div>
      <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
        <span className="text-5xl block mb-4">📚</span>
        <h3 className="text-xl font-bold text-white mb-2">הספרייה שלך ריקה כרגע</h3>
        <p className="text-gray-400 font-medium">כאשר תיצרי משימות חדשות בעמוד "יצירת תוכן", הן ישמרו כאן אוטומטית.</p>
      </div>
    </div>
  );
}