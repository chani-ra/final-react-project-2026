import React, { useEffect, useMemo, useState } from "react";
import {
  approveReview,
  deleteReview,
  getAllReviewsForAdmin,
  rejectReview,
} from "../../services/reviewService";

const filters = [
  { value: "pending", label: "ממתינות" },
  { value: "approved", label: "מאושרות" },
  { value: "rejected", label: "נדחו" },
  { value: "all", label: "הכול" },
];

export default function AdminReviews() {
  const [activeFilter, setActiveFilter] = useState("pending");
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadReviews = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllReviewsForAdmin(activeFilter);
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [activeFilter]);

  const stats = useMemo(() => {
    return {
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
      total: reviews.length,
    };
  }, [reviews]);

  const runAction = async (reviewId, action, successText) => {
    try {
      setActionLoadingId(reviewId);
      setMessage({ type: "", text: "" });

      await action(reviewId);
      await loadReviews();

      setMessage({ type: "success", text: successText });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              בקרת המלצות
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              אישור המלצות לדף הבית
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              כאן המנהל בודק המלצות שנשלחו על ידי משתמשים, ומחליט אילו
              המלצות יוצגו בעמוד הבית של האתר.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 lg:min-w-[430px]">
            <StatBox label="ממתינות" value={stats.pending} tone="yellow" />
            <StatBox label="מאושרות" value={stats.approved} tone="green" />
            <StatBox label="נדחו" value={stats.rejected} tone="red" />
            <StatBox label="סה״כ" value={stats.total} tone="blue" />
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-[1.5rem] border-2 px-5 py-3 text-sm font-black ${
            message.type === "success"
              ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
              : "border-red-300/35 bg-red-500/15 text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
                  activeFilter === filter.value
                    ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
                    : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading ? (
            <LoadingState />
          ) : reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {reviews.map((review) => (
                <ReviewAdminCard
                  key={review._id}
                  review={review}
                  isLoading={actionLoadingId === review._id}
                  onApprove={() =>
                    runAction(
                      review._id,
                      approveReview,
                      "ההמלצה אושרה ותוכל להופיע בדף הבית."
                    )
                  }
                  onReject={() =>
                    runAction(review._id, rejectReview, "ההמלצה נדחתה.")
                  }
                  onDelete={() =>
                    runAction(review._id, deleteReview, "ההמלצה נמחקה.")
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ReviewAdminCard({
  review,
  isLoading,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <article
      className="relative overflow-hidden rounded-[1.8rem] border-2 border-white/18 bg-white/10 p-5 text-white transition hover:border-yellow-300/35 hover:bg-white/13"
      style={{
        boxShadow:
          "0 18px 55px rgba(3,31,61,0.24), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">
              {review.usernameSnapshot || "משתמש"}
            </h2>

            <p className="mt-1 text-sm font-bold text-white/45">
              {getRoleLabel(review.roleSnapshot)} · {getStatusLabel(review.status)}
            </p>
          </div>

          <span className="rounded-full border border-yellow-300/45 bg-yellow-300 px-3 py-1 text-xs font-black text-slate-950">
            {review.rating || 5} / 5
          </span>
        </div>

        <p className="mt-4 rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 text-base font-semibold leading-8 text-white/75">
          {review.text}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={review.status} />

          {review.createdAt && (
            <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-black text-white/50">
              {formatDate(review.createdAt)}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onApprove}
            disabled={isLoading || review.status === "approved"}
            className="rounded-full border-2 border-emerald-300/45 bg-emerald-300/15 px-5 py-2.5 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/25 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isLoading ? "מטפל..." : "אישור"}
          </button>

          <button
            type="button"
            onClick={onReject}
            disabled={isLoading || review.status === "rejected"}
            className="rounded-full border-2 border-yellow-300/45 bg-yellow-300/15 px-5 py-2.5 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25 disabled:cursor-not-allowed disabled:opacity-45"
          >
            דחייה
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading}
            className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-2.5 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              boxShadow: isLoading ? "none" : "0 5px 0 rgba(89,15,20,0.42)",
            }}
          >
            מחיקה
          </button>
        </div>
      </div>
    </article>
  );
}

function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
  };

  return (
    <div
      className={`rounded-[1.25rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-[11px] font-black opacity-75">{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: {
      text: "ממתינה",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    },
    approved: {
      text: "מאושרת",
      className: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    },
    rejected: {
      text: "נדחתה",
      className: "border-red-300/35 bg-red-500/15 text-red-100",
    },
  };

  const item = config[status] || {
    text: status || "לא ידוע",
    className: "border-white/16 bg-white/10 text-white/60",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${item.className}`}
    >
      {item.text}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black text-white">
          טוען המלצות...
        </p>
      </div>
    </div>
  );
}

function EmptyReviews() {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-white/20 bg-white/8 p-10 text-center">
      <h2 className="text-2xl font-black text-white">אין המלצות להצגה</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
        ברגע שמשתמשים ישלחו המלצות, הן יופיעו כאן לאישור.
      </p>
    </div>
  );
}

function getRoleLabel(role) {
  const labels = {
    admin: "מנהל",
    teacher: "מורה",
    student: "תלמיד",
    user: "תלמיד",
  };

  return labels[role] || role || "משתמש";
}

function getStatusLabel(status) {
  const labels = {
    pending: "ממתינה לאישור",
    approved: "מאושרת",
    rejected: "נדחתה",
  };

  return labels[status] || status || "לא ידוע";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}