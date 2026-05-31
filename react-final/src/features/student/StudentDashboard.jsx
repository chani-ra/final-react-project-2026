import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getWeeklySong } from "../../services/songService";
import LearningMountainJourney from "./components/LearningMountainJourney";

const BRAND_RED = "#B8322A";
const BRAND_BLUE = "#0F4C75";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const userData = user;

  const [weeklySong, setWeeklySong] = useState(null);
  const [weeklySongLoading, setWeeklySongLoading] = useState(true);
  const [weeklySongError, setWeeklySongError] = useState("");

  const loadWeeklySong = async () => {
    try {
      setWeeklySongLoading(true);
      setWeeklySongError("");

      const song = await getWeeklySong();
      setWeeklySong(song);
    } catch (error) {
      setWeeklySongError(error.toString());
    } finally {
      setWeeklySongLoading(false);
    }
  };

  useEffect(() => {
    loadWeeklySong();
  }, []);

  const profile = useMemo(() => {
    const name = userData?.username || userData?.name || "תלמידה";
    const level = userData?.englishLevel || userData?.level || "beginner";
    const expectations = userData?.expectations || [];

    return {
      name,
      level,
      expectations,
    };
  }, [userData]);

  if (!userData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white">
        <div className="animate-pulse font-bold">טוען נתוני תלמידה...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <DashboardTopBar
        name={profile.name}
        level={profile.level}
        expectations={profile.expectations}
        onGoToCourses={() => navigate("/courses")}
      />

      <LearningMountainJourney
        user={userData}
        weeklySong={weeklySong}
        weeklySongLoading={weeklySongLoading}
        weeklySongError={weeklySongError}
      />

      <QuickAccessStrip navigate={navigate} />
    </div>
  );
}

function DashboardTopBar({ name, level, expectations, onGoToCourses }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#58BDEB] border border-white/45 shadow-[0_24px_80px_rgba(12,74,110,0.20)] p-6 md:p-8 text-white">
      <HeaderLines />

      <div className="relative flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <div className="inline-flex items-center bg-white text-[#0F4C75] border-[3px] border-[#B8322A] px-4 py-2 rounded-full text-sm font-black mb-4 shadow-sm">
            מסע הלמידה האישי שלך
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-sm">
            היי {name}, מוכנה לטפס עוד שלב?
          </h1>

          <p className="text-white/88 mt-3 max-w-2xl leading-relaxed">
            כל כלי באתר נמצא בתחנה אחרת במסע: מדריך חכם, מפת למידה, מאמן אישי,
            שיר שבועי, כתיבה ועוד.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {expectations.length > 0 ? (
              expectations.map((expectation) => (
                <span
                  key={expectation}
                  className="bg-white text-[#0F4C75] border-[2px] border-[#B8322A] px-3 py-1 rounded-full text-sm font-black shadow-sm"
                >
                  {getExpectationLabel(expectation)}
                </span>
              ))
            ) : (
              <span className="bg-white text-[#0F4C75] border-[2px] border-[#B8322A] px-3 py-1 rounded-full text-sm font-black shadow-sm">
                עדיין לא נבחרו מטרות למידה
              </span>
            )}
          </div>
        </div>

        <div className="relative bg-white/24 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/45 rounded-3xl p-5 min-w-[245px] h-fit shadow-[0_18px_45px_rgba(15,76,117,0.24)] backdrop-blur-xl">
          <div className="absolute -top-3 left-5 bg-[#B8322A] text-white text-xs font-black px-3 py-1 rounded-full shadow">
            COURSE
          </div>

          <div className="text-white/75 text-sm font-bold">הרמה שלך</div>

          <div className="text-3xl font-black mt-1">{getLevelLabel(level)}</div>

          <div className="mt-4 h-2 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full bg-[#B8322A] rounded-full w-[42%]" />
          </div>

          <button
            type="button"
            onClick={onGoToCourses}
            className="mt-5 w-full bg-white text-[#0F4C75] hover:bg-sky-50 font-black py-3 rounded-2xl transition-all border border-white shadow-sm"
          >
            מעבר לקורסים שלי
          </button>
        </div>
      </div>
    </section>
  );
}

function HeaderLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-25"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4" />
        <path d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42" />
        <path d="M90 75 H150 L185 40 L225 75 H310" />
        <path d="M930 92 H980 L1015 58 L1050 92 H1125" />
      </g>
    </svg>
  );
}

function QuickAccessStrip({ navigate }) {
  const links = [
    {
      label: "קורסים",
      path: "/courses",
      icon: <CourseIcon />,
    },
    {
      label: "משימות",
      path: "/tasks",
      icon: <TasksIcon />,
    },
    {
      label: "מילון",
      path: "/dictionary",
      icon: <DictionaryIcon />,
    },
    {
      label: "בולט",
      path: "/chat",
      icon: <BotMiniIcon />,
    },
    {
      label: "כתיבה",
      path: "/writing",
      icon: <WritingIcon />,
    },
  ];

  return (
    <section className="bg-white/26 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/35 rounded-[2rem] shadow-[0_18px_55px_rgba(15,76,117,0.22)] p-5 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center bg-white text-[#0F4C75] border-[3px] border-[#B8322A] px-4 py-2 rounded-full text-sm font-black mb-3 shadow-sm">
            מעבר מהיר
          </div>

          <h2 className="text-2xl font-black text-white drop-shadow-sm">
            קיצורי דרך
          </h2>

          <p className="text-white/78 text-sm mt-1">
            מעבר מהיר לכלים המרכזיים באתר.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {links.map((link) => (
          <button
            key={link.path}
            type="button"
            onClick={() => navigate(link.path)}
            className="group bg-white/94 hover:bg-white border border-white rounded-3xl p-4 shadow-sm hover:shadow-[0_14px_34px_rgba(15,76,117,0.22)] transition-all text-center hover:-translate-y-1"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F4C75] border-[3px] border-[#B8322A] text-white flex items-center justify-center transition-all group-hover:scale-105">
              {link.icon}
            </div>

            <div className="font-black text-[#0F4C75] mt-3">{link.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}

function getExpectationLabel(expectation) {
  const labels = {
    grammar: "דקדוק",
    fluent_speaking: "דיבור שוטף",
    confidence: "ביטחון באנגלית",
    vocabulary: "אוצר מילים",
  };

  return labels[expectation] || expectation;
}

function MiniIconBase({ children }) {
  return (
    <svg viewBox="0 0 48 48" className="w-7 h-7" fill="none">
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

function CourseIcon() {
  return (
    <MiniIconBase>
      <path d="M10 13H31C35 13 38 16 38 20V38H15C12 38 10 36 10 33V13Z" />
      <path d="M15 18H31" />
      <path d="M15 25H28" />
    </MiniIconBase>
  );
}

function TasksIcon() {
  return (
    <MiniIconBase>
      <rect x="11" y="9" width="26" height="31" rx="4" />
      <path d="M18 18H30" />
      <path d="M18 25H30" />
      <path d="M18 32H26" />
    </MiniIconBase>
  );
}

function DictionaryIcon() {
  return (
    <MiniIconBase>
      <path d="M12 10H31C34 10 36 12 36 15V38H16C14 38 12 36 12 34V10Z" />
      <path d="M18 17H30" />
      <path d="M18 24H28" />
      <path d="M36 15H16C14 15 12 13 12 10" />
    </MiniIconBase>
  );
}

function BotMiniIcon() {
  return (
    <MiniIconBase>
      <rect x="11" y="17" width="26" height="21" rx="6" />
      <path d="M24 17V9" />
      <circle cx="19" cy="27" r="1.5" fill="currentColor" />
      <circle cx="29" cy="27" r="1.5" fill="currentColor" />
      <path d="M19 33H29" />
    </MiniIconBase>
  );
}

function WritingIcon() {
  return (
    <MiniIconBase>
      <path d="M11 37L15 26L32 9L39 16L22 33L11 37Z" />
      <path d="M28 13L35 20" />
      <path d="M15 26L22 33" />
    </MiniIconBase>
  );
}