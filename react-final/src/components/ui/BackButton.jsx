// Reusable presentation; where the button returns is decided by the feature.
export default function BackButton({ onClick, label = "חזרה", compact = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={compact
        ? "absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-xl font-black text-white shadow-lg transition hover:bg-white/22"
        : "inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-black text-white/82 transition hover:bg-white/16 hover:text-white"}
    >
      <span aria-hidden="true">→</span>
      {!compact && <span>{label}</span>}
    </button>
  );
}
