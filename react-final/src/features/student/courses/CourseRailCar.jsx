import CourseProgressToggleButton from "./CourseProgressToggleButton.jsx";
import { getOpenButtonText, getShortDescription } from "./courseContentItemModel.js";

export default function CourseRailCar({
  item,
  index,
  activeTab,
  typeLabel,
  color,
  completed,
  isLoading,
  isActiveSong,
  getLevelLabel,
  getCategoryLabel,
  onOpen,
  onToggle,
}) {
  return (
    <article
      className={`relative h-[236px] w-[270px] shrink-0 snap-center rounded-[1.7rem] border p-4 text-white shadow-[0_15px_34px_rgba(3,31,61,0.22),0_0_20px_rgba(103,232,249,0.10),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:-translate-y-2 ${
        isActiveSong
          ? "border-[#ffd439]/58 bg-[#1b5f95]/70"
          : "border-cyan-100/28 bg-[#1b5f95]/54 hover:bg-[#1b5f95]/66"
      }`}
    >
      <div className="absolute -top-4 right-5 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-base font-black shadow-[0_7px_14px_rgba(3,31,61,0.22)]">
        {index + 1}
      </div>

      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between gap-3 pr-9">
          <span
            className={`rounded-full border border-white/18 bg-gradient-to-b ${color} px-3 py-1 text-[11px] font-black text-white shadow-[0_5px_12px_rgba(3,31,61,0.16)]`}
          >
            {typeLabel}
          </span>

          {completed && (
            <span className="rounded-full border border-emerald-300/35 bg-emerald-400/16 px-3 py-1 text-[11px] font-black text-emerald-200">
              בוצע
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[50px] text-xl font-black leading-tight">
          {item.title || item.theme || `${typeLabel} ${index + 1}`}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[34px] text-xs font-bold leading-relaxed text-white/62">
          {getShortDescription(activeTab, item)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.level && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/72">
              {getLevelLabel(item.level)}
            </span>
          )}

          {item.category && (
            <span className="rounded-full bg-[#ffd439]/14 px-2.5 py-1 text-[11px] font-bold text-[#ffe99a]">
              {getCategoryLabel(item.category)}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-full border-2 border-white/50 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-3 py-2.5 text-xs font-black text-white shadow-[0_5px_0_rgba(89,15,20,0.40)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
          >
            {getOpenButtonText(activeTab)}
          </button>

          <CourseProgressToggleButton
            completed={completed}
            isLoading={isLoading}
            completedLabel="בוצע"
            pendingLabel="סמני"
            onClick={onToggle}
            variant="dark"
          />
        </div>
      </div>
    </article>
  );
}
