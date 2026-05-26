import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Tasks() {
  const { user } = useSelector((state) => state.auth);
  
  // סינון לפי טאבים: 'pending' (לביצוע), 'review' (בבדיקה), 'completed' (הושלמו)
  const [activeTab, setActiveTab] = useState('pending');

  // נתוני דוגמה עשירים למשימות - בהמשך יגיעו דינמית
  const [tasks, setTasks] = useState([
    {
      id: 't1',
      title: 'תרגול אוצר מילים: אנגלית עסקית',
      description: 'תרגול של 20 מילים חדשות בנושא פגישות ומשא ומתן הכולל התאמת משפטים.',
      difficulty: 'Medium',
      estimatedTime: '15 דקות',
      status: 'pending',
      dueDate: 'מחר, 18:00',
      rewardXP: 120
    },
    {
      id: 't2',
      title: 'כתיבת חיבור: חופשת החלומות שלי',
      description: 'כתיבת פסקה של 80-100 מילים בזמן Past Simple תוך שימוש במילות קישור.',
      difficulty: 'Hard',
      estimatedTime: '30 דקות',
      status: 'pending',
      dueDate: 'בעוד 3 ימים',
      rewardXP: 250
    },
    {
      id: 't3',
      title: 'הבנת הנשמע: שיחה בבית קפה',
      description: 'האזנה לקובץ שמע קצר ומענה על 5 שאלות אמריקאיות.',
      difficulty: 'Easy',
      estimatedTime: '10 דקות',
      status: 'review',
      submittedAt: 'היום, 10:30',
      rewardXP: 100
    },
    {
      id: 't4',
      title: 'דקדוק: Present Simple vs Present Continuous',
      description: 'מבדק קצר לבדיקת השליטה בהבדלים בין הזמנים בהווה.',
      difficulty: 'Medium',
      estimatedTime: '20 דקות',
      status: 'completed',
      grade: 95,
      feedback: 'עבודה מצוינת! שים לב רק לשימוש בפעלים סטטיים (Stative Verbs).',
      rewardXP: 150
    }
  ]);

  // פונקציה שמחזירה את צבע מדד הקושי
  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  // סינון המשימות לפי הטאב הנבחר
  const filteredTasks = tasks.filter(task => task.status === activeTab);

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* כותרת הדף */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📝 המשימות שלי</h1>
          <p className="text-gray-400 text-sm mt-1">כאן מרכזים את כל המטלות, התרגולים והמבחנים המותאמים אישית עבורך.</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 rounded-2xl font-bold text-sm">
          <span>🏆 נקודות ניסיון זמינות: {tasks.filter(t => t.status === 'pending').reduce((acc, t) => acc + t.rewardXP, 0)} XP</span>
        </div>
      </div>

      {/* בורר הטאבים (ניווט פנימי בדף) */}
      <div className="flex border-b border-white/10 gap-2">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-4 font-medium text-sm transition-all relative ${activeTab === 'pending' ? 'text-yellow-400 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          לביצוע ({tasks.filter(t => t.status === 'pending').length})
          {activeTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('review')}
          className={`pb-3 px-4 font-medium text-sm transition-all relative ${activeTab === 'review' ? 'text-yellow-400 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          בבדיקה ({tasks.filter(t => t.status === 'review').length})
          {activeTab === 'review' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 font-medium text-sm transition-all relative ${activeTab === 'completed' ? 'text-yellow-400 font-bold' : 'text-gray-400 hover:text-white'}`}
        >
          הושלמו ({tasks.filter(t => t.status === 'completed').length})
          {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />}
        </button>
      </div>

      {/* רשימת המשימות המסוננת */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-gray-400 font-medium">אין משימות בקטגוריה זו כרגע.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all"
            >
              {/* פרטי המשימה */}
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(task.difficulty)}`}>
                    {task.difficulty === 'Easy' ? 'קל' : task.difficulty === 'Medium' ? 'בינוני' : 'קשה'}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">⏱️ {task.estimatedTime}</span>
                  <span className="text-xs text-yellow-500 font-bold">✨ +{task.rewardXP} XP</span>
                </div>
                <h3 className="text-xl font-bold">{task.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
                
                {/* הצגת פידבק למשימות שהושלמו */}
                {task.status === 'completed' && task.feedback && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs mt-2">
                    <strong>💡 פידבק מהמורה:</strong> {task.feedback}
                  </div>
                )}
              </div>

              {/* כפתורים וסטטוס צדדי */}
              <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t border-white/5 md:border-none pt-4 md:pt-0">
                {task.status === 'pending' && (
                  <>
                    <span className="text-xs text-red-400 font-medium">⏰ הגשה עד: {task.dueDate}</span>
                    <button className="bg-yellow-500 text-slate-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md w-full md:w-auto">
                      מתחילים לתרגל
                    </button>
                  </>
                )}

                {task.status === 'review' && (
                  <>
                    <span className="text-xs text-gray-400">הוגש ב: {task.submittedAt}</span>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold">
                      ⏳ נשלח לבדיקה
                    </span>
                  </>
                )}

                {task.status === 'completed' && (
                  <div className="text-center md:text-left">
                    <span className="text-xs text-gray-400 block mb-1">ציון סופי</span>
                    <span className="text-3xl font-black text-emerald-400">{task.grade}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}