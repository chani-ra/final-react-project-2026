import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getWeeklySong } from "../../../services/songService";

import DashboardHeader from "./components/DashboardHeader";
import JourneyMap from "../../general/dashboard/JourneyMap";
import StationModal from "./components/StationModal";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const userData = user;

  const [weeklySong, setWeeklySong] = useState(null);
  const [weeklySongLoading, setWeeklySongLoading] = useState(true);
  const [weeklySongError, setWeeklySongError] = useState("");
  const [activeStation, setActiveStation] = useState(null);

  useEffect(() => {
    let active = true;
    getWeeklySong()
      .then((song) => {
        if (active) setWeeklySong(song);
      })
      .catch((error) => {
        if (active) setWeeklySongError(error.toString());
      })
      .finally(() => {
        if (active) setWeeklySongLoading(false);
      });
    return () => { active = false; };
  }, []);

  const profile = useMemo(() => {
    const name = userData?.username || userData?.name || "תלמידה";
    const level = userData?.englishLevel || userData?.level || "beginner";
    const expectations = userData?.expectations || [];

    return { name, level, expectations };
  }, [userData]);

  const stations = useMemo(
    () => [
      {
        id: "smart-guide",
        number: 1,
        title: "המדריך החכם",
        short: "תכנון יומי חכם",
        iconKey: "compass",
      },
      {
        id: "brain-map",
        number: 2,
        title: "מפת הלמידה",
        short: "חוזקות וחולשות",
        iconKey: "brain",
      },
      {
        id: "coach",
        number: 3,
        title: "מאמן אישי",
        short: "עזרה לפי קושי",
        iconKey: "bot",
        glow: true,
      },
      {
        id: "weekly-song",
        number: 4,
        title: "שיר שבועי",
        short: "תרגול שמיעה",
        iconKey: "music",
      },
      {
        id: "courses",
        number: 5,
        title: "הקורסים שלי",
        short: "שיעורים ותרגול",
        iconKey: "book",
      },
      {
        id: "writing",
        number: 6,
        title: "מאמן כתיבה",
        short: "כתיבה ומשוב",
        iconKey: "pen",
      },
    ],
    []
  );

  const activeStationData = stations.find(
    (station) => station.id === activeStation
  );

  const openStation = (stationId) => {
    if (stationId === "courses") {
      navigate("/courses");
      return;
    }

    if (stationId === "writing") {
      navigate("/writing");
      return;
    }

    setActiveStation(stationId);
  };

  if (!userData) {
    return (
      <div
        className="flex min-h-[55vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/30 bg-[#062f52]/70 px-10 py-7 text-xl font-black shadow-[0_0_45px_rgba(255,255,255,0.24)] backdrop-blur-xl">
          טוען נתוני תלמידה...
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative min-h-[690px] overflow-hidden rounded-[2.4rem] border border-white/35 bg-[#46b9ef]/18 shadow-[0_32px_95px_rgba(8,72,116,0.28),inset_0_1px_0_rgba(255,255,255,0.22)]"
      dir="rtl"
    >
      <DashboardHeader
        name={profile.name}
        level={profile.level}
        expectations={profile.expectations}
        onGoToCourses={() => navigate("/courses")}
      />

      <JourneyMap stations={stations} onStationClick={openStation} />

      <StationModal
        activeStation={activeStation}
        activeStationData={activeStationData}
        onClose={() => setActiveStation(null)}
        user={userData}
        weeklySong={weeklySong}
        weeklySongLoading={weeklySongLoading}
        weeklySongError={weeklySongError}
      />
    </section>
  );
}