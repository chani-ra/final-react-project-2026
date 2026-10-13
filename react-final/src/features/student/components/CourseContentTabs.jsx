import { apiUrl } from "../../../services/axiosConfig";
import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer";

export default function CourseContentTabs({
  course,
  progress,
  actionLoadingKey,
  getLevelLabel,
  getCategoryLabel,
  isItemCompleted,
  onToggleCourseItem,
}) {
  const navigate = useNavigate();
  const railRef = useRef(null);

  const [activeTab, setActiveTab] = useState("lessons");
  const [activeSongId, setActiveSongId] = useState(
    course.songs?.[0]?._id || null
  );
  const [songPanelOpen, setSongPanelOpen] = useState(false);

  const lessons = course.lessons || [];
  const songs = course.songs || [];
  const exercises = course.exercises || [];
  const quizzes = course.quizzes || [];

  const activeSong =
    songs.find((song) => song._id === activeSongId) || songs[0];

  const tabs = [
    {
      id: "lessons",
      label: "שיעורים",
      typeLabel: "שיעור",
      count: lessons.length,
      completed: progress?.completedLessons?.length || 0,
      color: "from-[#2c8fd6] to-[#123c6b]",
    },
    {
      id: "songs",
      label: "שירים",
      typeLabel: "שיר",
      count: songs.length,
      completed: progress?.completedSongs?.length || 0,
      color: "from-[#ffd439] to-[#d98918]",
    },
    {
      id: "exercises",
      label: "תרגילים",
      typeLabel: "תרגיל",
      count: exercises.length,
      completed: progress?.completedExercises?.length || 0,
      color: "from-[#4fc3f7] to-[#176aa8]",
    },
    {
      id: "quizzes",
      label: "בחנים",
      typeLabel: "בוחן",
      count: quizzes.length,
      completed: progress?.completedQuizzes?.length || 0,
      color: "from-[#6ba6ff] to-[#2458a8]",
    },
  ];

  const safeIsItemCompleted = isItemCompleted || (() => false);
  const safeToggle = onToggleCourseItem || (() => null);

  const activeItems = useMemo(() => {
    if (activeTab === "lessons") return lessons;
    if (activeTab === "songs") return songs;
    if (activeTab === "exercises") return exercises;
    if (activeTab === "quizzes") return quizzes;
    return [];
  }, [activeTab, lessons, songs, exercises, quizzes]);

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const scrollRail = (direction) => {
    if (!railRef.current) return;

    railRef.current.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  const openSongPanel = (songId) => {
    setActiveSongId(songId);
    setSongPanelOpen(true);
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/24 bg-[#123c6b]/50 shadow-[0_18px_55px_rgba(3,31,61,0.24),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.045),transparent_45%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">מסלול הקורס</h2>
            <p className="text-xs font-bold text-white/58">
              בחרי סוג תוכן והתקדמי בין הקרונות.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#123c6b] shadow-[0_0_14px_rgba(255,255,255,0.16)]"
                    : "bg-white/10 text-white/82 hover:bg-white/17 hover:text-white"
                }`}
              >
                {tab.label}
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-[11px] ${
                    activeTab === tab.id
                      ? "bg-[#123c6b]/10 text-[#123c6b]"
                      : "bg-white/10 text-white/72"
                  }`}
                >
                  {tab.completed}/{tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ContentRail
          railRef={railRef}
          scrollRail={scrollRail}
          activeTab={activeTab}
          activeTabData={activeTabData}
          items={activeItems}
          courseId={course._id}
          navigate={navigate}
          getLevelLabel={getLevelLabel}
          getCategoryLabel={getCategoryLabel}
          actionLoadingKey={actionLoadingKey}
          isItemCompleted={safeIsItemCompleted}
          onToggleCourseItem={safeToggle}
          activeSongId={activeSongId}
          openSongPanel={openSongPanel}
        />

        {activeTab === "songs" && activeSong && songPanelOpen && (
          <SongPlayerPanel
            activeSong={activeSong}
            getLevelLabel={getLevelLabel}
            actionLoadingKey={actionLoadingKey}
            isItemCompleted={safeIsItemCompleted}
            onToggleCourseItem={safeToggle}
            onClose={() => setSongPanelOpen(false)}
          />
        )}
      </div>
    </section>
  );
}

function ContentRail({
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

function CourseRailCar({
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

          <ProgressToggleButton
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

function SongPlayerPanel({
  activeSong,
  getLevelLabel,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
  onClose,
}) {
  const completed = isItemCompleted({
    itemType: "song",
    itemId: activeSong._id,
  });

  const isLoading = actionLoadingKey === `song-${activeSong._id}`;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#031f3d]/55 px-4 py-6 backdrop-blur-md"
      dir="rtl"
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2.4rem] border border-white/28 bg-[#123c6b]/96 text-white shadow-[0_35px_100px_rgba(3,31,61,0.58),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_48%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white shadow-lg transition hover:bg-white/22"
          aria-label="סגירת נגן"
        >
          ×
        </button>

        <div className="relative z-10 p-5 md:p-7">
          <div className="mb-6 flex items-center gap-4 pl-14">
            <div className="flex h-17 w-17 shrink-0 items-center justify-center rounded-[1.5rem] border border-white/28 bg-gradient-to-b from-[#ffd439] to-[#d98918] text-4xl shadow-[0_12px_28px_rgba(3,31,61,0.28)]">
              ♪
            </div>

            <div>
              <div className="text-xs font-black text-[#ffe99a]">
                נגן שיר פעיל
              </div>

              <h3 className="mt-1 text-2xl font-black leading-tight md:text-3xl">
                {activeSong.title || activeSong.theme || "שיר לימודי"}
              </h3>

              <p className="mt-1 text-sm font-bold text-white/68">
                רמה: {getLevelLabel(activeSong.level)} · נושא:{" "}
                {activeSong.theme || "לא צוין"}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/22 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <CustomAudioPlayer
              src={apiUrl(`/songs/song/${activeSong._id}/stream`)}
              title={activeSong.title || activeSong.theme || "שיר לימודי"}
              subtitle={`תרגול האזנה · ${getLevelLabel(activeSong.level)}`}
              allowDownload={true}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="rounded-[1.5rem] border border-white/14 bg-white/9 p-4">
              <h4 className="font-black text-white">תרגול קצר</h4>
              <p className="mt-1 text-sm font-bold leading-relaxed text-white/64">
                האזיני לשיר, ואז סמני שהשלמת.
              </p>
            </div>

            <div className="min-w-[200px]">
              <ProgressToggleButton
                completed={completed}
                isLoading={isLoading}
                completedLabel="השיר הושלם"
                pendingLabel="סמני שהאזנת"
                onClick={() =>
                  onToggleCourseItem({
                    itemType: "song",
                    itemId: activeSong._id,
                    completed: !completed,
                  })
                }
                variant="light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ProgressToggleButton({
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

function getItemType(activeTab) {
  const map = {
    lessons: "lesson",
    songs: "song",
    exercises: "exercise",
    quizzes: "quiz",
  };

  return map[activeTab] || "lesson";
}

function openItem({ activeTab, item, courseId, navigate, openSongPanel }) {
  if (activeTab === "lessons") {
    navigate(`/teacher/lesson/${item._id}`);
    return;
  }

  if (activeTab === "songs") {
    openSongPanel(item._id);
    return;
  }

  if (activeTab === "exercises") {
    navigate(`/exercise/${item._id}`);
    return;
  }

  if (activeTab === "quizzes") {
    navigate(`/quiz/${item._id}?courseId=${courseId}`);
    return;
  }
}

function getOpenButtonText(activeTab) {
  const map = {
    lessons: "צפייה",
    songs: "השמעה",
    exercises: "התחל",
    quizzes: "התחל",
  };

  return map[activeTab] || "פתח";
}

function getShortDescription(activeTab, item) {
  if (activeTab === "lessons") {
    return item.description || "שיעור מתוך המסלול.";
  }

  if (activeTab === "songs") {
    return item.theme || "תרגול האזנה.";
  }

  if (activeTab === "exercises") {
    return "תרגול אישי.";
  }

  if (activeTab === "quizzes") {
    return item.description || "בדיקת הבנה.";
  }

  return item.description || item.theme || "פריט מתוך הקורס.";
}