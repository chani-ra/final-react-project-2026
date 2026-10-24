import { getSourceConfig } from "../taskFormatting";

export function StatBox({ label, value, tone }) {
  const toneClasses = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1rem] border p-2.5 text-center ${toneClasses[tone] || toneClasses.yellow
        }`}
    >
      <div className="text-xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

export function TabButton({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-black transition ${active
        ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_24px_rgba(253,224,71,0.25)]"
        : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
        }`}
    >
      {label} ({count})
    </button>
  );
}

export function SourceBadge({ source, type }) {
  const config = getSourceConfig(source, type);

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function EmptyTasks({ activeTab }) {
  const textByTab = {
    pending: "אין כרגע משימות לביצוע. אפשר לבקש מהמאמן האישי לבנות סדר לימוד.",
    review: "אין משימות שממתינות לבדיקה.",
    completed: "עדיין אין משימות שהושלמו.",
  };

  return (
    <div className="rounded-[1.3rem] border border-dashed border-white/25 bg-[#245d8c]/45 p-6 text-center">
      <h3 className="text-lg font-black text-white">אין משימות כאן כרגע</h3>

      <p className="mt-3 text-sm font-semibold leading-6 text-white/80">
        {textByTab[activeTab] || "אין משימות בקטגוריה זו כרגע."}
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-5 text-lg font-black text-white">
          טוען את המשימות שלך...
        </p>
      </div>
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