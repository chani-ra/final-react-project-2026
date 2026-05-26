import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/slices/authSlice'; // ודאי שהנתיב תואם לקובץ שלך

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // פונקציה שמתחברת לפי התפקיד שנבחר
  const handleQuickLogin = (roleName, roleType) => {
    // יוצרים משתמש דמו לפי התפקיד
    const fakeUser = {
      id: Date.now(),
      name: roleName,
      role: roleType,
      progress: roleType === 'student' ? 45 : 0
    };

    // שולחים לרידקס
    dispatch(registerUser(fakeUser));
    
    // מנווטים לדף הבית של אותו תפקיד
    if (roleType === 'admin') navigate('/admin/dashboard');
    else if (roleType === 'teacher') navigate('/teacher/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4" dir="rtl">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        
        <div className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-emerald-400" dir="ltr">
          EnglishWise
        </div>
        <p className="text-gray-400 mb-8 font-medium">ברוכים הבאים למערכת! בחר/י איך להתחבר:</p>

        <div className="space-y-4">
          <button 
            onClick={() => handleQuickLogin('נועה (תלמידה)', 'student')}
            className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🎒</span> כניסה כתלמיד/ה
          </button>

          <button 
            onClick={() => handleQuickLogin('ישראל (מורה)', 'teacher')}
            className="w-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🧑‍🏫</span> כניסה כמורה
          </button>

          <button 
            onClick={() => handleQuickLogin('מנהלת המערכת', 'admin')}
            className="w-full bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">⚙️</span> כניסה כאדמין
          </button>
        </div>

      </div>
    </div>
  );
}