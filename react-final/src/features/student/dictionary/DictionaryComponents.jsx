import React from "react";

export function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1.35rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

export function TextInput({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-white/70">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-[1.2rem] border-2 border-white/18 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, dir = "rtl" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-white/70">
        {label}
      </label>

      <textarea
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full resize-none rounded-[1.2rem] border-2 border-white/18 bg-white/10 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
      />
    </div>
  );
}

export function FilterButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-4 py-2 text-xs font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {label}
    </button>
  );
}

export function WordCard({ word, isLoading, onToggle, onDelete }) {
  return (
    <article
      className={`rounded-[1.7rem] border-2 p-4 transition ${
        word.mastered
          ? "border-emerald-300/28 bg-emerald-400/10"
          : "border-white/16 bg-white/10 hover:border-yellow-300/38 hover:bg-white/13"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className="truncate text-2xl font-black tracking-wide text-yellow-300"
            dir="ltr"
          >
            {word.word}
          </h3>

          <p className="mt-1 text-base font-black text-white">
            {word.translation}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black ${
            word.mastered
              ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-100"
              : "border-red-300/35 bg-red-500/12 text-red-100"
          }`}
        >
          {word.mastered ? "יודעת" : "בתרגול"}
        </span>
      </div>

      {word.definition && (
        <p className="mb-3 text-sm font-semibold leading-6 text-white/55" dir="ltr">
          {word.definition}
        </p>
      )}

      {word.example && (
        <div className="mb-4 rounded-[1.2rem] border border-white/10 bg-slate-950/55 p-3">
          <div className="mb-1 text-xs font-black text-white/35">Example</div>

          <p className="text-sm font-semibold italic leading-6 text-white/65" dir="ltr">
            {word.example}
          </p>
        </div>
      )}

      <div className="flex gap-3 border-t border-white/8 pt-3">
        <button
          type="button"
          onClick={onToggle}
          disabled={isLoading}
          className={`flex-1 rounded-full border px-4 py-2 text-xs font-black transition disabled:opacity-60 ${
            word.mastered
              ? "border-white/16 bg-white/8 text-white/60 hover:bg-white/12"
              : "border-yellow-300/55 bg-yellow-300 px-4 text-slate-950 hover:brightness-105"
          }`}
        >
          {isLoading ? "מעדכן..." : word.mastered ? "החזירי לתרגול" : "אני יודעת"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="rounded-full border border-red-300/30 bg-red-500/12 px-4 py-2 text-xs font-black text-red-100 transition hover:bg-red-500/22 disabled:opacity-60"
        >
          מחיקה
        </button>
      </div>
    </article>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black text-white">
          טוען את המילון...
        </p>
      </div>
    </div>
  );
}

export function EmptyDictionary() {
  return (
    <div className="rounded-[1.8rem] border-2 border-dashed border-white/20 bg-white/8 p-8 text-center">
      <h2 className="text-2xl font-black text-white">אין מילים להצגה</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
        בדקי מילה חדשה ושמרי אותה במילון האישי.
      </p>
    </div>
  );
}

export function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

export function DarkSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
  );
}
