import { apiUrl } from "../../../../services/axiosConfig";

import AppModal from "../../../../components/ui/AppModal";
import SmartLearningPath from "./SmartLearningPath";
import StudentBrainMap from "./StudentBrainMap";
import AICoachCard from "./AICoachCard";
import AudioPlayerControls from "../../../../components/ui/AudioPlayerControls.jsx";
import { useCourseAudio } from "../../../general/audio/useCourseAudio.js";

import { StationIcon, MusicIcon } from "../../../general/dashboard/dashboardIcons";

export default function StationModal({
  activeStation,
  activeStationData,
  onClose,
  user,
  weeklySong,
  weeklySongLoading,
  weeklySongError,
}) {
  return (
    <AppModal
      isOpen={!!activeStation}
      onClose={onClose}
      title={activeStationData?.title || ""}
      subtitle={activeStationData?.short || ""}
      icon={activeStationData ? <StationIcon iconKey={activeStationData.iconKey} /> : null}
      maxWidth={
        activeStation === "weekly-song"
          ? "max-w-2xl"
          : activeStation === "coach" ? "max-w-4xl" : "max-w-6xl"
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
  );
}

function WeeklySongModalContent({ weeklySong, loading, error }) {
  const { track, isPlaying, currentTime, duration, volume, playbackRate,
    error: audioError, playSong, toggle, seek, changeVolume, changeSpeed } = useCourseAudio();
  const weeklyId = weeklySong?._id ? `weekly:${weeklySong._id}` : "";
  const isCurrentSong = track?.id === weeklyId;
  const handleWeeklyPlayback = () => {
    if (!weeklySong?._id) return;
    if (isCurrentSong) {
      void toggle();
      return;
    }
    // User-click initiation allows browser audio permission and keeps playback in MainLayout.
    void playSong({
      id: weeklyId,
      title: weeklySong.title || weeklySong.theme || "שיר השבוע",
      subtitle: `שיר השבוע · ${getLevelLabel(weeklySong.level)}`,
      src: apiUrl(`/songs/song/${weeklySong._id}/stream`),
      returnPath: "/dashboard",
      returnLabel: "חזרה לדשבורד",
    });
  };
  if (loading) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-8 text-center font-bold text-slate-500">
        טוען את שיר השבוע...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 font-bold text-red-500">
        {error}
      </div>
    );
  }

  if (!weeklySong) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-10 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-100 bg-sky-50 text-sky-700">
          <MusicIcon large />
        </div>

        <h3 className="mt-5 text-2xl font-black text-slate-800">
          עדיין לא נבחר שיר שבועי
        </h3>

        <p className="mt-2 text-slate-500">
          כשהמנהל יבחר שיר, הוא יופיע כאן לתרגול שמיעה.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
          <MusicIcon large />
        </div>

        <h3 className="mt-3 text-xl font-black text-slate-900">
          {weeklySong.title || weeklySong.theme || "שיר השבוע"}
        </h3>

        <p className="mt-2 text-slate-500">
          רמה: {getLevelLabel(weeklySong.level)} · נושא:{" "}
          {weeklySong.theme || "לא צוין"}
        </p>
      </div>

      <AudioPlayerControls
        title={weeklySong.title || weeklySong.theme || "שיר השבוע"}
        subtitle={`תרגול האזנה · ${getLevelLabel(weeklySong.level)}`}
        isPlaying={isCurrentSong && isPlaying}
        currentTime={isCurrentSong ? currentTime : 0}
        duration={isCurrentSong ? duration : 0}
        onToggle={handleWeeklyPlayback}
        onSeek={isCurrentSong ? seek : undefined}
        volume={volume}
        onVolumeChange={changeVolume}
        playbackRate={playbackRate}
        onSpeedChange={changeSpeed}
        error={isCurrentSong ? audioError : ""}
      />

      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <h4 className="mb-2 font-black text-sky-800">הצעת תרגול</h4>

        <p className="text-sm leading-relaxed text-slate-600">
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