import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SmartGuideBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const cameFromSmartPath = location.state?.fromSmartPath;

  if (!cameFromSmartPath) return null;

  return (
    <button
      type="button"
      onClick={() =>
        navigate("/dashboard", {
          state: { openSmartPath: true },
        })
      }
      className="mb-5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-5 py-3 rounded-2xl transition-all shadow-md"
    >
      ← חזרה למדריך החכם שלי
    </button>
  );
}