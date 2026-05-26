import React from 'react';

export default function TeacherDashboard() {
  // נתוני דמו לסטטיסטיקות של המורה
  const stats = [
    { id: 1, label: 'סך הכל תלמידים', value: '48', icon: '👥', color: 'text-blue-400 bg-blue-500/10' },
    { id: 2, label: 'משימות הממתינות לבדיקה', value: '14', icon: '📝', color: 'text-yellow-400 bg-yellow-500/10' },
    { id: 3, label: 'ממוצע ציונים שבועי', value: '86.5', icon: '📈', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 4, label: 'אחוז פעילות השבוע', value: '92%', icon: '⚡', color: 'text-purple-400 bg-purple-500/10' },
  ];

  // רשימת התלמידים שצריכים עזרה או תשומת לב מיוחדת
  const alerts = [
    { id: 1, name: 'נועה לוי', issue: 'לא הגישה את 2 המשימות האחרונות', severity: 'high' },
    { id: 2, name: 'איתי כהן', issue: 'ציון נמוך (62) במבדק Present Simple', severity: 'medium' },
    { id: 3, name: 'מיכל אברהם', issue: 'לא התחברה למערכת מעל שבוע', severity: 'high' }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* כותרת עליונה */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📊 שלום, המורה!</h1>
        <p className="text-gray-400 mt-1">ברוך הבא ללוח הבקרה שלך. הנה סקירה של מה שקורה בכיתות שלך היום.</p>
      </div>

      {/* קוביות סטטיסטיקה מהירה */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(item => (
          <div key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{item.label}</p>
              <p className="text-3xl font-black mt-2 tracking-tight">{item.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* תיבת התראות וצווארי בקבוק (תלמידים שצריכים עזרה) */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
            ⚠️ תלמידים בטיפול דחוף
          </h3>
          <p className="text-xs text-gray-400">תלמידים שחווים קושי או שלא הגישו מטלות בזמן.</p>
          
          <div className="space-y-3 mt-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-2xl border flex flex-col gap-1 ${
                alert.severity === 'high' 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : 'bg-yellow-500/5 border-yellow-500/20'
              }`}>
                <span className="font-bold text-sm text-white">{alert.name}</span>
                <span className="text-xs text-gray-400">{alert.issue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* גרף/סקירה של משימות שמחכות לבדיקה */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              📥 משימות אחרונות שהוגשו
            </h3>
            <p className="text-xs text-gray-400 mt-1">מטלות שתלמידים סיימו ומחכות לציון או פידבק סופי שלך.</p>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-sm">חיבור: חופשת החלומות שלי</p>
                  <p className="text-xs text-gray-400">הוגש על ידי: דניאל רדקליף | כיתה ט'1</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-lg transition-all">
                  בדוק כעת
                </button>
              </div>

              <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="font-semibold text-sm">תרגול אוצר מילים מורחב</p>
                  <p className="text-xs text-gray-400">הוגש על ידי: שירה לוי | כיתה ט'3</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-lg transition-all">
                  בדוק כעת
                </button>
              </div>
            </div>
          </div>

          <button className="w-full text-center text-sm font-bold text-yellow-400 hover:text-yellow-300 mt-6 md:mt-0 pt-4 border-t border-white/5">
            צפה בכל 14 המשימות הממתינות לבדיקה ←
          </button>
        </div>

      </div>

    </div>
  );
}