import React from "react";

export default function ExerciseSidebar({ materials, onOpenMaterials }) {
  const hasMaterials = materials?.length > 0;

  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-lg font-black">חומרי עזר</h2>

        <div className="mt-3 rounded-xl border border-white/12 bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/62">
          {hasMaterials
            ? `יש ${materials.length} חומרי עזר זמינים לתרגיל הזה.`
            : "אין חומרי עזר מצורפים לתרגיל הזה."}
        </div>

        {hasMaterials && (
          <button
            type="button"
            onClick={onOpenMaterials}
            className="mt-3 w-full rounded-full border border-white/18 bg-white/10 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/16"
          >
            פתיחת חומרי עזר
          </button>
        )}
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffd439]/24 bg-[#ffd439]/14 text-lg text-[#ffd439]">
            ✎
          </div>

          <h2 className="text-lg font-black text-white">טיפ קטן</h2>
        </div>

        <p className="rounded-xl bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/74">
          כתבי תשובה קצרה וברורה. גם אם היא לא מושלמת, עצם הכתיבה באנגלית
          מחזקת ביטחון ושטף.
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
        <div className="text-xs font-bold text-white/56">מצב תרגול</div>
        <div className="mt-1 text-xl font-black text-white">תרגול אישי</div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/16">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a]" />
        </div>
      </div>
    </aside>
  );
}