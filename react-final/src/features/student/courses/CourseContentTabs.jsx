import { apiUrl } from "../../../services/axiosConfig";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { courseTabFromSearch } from "../../general/navigation/courseNavigationModel.js";
import { useCourseAudio } from "../../general/audio/useCourseAudio.js";
import CourseContentRail from "./CourseContentRail.jsx";
import CourseSongPlayerPanel from "./CourseSongPlayerPanel.jsx";
import { selectCourseItems } from "../../../contracts/courseContracts.ts";


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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = courseTabFromSearch(`?${searchParams.toString()}`);
  const changeTab = (tab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { replace: true });
    setSongPanelOpen(false);
  };
  const railRef = useRef(null);
  const [activeSongId, setActiveSongId] = useState(
    course.songs?.[0]?._id || null
  );
  const [songPanelOpen, setSongPanelOpen] = useState(false);
  const { playSong } = useCourseAudio();

  const lessons = selectCourseItems(course, "lessons");
  const songs = selectCourseItems(course, "songs");
  const exercises = selectCourseItems(course, "exercises");
  const quizzes = selectCourseItems(course, "quizzes");

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

  const activeItems = useMemo(
    () => selectCourseItems(course, activeTab),
    [course, activeTab]
  );

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const scrollRail = (direction) => {
    if (!railRef.current) return;

    railRef.current.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });
  };

  const openSongPanel = (songId) => {
    const selected = songs.find((song) => song._id === songId);
    if (!selected) return;
    setActiveSongId(songId);
    setSongPanelOpen(true);
    // Runs directly in a click handler, preserving browser media-play permissions.
    void playSong({
      id: selected._id,
      title: selected.title || selected.theme || "שיר לימודי",
      subtitle: `תרגול האזנה · ${getLevelLabel(selected.level)}`,
      courseId: String(course._id),
      src: apiUrl(`/songs/song/${selected._id}/stream`),
    });
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
                onClick={() => changeTab(tab.id)}
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

        <CourseContentRail
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
          <CourseSongPlayerPanel
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
