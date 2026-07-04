import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import AddReviewModal from "./AddReviewModal";
import AppFeedbackModal from "../../components/ui/AppFeedbackModal";
import { getApprovedReviews } from "../../services/reviewService";
import skyJourneyBackground from "../../assets/sky-journey-background.svg";

const fallbackReviews = [
  {
    _id: "demo-1",
    usernameSnapshot: "מורה לאנגלית",
    roleSnapshot: "teacher",
    rating: 5,
    text: "המערכת מסודרת וברורה, וקל לבנות בה שיעורים, תרגילים ובחנים.",
  },
  {
    _id: "demo-2",
    usernameSnapshot: "תלמידה",
    roleSnapshot: "student",
    rating: 5,
    text: "אהבתי שהאתר מכוון אותי מה כדאי ללמוד ולא נותן לי להסתבך לבד.",
  },
  {
    _id: "demo-3",
    usernameSnapshot: "מורה",
    roleSnapshot: "teacher",
    rating: 5,
    text: "השילוב בין קורסים, משימות וכלי AI הופך את הלמידה להרבה יותר אישית.",
  },
];

export default function ReviewsSection() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const actuallyLoggedIn = Boolean(
    isAuthenticated || user || localStorage.getItem("token")
  );

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getApprovedReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const reviewsToDisplay = reviews.length > 0 ? reviews : fallbackReviews;

  const visibleReviews = useMemo(() => {
    if (showAll) return reviewsToDisplay;
    return reviewsToDisplay.slice(0, 3);
  }, [reviewsToDisplay, showAll]);

  const handleAddClick = () => {
    if (!actuallyLoggedIn) {
      setFeedback({
        isOpen: true,
        type: "warning",
        title: "כדי להוסיף המלצה צריך להתחבר",
        message: "אחרי התחברות תוכלי לכתוב המלצה קצרה על האתר.",
      });
      return;
    }

    setIsAddOpen(true);
  };

  const handleCreated = () => {
    setFeedback({
      isOpen: true,
      type: "success",
      title: "תודה רבה!",
      message: "ההמלצה נשלחה בהצלחה.",
    });

    loadReviews();
  };

  return (
    <section className="relative z-10 px-4 py-10 md:px-6 md:py-14" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative min-h-[520px] overflow-hidden rounded-[2.4rem] border border-white/35 bg-[#46b9ef]/18 shadow-[0_32px_95px_rgba(8,72,116,0.28),inset_0_1px_0_rgba(255,255,255,0.22)]"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8,72,116,0.08), rgba(8,72,116,0.18)), url(${skyJourneyBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[#0b4f88]/20" />

          <HeaderLines />

          <div className="relative z-10 p-4 md:p-6">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/78 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

              <div className="relative z-10 p-5 md:p-7">
                <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
                      משתמשות מספרות ⭐
                    </div>

                    <h2
                      className="text-3xl font-extrabold leading-tight text-white md:text-5xl"
                      style={{
                        textShadow:
                          "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
                      }}
                    >
                      מה אומרות על EnglishWise?
                    </h2>

                    <p className="mt-3 max-w-4xl text-base font-semibold leading-8 text-white/76">
                      הצצה קצרה לחוויית הלמידה באתר — מצד תלמידות ומורות.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="w-full rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-7 py-3.5 text-base font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none xl:w-auto"
                  >
                    הוסיפי המלצה ✨
                  </button>
                </div>

                {loading ? (
                  <div className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-8 text-center text-xl font-black text-white shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
                    טוען המלצות...
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-3">
                      {visibleReviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>

                    {reviewsToDisplay.length > 3 && (
                      <div className="mt-7 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowAll((prev) => !prev)}
                          className="rounded-full border-2 border-[#ffd439]/55 bg-[#ffd439]/18 px-7 py-3 text-sm font-black text-[#ffe89a] transition hover:-translate-y-1 hover:bg-[#ffd439]/24"
                        >
                          {showAll ? "הציגי פחות" : "הציגי עוד המלצות"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddReviewModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={handleCreated}
      />

      <AppFeedbackModal
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        primaryText={feedback.type === "warning" ? "להתחברות" : "סגור"}
        secondaryText={feedback.type === "warning" ? "לא עכשיו" : ""}
        onPrimary={() => {
          if (feedback.type === "warning") {
            setFeedback((prev) => ({ ...prev, isOpen: false }));
            navigate("/login");
            return;
          }

          setFeedback((prev) => ({ ...prev, isOpen: false }));
        }}
        onSecondary={() =>
          setFeedback((prev) => ({ ...prev, isOpen: false }))
        }
        onClose={() => setFeedback((prev) => ({ ...prev, isOpen: false }))}
      />
    </section>
  );
}

function HeaderLines() {
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