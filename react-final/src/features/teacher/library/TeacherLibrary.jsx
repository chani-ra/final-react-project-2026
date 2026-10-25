import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TeacherContentCard from "./TeacherContentCard";
import EditContentModal from "../edit/EditContentModal";
import { QuizLibraryCard, EmptyState } from "./TeacherLibrarySections";
import { getLevelLabel } from "./libraryUtils";
import useTeacherLibrary from "./useTeacherLibrary";
import "../../shared/teacherAdminPolish.css";

const LIBRARY_TYPE_LABELS = {
  lesson: "שיעור",
  song: "שיר",
  exercise: "תרגיל",
  quiz: "בוחן",
};

function getItemTitle(item) {
  return item.title || item.topic || item.theme || "תוכן ללא כותרת";
}

function CompactItem({ item, type, onOpen }) {
  const label = LIBRARY_TYPE_LABELS[type] || "תוכן";
  const level = getLevelLabel(item.level || item.englishLevel);
  const description = item.description || item.instructions || item.theme || "לחצי לפתיחת פרטים ופעולות";

  return (
    <article className="ew-library-tile">
      <div className="ew-library-tile-top">
        <span className="ew-library-kind">{label}</span>
        <span className={`ew-library-status ${item.isPublic ? "is-live" : "is-draft"}`}>
          {item.isPublic ? "מפורסם" : "טיוטה"}
        </span>
      </div>
      <h3 className="ew-library-tile-title" title={getItemTitle(item)}>{getItemTitle(item)}</h3>
      <p className="ew-library-tile-description">{description}</p>
      <div className="ew-library-tile-bottom">
        <span className="ew-library-level">{level}</span>
        <button type="button" onClick={onOpen} className="ew-library-open" aria-label={`פתיחת פרטים: ${getItemTitle(item)}`}>
          פרטים ופעולות <span aria-hidden="true">←</span>
        </button>
      </div>
    </article>
  );
}

function LibraryDetails({ item, type, actionLoadingId, onClose, onView, onEdit, onTogglePublish, onDelete }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="ew-library-dialog-backdrop" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="ew-library-dialog" role="dialog" aria-modal="true" aria-labelledby="ew-library-dialog-title" dir="rtl">
        <header className="ew-library-dialog-header">
          <div>
            <span className="ew-library-dialog-eyebrow">{LIBRARY_TYPE_LABELS[type]} · פרטי התוכן</span>
            <h2 id="ew-library-dialog-title">{getItemTitle(item)}</h2>
          </div>
          <button type="button" ref={closeRef} onClick={onClose} className="ew-library-dialog-close" aria-label="סגירת פרטי התוכן">×</button>
        </header>
        <div className="ew-library-dialog-body">
          {type === "quiz" ? (
            <QuizLibraryCard
              quiz={item}
              actionLoadingId={actionLoadingId}
              onEdit={onEdit}
              onTogglePublish={onTogglePublish}
              onDelete={onDelete}
            />
          ) : (
            <TeacherContentCard
              item={item}
              type={type}
              actionLoadingId={actionLoadingId}
              onView={onView}
              onEdit={onEdit}
              onTogglePublish={onTogglePublish}
              onDelete={onDelete}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const {
    activeTab, setActiveTab,
    lessons, songs, exercises, quizzes,
    loading, actionLoadingId,
    editingItem, editType, editForm, setEditForm,
    tabs, itemsToShow, activeType,
    publishedCount, draftCount, totalCount,
    handleDelete, handleTogglePublish,
    openEditModal, closeEditModal, handleSaveEdit,
  } = useTeacherLibrary(user?._id || user?.id);

  // Derive the selected item from the live collection so edits/publication
  // are reflected immediately and deleted items disappear without stale data.
  const selectedItem = itemsToShow.find((item) => item._id === selectedId);
  const visibleItems = itemsToShow.filter((item) => {
    const searchText = [item.title, item.topic, item.theme, item.description, item.instructions]
      .filter(Boolean).join(" ").toLowerCase();
    return searchText.includes(query.trim().toLowerCase());
  });

  const changeTab = (tab) => {
    setSelectedId(null);
    setQuery("");
    setActiveTab(tab);
  };

  const closeDetails = () => { if (!editingItem) setSelectedId(null); };

  if (loading) {
    return <main className="ew-dashboard-loading" dir="rtl">טוען את הספרייה שלך...</main>;
  }

  return (
    <main className="ew-management ew-library-page" dir="rtl">
      <section className="ew-management-header">
        <div className="ew-management-title-block">
          <span className="ew-management-eyebrow">סביבת המורה</span>
          <h1>ספריית התוכן שלי</h1>
          <p>כל השיעורים, השירים, התרגילים והבחנים במקום אחד. לפתיחת פרטים ועריכה, בחרי כרטיס.</p>
        </div>
        <div className="ew-management-actions">
          <button type="button" onClick={() => navigate("/teacher/create")}>העלאת שיעור או שיר</button>
          <button type="button" onClick={() => navigate("/teacher/exercises/create")}>יצירת תרגיל</button>
          <button type="button" onClick={() => navigate("/teacher/quizzes/create")}>יצירת בוחן</button>
        </div>
      </section>

      <section className="ew-management-metrics" aria-label="סיכום הספרייה">
        {[
          ["כל התכנים", totalCount], ["שיעורים", lessons.length],
          ["שירים", songs.length], ["תרגילים", exercises.length],
          ["בחנים", quizzes.length], ["מפורסמים", publishedCount],
          ["טיוטות", draftCount],
        ].map(([label, count]) => (
          <div className="ew-management-metric" key={label}>
            <span>{label}</span><strong>{count}</strong>
          </div>
        ))}
      </section>

      <section className="ew-library-browser">
        <div className="ew-library-browser-top">
          <div>
            <h2>ניהול תכנים</h2>
            <p>תצוגה מרוכזת ונוחה. הפעולות מופיעות רק בפתיחת הפריט.</p>
          </div>
          <label className="ew-library-search-label">
            <span className="sr-only">חיפוש תוכן</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי כותרת או תיאור..." />
          </label>
        </div>
        <nav className="ew-library-tabs" aria-label="סוגי תוכן">
          {tabs.map((tab) => (
            <button type="button" key={tab.id} onClick={() => changeTab(tab.id)}
              className={activeTab === tab.id ? "is-active" : ""} aria-current={activeTab === tab.id ? "page" : undefined}>
              {tab.label}<span>{tab.count}</span>
            </button>
          ))}
        </nav>

        {itemsToShow.length === 0 ? (
          <EmptyState type={activeType} onClick={() => {
            if (activeType === "exercise") navigate("/teacher/exercises/create");
            else if (activeType === "quiz") navigate("/teacher/quizzes/create");
            else navigate("/teacher/create");
          }} />
        ) : visibleItems.length === 0 ? (
          <p className="ew-library-no-results">לא נמצאו תכנים שמתאימים לחיפוש.</p>
        ) : (
          <div className="ew-library-grid">
            {visibleItems.map((item) => (
              <CompactItem key={item._id} item={item} type={activeType} onOpen={() => setSelectedId(item._id)} />
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <LibraryDetails key={`${activeType}-${selectedId}`} item={selectedItem} type={activeType}
          actionLoadingId={actionLoadingId} onClose={closeDetails}
          onView={() => { if (activeType === "lesson") navigate(`/teacher/lesson/${selectedItem._id}`); }}
          onEdit={() => openEditModal(selectedItem, activeType)}
          onTogglePublish={() => handleTogglePublish(selectedItem, activeType)}
          onDelete={() => handleDelete(selectedItem, activeType)} />
      )}
      {editingItem && (
        <EditContentModal editType={editType} editForm={editForm} setEditForm={setEditForm}
          actionLoadingId={actionLoadingId} editingItemId={editingItem._id}
          onClose={closeEditModal} onSave={handleSaveEdit} />
      )}
    </main>
  );
}
