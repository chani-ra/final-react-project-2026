import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/layout/MainLayout";
import Home from "./components/Home";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Introduce from "./components/Introduce";

// shared components
import MyMessages from "./features/shared/messages/MyMessages";

// student components
import StudentDashboard from "./features/student/StudentDashboard";
import Tasks from "./features/student/Tasks";
import Chat from "./features/student/Chat";
import Courses from "./features/student/Courses";
import CourseDetails from "./features/student/CourseDetails";
import CreatePersonalCourse from "./features/student/CreatePersonalCourse";
import ExerciseView from "./features/student/ExerciseView";
import QuizView from "./features/student/QuizView";
import Dictionary from "./features/student/Dictionary";
import WritingTrainer from "./features/student/WritingTrainer";

// teacher components
import TeacherDashboard from "./features/teacher/TeacherDashBoard";
import TeacherStudents from "./features/teacher/TeacherStudents";
import TeacherCreate from "./features/teacher/TeacherCreate";
import TeacherExerciseBuilder from "./features/teacher/TeacherExerciseBuilder";
import TeacherLibrary from "./features/teacher/TeacherLibrary";
import TeacherGrading from "./features/teacher/TeacherGrading";
import LessonView from "./features/teacher/LessonView";
import TeacherQuizBuilder from "./features/teacher/TeacherQuizBuilder";

// admin components
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminUsers from "./features/admin/AdminUsers";
import AdminContent from "./features/admin/AdminContent";
import AdminMessages from "./features/admin/AdminMessages";
import AdminReviews from "./features/admin/AdminReviews";

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
      <Toaster position="top-center" reverseOrder={false} />
      <Introduce />     
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          
          <Route path="/messages" element={<MyMessages />} />

          {/* תלמיד */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
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

          {/* מנהל */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}