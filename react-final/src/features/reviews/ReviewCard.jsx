
const roleLabels = {
  student: "תלמידה",
  teacher: "מורה",
  admin: "צוות האתר",
};

const roleIcons = {
  student: "🎓",
  teacher: "👩‍🏫",
  admin: "⭐",
};

export default function ReviewCard({ review }) {
  const role = review.roleSnapshot || review.user?.role || "student";
  const name = review.usernameSnapshot || review.user?.username || "משתמשת";
  const rating = Math.min(Number(review.rating || 5), 5);

  return (
    <article className="relative h-full overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-5 text-white shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)] transition hover:-translate-y-1 hover:bg-[#082844]/86">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.10),transparent_34%)]" />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[1.4rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-3 py-3 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            {roleIcons[role] || "💬"}
          </div>

          <div>
            <h3 className="text-xl font-extrabold leading-tight text-white">
              {name}
            </h3>

            <span className="mt-2 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-3 py-1 text-xs font-extrabold text-[#ffe89a]">
              {roleLabels[role] || role}
            </span>
          </div>
        </div>

        <span className="rounded-full bg-[#ffd439] px-3 py-1 text-sm font-black text-[#123c6b] shadow-[0_0_18px_rgba(255,212,57,0.28)]">
          {rating}.0
        </span>
      </div>

      <div className="relative z-10 mb-3 text-lg leading-none text-[#ffd439]">
        {"★".repeat(rating)}
        <span className="text-white/20">{"★".repeat(5 - rating)}</span>
      </div>

      <p className="relative z-10 text-base font-semibold leading-8 text-white/78">
        {review.text}
      </p>
    </article>
  );
}