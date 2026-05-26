import React from 'react';

export default function AdminDashboard() {
  const stats = [
    { id: 1, title: 'משתמשים פעילים', value: '1,248', change: '+12%', isPositive: true },
    { id: 2, title: 'הכנסות החודש', value: '₪45,200', change: '+5%', isPositive: true },
    { id: 3, title: 'משימות שנבדקו', value: '8,432', change: '-2%', isPositive: false },
    { id: 4, title: 'שגיאות מערכת', value: '3', change: '-15%', isPositive: true },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">📈 נתוני מערכת כלליים</h1>
        <p className="text-gray-400 mt-1">מבט על לביצועי המערכת בזמן אמת.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="text-gray-400 text-sm font-medium mb-2">{stat.title}</h3>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                stat.isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center justify-center h-64 text-gray-500 font-medium shadow-sm">
        כאן יוצג גרף רישום משתמשים חודשי (ניתן לשלב ספריות כמו Recharts בהמשך)
      </div>

    </div>
  );
}