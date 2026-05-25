import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Register from './features/auth/Register';
import StudentDashboard from './features/student/StudentDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* נתיב ההרשמה נשאר מחוץ ל-Layout כי הוא דף בודד */}
        <Route path="/" element={<Register />} />
        
        {/* כל הנתיבים שבתוך ה-Layout יקבלו את ה-Navbar והעיצוב הקבוע */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          {/* כאן נוסיף בהמשך את שאר הדפים: /chat, /lessons, /admin וכו' */}
        </Route>
      </Routes>
    </Router>
  );
}