import React, { useState } from "react";
import { createReview } from "../../services/reviewService";

export default function AddReviewModal({ isOpen, onClose, onCreated }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (loading) return;
    setText("");
    setRating(5);
    setError("");
    onClose?.();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (text.trim().length < 10) {
      setError("כתבי המלצה קצת יותר מפורטת, לפחות 10 תווים.");
      return;
    }

    try {
      setLoading(true);

      await createReview({
        text: text.trim(),
        rating,
      });

      setText("");
      setRating(5);
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#082f57]/55 px-4 py-6 backdrop-blur-md"
      dir="rtl"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.2rem] border-2 border-white/45 bg-white shadow-[0_30px_90px_rgba(7,47,88,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(168,216,255,0.55),transparent_34%),radial-gradient(circle_at_100%_100%,rgba(255,212,57,0.28),transparent_32%)]" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute left-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-2xl font-black text-blue-700 transition hover:bg-blue-50"
          aria-label="סגירה"
        >
          ×
        </button>

        <form onSubmit={handleSubmit} className="relative z-10 p-6 md:p-8">
          <div className="mb-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-red-500 bg-white px-4 py-2 text-sm font-black text-red-600">
              💬 המלצה חדשה
            </div>

            <h2 className="text-3xl font-black leading-tight text-blue-700 md:text-4xl">
              ספרי לנו מה אהבת
            </h2>

            <p className="mt-2 text-base font-bold leading-relaxed text-gray-600">
              כתבי כמה מילים קצרות על החוויה שלך באתר.
            </p>
          </div>

          <label className="mb-2 block text-sm font-black text-blue-800">
            דירוג
          </label>

          <div className="mb-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl font-black transition ${
                  rating >= star
                    ? "border-yellow-400 bg-yellow-300 text-blue-800 shadow-sm"
                    : "border-blue-200 bg-white text-gray-300 hover:border-yellow-300 hover:text-yellow-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <label className="mb-2 block text-sm font-black text-blue-800">
            ההמלצה שלך
          </label>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            maxLength={700}
            placeholder="לדוגמה: אהבתי שהאתר עוזר לי לדעת מה לתרגל..."
            className="w-full resize-none rounded-[1.5rem] border-2 border-blue-200 bg-white/90 px-5 py-4 text-lg font-bold leading-8 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-gray-500">
            <span>{text.length}/700</span>
            <span>מינימום 10 תווים</span>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-700">
              {error}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full border-2 border-white bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-6 py-3.5 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.35)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
            >
              {loading ? "שולח..." : "שלחי המלצה"}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-full border-2 border-blue-600 bg-white px-6 py-3.5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}