import React from "react";
import { useNavigate } from "react-router-dom";
import { useLearningStudio } from "./useLearningStudio";
import LessonText from "./LessonText";

const inputStyle = "w-full min-w-0 rounded-xl border border-white/30 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/25 disabled:opacity-50";

export default function LearningStudio() {
  const navigate = useNavigate();
  const data = useLearningStudio();
  const { categories, providers, categoryId, subcategoryId, provider, prompt, lesson, history,
    loading, saving, historyLoading, error, activeTab, setActiveTab,
    setProvider, setPrompt, setLesson, changeCategory, setSubcategoryId, createLesson, loadHistory, subcategories } = data;
  const currentProvider = providers.find((engine) => engine.id === provider);

  return (
    <main dir="rtl" className="mx-auto max-w-6xl space-y-5 text-white">
      <header className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-slate-950/65 px-5 py-6 shadow-2xl backdrop-blur-xl sm:px-8">
        <div className="pointer-events-none absolute -left-16 -top-24 h-60 w-60 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">EnglishWise · AI Learning Studio</span>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">השיעור הבא שלך מתחיל כאן</h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white/70">בחרי נושא, שאלי את מה שמעניין אותך וקבלי שיעור אישי. כל מה שתלמדי יישמר עבורך.</p>
          </div>
          <button type="button" onClick={() => navigate("/courses")} className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold transition hover:bg-white/20">חזרה לקורסים ←</button>
        </div>
      </header>

      <nav aria-label="שיעורים אישיים" className="flex gap-2 rounded-full border border-white/25 bg-slate-950/45 p-1.5 backdrop-blur-md">
        <button type="button" onClick={() => setActiveTab("create")} aria-current={activeTab === "create" ? "page" : undefined} className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black transition ${activeTab === "create" ? "bg-yellow-300 text-slate-950" : "text-white/80 hover:bg-white/10"}`}>יצירת שיעור</button>
        <button type="button" onClick={() => setActiveTab("history")} aria-current={activeTab === "history" ? "page" : undefined} className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black transition ${activeTab === "history" ? "bg-yellow-300 text-slate-950" : "text-white/80 hover:bg-white/10"}`}>השיעורים ששמרתי ({history.total || 0})</button>
      </nav>

      {error && <div role="alert" className="rounded-xl border border-red-200/50 bg-red-950/75 px-4 py-3 text-sm text-red-100">{error}</div>}
      {loading ? <p role="status" className="py-12 text-center">טוען תחומי לימוד...</p> : activeTab === "create" ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
          <form onSubmit={createLesson} className="space-y-5 rounded-[1.8rem] border border-white/25 bg-slate-950/65 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <div><h2 className="text-lg font-black">בואי נתאים לך שיעור</h2><p className="mt-1 text-xs text-white/60">שלושה צעדים קצרים, והלמידה מתחילה.</p></div>
            <label className="block space-y-2"><span className="text-sm font-bold">1. תחום לימוד</span>
              <select className={inputStyle} value={categoryId} onChange={(event) => changeCategory(event.target.value)} required>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select>
            </label>
            <label className="block space-y-2"><span className="text-sm font-bold">תת־נושא</span>
              <select className={inputStyle} value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)} required>{subcategories.map((topic) => <option key={topic._id} value={topic._id}>{topic.name}</option>)}</select>
            </label>
            <fieldset className="space-y-2"><legend className="text-sm font-bold">2. בחרי מנוע AI</legend>
              <div className="grid grid-cols-2 gap-2">{providers.map((engine) => (
                <label key={engine.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${provider === engine.id ? "border-yellow-300 bg-yellow-300/20" : "border-white/20 bg-white/5"} ${!engine.available ? "cursor-not-allowed opacity-45" : ""}`}>
                  <input type="radio" name="provider" value={engine.id} checked={provider === engine.id} disabled={!engine.available || saving} onChange={() => setProvider(engine.id)} className="accent-yellow-300" />{engine.label}
                </label>
              ))}</div>
              {currentProvider && !currentProvider.available && <p className="text-xs text-yellow-100">המנוע הזה עדיין לא מוגדר בשרת.</p>}
            </fieldset>
            <label className="block space-y-2"><span className="text-sm font-bold">3. מה תרצי ללמוד?</span>
              <textarea className={`${inputStyle} min-h-36 resize-y`} maxLength={800} minLength={5} value={prompt} onChange={(event) => setPrompt(event.target.value)} disabled={saving} placeholder="למשל: תסביר לי Past Simple בעברית, תן דוגמאות מחיי היום-יום ובסוף תרגול קצר..." required />
              <span className="block text-left text-xs text-white/50">{prompt.length}/800</span>
            </label>
            <button type="submit" disabled={saving || !categoryId || !subcategoryId || !currentProvider?.available} className="w-full rounded-full bg-gradient-to-b from-yellow-200 to-yellow-400 px-5 py-3.5 font-black text-slate-950 shadow-[0_5px_0_#8f641a] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{saving ? "יוצרים עבורך שיעור..." : "✨ צרי לי שיעור אישי"}</button>
          </form>
          <LessonPanel lesson={lesson} pending={saving} />
        </div>
      ) : (
        <section className="rounded-[1.8rem] border border-white/25 bg-slate-950/65 p-5 backdrop-blur-xl sm:p-6">
          <h2 className="text-xl font-black">ספריית השיעורים האישית שלי</h2>
          <p className="mt-1 text-sm text-white/60">השיעורים נשמרים אוטומטית לאחר יצירה מוצלחת.</p>
          {historyLoading ? <p role="status" className="mt-6">טוען היסטוריה...</p> : !history.items?.length ? <p className="mt-8 text-center text-white/75">עדיין אין שיעורים שמורים. צרי שיעור ראשון ונתחיל!</p> : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{history.items.map((item) => (
              <button key={item._id} type="button" onClick={() => { setLesson(item); setActiveTab("create"); }} className="rounded-2xl border border-white/20 bg-white/5 p-4 text-right transition hover:border-yellow-300/50 hover:bg-white/10">
                <span className="text-xs text-yellow-200">{item.category?.name} · {item.subcategory?.name}</span>
                <strong className="mt-2 block line-clamp-2 text-sm">{item.prompt}</strong>
                <span className="mt-3 block text-xs text-white/55">{new Date(item.createdAt).toLocaleDateString("he-IL")} · {item.provider === "openai" ? "OpenAI" : "Gemini"}</span>
              </button>
            ))}</div>
          )}
          <div className="mt-5 flex items-center justify-center gap-4 text-sm"><button type="button" disabled={historyLoading || history.page <= 1} onClick={() => loadHistory(history.page - 1)} className="rounded-full border border-white/30 px-4 py-2 disabled:opacity-30">הקודם</button><span>עמוד {history.page || 1} מתוך {Math.max(1, history.pages || 0)}</span><button type="button" disabled={historyLoading || history.page >= history.pages} onClick={() => loadHistory(history.page + 1)} className="rounded-full border border-white/30 px-4 py-2 disabled:opacity-30">הבא</button></div>
        </section>
      )}
    </main>
  );
}

function LessonPanel({ lesson, pending }) {
  return <section aria-live="polite" className="min-h-[430px] rounded-[1.8rem] border border-white/25 bg-gradient-to-br from-slate-950/85 to-[#115784]/80 p-5 shadow-xl backdrop-blur-xl sm:p-7">
    {pending ? <div role="status" className="flex h-full min-h-72 items-center justify-center text-center text-base font-bold">כותבים, מסבירים ומכינים לך תרגול אישי...</div> : lesson ? (
      <><div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4"><div><span className="text-xs font-bold text-yellow-200">השיעור האישי שלך</span><h2 className="mt-1 text-lg font-black">{lesson.prompt}</h2></div><span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs">{lesson.provider === "openai" ? "OpenAI GPT" : "Gemini"}</span></div><LessonText text={lesson.response} /></>
    ) : <div className="flex min-h-[330px] flex-col items-center justify-center px-5 text-center"><span className="text-5xl" aria-hidden="true">📖</span><h2 className="mt-4 text-xl font-black">דף חדש במסע האנגלית שלך</h2><p className="mt-2 max-w-sm text-sm leading-7 text-white/65">כאן יופיע השיעור שניצור יחד: הסברים, דוגמאות ותרגול קצר המותאמים אלייך.</p></div>}
  </section>;
}
