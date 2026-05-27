import React, { useEffect, useRef, useState } from "react";

export default function CustomAudioPlayer({
  src,
  title = "Audio",
  subtitle = "",
  allowDownload = true,
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [speed, setSpeed] = useState(1);

  // איפוס הנגן כאשר מתחלף קובץ שמע
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = speed;
    }
  }, [src]);

  // הפעלה או עצירה של השמע
  const togglePlay = async () => {
    if (!audioRef.current || !src) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio play error:", error);
    }
  };

  // שינוי מיקום ההשמעה
  const handleSeek = (e) => {
    const newTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setCurrentTime(newTime);
  };

  // שינוי ווליום
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // שינוי מהירות השמעה
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);

    setSpeed(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  // חזרה להתחלה
  const restartAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  // הורדת קובץ השמע
  const downloadAudio = () => {
    if (!src) return;

    const link = document.createElement("a");
    link.href = src;
    link.download = `${title || "audio"}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // עיצוב זמן לתצוגה
  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  const progressPercent = duration ? Math.round((currentTime / duration) * 100) : 0;

  return (
    <div className="bg-slate-950/80 border border-white/10 rounded-3xl p-5 shadow-xl">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-xl font-black text-white truncate">{title}</h3>

          {subtitle && (
            <p className="text-gray-400 text-sm mt-1 truncate">{subtitle}</p>
          )}
        </div>

        <div className="bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
          {progressPercent}% הושמע
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="w-14 h-14 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xl font-black transition-all shadow-lg"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          type="button"
          onClick={restartAudio}
          className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          title="חזרה להתחלה"
        >
          ↺
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-emerald-400 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <label className="block text-xs text-gray-400 font-bold mb-2">
            מהירות
          </label>

          <select
            value={speed}
            onChange={handleSpeedChange}
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-2 text-white outline-none"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
          <label className="block text-xs text-gray-400 font-bold mb-2">
            ווליום
          </label>

          <div className="flex items-center gap-2">
            <span className="text-sm">🔈</span>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-emerald-400 cursor-pointer"
            />

            <span className="text-sm">🔊</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-end">
          <button
            type="button"
            onClick={downloadAudio}
            disabled={!allowDownload}
            className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2 rounded-xl transition-all"
          >
            הורדה ⬇️
          </button>
        </div>
      </div>
    </div>
  );
}