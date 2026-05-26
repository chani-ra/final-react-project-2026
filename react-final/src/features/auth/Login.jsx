import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';

import { loginUser as loginAction } from '../../redux/slices/authSlice'; // ודאי שהנתיב נכון
import { loginUser } from '../../services/authService';

export default function Login() {
  // הגדרת ה-Hooks כאן למעלה
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      
      // כאן משתמשים בדיספאץ' שהוגדר למעלה
      dispatch(loginAction(data.user));
      
      // שמירת הנתונים המלאים
      localStorage.setItem('token', data.token);
      
      // ניגשים ישירות לשדה המדויק שראינו בקונסול: data.user.role
      const role = data.user?.role;
      localStorage.setItem('userRole', role);
      
      // 👇 התוספת החדשה: שמירת כל אובייקט המשתמש כטקסט בזיכרון
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log("התחברות הצליחה, תפקיד המשתמש הוא:", role);

      // ניווט לפי התפקיד
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard'); // תלמיד
      }
      
    } catch (err) {
      setError(typeof err === 'string' ? err : 'שגיאה בהתחברות');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950" dir="rtl">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">התחברות למערכת 🚀</h2>
        
        {/* הודעת שגיאה באדום אם ההתחברות נכשלה */}
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center font-bold">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">אימייל</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">סיסמה</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-lg mt-4 ${
              isLoading ? 'bg-indigo-500/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isLoading ? 'מתחבר לשרת...' : 'היכנס למערכת'}
          </button>
        </form>
      </div>
    </div>
  );
}