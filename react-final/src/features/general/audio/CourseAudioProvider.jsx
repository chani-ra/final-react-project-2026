import { useRef, useState } from "react";
import { CourseAudioContext } from "./courseAudioContext.js";

// A single HTMLAudioElement stays mounted while protected routes change.
// It is cleared when MainLayout unmounts (e.g. logging out).
export default function CourseAudioProvider({ children }) {
  const audioRef = useRef(null);
  const playbackRequestRef = useRef(0);
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState("");

  const playSong = async (next) => {
    const audio = audioRef.current;
    if (!audio || !next?.id || !next?.src) return;
    const requestId = ++playbackRequestRef.current;
    if (track?.id !== next.id || track?.src !== next.src) {
      audio.src = next.src;
      audio.load();
      audio.volume = volume;
      audio.playbackRate = playbackRate;
      setCurrentTime(0);
      setDuration(0);
    }
    setTrack(next);
    setError("");
    try {
      // Called from the user's button click, not a delayed React effect.
      await audio.play();
    } catch (err) {
      if (requestId !== playbackRequestRef.current) return;
      setIsPlaying(false);
      setError("לא ניתן להפעיל את השיר כרגע. ניתן לנסות שוב באמצעות כפתור ההשמעה.");
      console.error("Course audio playback failed", err);
    }
  };
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (!audio.paused) audio.pause();
    else {
      try { await audio.play(); }
      catch (err) {
        setError("לא ניתן להפעיל את השיר כרגע.");
        console.error("Course audio playback failed", err);
      }
    }
  };
  const seek = (seconds) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(seconds)) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };
  const changeVolume = (next) => {
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  };
  const changeSpeed = (next) => {
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };
  const closePlayer = () => {
    ++playbackRequestRef.current;
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.removeAttribute("src"); audio.load(); }
    setTrack(null);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  };
  return (
    <CourseAudioContext.Provider value={{ track, isPlaying, currentTime, duration, volume,
      playbackRate, error, playSong, toggle, seek, changeVolume, changeSpeed, closePlayer }}>
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onDurationChange={(event) => {
          const seconds = event.currentTarget.duration;
          setDuration(Number.isFinite(seconds) ? seconds : 0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onError={() => setError("קובץ השיר לא זמין להשמעה כרגע.")}
      />
    </CourseAudioContext.Provider>
  );
}
