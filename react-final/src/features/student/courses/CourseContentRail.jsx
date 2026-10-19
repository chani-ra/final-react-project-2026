import CourseRailCar from "./CourseRailCar.jsx";
import { getItemType } from "./courseContentItemModel.js";

export default function CourseContentRail({
  railRef,
  scrollRail,
  activeTab,
  activeTabData,
  items,
  courseId,
  navigate,
  getLevelLabel,
  getCategoryLabel,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
  activeSongId,
  openSongPanel,
}) {
  if (!items.length) {
    return (
      <EmptyContent
        label={activeTabData?.label}
        text={`עדיין אין ${activeTabData?.label || "תוכן"} בקורס הזה.`}
      />
    );
  }

  return (
    <div className="relative px-4 py-4">
      <RailLine />

      {items.length > 4 && (
        <>
          <button
            type="button"
            onClick={() => scrollRail("right")}
            className="absolute right-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-[#123c6b]/80 text-3xl font-black text-white shadow-[0_10px_24px_rgba(3,31,61,0.26)] backdrop-blur-xl transition hover:bg-[#176aa8] xl:flex"
          >
            ›
          </button>

          <button
            type="button"
            onClick={() => scrollRail("left")}
            className="absolute left-3 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-[#123c6b]/80 text-3xl font-black text-white shadow-[0_10px_24px_rgba(3,31,61,0.26)] backdrop-blur-xl transition hover:bg-[#176aa8] xl:flex"
          >
            ‹
          </button>
        </>
      )}

      <div
        ref={railRef}
        className="course-horizontal-rail relative z-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-2 pb-4 pt-5"
      >
        {items.map((item, index) => {
          const itemType = getItemType(activeTab);
          const completed = isItemCompleted({
            itemType,
            itemId: item._id,
          });

          const loadingKey = `${itemType}-${item._id}`;
          const isLoading = actionLoadingKey === loadingKey;
          const isActiveSong =
            activeTab === "songs" && activeSongId === item._id;

          return (
            <CourseRailCar
              key={item._id}
              item={item}
              index={index}
              activeTab={activeTab}
              typeLabel={activeTabData?.typeLabel || "פריט"}
              color={activeTabData?.color}
              completed={completed}
              isLoading={isLoading}
              isActiveSong={isActiveSong}
              getLevelLabel={getLevelLabel}
              getCategoryLabel={getCategoryLabel}
              onOpen={() =>
                openItem({
                  activeTab,
                  item,
                  courseId,
                  navigate,
                  openSongPanel,
                })
              }
              onToggle={() =>
                onToggleCourseItem({
                  itemType,
                  itemId: item._id,
                  completed: !completed,
                })
              }
            />
          );
        })}
      </div>

      {items.length > 4 && <RailHint />}
    </div>
  );
}

function RailLine() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-[48%] z-0 h-28 w-full"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M20 62C130 20 240 96 350 62C470 25 565 95 680 62C790 30 900 82 1015 58C1090 42 1145 46 1180 30"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="12 16"
      />
      <path
        d="M20 66C130 24 240 100 350 66C470 29 565 99 680 66C790 34 900 86 1015 62C1090 46 1145 50 1180 34"
        fill="none"
        stroke="rgba(7,90,152,0.22)"
        strokeWidth="13"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RailHint() {
  return (
    <div className="mt-1 text-center text-xs font-bold text-white/50">
      יש עוד קרונות במסלול — אפשר להשתמש בחצים או לגלול בעדינות לרוחב
    </div>
  );
}

function EmptyContent({ label, text }) {
  return (
    <div className="p-5">
      <div className="rounded-[2rem] border border-dashed border-white/18 bg-[#123c6b]/44 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/14 bg-white/9 text-2xl">
          —
        </div>
        <h3 className="text-2xl font-black text-white">{label}</h3>
        <p className="mt-2 font-bold text-white/60">{text}</p>
      </div>
    </div>
  );
}

function openItem({ activeTab, item, courseId, navigate, openSongPanel }) {
  if (activeTab === "lessons") {
    navigate(`/lesson/${item._id}?courseId=${encodeURIComponent(courseId)}`, { state: { courseReturn: { courseId, tab: "lessons" } } });
    return;
  }

  if (activeTab === "songs") {
    openSongPanel(item._id);
    return;
  }

  if (activeTab === "exercises") {
    navigate(`/exercise/${item._id}?courseId=${encodeURIComponent(courseId)}`, { state: { courseReturn: { courseId, tab: "exercises" } } });
    return;
  }

  if (activeTab === "quizzes") {
    navigate(`/quiz/${item._id}?courseId=${encodeURIComponent(courseId)}`, { state: { courseReturn: { courseId, tab: "quizzes" } } });
    return;
  }
}
