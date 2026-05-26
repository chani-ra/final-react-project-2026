import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
//student components
import StudentDashboard from './features/student/StudentDashboard';
import Tasks from './features/student/Tasks';
import Chat from './features/student/Chat';
import Courses from './features/student/Courses';
import Dictionary from './features/student/Dictionary';

//teacher components
import TeacherDashboard from './features/teacher/TeacherDashboard';
import TeacherStudents from './features/teacher/TeacherStudents';
import TeacherCreate from './features/teacher/TeacherCreate';
import TeacherLibrary from './features/teacher/TeacherLibrary';
import TeacherGrading from './features/teacher/TeacherGrading';

//admin components
import AdminDashboard from './features/admin/AdminDashboard';
// קומפוננטות זמניות (Stubs) כדי שהניווט יעבוד עכשיו בלי שגיאות:
// שימי לב: השורה של Tasks נמחקה מפה כדי שלא תהיה התנגשות!



// דפי מנהל זמניים
const AdminUsers = () => <div className="p-6"><h1 className="text-2xl font-bold">⚙️ ניהול משתמשים והרשאות</h1></div>;
const AdminCourses = () => <div className="p-6"><h1 className="text-2xl font-bold">🗂️ ניהול קורסים במערכת</h1></div>;
const AdminSettings = () => <div className="p-6"><h1 className="text-2xl font-bold">🛠️ הגדרות מערכת גלובליות</h1></div>;

export default function App() {
  return (
    <Router>
      <Routes>
        {/* דף כניסה/הרשמה - מחוץ ל-Navbar */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* כל הדפים המוגנים שנמצאים בתוך המעטפת (MainLayout) */}
        <Route element={<MainLayout />}>
          
          {/* נתיבים המיועדים לתלמיד */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dictionary" element={<Dictionary />} />

          {/* נתיבים המיועדים למורה */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/create" element={<TeacherCreate />} />
          <Route path="/teacher/library" element={<TeacherLibrary />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />

          {/* נתיבים המיועדים למנהל */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
        </Route>
      </Routes>
    </Router>
  );
}