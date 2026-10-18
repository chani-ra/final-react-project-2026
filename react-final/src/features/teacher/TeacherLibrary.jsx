import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TeacherContentCard from "./components/TeacherContentCard";
import EditContentModal from "./components/EditContentModal";
import {
  LibraryHeader, StatsGrid, TabsBar,
  QuizLibraryCard, EmptyState, HeaderLines,
} from "./components/library/TeacherLibrarySections";
import useTeacherLibrary from "./hooks/useTeacherLibrary";

export default function TeacherLibrary() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
