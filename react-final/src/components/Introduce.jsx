import React, { useEffect, useState } from "react";
import skyJourneyBackground from "../assets/sky-journey-background.svg";

export default function Introduce() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startExit = setTimeout(() => {
      setLeaving(true);
    }, 2300);

    const removeIntro = setTimeout(() => {
      setShow(false);
    }, 3100);

    return () => {
      clearTimeout(startExit);
      clearTimeout(removeIntro);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#55b9ef] transition-all duration-700 ${
        leaving ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      dir="ltr"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0b5e9b]/10 via-[#0b4f88]/25 to-[#061f36]/65" />

      <div className="absolute inset-8 rounded-[3rem] border-2 border-white/24 bg-[#061f36]/36 shadow-[0_35px_110px_rgba(3,31,61,0.48),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm" />

      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 1400 800" fill="none">
          <path
            d="M-80 610 C150 490 270 560 470 410 C660 270 780 350 990 210 C1130 115 1260 150 1480 45"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M-60 720 C160 610 310 645 520 520 C730 395 860 440 1080 315 C1230 230 1320 250 1490 170"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="mb-7 h-1.5 w-32 rounded-full bg-[#ffd439] shadow-[0_0_28px_rgba(255,212,57,0.55)]" />

        <h1
          className="select-none text-[clamp(4.5rem,14vw,13rem)] font-black leading-none tracking-[-0.08em] text-white"
          style={{
            textShadow:
              "7px 7px 0 rgba(184,50,42,0.55), -2px -2px 0 rgba(15,76,117,0.95), 0 25px 60px rgba(0,0,0,0.42)",
            animation: "introTitle 1.05s ease-out both",
          }}
        >
          EnglishWise
        </h1>

        <p
          className="mt-6 text-[clamp(1rem,2vw,1.65rem)] font-extrabold tracking-[0.24em] text-[#ffe89a]"
          style={{
            animation: "introSubtitle 1.1s ease-out 0.5s both",
          }}
        >
          LEARN SMARTER
        </p>
      </div>

      <style>
        {`
          @keyframes introTitle {
            0% {
              opacity: 0;
              transform: translateY(34px) scale(0.92);
              filter: blur(10px);
            }
            65% {
              opacity: 1;
              transform: translateY(0) scale(1.025);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes introSubtitle {
            0% {
              opacity: 0;
              transform: translateY(16px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}