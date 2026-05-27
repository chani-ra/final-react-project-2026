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

import TeacherContentCard from "./components/TeacherContentCard";
import EditContentModal from "./components/EditContentModal";

export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("lessons");
  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);
  const [exercises, setExercises] = useState([]);

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
    isPublic: false,
  });

  const teacherId = user?._id || user?.id;

  // טעינת כל ספריית המורה: שיעורים, שירים ותרגילים
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

      const [teacherLessons, teacherSongs, teacherExercises] =
        await Promise.all([
          getTeacherLessons(teacherId),
          getTeacherSongs(teacherId),
          getTeacherExercises(teacherId),
        ]);

      setLessons(teacherLessons || []);
      setSongs(teacherSongs || []);
      setExercises(teacherExercises || []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [teacherId]);

  // מחיקת פריט תוכן לפי סוג
  const handleDelete = async (item, type) => {
    const labels = {
      lesson: "השיעור",
      song: "השיר",
      exercise: "התרגיל",
    };

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

  // פרסום או החזרה לטיוטה לפי סוג תוכן
  const handleTogglePublish = async (item, type) => {
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

  // פתיחת חלון עריכה
  const openEditModal = (item, type) => {
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

  // סגירת חלון עריכה
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
      isPublic: false,
    });
  };

  // שמירת עריכה לפי סוג התוכן
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setActionLoadingId(editingItem._id);

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
    { id: "lessons", label: "שיעורים", icon: "🎬", count: lessons.length },
    { id: "songs", label: "שירים", icon: "🎵", count: songs.length },
    {
      id: "exercises",
      label: "תרגילים",
      icon: "📝",
      count: exercises.length,
    },
  ];

  const itemsByTab = {
    lessons,
    songs,
    exercises,
  };

  const typeByTab = {
    lessons: "lesson",
    songs: "song",
    exercises: "exercise",
  };

  const itemsToShow = itemsByTab[activeTab] || [];
  const activeType = typeByTab[activeTab];

  const publishedCount =
    lessons.filter((item) => item.isPublic).length +
    songs.filter((item) => item.isPublic).length +
    exercises.filter((item) => item.isPublic).length;

  const draftCount =
    lessons.filter((item) => !item.isPublic).length +
    songs.filter((item) => !item.isPublic).length +
    exercises.filter((item) => !item.isPublic).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הספרייה שלך... 📂</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">📂 הספרייה שלי</h1>

          <p className="text-gray-400 mt-1">
            ניהול שיעורים, שירים ותרגילים: צפייה, האזנה, עריכה, פרסום, טיוטה
            ומחיקה.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => navigate("/teacher/exercises/create")}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            + יצירת תרגיל
          </button>

          <button
            onClick={() => navigate("/teacher/create")}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg"
          >
            + העלאת תוכן
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="שיעורים" value={lessons.length} />
        <StatCard title="שירים" value={songs.length} />
        <StatCard title="תרגילים" value={exercises.length} />
        <StatCard
          title="מפורסמים"
          value={publishedCount}
          color="text-emerald-400"
        />
        <StatCard title="טיוטות" value={draftCount} color="text-yellow-400" />
      </section>

      <section className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label} ({tab.count})
          </button>
        ))}
      </section>

      {itemsToShow.length === 0 ? (
        <EmptyState type={activeType} onClick={() => {
          if (activeType === "exercise") {
            navigate("/teacher/exercises/create");
          } else {
            navigate("/teacher/create");
          }
        }} />
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

// כרטיס סטטיסטיקה קטן
function StatCard({ title, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`text-3xl font-black mt-1 ${color}`}>{value}</div>
    </div>
  );
}

// מצב ריק לפי סוג תוכן
function EmptyState({ type, onClick }) {
  const config = {
    lesson: {
      icon: "🎬",
      title: "אין שיעורים בספרייה",
      text: "העלי שיעור ראשון כדי להתחיל לבנות מאגר תוכן חכם.",
      button: "העלאת שיעור",
    },
    song: {
      icon: "🎵",
      title: "אין שירים בספרייה",
      text: "העלי שיר ראשון כדי להעשיר את מסלולי הלמידה.",
      button: "העלאת שיר",
    },
    exercise: {
      icon: "📝",
      title: "אין תרגילים בספרייה",
      text: "צרי תרגיל ראשון ידנית או בעזרת AI.",
      button: "יצירת תרגיל",
    },
  };

  const item = config[type];

  return (
    <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <div className="text-5xl mb-4">{item.icon}</div>

      <h2 className="text-2xl font-bold mb-2">{item.title}</h2>

      <p className="text-gray-400 mb-6">{item.text}</p>

      <button
        onClick={onClick}
        className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 rounded-xl"
      >
        {item.button}
      </button>
    </div>
  );
}