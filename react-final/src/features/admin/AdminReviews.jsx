import React, { useEffect, useState } from "react";
import {
  approveReview,
  deleteReview,
  getAllReviewsForAdmin,
  rejectReview,
} from "../../services/reviewService";
import AppFeedbackModal from "../../components/ui/AppFeedbackModal";

const filters = [
  { value: "pending", label: "ממתינות" },
  { value: "approved", label: "מאושרות" },
  { value: "rejected", label: "נדחו" },
  { value: "all", label: "הכול" },
];

const statusLabels = {
  pending: "ממתינה",
  approved: "מאושרת",
  rejected: "נדחתה",
};

const statusClasses = {
  pending: "border-[#ffd439]/45 bg-[#ffd439]/16 text-[#ffe89a]",
  approved: "border-emerald-300/40 bg-emerald-400/15 text-emerald-100",
  rejected: "border-red-300/40 bg-red-400/15 text-red-100",
};

export default function AdminReviews() {
  const [activeFilter, setActiveFilter] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    review: null,
    note: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    review: null,
  });

  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviewsForAdmin(activeFilter);
      setReviews(data);
    } catch (error) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "שגיאה בטעינת המלצות",
        message: error.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [activeFilter]);

  const handleApprove = async (reviewId) => {
    try {
      setActionLoadingId(reviewId);
      await approveReview(reviewId);

      setFeedback({
        isOpen: true,
        type: "success",
        title: "ההמלצה אושרה",
        message: "ההמלצה תופיע באזור ההמלצות באתר.",
      });

      await loadReviews();
    } catch (error) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "שגיאה באישור",
        message: error.toString(),
      });
    } finally {
      setActionLoadingId("");
    }
  };

  const openRejectModal = (review) => {
    setRejectModal({
      isOpen: true,
      review,
      note: "",
    });
  };

  const closeRejectModal = () => {
    if (actionLoadingId) return;

    setRejectModal({
      isOpen: false,
      review: null,
      note: "",
    });
  };

  const submitReject = async () => {
    if (!rejectModal.review?._id) return;

    try {
      setActionLoadingId(rejectModal.review._id);

      await rejectReview(rejectModal.review._id, rejectModal.note.trim());

      setRejectModal({
        isOpen: false,
        review: null,
        note: "",
      });

      setFeedback({
        isOpen: true,
        type: "success",
        title: "ההמלצה נדחתה",
        message: "ההמלצה לא תוצג באתר.",
      });

      await loadReviews();
    } catch (error) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "שגיאה בדחייה",
        message: error.toString(),
      });
    } finally {
      setActionLoadingId("");
    }
  };

  const openDeleteModal = (review) => {
    setDeleteModal({
      isOpen: true,
      review,
    });
  };

  const closeDeleteModal = () => {
    if (actionLoadingId) return;

    setDeleteModal({
      isOpen: false,
      review: null,
    });
  };

  const submitDelete = async () => {
    if (!deleteModal.review?._id) return;

    try {
      setActionLoadingId(deleteModal.review._id);

      await deleteReview(deleteModal.review._id);

      setDeleteModal({
        isOpen: false,
        review: null,
      });

      setFeedback({
        isOpen: true,
        type: "success",
        title: "ההמלצה נמחקה",
        message: "היא הוסרה מהמערכת.",
      });

      await loadReviews();
    } catch (error) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "שגיאה במחיקה",
        message: error.toString(),
      });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-7" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/30 bg-[#123c6b]/82 p-6 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.14),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_55%)]" />

        <div className="relative z-10">
          <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/35 bg-[#ffd439]/16 px-4 py-2 text-sm font-black text-[#ffe89a]">
            ניהול המלצות
          </div>

          <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
            אישור המלצות לאתר
          </h1>

          <p className="mt-3 max-w-3xl text-base font-semibold leading-8 text-white/72">
            כאן אפשר לעבור על המלצות שנשלחו, לאשר אותן, לדחות אותן או למחוק
            אותן בצורה מסודרת.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
              activeFilter === filter.value
                ? "border-[#ffd439] bg-[#ffd439] text-[#123c6b] shadow-[0_8px_22px_rgba(255,212,57,0.22)]"
                : "border-white/20 bg-[#061f36]/54 text-white hover:bg-[#061f36]/72"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-white/22 bg-[#061f36]/64 p-10 text-center text-xl font-black text-white shadow-xl">
          טוען המלצות...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-[2rem] border-2 border-dashed border-white/25 bg-[#061f36]/54 p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl font-black">אין המלצות להצגה</h2>
          <p className="mt-2 text-white/65">
            כשהמשתמשות ישלחו המלצות הן יופיעו כאן.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="relative overflow-hidden rounded-[2.2rem] border border-white/24 bg-[#061f36]/68 p-6 text-white shadow-[0_28px_80px_rgba(3,31,61,0.34),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.10),transparent_32%)]" />

              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {review.usernameSnapshot}
                    </h2>

                    <p className="mt-1 text-sm font-bold text-white/58">
                      תפקיד: {review.roleSnapshot} · נשלח בתאריך{" "}
                      {new Date(review.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${
                      statusClasses[review.status] ||
                      "border-white/20 bg-white/10 text-white"
                    }`}
                  >
                    {statusLabels[review.status] || review.status}
                  </span>
                </div>

                <div className="mb-3 text-lg text-[#ffd439]">
                  {"★".repeat(review.rating || 5)}
                  <span className="text-white/20">
                    {"★".repeat(5 - (review.rating || 5))}
                  </span>
                </div>

                <p className="rounded-[1.7rem] border border-white/14 bg-white/8 p-5 text-lg font-semibold leading-8 text-white/78">
                  {review.text}
                </p>

                {review.adminNote && (
                  <div className="mt-4 rounded-2xl border border-red-200/20 bg-red-500/12 p-4 text-sm font-bold text-red-100">
                    הערה: {review.adminNote}
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {review.status !== "approved" && (
                    <button
                      type="button"
                      disabled={actionLoadingId === review._id}
                      onClick={() => handleApprove(review._id)}
                      className="flex-1 rounded-full border-2 border-emerald-300/40 bg-emerald-400 px-5 py-3 text-sm font-black text-[#123c6b] transition hover:-translate-y-1 hover:bg-emerald-300 disabled:opacity-60"
                    >
                      {actionLoadingId === review._id ? "מטפל..." : "אשרי"}
                    </button>
                  )}

                  {review.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={actionLoadingId === review._id}
                      onClick={() => openRejectModal(review)}
                      className="flex-1 rounded-full border-2 border-[#ffd439]/55 bg-[#ffd439]/16 px-5 py-3 text-sm font-black text-[#ffe89a] transition hover:-translate-y-1 hover:bg-[#ffd439]/24 disabled:opacity-60"
                    >
                      דחי
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={actionLoadingId === review._id}
                    onClick={() => openDeleteModal(review)}
                    className="flex-1 rounded-full border-2 border-red-300/30 bg-red-500/85 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-red-500 disabled:opacity-60"
                  >
                    מחקי
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <RejectReviewModal
        isOpen={rejectModal.isOpen}
        note={rejectModal.note}
        loading={Boolean(actionLoadingId)}
        onChangeNote={(value) =>
          setRejectModal((prev) => ({ ...prev, note: value }))
        }
        onClose={closeRejectModal}
        onSubmit={submitReject}
      />

      <DeleteReviewModal
        isOpen={deleteModal.isOpen}
        loading={Boolean(actionLoadingId)}
        onClose={closeDeleteModal}
        onSubmit={submitDelete}
      />

      <AppFeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        primaryText="אישור"
        onClose={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
        onPrimary={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

function RejectReviewModal({
  isOpen,
  note,
  loading,
  onChangeNote,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#031f3d]/62 px-4 py-6 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.3rem] border border-white/30 bg-[#123c6b]/96 p-6 text-white shadow-[0_35px_100px_rgba(3,31,61,0.58),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black">דחיית המלצה</h2>

          <p className="mt-3 text-base font-semibold leading-8 text-white/70">
            אפשר לכתוב הערה קצרה לדחייה. לא חובה.
          </p>

          <textarea
            value={note}
            onChange={(event) => onChangeNote(event.target.value)}
            rows={4}
            placeholder="הערה פנימית, אם רוצים..."
            className="mt-5 w-full resize-none rounded-[1.5rem] border-2 border-white/18 bg-white/10 px-5 py-4 text-base font-bold leading-8 text-white outline-none placeholder:text-white/38 focus:border-[#ffd439]/70"
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className="flex-1 rounded-full border-2 border-[#ffd439]/55 bg-[#ffd439] px-6 py-3.5 text-sm font-black text-[#123c6b] transition hover:-translate-y-1 disabled:opacity-60"
            >
              {loading ? "דוחה..." : "דחי המלצה"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-white/24 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/16 disabled:opacity-60"
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteReviewModal({ isOpen, loading, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#031f3d]/62 px-4 py-6 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2.3rem] border border-white/30 bg-[#123c6b]/96 p-6 text-white shadow-[0_35px_100px_rgba(3,31,61,0.58),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.14),transparent_32%)]" />

        <div className="relative z-10">
          <h2 className="text-3xl font-black">מחיקת המלצה</h2>

          <p className="mt-3 text-base font-semibold leading-8 text-white/70">
            פעולה זו תסיר את ההמלצה מהמערכת.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className="flex-1 rounded-full border-2 border-red-300/35 bg-red-500 px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-red-400 disabled:opacity-60"
            >
              {loading ? "מוחק..." : "מחקי"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-white/24 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/16 disabled:opacity-60"
            >
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}