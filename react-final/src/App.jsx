import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/layout/MainLayout";

import Home from "./components/Home";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";

// student components
import StudentDashboard from "./features/student/StudentDashboard";
import Tasks from "./features/student/Tasks";
import Chat from "./features/student/Chat";
import Courses from "./features/student/Courses";
import CourseDetails from "./features/student/CourseDetails";
import CreatePersonalCourse from "./features/student/CreatePersonalCourse";
import ExerciseView from "./features/student/ExerciseView";
import Dictionary from "./features/student/Dictionary";

// teacher components
import TeacherDashboard from "./features/teacher/TeacherDashboard";
import TeacherStudents from "./features/teacher/TeacherStudents";
import TeacherCreate from "./features/teacher/TeacherCreate";
import TeacherLibrary from "./features/teacher/TeacherLibrary";
import TeacherGrading from "./features/teacher/TeacherGrading";
import LessonView from "./features/teacher/LessonView";

// admin components
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminUsers from "./features/admin/AdminUsers";
import AdminContent from "./features/admin/AdminContent";
import AdminMessages from "./features/admin/AdminMessages";

const AdminSettings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white">
      🛠️ הגדרות מערכת גלובליות
    </h1>
  </div>
);

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* דפים ציבוריים */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* דפים מוגנים */}
        <Route element={<MainLayout />}>
          {/* תלמיד */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/create-personal-course" element={<CreatePersonalCourse />} />
          <Route path="/exercise/:exerciseId" element={<ExerciseView />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dictionary" element={<Dictionary />} />

          {/* מורה */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/create" element={<TeacherCreate />} />
          <Route path="/teacher/library" element={<TeacherLibrary />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />
          <Route path="/teacher/lesson/:lessonId" element={<LessonView />} />

          {/* מנהל */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}