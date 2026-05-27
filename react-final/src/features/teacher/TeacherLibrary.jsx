import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTeacherLessons, getTeacherSongs } from '../../services/teacherService';
export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  
  // ניהול הטאב הנוכחי: 'lessons' או 'songs'
  const [activeTab, setActiveTab] = useState('lessons');
  
  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
useEffect(() => {
    const loadLibraryData = async () => {
      if (!user?._id && !user?.id) return;
      const teacherId = user._id || user.id;

      setLoading(true);
      setError('');

      // 1. ניסיון טעינת שיעורים
      try {
        const lessonsData = await getTeacherLessons(teacherId);
        setLessons(lessonsData);
      } catch (err) {
        console.error('שגיאה בטעינת שיעורים:', err);
        setError('היה קושי בטעינת השיעורים שלך מהשרת.');
      }

      // 2. ניסיון טעינת שירים (בנפרד - כדי ש-404 כאן לא יפיל את השיעורים)
      try {
        const songsData = await getTeacherSongs(teacherId);
        setSongs(songsData);
      } catch (err) {
        console.error('שגיאה בטעינת שירים (כתובת ה-API כנראה דורשת התאמה):', err);
        // אנחנו לא נועלים את המסך, פשוט משאירים מערך שירים ריק בינתיים
      }

      setLoading(false);
    };

    loadLibraryData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הספרייה שלך... 📂</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10" dir="rtl">
      {/* כותרת הדף */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            הספרייה שלי 📂
          </h1>
          <p className="text-gray-400 mt-2">כאן נמצאים כל התכנים, השיעורים והשירים שהעלית למערכת.</p>
        </div>
      </div>

      {/* ניווט פנימי (Tabs) בין שיעורים לשירים */}
      <div className="flex border-b border-white/10 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`pb-4 text-lg font-bold transition-all relative ${
            activeTab === 'lessons' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          שיעורים שהועלו ({lessons.length})
          {activeTab === 'lessons' && <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-indigo-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab('songs')}
          className={`pb-4 text-lg font-bold transition-all relative ${
            activeTab === 'songs' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          שירים במערכת ({songs.length})
          {activeTab === 'songs' && <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-cyan-400 rounded-full" />}
        </button>
      </div>

      {error && <div className="text-red-400 mb-4 text-sm font-semibold bg-red-500/10 p-3 rounded-xl">{error}</div>}

      {/* תצוגת שיעורים */}
      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.length === 0 ? (
            <p className="text-gray-500 col-span-full py-10 text-center">עדיין לא העלית אף שיעור במערכת.</p>
          ) : (
            lessons.map((lesson) => (
              <div key={lesson._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">{lesson.icon || '🎬'}</span>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md">
                      {lesson.topic || 'כללי'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{lesson.description || 'אין תיאור לשיעור זה.'}</p>
                </div>
                
                <div className="border-t border-white/5 pt-4 mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span>נוצר ב: {new Date(lesson.createdAt).toLocaleDateString('he-IL')}</span>
                  <div className="flex gap-2">
                    <button className="text-indigo-400 hover:underline font-bold">צפייה</button>
                    <span className="text-white/20">|</span>
                    <button className="text-red-400 hover:underline font-bold">מחיקה</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* תצוגת שירים */}
      {activeTab === 'songs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.length === 0 ? (
            <p className="text-gray-500 col-span-full py-10 text-center">עדיין לא העלית אף שיר במערכת.</p>
          ) : (
            songs.map((song) => (
              <div key={song._id} className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-2xl">🎵</span>
                    <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-md">
                      {song.genre || 'שיר'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{song.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">אמן/יוצר: {song.artist || 'לא מצוין'}</p>
                </div>
                
                <div className="border-t border-white/5 pt-4 mt-auto flex justify-between items-center text-xs text-gray-500">
                  <span>נוצר ב: {new Date(song.createdAt).toLocaleDateString('he-IL')}</span>
                  <div className="flex gap-2">
                    <button className="text-cyan-400 hover:underline font-bold">השמעה</button>
                    <span className="text-white/20">|</span>
                    <button className="text-red-400 hover:underline font-bold">מחיקה</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}