import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioPlayerControls from "../../../components/ui/AudioPlayerControls.jsx";
import { useCourseAudio } from "./useCourseAudio.js";
import { audioReturnTarget } from "./audioReturnModel.js";

// The single learner player stays mounted while routes inside MainLayout change.
export default function PersistentCoursePlayer() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hoverSuppressed, setHoverSuppressed] = useState(false);
  const expanded = pinned || (hovered && !hoverSuppressed);
  const { track, isPlaying, currentTime, duration, error, toggle, seek, closePlayer } = useCourseAudio();
  if (!track) return null;
  const destination = audioReturnTarget(track);
  return (
    <aside
      dir="rtl"
      aria-label="נגן שירים ברקע"
      className={`fixed bottom-3 right-3 z-[90] transition-[width] duration-200 ${expanded ? "w-[min(32rem,calc(100vw-1.5rem))]" : "w-12"}`}
      onMouseEnter={() => { setHovered(true); setHoverSuppressed(false); }}
      onMouseLeave={() => { setHovered(false); setHoverSuppressed(false); }}
    >
      <div className="flex min-w-0 items-end gap-2">
        <button
          type="button"
          aria-label={expanded ? "מזעור הנגן" : `הצגת נגן השיר: ${track.title || "שיר לימודי"}`}
          aria-expanded={expanded}
          title={expanded ? "מזעור הנגן" : "הצגת נגן השירים"}
          onClick={() => {
            if (expanded) {
              setPinned(false);
              setHoverSuppressed(true);
            } else {
              setPinned(true);
              setHoverSuppressed(false);
            }
          }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-200/30 bg-[#123e60] text-2xl text-[#f3cf83] shadow-[0_5px_18px_rgba(5,34,55,0.3)] transition hover:bg-[#205477] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3cf83]"
        >
          <span aria-hidden="true">♪</span>
          {isPlaying && <span aria-hidden="true" className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-emerald-300 ring-2 ring-[#123e60]" />}
        </button>
        {expanded && (
          <div className="min-w-0 flex-1">
            <AudioPlayerControls
              compact
              title={track.title}
              subtitle={track.subtitle}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onToggle={toggle}
              onSeek={seek}
              onReturn={destination ? () => navigate(destination.path) : undefined}
              returnLabel={destination?.label}
              onClose={closePlayer}
              error={error}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
