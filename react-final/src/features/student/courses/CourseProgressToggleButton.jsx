export default function CourseProgressToggleButton({
  completed,
  isLoading,
  pendingLabel,
  completedLabel,
  onClick,
  variant = "dark",
}) {
  const pendingClass =
    variant === "light"
      ? "border-[#176aa8]/20 bg-[#176aa8]/10 text-[#123c6b] hover:bg-[#176aa8]/16"
      : "border-white/16 bg-white/10 text-white hover:bg-white/16";

  const completedClass =
    variant === "light"
      ? "border-emerald-400/35 bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
      : "border-emerald-300/35 bg-emerald-400/16 text-emerald-200 hover:bg-emerald-400/22";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full rounded-full border px-3 py-2.5 text-xs font-black transition-all disabled:opacity-60 ${
        completed ? completedClass : pendingClass
      }`}
    >
      {isLoading ? "מעדכן..." : completed ? completedLabel : pendingLabel}
    </button>
  );
}
