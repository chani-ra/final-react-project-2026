import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  approveReview,
  deleteReview,
  getAllReviewsForAdmin,
  rejectReview,
} from "../../services/reviewService";

const filters = [
  { value: "all", label: "הכול" },
  { value: "pending", label: "ממתינות" },
  { value: "approved", label: "מאושרות" },
  { value: "rejected", label: "נדחו" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    text: "",
    confirmText: "",
    action: null,
    reviewId: "",
  });

  const loadReviews = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllReviewsForAdmin("all");
      setReviews(normalizeReviewsResponse(data));
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const counts = useMemo(() => {
    return {
      all: reviews.length,
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
    };
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    let list = reviews;

    if (activeFilter !== "all") {
      list = reviews.filter((review) => review.status === activeFilter);
    }

    if (!search) return list;

    return list.filter((review) => {
      return (
        getReviewerName(review).toLowerCase().includes(search) ||
        getReviewText(review).toLowerCase().includes(search) ||
        getRoleLabel(review.roleSnapshot || review.role).toLowerCase().includes(search)
      );
    });
  }, [reviews, activeFilter, searchQuery]);

  const openConfirmModal = ({ reviewId, title, text, confirmText, action }) => {
    setConfirmModal({
      isOpen: true,
      reviewId,
      title,
      text,
      confirmText,
      action,
    });
  };

  const closeConfirmModal = () => {
    if (actionLoadingId) return;

    setConfirmModal({
      isOpen: false,
      title: "",
      text: "",
      confirmText: "",
      action: null,
      reviewId: "",
    });
  };

  const runAction = async () => {
    if (!confirmModal.action || !confirmModal.reviewId) return;

    try {
      setActionLoadingId(confirmModal.reviewId);
      setMessage({ type: "", text: "" });

      await confirmModal.action(confirmModal.reviewId);
      await loadReviews();

      setMessage({
        type: "success",
        text: "הפעולה בוצעה בהצלחה.",
      });

      closeConfirmModal();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <section
        className="relative overflow-hidden rounded-[2.1rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              reviews control
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              ניהול המלצות
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              אישור, דחייה או מחיקה של המלצות משתמשים לפני שהן מוצגות באתר.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReviews}
            className="w-fit rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            רענון המלצות
          </button>
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
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
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
                  {filter.label} ({counts[filter.value]})
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="חיפוש לפי שם, תוכן או תפקיד..."
              className="w-full rounded-full border-2 border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15 lg:w-[340px]"
            />
          </div>

          {loading ? (
            <LoadingState />
          ) : visibleReviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <ReviewsTable
              reviews={visibleReviews}
              actionLoadingId={actionLoadingId}
              onApprove={(reviewId) =>
                openConfirmModal({
                  reviewId,
                  title: "אישור המלצה",
                  text: "לאשר את ההמלצה ולהציג אותה באתר?",
                  confirmText: "אישור",
                  action: approveReview,
                })
              }
              onReject={(reviewId) =>
                openConfirmModal({
                  reviewId,
                  title: "דחיית המלצה",
                  text: "לדחות את ההמלצה כך שלא תוצג באתר?",
                  confirmText: "דחייה",
                  action: rejectReview,
                })
              }
              onDelete={(reviewId) =>
                openConfirmModal({
                  reviewId,
                  title: "מחיקת המלצה",
                  text: "למחוק את ההמלצה לצמיתות?",
                  confirmText: "מחיקה",
                  action: deleteReview,
                })
              }
            />
          )}
        </div>
      </section>

      {confirmModal.isOpen && (
        <ConfirmActionModal
          title={confirmModal.title}
          text={confirmModal.text}
          confirmText={confirmModal.confirmText}
          isLoading={Boolean(actionLoadingId)}
          onConfirm={runAction}
          onCancel={closeConfirmModal}
        />
      )}
    </div>
  );
}

function ReviewsTable({
  reviews,
  actionLoadingId,
  onApprove,
  onReject,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border-2 border-white/14 bg-slate-950/45">
      <div className="max-h-[620px] overflow-auto">
        <table className="w-full min-w-[980px] text-right">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-white/12 bg-slate-950 text-xs font-black text-white/62">
              <th className="px-4 py-4">שם</th>
              <th className="px-4 py-4">תפקיד</th>
              <th className="px-4 py-4">דירוג</th>
              <th className="px-4 py-4">תוכן ההמלצה</th>
              <th className="px-4 py-4">סטטוס</th>
              <th className="px-4 py-4">תאריך</th>
              <th className="px-4 py-4 text-left">פעולות</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/8 text-sm">
            {reviews.map((review) => {
              const isLoading = actionLoadingId === review._id;

              return (
                <tr key={review._id} className="transition hover:bg-white/8">
                  <td className="px-4 py-4 font-black text-white">
                    {getReviewerName(review)}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {getRoleLabel(review.roleSnapshot || review.role)}
                  </td>

                  <td className="px-4 py-4">
                    <span className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-100">
                      {review.rating || 5} / 5
                    </span>
                  </td>

                  <td className="max-w-[350px] px-4 py-4 text-white/66">
                    <span className="line-clamp-2 leading-6">
                      {getReviewText(review)}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={review.status} />
                  </td>

                  <td className="px-4 py-4 text-white/55">
                    {formatDate(review.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(review._id)}
                        disabled={isLoading || review.status === "approved"}
                        className="rounded-full border border-emerald-300/35 bg-emerald-300/12 px-4 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/20 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        אישור
                      </button>

                      <button
                        type="button"
                        onClick={() => onReject(review._id)}
                        disabled={isLoading || review.status === "rejected"}
                        className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100 transition hover:bg-yellow-300/25 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        דחייה
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(review._id)}
                        disabled={isLoading}
                        className="rounded-full border border-red-300/35 bg-red-500/15 px-4 py-2 text-xs font-black text-red-100 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {isLoading ? "מטפל..." : "מחיקה"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConfirmActionModal({
  title,
  text,
  confirmText,
  isLoading,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 p-4"
      dir="rtl"
    >
      <div
        className="w-full max-w-md rounded-[2rem] border-2 border-white/20 bg-slate-950 p-6 text-white shadow-2xl"
        style={{
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="mb-4 rounded-full border border-red-300/30 bg-red-500/15 px-4 py-2 text-center text-sm font-black text-red-100">
          פעולה ניהולית
        </div>

        <h2 className="text-center text-2xl font-black text-white">{title}</h2>

        <p className="mt-4 text-center text-sm font-semibold leading-7 text-white/65">
          {text}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              boxShadow: isLoading ? "none" : "0 6px 0 rgba(89,15,20,0.42)",
            }}
          >
            {isLoading ? "מבצע..." : confirmText}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-full border-2 border-white/16 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-60"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: "ממתינה",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    },
    approved: {
      label: "מאושרת",
      className: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    },
    rejected: {
      label: "נדחתה",
      className: "border-red-300/35 bg-red-500/15 text-red-100",
    },
  };

  const item = config[status] || {
    label: status || "לא ידוע",
    className: "border-white/16 bg-white/10 text-white/60",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black">טוען המלצות...</p>
      </div>
    </div>
  );
}

function EmptyReviews() {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-white/18 bg-white/8 p-10 text-center">
      <h2 className="text-2xl font-black text-white">אין המלצות להצגה</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/58">
        אין המלצות שמתאימות לסינון או לחיפוש שבחרת.
      </p>
    </div>
  );
}

function normalizeReviewsResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getReviewerName(review) {
  return (
    review.usernameSnapshot ||
    review.user?.username ||
    review.username ||
    review.name ||
    "משתמש"
  );
}

function getReviewText(review) {
  return review.text || review.content || review.body || "";
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

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}