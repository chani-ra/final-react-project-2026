import React, { useState } from 'react';

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('students'); // 'students' או 'teachers'
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState([
    { id: 1, name: 'אלון לוי', email: 'alon@gmail.com', role: 'student', status: 'פעיל', date: '12/05/2026' },
    { id: 2, name: 'רוני כהן', email: 'roni.teacher@wise.com', role: 'teacher', status: 'פעיל', date: '01/02/2026' },
    { id: 3, name: 'מאיה אברהם', email: 'maya@gmail.com', role: 'student', status: 'מוקפא', date: '20/04/2026' },
    { id: 4, name: 'ישראל ישראלי', email: 'israel.t@wise.com', role: 'teacher', status: 'פעיל', date: '18/05/2026' },
  ]);

  const filteredUsers = users.filter(user => 
    user.role === (activeTab === 'students' ? 'student' : 'teacher') &&
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">👥 ניהול משתמשי המערכת</h1>
        <p className="text-gray-400 mt-1">ניהול והרשאות של מורים ותלמידים בהפרדה מלאה.</p>
      </div>

      {/* טאבים להפרדה */}
      <div className="flex gap-2 border-b border-white/10 pb-px">
        <button 
          onClick={() => setActiveTab('students')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'students' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          🎒 תלמידים ({users.filter(u => u.role === 'student').length})
        </button>
        <button 
          onClick={() => setActiveTab('teachers')}
          className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'teachers' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          🧑‍🏫 מורים ({users.filter(u => u.role === 'teacher').length})
        </button>
      </div>

      {/* חיפוש */}
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={`חפש ${activeTab === 'students' ? 'תלמיד/ה' : 'מורה'}...`} 
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-all"
      />

      {/* טבלה מסודרת */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-sm font-semibold">
              <th className="p-4">שם מלא</th>
              <th className="p-4">אימייל</th>
              <th className="p-4">תאריך הצטרפות</th>
              <th className="p-4">סטטוס</th>
              <th className="p-4 text-left">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-bold text-white">{user.name}</td>
                <td className="p-4 text-gray-300 font-mono text-xs">{user.email}</td>
                <td className="p-4 text-gray-400">{user.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === 'פעיל' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-left">
                  <button className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all text-gray-300">
                    ניהול הרשאות
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}