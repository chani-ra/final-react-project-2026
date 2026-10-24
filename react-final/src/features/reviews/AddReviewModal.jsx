import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createReview } from "../../services/reviewService";

export default function AddReviewModal({ isOpen, onClose, onCreated }) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textAreaRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === "Escape" && !loading) onClose?.();
    };
    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [isOpen, loading, onClose]);

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
      setError("כתבי המלצה מעט מפורטת יותר, לפחות 10 תווים.");
      return;
    }
    try {
      setLoading(true);
      await createReview({ text: text.trim(), rating });
      setText("");
      setRating(5);
      onCreated?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#072a4b]/75 p-3 backdrop-blur-sm sm:p-5"
      dir="rtl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ew-review-modal-title"
        className="relative w-full max-w-[455px] overflow-hidden rounded-[1.5rem] border border-sky-100/45 bg-gradient-to-br from-[#286b9f] via-[#205d90] to-[#124574] text-white shadow-[0_24px_74px_rgba(4,29,59,0.48)] sm:rounded-[1.8rem]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_2%,rgba(186,225,255,0.26),transparent_44%)]" />
        <form onSubmit={handleSubmit} className="relative max-h-[min(92dvh,740px)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-[#ffbac1]/60 bg-[#e55066]/25 px-3 py-1 text-xs font-bold text-[#ffe0e4]">החוויה שלך חשובה לנו</span>
              <h2 id="ew-review-modal-title" className="mt-2 text-xl font-black leading-tight text-white sm:text-2xl">הוספת המלצה</h2>
              <p className="mt-1 text-sm leading-6 text-sky-50/90">ספרי בכמה מילים איך הייתה חוויית הלמידה שלך.</p>
            </div>
            <button type="button" onClick={handleClose} disabled={loading} aria-label="סגירת חלון המלצה" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/15 text-xl font-bold text-white transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-200 disabled:opacity-50">×</button>
          </div>

          <fieldset className="mb-4">
            <legend className="mb-2 text-sm font-bold text-sky-50">איך היית מדרגת את החוויה?</legend>
            <div className="flex flex-wrap gap-1.5" aria-label="דירוג בין כוכב אחד לחמישה">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star} מתוך 5 כוכבים`}
                  aria-pressed={rating === star}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-200 ${rating >= star ? "border-yellow-200/80 bg-yellow-300/20 text-yellow-200" : "border-white/20 bg-white/10 text-white/40 hover:border-yellow-200/60"}`}
                >★</button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="ew-review-text" className="mb-2 block text-sm font-bold text-sky-50">ההמלצה שלך</label>
          <textarea
            id="ew-review-text"
            ref={textAreaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            maxLength={700}
            placeholder="לדוגמה: אהבתי שהתרגולים מותאמים אליי..."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "ew-review-error" : "ew-review-hint"}
            className="block w-full resize-y rounded-xl border border-sky-100/45 bg-[#103e69]/55 px-3.5 py-3 text-base font-medium leading-7 text-white outline-none transition placeholder:text-sky-100/65 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-200/25"
          />
          <div id="ew-review-hint" className="mt-1.5 flex justify-between gap-3 text-xs text-sky-100/85"><span>לפחות 10 תווים</span><span>{text.length}/700</span></div>

          {error && <p id="ew-review-error" role="alert" className="mt-3 rounded-lg border border-red-200/60 bg-red-900/25 px-3 py-2 text-sm font-semibold text-white">{error}</p>}

          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
            <button type="button" onClick={handleClose} disabled={loading} className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-50 sm:flex-1">ביטול</button>
            <button type="submit" disabled={loading} className="rounded-xl border border-[#ffc4ca]/60 bg-gradient-to-b from-[#f66a7d] to-[#c73c54] px-5 py-2.5 text-sm font-black text-white shadow-[0_5px_14px_rgba(80,20,48,0.25)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-200 disabled:opacity-60 sm:flex-[1.5]">{loading ? "שולחת..." : "שליחת המלצה"}</button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}
