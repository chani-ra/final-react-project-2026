import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getTeacherLessons,
  getTeacherSongs,
  deleteLesson,
  deleteSong,
  updateLesson,
  updateSong,
  updateLessonPublishStatus,
  updateSongPublishStatus,
} from "../../services/teacherService";

import {
  getTeacherExercises,
  updateExercise,
  deleteExercise,
} from "../../services/exerciseService";

import {
  getTeacherQuizzes,
  updateQuiz,
  deleteQuiz,
  updateQuizPublishStatus,
} from "../../services/quizService";

import TeacherContentCard from "./components/TeacherContentCard";
import EditContentModal from "./components/EditContentModal";

export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("lessons");

  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState("");
  const [editForm, setEditForm] = useState(getEmptyEditForm());

  const teacherId = user?._id || user?.id;

  const tabs = useMemo(
    () => [
      { id: "lessons", label: "שיעורים", type: "lesson", count: lessons.length },
      { id: "songs", label: "שירים", type: "song", count: songs.length },
      {
        id: "exercises",
        label: "תרגילים",
        type: "exercise",
        count: exercises.length,
      },
      { id: "quizzes", label: "בחנים", type: "quiz", count: quizzes.length },
    ],
    [lessons.length, songs.length, exercises.length, quizzes.length]
  );

  const itemsByTab = {
    lessons,
    songs,
    exercises,
    quizzes,
  };

  const typeByTab = {
    lessons: "lesson",
    songs: "song",
    exercises: "exercise",
    quizzes: "quiz",
  };

  const itemsToShow = itemsByTab[activeTab] || [];
  const activeType = typeByTab[activeTab];

  const publishedCount =
    lessons.filter((item) => item.isPublic).length +
    songs.filter((item) => item.isPublic).length +
    exercises.filter((item) => item.isPublic).length +
    quizzes.filter((item) => item.isPublic).length;

  const draftCount =
    lessons.filter((item) => !item.isPublic).length +
    songs.filter((item) => !item.isPublic).length +
    exercises.filter((item) => !item.isPublic).length +
    quizzes.filter((item) => !item.isPublic).length;

  const totalCount =
    lessons.length + songs.length + exercises.length + quizzes.length;

  const loadLibrary = async () => {
    if (!teacherId) {
      setMessage({
        type: "error",
        text: "לא נמצא מזהה מורה. נסי להתחבר מחדש.",
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [
        teacherLessons,
        teacherSongs,
        teacherExercises,
        teacherQuizzes,
      ] = await Promise.all([
        getTeacherLessons(teacherId),
        getTeacherSongs(teacherId),
        getTeacherExercises(teacherId),
        getTeacherQuizzes(),
      ]);

      setLessons(teacherLessons || []);
      setSongs(teacherSongs || []);
      setExercises(teacherExercises || []);
      setQuizzes(teacherQuizzes || []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [teacherId]);

  const handleDelete = async (item, type) => {
    const labels = {
      lesson: "השיעור",
      song: "השיר",
      exercise: "התרגיל",
      quiz: "הבוחן",
    };

    const confirmDelete = window.confirm(`האם למחוק את ${labels[type]}?`);
    if (!confirmDelete) return;

    try {
      setActionLoadingId(item._id);
      setMessage({ type: "", text: "" });

      if (type === "lesson") {
        await deleteLesson(item._id);
        setLessons((prev) => prev.filter((lesson) => lesson._id !== item._id));
      }

      if (type === "song") {
        await deleteSong(item._id);
        setSongs((prev) => prev.filter((song) => song._id !== item._id));
      }

      if (type === "exercise") {
        await deleteExercise(item._id);
        setExercises((prev) =>
          prev.filter((exercise) => exercise._id !== item._id)
        );
      }

      if (type === "quiz") {
        await deleteQuiz(item._id);
        setQuizzes((prev) => prev.filter((quiz) => quiz._id !== item._id));
      }

      setMessage({
        type: "success",
        text: `${labels[type]} נמחק בהצלחה.`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const handleTogglePublish = async (item, type) => {
    try {
      setActionLoadingId(item._id);
      setMessage({ type: "", text: "" });

      const newStatus = !item.isPublic;

      if (type === "lesson") {
        const response = await updateLessonPublishStatus(item._id, newStatus);
        const updatedLesson = response.lesson;

        setLessons((prev) =>
          prev.map((lesson) =>
            lesson._id === item._id
              ? { ...lesson, isPublic: updatedLesson?.isPublic ?? newStatus }
              : lesson
          )
        );
      }

      if (type === "song") {
        const response = await updateSongPublishStatus(item._id, newStatus);
        const updatedSong = response.song;

        setSongs((prev) =>
          prev.map((song) =>
            song._id === item._id
              ? { ...song, isPublic: updatedSong?.isPublic ?? newStatus }
              : song
          )
        );
      }

      if (type === "exercise") {
        const response = await updateExercise(item._id, {
          isPublic: newStatus,
        });

        const updatedExercise = response.exercise;

        setExercises((prev) =>
          prev.map((exercise) =>
            exercise._id === item._id
              ? {
                ...exercise,
                isPublic: updatedExercise?.isPublic ?? newStatus,
              }
              : exercise
          )
        );
      }

      if (type === "quiz") {
        const response = await updateQuizPublishStatus(item._id, newStatus);
        const updatedQuiz = response.quiz;

        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz._id === item._id
              ? {
                ...quiz,
                isPublic: updatedQuiz?.isPublic ?? newStatus,
              }
              : quiz
          )
        );
      }

      setMessage({
        type: "success",
        text: newStatus
          ? "התוכן פורסם ויכול להיכנס למסלולים אישיים."
          : "התוכן הוחזר לטיוטה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const openEditModal = (item, type) => {
    setEditingItem(item);
    setEditType(type);

    if (type === "quiz") {
      setEditForm({
        ...getEmptyEditForm(),
        title: item.title || "",
        description: item.description || "",
        englishLevel: item.englishLevel || "beginner",
        quizType: item.quizType || "mixed",
        category: item.category || "general",
        duration: item.duration || 30,
        passingScore: item.passingScore || 70,
        isPublic: Boolean(item.isPublic),
        questions: Array.isArray(item.questions)
          ? item.questions.map((question) => ({
            question: question.question || "",
            questionType: question.questionType || "multiple-choice",
            options: Array.isArray(question.options) ? question.options : [],
            correctAnswer: question.correctAnswer || "",
            explanation: question.explanation || "",
            points: question.points || 1,
            difficulty: question.difficulty || "medium",
          }))
          : [],
      });

      return;
    }

    setEditForm({
      ...getEmptyEditForm(),
      title: item.title || "",
      topic: item.topic || "",
      theme: item.theme || "",
      description: item.description || "",
      instructions: item.instructions || "",
      category: item.category || "general",
      level: item.level || "beginner",
      isPublic: Boolean(item.isPublic),
    });
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditType("");
    setEditForm(getEmptyEditForm());
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setActionLoadingId(editingItem._id);
      setMessage({ type: "", text: "" });

      if (editType === "quiz") {
        const response = await updateQuiz(editingItem._id, {
          title: editForm.title,
          description: editForm.description,
          englishLevel: editForm.englishLevel,
          quizType: editForm.quizType,
          category: editForm.category,
          duration: Number(editForm.duration) || 30,
          passingScore: Number(editForm.passingScore) || 70,
          isPublic: Boolean(editForm.isPublic),
          questions: editForm.questions,
        });

        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz._id === editingItem._id ? { ...quiz, ...response.quiz } : quiz
          )
        );

        setMessage({ type: "success", text: "הבוחן עודכן בהצלחה." });
        closeEditModal();
        return;
      }

      if (editType === "lesson") {
        const response = await updateLesson(editingItem._id, {
          title: editForm.title,
          topic: editForm.topic,
          description: editForm.description,
          category: editForm.category,
          level: editForm.level,
        });

        setLessons((prev) =>
          prev.map((lesson) =>
            lesson._id === editingItem._id
              ? { ...lesson, ...response.lesson }
              : lesson
          )
        );

        setMessage({ type: "success", text: "השיעור עודכן בהצלחה." });
      }

      if (editType === "song") {
        const response = await updateSong(editingItem._id, {
          title: editForm.title,
          theme: editForm.theme,
          category: editForm.category,
          level: editForm.level,
        });

        setSongs((prev) =>
          prev.map((song) =>
            song._id === editingItem._id ? { ...song, ...response.song } : song
          )
        );

        setMessage({ type: "success", text: "השיר עודכן בהצלחה." });
      }

      if (editType === "exercise") {
        const response = await updateExercise(editingItem._id, {
          title: editForm.title,
          description: editForm.description,
          instructions: editForm.instructions,
          category: editForm.category,
          level: editForm.level,
          isPublic: editForm.isPublic,
        });

        setExercises((prev) =>
          prev.map((exercise) =>
            exercise._id === editingItem._id
              ? { ...exercise, ...response.exercise }
              : exercise
          )
        );

        setMessage({ type: "success", text: "התרגיל עודכן בהצלחה." });
      }

      closeEditModal();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את הספרייה שלך...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <LibraryHeader
            totalCount={totalCount}
            publishedCount={publishedCount}
            draftCount={draftCount}
            onCreateQuiz={() => navigate("/teacher/quizzes/create")}
            onCreateExercise={() => navigate("/teacher/exercises/create")}
            onCreateContent={() => navigate("/teacher/create")}
          />

          {message.text && <MessageBox message={message} />}

          <StatsGrid
            lessons={lessons.length}
            songs={songs.length}
            exercises={exercises.length}
            quizzes={quizzes.length}
            published={publishedCount}
            drafts={draftCount}
          />

          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {!itemsToShow.length ? (
            <EmptyState
              type={activeType}
              onClick={() => {
                if (activeType === "exercise") {
                  navigate("/teacher/exercises/create");
                  return;
                }

                if (activeType === "quiz") {
                  navigate("/teacher/quizzes/create");
                  return;
                }

                navigate("/teacher/create");
              }}
            />
          ) : activeType === "quiz" ? (
            <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {itemsToShow.map((quiz) => (
                <QuizLibraryCard
                  key={quiz._id}
                  quiz={quiz}
                  actionLoadingId={actionLoadingId}
                  onEdit={() => openEditModal(quiz, "quiz")}
                  onTogglePublish={() => handleTogglePublish(quiz, "quiz")}
                  onDelete={() => handleDelete(quiz, "quiz")}
                />
              ))}
            </section>
          ) : (
            <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {itemsToShow.map((item) => (
                <TeacherContentCard
                  key={item._id}
                  item={item}
                  type={activeType}
                  actionLoadingId={actionLoadingId}
                  onView={() => {
                    if (activeType === "lesson") {
                      navigate(`/teacher/lesson/${item._id}`);
                    }
                  }}
                  onEdit={() => openEditModal(item, activeType)}
                  onTogglePublish={() => handleTogglePublish(item, activeType)}
                  onDelete={() => handleDelete(item, activeType)}
                />
              ))}
            </section>
          )}
        </div>
      </section>

      {editingItem && (
        <EditContentModal
          editType={editType}
          editForm={editForm}
          setEditForm={setEditForm}
          actionLoadingId={actionLoadingId}
          editingItemId={editingItem._id}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </main>
  );
}

function LibraryHeader({
  totalCount,
  publishedCount,
  draftCount,
  onCreateQuiz,
  onCreateExercise,
  onCreateContent,
}) {
  return (
    <header className="mb-6">
      <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-sm font-black text-[#ffe89a]">
        ספריית המורה
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1
            className="text-3xl font-black leading-tight md:text-5xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
            }}
          >
            ניהול תוכן מורה
          </h1>

          <p className="mt-3 max-w-4xl text-sm font-bold leading-relaxed text-white/72 md:text-base">
            כאן מנהלים שיעורים, שירים, תרגילים ובחנים. תוכן מפורסם יכול להיכנס
            למסלולים אישיים של תלמידות.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
          <MiniInfoCard label="סה״כ" value={totalCount} />
          <MiniInfoCard label="מפורסמים" value={publishedCount} />
          <MiniInfoCard label="טיוטות" value={draftCount} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <HeaderActionButton
          title="יצירת בוחן"
          subtitle="בוחן אמריקאי עם שאלות ומשוב"
          icon="Q"
          onClick={onCreateQuiz}
        />

        <HeaderActionButton
          title="יצירת תרגיל"
          subtitle="תרגול מותאם למסלולי תלמידות"
          icon="E"
          onClick={onCreateExercise}
        />

        <HeaderActionButton
          title="העלאת שיעור או שיר"
          subtitle="וידאו או אודיו לספריית התוכן"
          icon="U"
          onClick={onCreateContent}
        />
      </div>
    </header>
  );
}

function HeaderActionButton({ title, subtitle, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.8rem] border-2 border-white/38 bg-[#061f36]/54 p-5 text-right text-white shadow-[0_18px_42px_rgba(3,31,61,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-[#ffd439]/55 hover:bg-[#123c6b]/74"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

      <div className="relative z-10 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-xl font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.42),0_12px_24px_rgba(3,31,61,0.28)]">
          {icon}
        </span>

        <span className="min-w-0">
          <span className="block text-xl font-black leading-7 text-white md:text-2xl">
            {title}
          </span>

          <span className="mt-1 block text-sm font-bold leading-6 text-white/66">
            {subtitle}
          </span>
        </span>

        <span className="mr-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/18 bg-white/10 text-2xl font-black text-[#ffe89a] transition group-hover:bg-[#ffd439]/20">
          +
        </span>
      </div>
    </button>
  );
}

function MessageBox({ message }) {
  return (
    <div
      className={`mb-5 rounded-[1.5rem] px-5 py-4 text-sm font-bold shadow-[0_12px_32px_rgba(3,31,61,0.16)] ${message.type === "success"
          ? "border border-emerald-300/28 bg-emerald-400/14 text-emerald-100"
          : "border border-red-300/30 bg-red-500/16 text-red-100"
        }`}
    >
      {message.text}
    </div>
  );
}

function StatsGrid({ lessons, songs, exercises, quizzes, published, drafts }) {
  return (
    <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
      <StatCard title="שיעורים" value={lessons} />
      <StatCard title="שירים" value={songs} />
      <StatCard title="תרגילים" value={exercises} />
      <StatCard title="בחנים" value={quizzes} />
      <StatCard title="מפורסמים" value={published} />
      <StatCard title="טיוטות" value={drafts} />
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      <div className="text-xs font-bold text-white/58">{title}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

function TabsBar({ tabs, activeTab, setActiveTab }) {
  return (
    <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/62 p-3 shadow-[0_24px_65px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-black transition-all ${active
                  ? "border border-[#ffd439]/35 bg-[#ffd439]/22 text-[#fff3b0] shadow-[0_0_18px_rgba(255,212,57,0.14)]"
                  : "border border-white/12 bg-white/8 text-white/72 hover:bg-white/12 hover:text-white"
                }`}
            >
              {tab.label}
              <span
                className={`mr-2 rounded-full px-2 py-0.5 text-[11px] ${active
                    ? "bg-[#123c6b]/50 text-[#fff3b0]"
                    : "bg-white/10 text-white/58"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function QuizLibraryCard({
  quiz,
  actionLoadingId,
  onEdit,
  onTogglePublish,
  onDelete,
}) {
  const questionCount = quiz.questions?.length || 0;
  const courseTitle = quiz.courseId?.title || "בוחן חכם כללי";
  const isLoading = actionLoadingId === quiz._id;

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#ff6659]/38 bg-[#123c6b]/72 p-4 text-white shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <StatusBadge isPublic={quiz.isPublic} />
              <SoftBadge>{getLevelLabel(quiz.englishLevel)}</SoftBadge>
              <SoftBadge>{getQuizTypeLabel(quiz.quizType)}</SoftBadge>
            </div>

            <h3 className="line-clamp-2 text-2xl font-black leading-tight">
              {quiz.title || "בוחן ללא כותרת"}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-white/62">
              {quiz.description || "אין תיאור לבוחן זה."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <SmallInfo label="שאלות" value={questionCount} />
          <SmallInfo label="רמה" value={getLevelLabel(quiz.englishLevel)} />
          <SmallInfo label="סוג" value={getQuizTypeLabel(quiz.quizType)} />
          <SmallInfo label="קורס" value={courseTitle} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3">
          <CardActionButton
            label="עריכה"
            onClick={onEdit}
            disabled={isLoading}
            variant="blue"
          />

          <CardActionButton
            label={quiz.isPublic ? "החזר לטיוטה" : "פרסם"}
            onClick={onTogglePublish}
            disabled={isLoading}
            variant="dark"
          />

          <CardActionButton
            label="מחיקה"
            onClick={onDelete}
            disabled={isLoading}
            variant="red"
          />
        </div>
      </div>
    </article>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="h-3 w-3 shrink-0 rounded-full bg-[#ffd439] shadow-[0_0_12px_rgba(255,212,57,0.55)]" />

      <span className="min-w-0">
        <span className="block text-sm font-bold leading-5 text-white/58">
          {label}
        </span>

        <span className="block truncate text-lg font-extrabold leading-7 text-white">
          {value || "לא צוין"}
        </span>
      </span>
    </div>
  );
}

function StatusBadge({ isPublic }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black ${isPublic
          ? "border-white/24 bg-white/12 text-white"
          : "border-[#ffd439]/32 bg-[#ffd439]/14 text-[#fff3b0]"
        }`}
    >
      {isPublic ? "מפורסם" : "טיוטה"}
    </span>
  );
}

function SoftBadge({ children }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-black text-white/68">
      {children}
    </span>
  );
}
function CardActionButton({ label, onClick, disabled, variant }) {
  const classes = {
    blue:
      "border-[#7dd3fc] bg-[#0f4c75] text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#176aa8]",
    dark:
      "border-[#ffd439] bg-[#123c6b] text-[#fff3b0] shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#0f4c75]",
    red:
      "border-[#ffb4ad] bg-[#b8322a] text-white shadow-[0_5px_0_rgba(89,15,20,0.50)] hover:bg-[#9f2a24]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-2 px-4 py-3 text-sm font-black transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 ${classes[variant]}`}
    >
      {label}
    </button>
  );
}
function EmptyState({ type, onClick }) {
  const config = {
    lesson: {
      title: "אין שיעורים בספרייה",
      text: "העלי שיעור ראשון כדי להתחיל לבנות מאגר תוכן חכם.",
      button: "העלאת שיעור",
    },
    song: {
      title: "אין שירים בספרייה",
      text: "העלי שיר ראשון כדי להעשיר את מסלולי הלמידה.",
      button: "העלאת שיר",
    },
    exercise: {
      title: "אין תרגילים בספרייה",
      text: "צרי תרגיל ראשון ידנית או בעזרת AI.",
      button: "יצירת תרגיל",
    },
    quiz: {
      title: "אין בחנים בספרייה",
      text: "צרי בוחן ראשון בעזרת AI כדי להוסיף מדידה למסלולי הלמידה.",
      button: "יצירת בוחן",
    },
  };

  const item = config[type];

  return (
    <section className="mt-5 rounded-[2rem] border border-white/22 bg-[#061f36]/62 px-6 py-14 text-center text-white shadow-[0_24px_65px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/16 bg-white/10 text-2xl font-black">
        +
      </div>

      <h2 className="text-2xl font-black">{item.title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62">
        {item.text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
      >
        {item.button}
      </button>
    </section>
  );
}

function MiniInfoCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="text-xs font-bold text-white/58">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
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

function getEmptyEditForm() {
  return {
    title: "",
    topic: "",
    theme: "",
    description: "",
    instructions: "",
    category: "general",
    level: "beginner",
    englishLevel: "beginner",
    quizType: "mixed",
    duration: 30,
    passingScore: 70,
    questions: [],
    isPublic: false,
  };
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

function getQuizTypeLabel(type) {
  const labels = {
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    reading: "קריאה",
    listening: "שמיעה",
    writing: "כתיבה",
    mixed: "מעורב",
  };

  return labels[type] || type || "לא צוין";
}