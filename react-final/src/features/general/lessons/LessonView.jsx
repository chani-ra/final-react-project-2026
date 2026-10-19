import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axiosConfig, { apiUrl } from "../../../services/axiosConfig";
import useCourseReturn from "../navigation/useCourseReturn.js";
import DetailHeaderActions from "../../../components/ui/DetailHeaderActions.jsx";

// Shared by initial loading and the existing manual Retry button.
async function requestLesson(lessonId, isTeacherPreview) {
  const endpoint = isTeacherPreview
    ? `/lessons/manage/${lessonId}`
    : `/lessons/${lessonId}`;
  const response = await axiosConfig.get(endpoint);
  return {
    lesson: response.data?.lesson || response.data,
    previewToken: isTeacherPreview ? response.data?.previewToken || "" : "",
  };
}

function getLessonError(err) {
  if (err?.code === "ERR_NETWORK") {
    return "לא הצלחתי להתחבר לשרת. בדקי שהשרת פעיל ושהכתובת מוגדרת נכון.";
  }
  return err?.response?.data?.message || err?.message || "אירעה שגיאה בטעינת השיעור.";
}

export default function LessonView({ mode = "teacher" }) {
  const isTeacherPreview = mode === "teacher";
  const { lessonId } = useParams();
  const { goBack, returnLabel } = useCourseReturn("lessons", { teacherPreview: isTeacherPreview });

  const [lesson, setLesson] = useState(null);
  const [previewToken, setPreviewToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await requestLesson(lessonId, isTeacherPreview);
      setLesson(result.lesson);
      setPreviewToken(result.previewToken);
    } catch (err) {
      console.error("שגיאה בטעינת השיעור:", err);
      setError(getLessonError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lessonId) return;
    let active = true;
    requestLesson(lessonId, isTeacherPreview)
      .then((result) => {
        if (!active) return;
        setLesson(result.lesson);
        setPreviewToken(result.previewToken);
      })
      .catch((err) => {
        if (!active) return;
        console.error("שגיאה בטעינת השיעור:", err);
        setError(getLessonError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [lessonId, isTeacherPreview]);

  const videoSrc = useMemo(() => {
    if (!lesson?.videoFileName) return "";

    const id = lesson._id || lessonId;
    if (!isTeacherPreview) return apiUrl(`/lessons/${id}/stream`);
    if (!previewToken) return "";

    return apiUrl(
      `/lessons/manage/${id}/stream?token=${encodeURIComponent(previewToken)}`
    );
  }, [lesson, lessonId, isTeacherPreview, previewToken]);

  const handleClose = goBack;

  if (loading) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את השיעור...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6" dir="rtl">
        <ErrorCard error={error} onRetry={loadLesson} onClose={handleClose} />
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6" dir="rtl">
        <div className="rounded-[2.4rem] border border-white/28 bg-[#123c6b]/74 p-8 text-center text-white shadow-[0_28px_80px_rgba(3,31,61,0.34)] backdrop-blur-xl">
          <h1 className="text-3xl font-black">השיעור לא נמצא</h1>

          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3 font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)]"
          >
            חזרה
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <div className="relative z-10 p-4 md:p-5">
          <header className="mb-4">
            <DetailHeaderActions onBack={handleClose} onClose={handleClose} backLabel={returnLabel} />

            <h1
              className="text-2xl font-black leading-tight md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
              }}
            >
              {lesson.title || "שיעור ללא כותרת"}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-4xl text-sm font-bold leading-relaxed text-white/66">
              {lesson.description || "אין עדיין תיאור לשיעור הזה."}
            </p>
          </header>

          <div className="grid gap-4 xl:grid-cols-[1.72fr_0.58fr]">
            <section className="overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-3 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">וידאו השיעור</h2>
                  <p className="text-[11px] font-bold text-white/55">
                    צפי בשיעור ואז חזרי למסלול הקורס.
                  </p>
                </div>

                <div className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-black text-white/70">
                  Lesson player
                </div>
              </div>

              {videoSrc ? (
                <div className="overflow-hidden rounded-[1.6rem] border border-white/18 bg-black shadow-[0_16px_45px_rgba(0,0,0,0.32)]">
                  <video
                    src={videoSrc}
                    controls
                    className="aspect-video w-full bg-black"
                  >
                    הדפדפן שלך לא תומך בנגן וידאו.
                  </video>
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-[1.6rem] border border-dashed border-white/18 bg-white/8 text-center">
                  <div>
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/18 bg-white/10 text-3xl">
                      —
                    </div>
                    <div className="text-lg font-black">אין קובץ וידאו לשיעור</div>
                    <div className="mt-1 text-sm font-bold text-white/56">
                      כשהמורה תעלה וידאו, הוא יופיע כאן.
                    </div>
                  </div>
                </div>
              )}
            </section>

            <aside className="space-y-3">
              <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <h2 className="text-lg font-black">פרטי השיעור</h2>

                <div className="mt-3 grid gap-2">
                  <CompactInfo label="סוג" value="שיעור" />

                  <CompactInfo
                    label="נושא"
                    value={lesson.topic || lesson.category || "כללי"}
                  />

                  <CompactInfo
                    label="רמה"
                    value={getLevelLabel(lesson.level)}
                  />

                  <CompactInfo label="שפה" value={lesson.language || "אנגלית"} />
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffd439]/24 bg-[#ffd439]/14 text-lg text-[#ffd439]">
                    ✓
                  </div>

                  <h2 className="text-lg font-black text-white">
                    איך ללמוד?
                  </h2>
                </div>

                <ol className="space-y-2 text-xs font-bold leading-relaxed text-white/74">
                  <li className="rounded-xl bg-white/8 px-3 py-2">
                    1. צפי פעם אחת ברצף.
                  </li>
                  <li className="rounded-xl bg-white/8 px-3 py-2">
                    2. עצרי וכתבי מילים חדשות.
                  </li>
                  <li className="rounded-xl bg-white/8 px-3 py-2">
                    3. חזרי וסמני כבוצע.
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function CompactInfo({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/8 px-3 py-2">
      <span className="text-xs font-bold text-white/56">{label}</span>
      <span className="line-clamp-1 text-xs font-black text-white">
        {value || "לא צוין"}
      </span>
    </div>
  );
}

function ErrorCard({ error, onRetry, onClose }) {
  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-red-300/35 bg-[#123c6b]/78 p-7 text-white shadow-[0_28px_80px_rgba(3,31,61,0.38)] backdrop-blur-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white transition hover:bg-white/22"
      >
        ×
      </button>

      <div className="max-w-2xl">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-red-300/35 bg-red-500/16 text-3xl">
          !
        </div>

        <h1 className="text-3xl font-black text-red-100">
          לא הצלחנו לפתוח את השיעור
        </h1>

        <p className="mt-3 text-base font-bold leading-relaxed text-white/72">
          {error}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-7 py-3 font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
          >
            נסי שוב
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/18 bg-white/10 px-7 py-3 font-black text-white transition hover:bg-white/16"
          >
            חזרה לקורס
          </button>
        </div>
      </div>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}