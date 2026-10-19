import BackButton from "./BackButton.jsx";

/** Same top bar for course content details: back on the right, X on the left. */
export default function DetailHeaderActions({ onBack, onClose, backLabel = "חזרה" }) {
  return (
    <div dir="rtl" className="mb-5 flex min-h-11 items-center justify-between gap-4">
      <BackButton onClick={onBack} label={backLabel} />
      <button
        type="button"
        onClick={onClose || onBack}
        aria-label="סגירה"
        title="סגירה"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl font-normal text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ×
      </button>
    </div>
  );
}
