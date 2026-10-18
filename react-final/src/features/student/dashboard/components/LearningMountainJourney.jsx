import { apiUrl } from "../../../../services/axiosConfig";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppModal from "../../../../components/ui/AppModal";
import SmartLearningPath from "./SmartLearningPath";
import StudentBrainMap from "./StudentBrainMap";
import AICoachCard from "./AICoachCard";
import CustomAudioPlayer from "../../../../components/CustomAudioPlayer";

const BRAND_RED = "#B8322A";
const BRAND_BLUE = "#0F4C75";

export default function LearningMountainJourney({
  user,
  weeklySong,
  weeklySongLoading,
  weeklySongError,
}) {
  const navigate = useNavigate();
  const [activeStation, setActiveStation] = useState(null);

  const userName = user?.username || user?.name || "תלמידה";
  const userLevel = user?.englishLevel || user?.level || "beginner";

  const stations = useMemo(
    () => [
      {
        id: "smart-guide",
        title: "המדריך החכם",
        short: "תכנון לימוד יומי",
        icon: <CompassIcon />,
        position: "right-[8%] top-[70%]",
      },
      {
        id: "brain-map",
        title: "מפת הלמידה",
        short: "חוזקות וחולשות",
        icon: <BrainLineIcon />,
        position: "right-[27%] top-[50%]",
      },
      {
        id: "coach",
        title: "מאמן אישי",
        short: "עזרה לפי קושי",
        icon: <BotLineIcon />,
        position: "right-[48%] top-[66%]",
      },
      {
        id: "weekly-song",
        title: "שיר השבוע",
        short: "תרגול שמיעה",
        icon: <MusicLineIcon />,
        position: "right-[68%] top-[43%]",
      },
      {
        id: "writing",
        title: "מאמן כתיבה",
        short: "ציון ומשוב",
        icon: <PenLineIcon />,
        position: "right-[84%] top-[24%]",
      },
    ],
    []
  );

  const activeStationData = stations.find(
    (station) => station.id === activeStation
  );

  const openStation = (stationId) => {
    if (stationId === "writing") {
      navigate("/writing");
      return;
    }

    setActiveStation(stationId);
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/45 shadow-[0_24px_80px_rgba(12,74,110,0.22)] bg-[#58BDEB] min-h-[640px]">
      <JourneyBackground />

      <div className="relative z-10 p-6 md:p-9">
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/22 border border-white/35 text-white px-4 py-2 rounded-full text-sm font-black shadow-sm mb-4">
              English Mountain Journey
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-sm">
              היי {userName}, יוצאים למסע האנגלית שלך
            </h1>

            <p className="text-white/88 mt-3 max-w-2xl leading-relaxed">
              כל תחנה פותחת כלי אחר. הדשבורד נשאר נקי, והלמידה מרגישה כמו
              מסלול אישי שמתקדמים בו צעד אחרי צעד.
            </p>
          </div>

          <LevelCard level={userLevel} />
        </div>

        <div className="relative min-h-[410px]">
          <MountainPath />

          {stations.map((station, index) => (
            <JourneyStation
              key={station.id}
              station={station}
              index={index}
              onClick={() => openStation(station.id)}
            />
          ))}

          <div className="absolute left-[5%] top-[5%] hidden md:block">
            <div className="relative">
              <div className="w-20 h-20 rounded-[1.8rem] bg-white/22 border-[4px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/50 backdrop-blur flex items-center justify-center shadow-[0_18px_45px_rgba(15,76,117,0.28)]">
                <FinishLineIcon />
              </div>

              <div className="absolute -bottom-3 right-1 bg-white/95 border border-[#0F4C75]/20 rounded-full px-3 py-1 text-xs font-black text-sky-900 shadow">
                הפסגה
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppModal
        isOpen={!!activeStation}
        onClose={() => setActiveStation(null)}
        title={activeStationData?.title || ""}
        subtitle={activeStationData?.short || ""}
        icon={activeStationData?.icon || null}
        maxWidth={
          activeStation === "weekly-song" || activeStation === "coach"
            ? "max-w-4xl"
            : "max-w-6xl"
        }
      >
        {activeStation === "smart-guide" && <SmartLearningPath user={user} />}

        {activeStation === "brain-map" && <StudentBrainMap user={user} />}

        {activeStation === "coach" && <AICoachCard user={user} />}

        {activeStation === "weekly-song" && (
          <WeeklySongModalContent
            weeklySong={weeklySong}
            loading={weeklySongLoading}
            error={weeklySongError}
          />
        )}
      </AppModal>
    </section>
  );
}

function LevelCard({ level }) {
  return (
    <div className="relative bg-white/24 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/45 rounded-3xl shadow-[0_18px_45px_rgba(15,76,117,0.24)] p-5 min-w-[230px] h-fit backdrop-blur-xl">
      <div className="absolute -top-3 left-5 bg-[#B8322A] text-white text-xs font-black px-3 py-1 rounded-full shadow">
        LEVEL
      </div>

      <div className="text-sm text-white/78 font-bold">הרמה שלך</div>

      <div className="text-2xl font-black text-white mt-1">
        {getLevelLabel(level)}
      </div>

      <div className="mt-4 h-2 bg-white/25 rounded-full overflow-hidden">
        <div className="h-full bg-[#B8322A] rounded-full w-[42%]" />
      </div>

      <div className="text-xs text-white/72 mt-2">
        ההתקדמות נבנית מפעילות אמיתית באתר.
      </div>
    </div>
  );
}

function JourneyStation({ station, index, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute ${station.position} -translate-x-1/2 -translate-y-1/2 group`}
    >
      <div className="relative flex flex-col items-center">
        <div className="relative w-30 h-30 md:w-32 md:h-32 rounded-[2.2rem] bg-white/24 backdrop-blur-xl border-[6px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/60 shadow-[0_18px_45px_rgba(15,76,117,0.34)] flex items-center justify-center transition-all group-hover:-translate-y-2 group-hover:scale-105">
          <div className="absolute inset-2 rounded-[1.7rem] bg-[#0F4C75]/16 opacity-90" />

          <div className="relative z-10 w-16 h-16 text-white drop-shadow">
            {station.icon}
          </div>

          <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-[#B8322A] text-white border border-white flex items-center justify-center text-sm font-black shadow-md">
            {index + 1}
          </div>
        </div>

        <div className="mt-3 bg-white/95 border border-[#0F4C75]/15 rounded-2xl px-4 py-2 shadow-md min-w-[145px]">
          <div className="font-black text-[#0F4C75] text-sm">
            {station.title}
          </div>

          <div className="text-[11px] text-slate-500 mt-0.5">
            {station.short}
          </div>
        </div>
      </div>
    </button>
  );
}

function JourneyBackground() {
  return (
    <>
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        viewBox="0 0 1400 650"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M45 170 H110 L150 130 L195 170 H280" />
          <path d="M960 140 H1030 L1075 90 L1125 140 H1260" />
          <path d="M720 185 H770 L805 150 L840 185 H900" />

          <path d="M40 510 C150 460 230 485 330 420 C450 342 550 390 650 320 C760 242 860 280 965 210 C1085 130 1200 170 1330 85" />
          <path d="M65 550 C175 505 245 520 360 465 C475 408 560 440 680 382 C800 325 890 355 1010 280 C1135 202 1218 220 1340 165" />

          <rect x="130" y="370" width="95" height="155" rx="8" opacity="0.45" />
          <rect x="250" y="330" width="130" height="195" rx="8" opacity="0.35" />
          <rect x="1120" y="335" width="110" height="190" rx="8" opacity="0.35" />
          <rect x="1250" y="285" width="140" height="240" rx="8" opacity="0.35" />

          <circle cx="155" cy="280" r="25" opacity="0.5" />
          <path d="M155 305 V430" opacity="0.5" />

          <circle cx="1230" cy="255" r="30" opacity="0.5" />
          <path d="M1230 285 V430" opacity="0.5" />
        </g>
      </svg>

      <div className="absolute top-20 right-[8%] w-80 h-24 rounded-full bg-white/18 blur-2xl" />
      <div className="absolute top-32 left-[12%] w-[28rem] h-28 rounded-full bg-white/14 blur-2xl" />
      <div className="absolute bottom-[-90px] right-[-10%] w-[58%] h-64 rounded-t-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-110px] left-[-8%] w-[58%] h-72 rounded-t-full bg-white/8 blur-2xl" />
    </>
  );
}

function MountainPath() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
    >
      <path
        d="M 80 335 C 180 300, 210 250, 310 250 C 420 250, 420 320, 535 300 C 630 285, 610 190, 735 180 C 840 172, 845 90, 940 70"
        fill="none"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="17"
        strokeLinecap="round"
      />

      <path
        d="M 80 335 C 180 300, 210 250, 310 250 C 420 250, 420 320, 535 300 C 630 285, 610 190, 735 180 C 840 172, 845 90, 940 70"
        fill="none"
        stroke="rgba(15,76,117,0.5)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="14 18"
      />
    </svg>
  );
}

function WeeklySongModalContent({ weeklySong, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-sky-100 p-8 text-center text-slate-500 font-bold">
        טוען את שיר השבוע...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-500 rounded-3xl p-6 font-bold">
        {error}
      </div>
    );
  }

  if (!weeklySong) {
    return (
      <div className="bg-white rounded-3xl border border-sky-100 p-10 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
          <MusicLineIcon />
        </div>

        <h3 className="text-2xl font-black text-slate-800 mt-5">
          עדיין לא נבחר שיר שבועי
        </h3>

        <p className="text-slate-500 mt-2">
          כשהמנהל יבחר שיר, הוא יופיע כאן לתרגול שמיעה.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm">
        <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700">
          <MusicLineIcon />
        </div>

        <h3 className="text-3xl font-black text-slate-900 mt-5">
          {weeklySong.title || weeklySong.theme || "שיר השבוע"}
        </h3>

        <p className="text-slate-500 mt-2">
          רמה: {getLevelLabel(weeklySong.level)} · נושא:{" "}
          {weeklySong.theme || "לא צוין"}
        </p>
      </div>

      <CustomAudioPlayer
        src={apiUrl(`/songs/song/${weeklySong._id}/stream`)}
        title={weeklySong.title || weeklySong.theme || "שיר השבוע"}
        subtitle={`תרגול האזנה · ${getLevelLabel(weeklySong.level)}`}
        allowDownload={false}
      />

      <div className="bg-sky-50 border border-sky-100 rounded-3xl p-5">
        <h4 className="font-black text-sky-800 mb-2">הצעת תרגול</h4>

        <p className="text-slate-600 text-sm leading-relaxed">
          האזיני פעם אחת להבנה כללית, ואז פעם נוספת כדי לזהות שלוש מילים או
          ביטויים חדשים.
        </p>
      </div>
    </div>
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

function BaseIcon({ children }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

function CompassIcon() {
  return (
    <BaseIcon>
      <circle cx="32" cy="32" r="23" />
      <path d="M39 21L34 36L20 43L26 28L39 21Z" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
    </BaseIcon>
  );
}

function BrainLineIcon() {
  return (
    <BaseIcon>
      <path d="M22 18C16 18 12 23 12 29C8 32 8 40 14 43C15 50 23 52 28 48" />
      <path d="M42 18C48 18 52 23 52 29C56 32 56 40 50 43C49 50 41 52 36 48" />
      <path d="M28 16C25 20 25 26 30 30" />
      <path d="M36 16C39 20 39 26 34 30" />
      <path d="M28 48V36" />
      <path d="M36 48V36" />
      <path d="M24 34H40" />
    </BaseIcon>
  );
}

function BotLineIcon() {
  return (
    <BaseIcon>
      <rect x="14" y="22" width="36" height="28" rx="8" />
      <path d="M32 22V12" />
      <circle cx="24" cy="35" r="2" fill="currentColor" />
      <circle cx="40" cy="35" r="2" fill="currentColor" />
      <path d="M25 43H39" />
      <path d="M8 34H14" />
      <path d="M50 34H56" />
    </BaseIcon>
  );
}

function MusicLineIcon() {
  return (
    <BaseIcon>
      <path d="M24 44V18L48 14V38" />
      <circle cx="18" cy="46" r="6" />
      <circle cx="42" cy="40" r="6" />
      <path d="M24 24L48 20" />
    </BaseIcon>
  );
}

function PenLineIcon() {
  return (
    <BaseIcon>
      <path d="M14 48L18 36L42 12L52 22L28 46L14 48Z" />
      <path d="M36 18L46 28" />
      <path d="M18 36L28 46" />
    </BaseIcon>
  );
}

function FinishLineIcon() {
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 text-white" fill="none">
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 54V12" />
        <path d="M20 14H48V36H20" />
        <path d="M28 14V36" />
        <path d="M38 14V36" />
        <path d="M20 24H48" />
      </g>
    </svg>
  );
}