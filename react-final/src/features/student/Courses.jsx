import React from 'react';
import { useSelector } from 'react-redux';

export default function Courses() {
  const { user } = useSelector((state) => state.auth);

  // נתוני דוגמה של הקורסים של התלמיד
  const myCourses = [
    { 
      id: 1, 
      title: 'אנגלית עסקית למתחילים', 
      level: 'B1', 
      progress: 65, 
      totalLessons: 12,
      completedLessons: 8,
      nextLesson: 'כתיבת אימייל רשמי', 
      color: 'from-blue-500 to-cyan-400' 
    },
    { 
      id: 2, 
      title: 'דקדוק מתקדם - זמנים', 
      level: 'B2', 
      progress: 30, 
      totalLessons: 10,
      completedLessons: 3,
      nextLesson: 'Present Perfect', 
      color: 'from-indigo-500 to-purple-500' 
    },
    { 
      id: 3, 
      title: 'אוצר מילים: טיולים בחו"ל', 
      level: 'A2', 
      progress: 100, 
      totalLessons: 5,
      completedLessons: 5,
      nextLesson: 'הקורס הושלם בהצלחה!', 
      color: 'from-emerald-500 to-teal-400' 
    }
  ];

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* כותרת הדף */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📚 הקורסים שלי</h1>
          <p className="text-gray-400 mt-2">המשך מאותה נקודה שבה עצרת והשלם את מסלולי הלמידה שלך.</p>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all shadow-lg">
          + חפש קורסים חדשים
        </button>
      </div>

      {/* רשימת הקורסים */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myCourses.map(course => (
          <div key={course.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col justify-between h-full">
            
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-white/10 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  רמה: {course.level}
                </span>
                <span className="text-sm font-medium text-gray-400">
                  {course.completedLessons} / {course.totalLessons} שיעורים
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
              
              <div className="bg-black/20 p-4 rounded-xl mt-4 border border-white/5">
                <p className="text-sm text-gray-400 mb-1">השיעור הבא שלך:</p>
                <p className="font-semibold">{course.nextLesson}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span>התקדמות</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${course.color} rounded-full`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              
              <button 
                className={`w-full mt-6 py-3 rounded-xl font-bold transition-all shadow-md
                  ${course.progress === 100 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {course.progress === 100 ? 'חזור על החומר' : 'המשך ללמוד'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}