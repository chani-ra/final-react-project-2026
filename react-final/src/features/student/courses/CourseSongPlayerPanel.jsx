import { createPortal } from "react-dom";
import { apiUrl } from "../../../services/axiosConfig";
import DetailHeaderActions from "../../../components/ui/DetailHeaderActions.jsx";
import AudioPlayerControls from "../../../components/ui/AudioPlayerControls.jsx";
import { useCourseAudio } from "../../general/audio/useCourseAudio.js";
import CourseProgressToggleButton from "./CourseProgressToggleButton.jsx";

function CourseSongControls({ songId, downloadUrl }) {
  const { track, isPlaying, currentTime, duration, volume, playbackRate, error,
    toggle, seek, changeVolume, changeSpeed } = useCourseAudio();
  const selected = track?.id === songId;
  return (
    <AudioPlayerControls
      title={selected ? track.title : "שיר לימודי"}
      subtitle={selected ? track.subtitle : "תרגול האזנה"}
      isPlaying={selected && isPlaying}
      currentTime={selected ? currentTime : 0}
      duration={selected ? duration : 0}
      onToggle={selected ? toggle : undefined}
      onSeek={selected ? seek : undefined}
      volume={volume}
      onVolumeChange={changeVolume}
      playbackRate={playbackRate}
      onSpeedChange={changeSpeed}
      downloadUrl={downloadUrl}
      error={selected ? error : "השיר אינו פעיל. חזרי לרשימה ובחרי אותו מחדש."}
    />
  );
}

export default function CourseSongPlayerPanel({
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

        <div className="relative z-10 p-5 md:p-7">
          <DetailHeaderActions onBack={onClose} onClose={onClose} backLabel="חזרה לשירים" />
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

          <div>
            <CourseSongControls
              songId={activeSong._id}
              downloadUrl={apiUrl(`/songs/song/${activeSong._id}/stream`)}
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
              <CourseProgressToggleButton
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
