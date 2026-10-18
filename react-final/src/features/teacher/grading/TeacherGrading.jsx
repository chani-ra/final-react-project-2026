export default function TeacherGrading() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold">✅ בדיקת משימות</h1>
        <p className="text-gray-400 mt-2">מטלות שהוגשו על ידי תלמידים וממתינות לציון ומשוב מצידך.</p>
      </div>
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-gray-300">
        מסך הבדיקה עדיין אינו מחובר לרשימת הגשות של תלמידים. לא יוצגו כאן משימות לדוגמה כאילו הוגשו בפועל.
      </div>
    </div>
  );
}
