import { useEffect, useState } from "react";
import { getAdminLearningHistory } from "../../../services/learningService";

export default function AdminLearningHistory() {
  const [history, setHistory] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getAdminLearningHistory({ page });
        if (active) { setHistory(data); setError(""); }
      } catch (err) { if (active) setError(err.message); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [page]);

  return <main dir="rtl" className="rounded-[2rem] border border-white/25 bg-slate-950/75 p-5 text-white shadow-xl backdrop-blur-xl sm:p-7">
    <span className="text-xs font-black tracking-widest text-yellow-200">ADMIN · AI LEARNING</span>
    <h1 className="mt-2 text-2xl font-black">היסטוריית שיעורי AI</h1>
    <p className="mt-2 text-sm text-white/65">מעקב אחר בקשות הלמידה ושיעורי ה־AI שנוצרו במערכת.</p>
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-900/60 p-3">{error}</p>}
    {loading ? <p role="status" className="mt-6">טוען נתוני למידה...</p> : <>
      <p className="mt-5 text-sm">סה״כ {history.total} שיעורים שמורים</p>
      <div className="mt-4 space-y-3">{history.items?.map((item) => (
        <article key={item._id} className="rounded-2xl border border-white/20 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><strong>{item.user?.username || "משתמש"} · {item.user?.email || ""}</strong><span className="text-xs text-white/55">{new Date(item.createdAt).toLocaleString("he-IL")}</span></div>
          <p className="mt-1 text-xs text-yellow-200">{item.category?.name} / {item.subcategory?.name} · {item.provider || "gemini"}</p>
          <p className="mt-2 text-sm">{item.prompt}</p>
          <button type="button" onClick={() => setOpened(opened === item._id ? null : item._id)} className="mt-3 text-xs font-black text-yellow-200 underline">{opened === item._id ? "סגירת השיעור" : "הצגת התשובה"}</button>
          {opened === item._id && <div className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-7">{item.response}</div>}
        </article>
      ))}</div>
      <div className="mt-5 flex items-center justify-center gap-4 text-sm"><button type="button" disabled={loading || page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }} className="rounded-full border border-white/30 px-4 py-2 disabled:opacity-30">הקודם</button><span>{page} / {Math.max(history.pages || 0, 1)}</span><button type="button" disabled={loading || page >= history.pages} onClick={() => { setLoading(true); setPage(page + 1); }} className="rounded-full border border-white/30 px-4 py-2 disabled:opacity-30">הבא</button></div>
    </>}
  </main>;
}
