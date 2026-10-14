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
import {
  LibraryHeader, MessageBox, StatsGrid, TabsBar,
  QuizLibraryCard, EmptyState, HeaderLines,
} from "./components/library/TeacherLibrarySections";
import { getEmptyEditForm } from "./components/library/libraryUtils";


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
