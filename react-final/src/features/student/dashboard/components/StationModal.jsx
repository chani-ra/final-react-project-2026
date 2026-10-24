import "./learningStationTheme.css";
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
      variant="sky"
      title={activeStationData?.title || ""}
      subtitle={activeStationData?.short || ""}
      icon={activeStationData ? <StationIcon iconKey={activeStationData.iconKey} /> : null}
      maxWidth={
        activeStation === "weekly-song"
          ? "max-w-2xl"
          : activeStation === "coach" ? "max-w-4xl" : "max-w-5xl"
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
      <div className="rounded-2xl border border-white/30 ew-sky-inset p-5 text-center font-bold text-white/90 sm:p-7">
        טוען את שיר השבוע...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200/55 bg-red-900/30 p-4 font-bold text-red-100 sm:p-5">
        {error}
      </div>
    );
  }

  if (!weeklySong) {
    return (
      <div className="rounded-2xl border border-white/30 ew-sky-inset p-5 text-center sm:p-7">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-sky-200/20 text-sky-50">
          <MusicIcon large />
        </div>

        <h3 className="mt-4 text-xl font-black text-white">
          עדיין לא נבחר שיר שבועי
        </h3>

        <p className="mt-2 text-sm leading-6 text-sky-50/90">
          כשהמנהל יבחר שיר, הוא יופיע כאן לתרגול שמיעה.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-white/35 ew-sky-panel p-4 shadow-[0_12px_28px_rgba(7,39,75,0.18)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/35 bg-sky-200/20 text-white">
          <MusicIcon large />
        </div>

        <h3 className="mt-3 text-lg font-black text-white sm:text-xl">
          {weeklySong.title || weeklySong.theme || "שיר השבוע"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-sky-50/90">
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

      <div className="rounded-2xl border border-white/30 bg-sky-200/15 p-4">
        <h4 className="mb-2 font-black text-yellow-100">הצעת תרגול</h4>

        <p className="text-sm leading-6 text-sky-50/90">
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