export function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {children}
    </button>
  );
}
export function MiniCounter({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
  };

  return (
    <div
      className={`rounded-[1.15rem] border px-4 py-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-xl font-black">{value}</div>
      <div className="text-[11px] font-black opacity-75">{label}</div>
    </div>
  );
}
export function SimpleContentPanel({ title, text }) {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-white/18 bg-white/8 p-8 text-center">
      <h2 className="text-2xl font-black text-white">{title}</h2>

      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-white/58">
        {text}
      </p>
    </div>
  );
}
export function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black">טוען תוכן...</p>
      </div>
    </div>
  );
}
export function EmptyContent() {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-white/18 bg-white/8 p-10 text-center">
      <h2 className="text-2xl font-black text-white">אין שירים במערכת</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/58">
        כאשר יתווספו שירים, הם יופיעו כאן לניהול ובחירת שיר שבועי.
      </p>
    </div>
  );
}
