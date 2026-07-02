import React from "react";

export function MessageBox({ message }) {
  if (!message?.text) return null;

  return (
    <div
      className={`mb-5 rounded-[1.5rem] px-5 py-4 text-base font-bold shadow-[0_12px_32px_rgba(3,31,61,0.16)] ${
        message.type === "success"
          ? "border border-emerald-300/28 bg-emerald-400/14 text-emerald-100"
          : "border border-red-300/30 bg-red-500/16 text-red-100"
      }`}
    >
      {message.text}
    </div>
  );
}

export function MiniInfoCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="text-sm font-bold text-white/62">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="h-3 w-3 shrink-0 rounded-full bg-[#ffd439] shadow-[0_0_12px_rgba(255,212,57,0.55)]" />

      <span className="min-w-0">
        <span className="block text-sm font-bold leading-5 text-white/58">
          {label}
        </span>

        <span className="block truncate text-base font-extrabold leading-7 text-white">
          {value || "לא צוין"}
        </span>
      </span>
    </div>
  );
}

export function HeaderLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4"
          strokeWidth="3"
        />
        <path
          d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}