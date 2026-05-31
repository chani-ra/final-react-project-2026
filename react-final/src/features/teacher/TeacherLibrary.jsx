import React, { useEffect, useState } from "react";
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

  const [editForm, setEditForm] = useState({
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
  });

  const teacherId = user?._id || user?.id;

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

    if (type === "quiz") {
      const confirmDelete = window.confirm("האם למחוק את הבוחן?");
      if (!confirmDelete) return;

      try {
        setActionLoadingId(item._id);

        await deleteQuiz(item._id);

        setQuizzes((prev) => prev.filter((quiz) => quiz._id !== item._id));

        setMessage({
          type: "success",
          text: "הבוחן נמחק בהצלחה",
        });
      } catch (error) {
        setMessage({ type: "error", text: error.toString() });
      } finally {
        setActionLoadingId("");
      }

      return;
    }

    const confirmDelete = window.confirm(`האם למחוק את ${labels[type]}?`);
    if (!confirmDelete) return;

    try {
      setActionLoadingId(item._id);

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

      setMessage({
        type: "success",
        text: `${labels[type]} נמחק בהצלחה`,
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const handleTogglePublish = async (item, type) => {
    if (type === "quiz") {
      try {
        setActionLoadingId(item._id);

        const newStatus = !item.isPublic;
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

        setMessage({
          type: "success",
          text: newStatus
            ? "הבוחן פורסם ויכול להיכנס למסלולים אישיים"
            : "הבוחן הוחזר לטיוטה",
        });
      } catch (error) {
        setMessage({ type: "error", text: error.toString() });
      } finally {
        setActionLoadingId("");
      }

      return;
    }

    try {
      setActionLoadingId(item._id);

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

      setMessage({
        type: "success",
        text: newStatus
          ? "התוכן פורסם ויכול להיכנס למסלולים אישיים"
          : "התוכן הוחזר לטיוטה",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const openEditModal = (item, type) => {
    if (type === "quiz") {
      setEditingItem(item);
      setEditType(type);

      setEditForm({
        title: item.title || "",
        description: item.description || "",
        englishLevel: item.englishLevel || "beginner",
        quizType: item.quizType || "mixed",
        category: item.category || "general",
        duration: item.duration || 30,
        passingScore: item.passingScore || 70,
        isPublic: Boolean(item.isPublic),
        questions: Array.isArray(item.questions)
          ? item.questions.map((q) => ({
              question: q.question || "",
              questionType: q.questionType || "multiple-choice",
              options: Array.isArray(q.options) ? q.options : [],
              correctAnswer: q.correctAnswer || "",
              explanation: q.explanation || "",
              points: q.points || 1,
              difficulty: q.difficulty || "medium",
            }))
          : [],
      });

      return;
    }

    setEditingItem(item);
    setEditType(type);

    setEditForm({
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

    setEditForm({
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
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setActionLoadingId(editingItem._id);

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

        setMessage({ type: "success", text: "הבוחן עודכן בהצלחה" });

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

        setMessage({ type: "success", text: "השיעור עודכן בהצלחה" });
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

        setMessage({ type: "success", text: "השיר עודכן בהצלחה" });
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

        setMessage({ type: "success", text: "התרגיל עודכן בהצלחה" });
      }

      closeEditModal();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const tabs = [
    { id: "lessons", label: "שיעורים", count: lessons.length },
    { id: "songs", label: "שירים", count: songs.length },
    { id: "exercises", label: "תרגילים", count: exercises.length },
    { id: "quizzes", label: "בחנים", count: quizzes.length },
  ];

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הספרייה שלך...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#58BDEB] border border-white/45 shadow-[0_24px_80px_rgba(12,74,110,0.20)] p-6 md:p-8 text-white">
        <HeaderLines />

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center bg-white text-[#0F4C75] border-[3px] border-[#B8322A] px-4 py-2 rounded-full text-sm font-black mb-4 shadow-sm">
              הספרייה שלי
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-sm">
              ניהול תוכן מורה
            </h1>

            <p className="text-white/88 mt-3 max-w-2xl leading-relaxed">
              ניהול שיעורים, שירים, תרגילים ובחנים: צפייה, עריכה, פרסום, טיוטה
              ומחיקה.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => navigate("/teacher/quizzes/create")}
              className="bg-[#B8322A] hover:bg-[#9F2A24] text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg"
            >
              יצירת בוחן
            </button>

            <button
              onClick={() => navigate("/teacher/exercises/create")}
              className="bg-[#0F4C75] hover:bg-[#0B3D5E] text-white font-black px-6 py-3 rounded-2xl transition-all shadow-lg"
            >
              יצירת תרגיל
            </button>

            <button
              onClick={() => navigate("/teacher/create")}
              className="bg-white hover:bg-sky-50 text-[#0F4C75] font-black px-6 py-3 rounded-2xl transition-all shadow-lg"
            >
              העלאת תוכן
            </button>
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
              : "bg-red-50 border border-red-100 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatCard title="שיעורים" value={lessons.length} />
        <StatCard title="שירים" value={songs.length} />
        <StatCard title="תרגילים" value={exercises.length} />
        <StatCard title="בחנים" value={quizzes.length} />
        <StatCard title="מפורסמים" value={publishedCount} />
        <StatCard title="טיוטות" value={draftCount} />
      </section>

      <section className="bg-white/26 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/35 rounded-[2rem] shadow-[0_18px_55px_rgba(15,76,117,0.22)] p-4 backdrop-blur-xl">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full font-black text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#0F4C75] border-[3px] border-[#B8322A] shadow-sm"
                  : "bg-white/18 text-white hover:bg-white/28 border border-white/25"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </section>

      {itemsToShow.length === 0 ? (
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
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
    <div className="bg-white/94 border border-white rounded-[2rem] shadow-[0_14px_40px_rgba(15,76,117,0.18)] p-5">
      <div className="flex justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-black text-[#0F4C75]">
            {quiz.title}
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            {quiz.description || "אין תיאור לבוחן זה."}
          </p>
        </div>

        <span
          className={`h-fit px-3 py-1 rounded-full text-xs font-black ${
            quiz.isPublic
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-amber-50 text-amber-700 border border-amber-100"
          }`}
        >
          {quiz.isPublic ? "מפורסם" : "טיוטה"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SmallInfo label="שאלות" value={questionCount} />
        <SmallInfo label="רמה" value={getLevelLabel(quiz.englishLevel)} />
        <SmallInfo label="סוג" value={getQuizTypeLabel(quiz.quizType)} />
        <SmallInfo label="קורס" value={courseTitle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
        <button
          type="button"
          onClick={onEdit}
          disabled={isLoading}
          className="bg-[#0F4C75] hover:bg-[#0B3D5E] disabled:opacity-60 text-white font-black py-3 rounded-2xl"
        >
          עריכה
        </button>

        <button
          type="button"
          onClick={onTogglePublish}
          disabled={isLoading}
          className={`font-black py-3 rounded-2xl disabled:opacity-60 ${
            quiz.isPublic
              ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100"
          }`}
        >
          {quiz.isPublic ? "החזר לטיוטה" : "פרסם"}
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isLoading}
          className="bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 border border-red-100 font-black py-3 rounded-2xl"
        >
          מחיקה
        </button>
      </div>
    </div>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3">
      <div className="text-xs text-slate-500 font-bold">{label}</div>
      <div className="font-black text-slate-800 mt-1 truncate">{value}</div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/94 border border-white rounded-2xl p-5 shadow-[0_12px_30px_rgba(15,76,117,0.16)]">
      <div className="text-sm text-slate-500 font-bold">{title}</div>
      <div className="text-3xl font-black mt-1 text-[#0F4C75]">{value}</div>
    </div>
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
    <div className="text-center py-16 bg-white/94 rounded-[2rem] border border-white shadow-[0_14px_40px_rgba(15,76,117,0.18)]">
      <h2 className="text-2xl font-black mb-2 text-[#0F4C75]">
        {item.title}
      </h2>

      <p className="text-slate-500 mb-6">{item.text}</p>

      <button
        onClick={onClick}
        className="bg-[#B8322A] hover:bg-[#9F2A24] text-white font-black px-8 py-3 rounded-2xl"
      >
        {item.button}
      </button>
    </div>
  );
}

function HeaderLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-25"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4" />
        <path d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42" />
        <path d="M90 75 H150 L185 40 L225 75 H310" />
        <path d="M930 92 H980 L1015 58 L1050 92 H1125" />
      </g>
    </svg>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
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