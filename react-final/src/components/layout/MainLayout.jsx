import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // יצירתיות: הוספנו פונקציה שמחזירה תפריט עשיר יותר
  const getNavLinks = () => {
    if (!user) return [];
    
    const baseLinks = {
      student: [
        { name: 'דשבורד', path: '/dashboard', icon: '🏠' },
        { name: 'שיעורים', path: '/lessons', icon: '📚' },
        { name: 'צ\'אט בולט', path: '/chat', icon: '🤖' }
      ],
      teacher: [
        { name: 'ניהול תלמידים', path: '/teacher/students', icon: '👥' },
        { name: 'ספריית תכנים', path: '/teacher/library', icon: '📂' },
        { name: 'יצירת שיעור', path: '/teacher/create', icon: '✨' }
      ],
      admin: [
        { name: 'לוח בקרה', path: '/admin/dashboard', icon: '📊' },
        { name: 'ניהול משתמשים', path: '/admin/users', icon: '⚙️' }
      ]
    };
    return baseLinks[user.role] || [];
  };

  const links = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar מעוצב עם צל עדין */}
      <nav className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center px-8 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg animate-pulse" />
          <span className="font-bold text-2xl tracking-tight text-white">English<span className="text-yellow-400">Wise</span></span>
        </div>
        
        <div className="flex gap-2">
          {links.map(link => (
            <button 
              key={link.path} 
              onClick={() => navigate(link.path)} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 text-sm font-medium"
            >
              <span>{link.icon}</span> {link.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <button className="text-xl">🔔</button>
           <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full border-2 border-slate-800" />
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}