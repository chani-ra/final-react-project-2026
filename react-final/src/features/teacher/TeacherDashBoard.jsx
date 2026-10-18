import useMessageNotice from "../../components/ui/useMessageNotice.js";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getTeacherDashboardData } from "../../services/teacherService";

import JourneyMap from "../student/components/dashboard/JourneyMap";
import AppModal from "../../components/ui/AppModal";

export default function TeacherDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLessons: 0,
    totalViews: 0,
    totalStudents: 0,
    averageEnrollment: 0,
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);
  const [activeStation, setActiveStation] = useState(null);

  const teacherId = user?._id || user?.id;
  const teacherName = user?.username || user?.name || "המורה";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!teacherId) {
        setMessage({
          type: "error",
          text: "לא נמצא מזהה מורה. נסי להתחבר מחדש.",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage({ type: "", text: "" });

        const data = await getTeacherDashboardData(teacherId);

        setStats({
          totalLessons: data.stats?.totalLessons || 0,
          totalViews: data.stats?.totalViews || 0,
          totalStudents: data.stats?.totalStudents || 0,
          averageEnrollment: data.stats?.averageEnrollment || 0,
        });

        setLessons(data.lessons || []);
      } catch (error) {
        console.error("שגיאה בטעינת דשבורד מורה:", error);

        setMessage({
          type: "error",
          text: error.toString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [teacherId]);

  const latestLessons = useMemo(() => lessons.slice(0, 5), [lessons]);

  const stations = useMemo(
    () => [
      {
        id: "latest-lessons",
        number: 1,
        title: "שיעורים אחרונים",
        short: "מה העלית לאחרונה",
        iconKey: "book",
      },
      {
        id: "teacher-library",
        number: 2,
        title: "הספרייה שלי",
        short: "ניהול כל התוכן",
        iconKey: "compass",
      },
      {
        id: "create-content",
        number: 3,
        title: "העלאת תוכן",
        short: "שיעור או שיר חדש",
        iconKey: "music",
        glow: true,
      },
      {
        id: "create-quiz",
        number: 4,
        title: "יצירת בוחן",
        short: "שאלות ומשוב",
        iconKey: "brain",
      },
      {
        id: "create-exercise",
        number: 5,
        title: "יצירת תרגיל",
        short: "תרגול אישי",
        iconKey: "pen",
      },
      {
        id: "students",
        number: 6,
        title: "תלמידות",
        short: "מעקב התקדמות",
        iconKey: "bot",
      },
    ],
    []
  );

  const activeStationData = stations.find(
    (station) => station.id === activeStation
  );

  const openStation = (stationId) => {
    if (stationId === "latest-lessons") {
      setActiveStation(stationId);
      return;
    }

    if (stationId === "teacher-library") {
      navigate("/teacher/library");
      return;
    }

    if (stationId === "create-content") {
      navigate("/teacher/create");
      return;
    }

    if (stationId === "create-quiz") {
      navigate("/teacher/quizzes/create");
      return;
    }

    if (stationId === "create-exercise") {
      navigate("/teacher/exercises/create");
      return;
    }

    if (stationId === "students") {
      navigate("/teacher/students");
      return;
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-[55vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/30 bg-[#062f52]/70 px-10 py-7 text-xl font-black shadow-[0_0_45px_rgba(255,255,255,0.24)] backdrop-blur-xl">
          טוען נתוני מורה...
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative min-h-[690px] overflow-hidden rounded-[2.4rem] border border-white/35 bg-[#46b9ef]/18 shadow-[0_32px_95px_rgba(8,72,116,0.28),inset_0_1px_0_rgba(255,255,255,0.22)]"
      dir="rtl"
    >
      <TeacherDashboardHeader
        teacherName={teacherName}
        stats={stats}
        message={message}
        onGoToLibrary={() => navigate("/teacher/library")}
      />

      <JourneyMap stations={stations} onStationClick={openStation} />

      <TeacherStationModal
        activeStation={activeStation}
        activeStationData={activeStationData}
        onClose={() => setActiveStation(null)}
        latestLessons={latestLessons}
        onGoToLibrary={() => navigate("/teacher/library")}
        onCreateContent={() => navigate("/teacher/create")}
      />
    </section>
  );
}

function TeacherDashboardHeader({
  teacherName,
  stats,
  message,
  onGoToLibrary,
}) {
  return (
    <div className="relative z-20 px-5 pt-5 md:px-8 md:pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-[1.7rem] border border-white/36 bg-[#073a5d]/36 p-4 shadow-[0_16px_44px_rgba(7,54,89,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
          <div className="text-xl font-black text-white">
            שלום {teacherName}
          </div>

          <div className="mt-1 text-sm font-bold text-white/74">
            לוח בקרה למורה
          </div>
        </div>

        <div className="text-center">
          <h1
            className="text-3xl font-black text-white md:text-5xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
            }}
          >
            מפת הניהול שלך
          </h1>

          <p className="mt-2 text-sm font-black text-[#08324e]/78 md:text-base">
            יוצרים • מפרסמים • מלווים תלמידות
          </p>

          <TeacherStatsBar stats={stats} />
        </div>

        <button
          type="button"
          onClick={onGoToLibrary}
          className="group relative overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3.5 text-base font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.48),0_0_24px_rgba(255,255,255,0.22)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="relative">מעבר לספרייה שלי</span>
        </button>
      </div>

    </div>
  );
}

function TeacherStatsBar({ stats }) {
  const items = [
    { label: "תכנים", value: stats.totalLessons },
    { label: "צפיות", value: stats.totalViews },
    { label: "תלמידות", value: stats.totalStudents },
    { label: "ממוצע", value: stats.averageEnrollment },
  ];

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="rounded-full border border-white/26 bg-white/16 px-4 py-1.5 text-xs font-black text-white shadow-sm backdrop-blur-xl"
        >
          {item.value ?? 0} {item.label}
        </span>
      ))}
    </div>
  );
}

function TeacherStationModal({
  activeStation,
  activeStationData,
  onClose,
  latestLessons,
  onGoToLibrary,
  onCreateContent,
}) {
  return (
    <AppModal
      isOpen={!!activeStation}
      onClose={onClose}
      title={activeStationData?.title || ""}
      subtitle={activeStationData?.short || ""}
      maxWidth="max-w-5xl"
    >
      {activeStation === "latest-lessons" && (
        <LatestLessonsModalContent
          latestLessons={latestLessons}
          onGoToLibrary={onGoToLibrary}
          onCreateContent={onCreateContent}
        />
      )}
    </AppModal>
  );
}

function LatestLessonsModalContent({
  latestLessons,
  onGoToLibrary,
  onCreateContent,
}) {
  if (!latestLessons.length) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-10 text-center">
        <h3 className="text-2xl font-black text-slate-900">
          עדיין לא העלית שיעורים
        </h3>

        <p className="mx-auto mt-2 max-w-md text-slate-500">
          ברגע שתעלי שיעורים או שירים, הם יופיעו כאן בצורה מסודרת.
        </p>

        <button
          type="button"
          onClick={onCreateContent}
          className="mt-6 rounded-full bg-[#b8322a] px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1"
        >
          העלאת תוכן ראשון
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
        <h3 className="text-3xl font-black text-slate-900">
          שיעורים אחרונים שהעלית
        </h3>

        <p className="mt-2 text-slate-500">
          תצוגה קצרה מתוך הספרייה שלך. לעריכה מלאה עברי לספרייה.
        </p>
      </div>

      <div className="space-y-3">
        {latestLessons.map((lesson, index) => (
          <LatestLessonRow
            key={lesson._id || index}
            lesson={lesson}
            index={index}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          onClick={onGoToLibrary}
          className="flex-1 rounded-full bg-[#0f4c75] px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1"
        >
          מעבר לספרייה
        </button>

        <button
          type="button"
          onClick={onCreateContent}
          className="flex-1 rounded-full bg-[#b8322a] px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1"
        >
          העלאת תוכן חדש
        </button>
      </div>
    </div>
  );
}

function LatestLessonRow({ lesson, index }) {
  return (
    <article className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl border border-sky-100 bg-sky-50 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f4c75] text-lg font-black text-white">
        {index + 1}
      </div>

      <div className="min-w-0">
        <h4 className="truncate text-lg font-black text-slate-900">
          {lesson.title || "שיעור ללא כותרת"}
        </h4>

        <p className="truncate text-sm font-bold text-slate-500">
          {lesson.topic || "כללי"}
        </p>
      </div>

      <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-sm">
        <div className="text-xs font-bold text-slate-400">צפיות</div>
        <div className="text-lg font-black text-[#0f4c75]">
          {lesson.views || 0}
        </div>
      </div>
    </article>
  );
}