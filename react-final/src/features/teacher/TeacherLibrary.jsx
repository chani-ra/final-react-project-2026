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

import TeacherContentCard from "./components/TeacherContentCard";
import EditContentModal from "./components/EditContentModal";

export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("lessons");
  const [lessons, setLessons] = useState([]);
  const [songs, setSongs] = useState([]);

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
    category: "general",
    level: "beginner",
  });

  const teacherId = user?._id || user?.id;

  // טעינת שיעורים ושירים של המורה
  const loadLibrary = async () => {
    if (!teacherId) {
      setMessage({ type: "error", text: "לא נמצא מזהה מורה. נסי להתחבר מחדש." });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [teacherLessons, teacherSongs] = await Promise.all([
        getTeacherLessons(teacherId),
        getTeacherSongs(teacherId),
      ]);

      setLessons(teacherLessons || []);
      setSongs(teacherSongs || []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, [teacherId]);

  // מחיקת פריט תוכן
  const handleDelete = async (item, type) => {
    const confirmDelete = window.confirm(
      type === "lesson" ? "האם למחוק את השיעור?" : "האם למחוק את השיר?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoadingId(item._id);

      if (type === "lesson") {
        await deleteLesson(item._id);
        setLessons((prev) => prev.filter((lesson) => lesson._id !== item._id));
        setMessage({ type: "success", text: "השיעור נמחק בהצלחה" });
      } else {
        await deleteSong(item._id);
        setSongs((prev) => prev.filter((song) => song._id !== item._id));
        setMessage({ type: "success", text: "השיר נמחק בהצלחה" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  // פרסום או החזרה לטיוטה
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
      } else {
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

      setMessage({
        type: "success",
        text: newStatus ? "התוכן פורסם לתלמידים ולמסלולי AI" : "התוכן הוחזר לטיוטה",
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
      category: item.category || "general",
      level: item.level || "beginner",
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
      category: "general",
      level: "beginner",
    });
  };

  // שמירת עריכה של שיעור או שיר
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
            lesson._id === editingItem._id ? { ...lesson, ...response.lesson } : lesson
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

      closeEditModal();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const itemsToShow = activeTab === "lessons" ? lessons : songs;
  const activeType = activeTab === "lessons" ? "lesson" : "song";

  const publishedCount =
    lessons.filter((item) => item.isPublic).length +
    songs.filter((item) => item.isPublic).length;

  const draftCount =
    lessons.filter((item) => !item.isPublic).length +
    songs.filter((item) => !item.isPublic).length;

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
            ניהול שיעורים ושירים: צפייה, האזנה, עריכה, פרסום, טיוטה ומחיקה.
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/create")}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg"
        >
          + העלאת תוכן חדש
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="שיעורים" value={lessons.length} />
        <StatCard title="שירים" value={songs.length} />
        <StatCard title="מפורסמים" value={publishedCount} color="text-emerald-400" />
        <StatCard title="טיוטות" value={draftCount} color="text-yellow-400" />
      </div>

      <div className="flex gap-2 border-b border-white/10">
        <TabButton
          isActive={activeTab === "lessons"}
          onClick={() => setActiveTab("lessons")}
          label={`🎬 שיעורים (${lessons.length})`}
          activeClass="border-indigo-400 text-indigo-400"
        />

        <TabButton
          isActive={activeTab === "songs"}
          onClick={() => setActiveTab("songs")}
          label={`🎵 שירים (${songs.length})`}
          activeClass="border-emerald-400 text-emerald-400"
        />
      </div>

      {itemsToShow.length === 0 ? (
        <EmptyState
          type={activeType}
          onClick={() => navigate("/teacher/create")}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {itemsToShow.map((item) => (
            <TeacherContentCard
              key={item._id}
              item={item}
              type={activeType}
              actionLoadingId={actionLoadingId}
              onView={() =>
                activeType === "lesson" && navigate(`/teacher/lesson/${item._id}`)
              }
              onEdit={() => openEditModal(item, activeType)}
              onTogglePublish={() => handleTogglePublish(item, activeType)}
              onDelete={() => handleDelete(item, activeType)}
            />
          ))}
        </div>
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

// כפתור טאב
function TabButton({ isActive, onClick, label, activeClass }) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
        isActive ? activeClass : "border-transparent text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

// תצוגה כשאין תוכן
function EmptyState({ type, onClick }) {
  const isLesson = type === "lesson";

  return (
    <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <div className="text-5xl mb-4">{isLesson ? "🎬" : "🎵"}</div>
      <h2 className="text-2xl font-bold mb-2">
        {isLesson ? "אין שיעורים בספרייה" : "אין שירים בספרייה"}
      </h2>
      <p className="text-gray-400 mb-6">
        {isLesson
          ? "העלי שיעור ראשון כדי להתחיל לבנות מאגר תוכן חכם."
          : "העלי שיר ראשון כדי להעשיר את מסלולי הלמידה."}
      </p>

      <button
        onClick={onClick}
        className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 rounded-xl"
      >
        {isLesson ? "העלאת שיעור" : "העלאת שיר"}
      </button>
    </div>
  );
}