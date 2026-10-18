import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { NoticeProvider } from "./components/ui/NoticeProvider";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SessionBootstrap from "./components/auth/SessionBootstrap";
import Home from "./components/Home";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Introduce from "./components/Introduce";

// shared components
const MyMessages = lazy(() => import("./features/shared/messages/MyMessages"));

// student components
const StudentDashboard = lazy(() => import("./features/student/StudentDashboard"));
const Tasks = lazy(() => import("./features/student/Tasks"));
const Chat = lazy(() => import("./features/student/Chat"));
const Courses = lazy(() => import("./features/student/Courses"));
const CourseDetails = lazy(() => import("./features/student/CourseDetails"));
const CreatePersonalCourse = lazy(() => import("./features/student/CreatePersonalCourse"));
const ExerciseView = lazy(() => import("./features/student/ExerciseView"));
const QuizView = lazy(() => import("./features/student/QuizView"));
const Dictionary = lazy(() => import("./features/student/Dictionary"));
const WritingTrainer = lazy(() => import("./features/student/WritingTrainer"));
const LearningStudio = lazy(() => import("./features/student/learning/LearningStudio"));

// teacher components
const TeacherDashboard = lazy(() => import("./features/teacher/TeacherDashBoard"));
const TeacherStudents = lazy(() => import("./features/teacher/TeacherStudents"));
const TeacherCreate = lazy(() => import("./features/teacher/TeacherCreate"));
const TeacherExerciseBuilder = lazy(() => import("./features/teacher/TeacherExerciseBuilder"));
const TeacherLibrary = lazy(() => import("./features/teacher/TeacherLibrary"));
const TeacherGrading = lazy(() => import("./features/teacher/TeacherGrading"));
const LessonView = lazy(() => import("./features/teacher/LessonView"));
const TeacherQuizBuilder = lazy(() => import("./features/teacher/TeacherQuizBuilder"));

// admin components
const AdminDashboard = lazy(() => import("./features/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./features/admin/AdminUsers"));
const AdminContent = lazy(() => import("./features/admin/AdminContent"));
const AdminMessages = lazy(() => import("./features/admin/AdminMessages"));
const AdminReviews = lazy(() => import("./features/admin/AdminReviews"));
const AdminLearningHistory = lazy(() => import("./features/admin/AdminLearningHistory"));

function RouteLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl bg-slate-900/60 px-5 py-3 text-sm text-white shadow-lg backdrop-blur-sm">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
        <span>טוען את העמוד...</span>
      </div>
    </div>
  );
}

const AdminSettings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white">
      הגדרות מערכת גלובליות
    </h1>
  </div>
);

export default function App() {
  return (
    <Router>
      <NoticeProvider>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { background: "#102e50", color: "#fff", border: "1px solid rgba(255,255,255,.3)", borderRadius: "14px", fontWeight: 700, direction: "rtl" } }} />
      <Introduce />
      <SessionBootstrap />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/messages" element={<MyMessages />} />

            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              {/* תלמיד */}
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/ai-lesson" element={<LearningStudio />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              <Route path="/lesson/:lessonId" element={<LessonView mode="student" />} />
              <Route
                path="/create-personal-course"
                element={<CreatePersonalCourse />}
              />
              <Route path="/exercise/:exerciseId" element={<ExerciseView />} />
              <Route path="/quiz/:quizId" element={<QuizView />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/writing" element={<WritingTrainer />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/dictionary" element={<Dictionary />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["teacher", "admin"]} />}>
              {/* מורה */}
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/students" element={<TeacherStudents />} />
              <Route path="/teacher/create" element={<TeacherCreate />} />
              <Route
                path="/teacher/exercises/create"
                element={<TeacherExerciseBuilder />}
              />
              <Route path="/teacher/library" element={<TeacherLibrary />} />
              <Route path="/teacher/grading" element={<TeacherGrading />} />
              <Route path="/teacher/lesson/:lessonId" element={<LessonView />} />
              <Route
                path="/teacher/quizzes/create"
                element={<TeacherQuizBuilder />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              {/* מנהל */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/learning" element={<AdminLearningHistory />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
        </Routes>
      </Suspense>
      </NoticeProvider>
    </Router>
  );
}