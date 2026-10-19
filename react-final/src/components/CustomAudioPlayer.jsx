import { useRef, useState } from "react";
import AudioPlayerControls from "./ui/AudioPlayerControls.jsx";

/** Standalone preview audio: shares the site's player UI but not learner playback. */
export default function CustomAudioPlayer({
  src,
  title = "Audio",
  subtitle = "",
  allowDownload = false,
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState("");

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      setError("");
      await audio.play();
    } catch (err) {
      console.error("Audio playback failed:", err);
      setError("לא הצלחנו להפעיל את השיר. בדקי שקובץ השמע זמין.");
    }
  };

  const handleVolume = (next) => {
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  };

  const handleSpeed = (next) => {
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const handleSeek = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  return (
    <div>
      <AudioPlayerControls
        title={title}
        subtitle={subtitle}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        onToggle={togglePlay}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolume}
        playbackRate={playbackRate}
        onSpeedChange={handleSpeed}
        downloadUrl={allowDownload ? src : ""}
        error={error}
      />
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="hidden"
        onLoadStart={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          setError("");
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          setDuration(Number.isFinite(seconds) ? seconds : 0);
          event.currentTarget.volume = volume;
          event.currentTarget.playbackRate = playbackRate;
        }}
        onDurationChange={(event) => {
          const seconds = event.currentTarget.duration;
          setDuration(Number.isFinite(seconds) ? seconds : 0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setError("לא הצלחנו לטעון את קובץ השמע. בדקי שהשרת פעיל.")}
      />
    </div>
  );
}
