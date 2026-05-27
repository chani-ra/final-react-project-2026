import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// ודאי שהייבוא של axios מוגדר נכון
import axios from 'axios'; 
export default function LessonView() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/lessons/${lessonId}`);
        // השרת מחזיר אובייקט עם שדה בשם lesson
        setLesson(res.data.lesson); 
      } catch (err) {
        console.error("שגיאה בטעינת השיעור", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className="text-white p-10">טוען נתונים...</div>;
  if (!lesson) return <div className="text-white p-10">השיעור לא נמצא.</div>;

  return (
    <div className="p-10 text-white max-w-4xl mx-auto" dir="rtl">
      <h1 className="text-4xl font-black mb-2">{lesson.title}</h1>
      <p className="text-indigo-400 font-bold mb-6">נושא: {lesson.topic}</p>
      
      {/* תצוגת הוידאו */}
      <div className="bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8">
        <video 
          controls 
          className="w-full h-auto"
          src={`http://localhost:3000${lesson.videoUrl}`}
        >
          הדפדפן שלך לא תומך בנגן וידאו.
        </video>
      </div>

      <h2 className="text-2xl font-bold mb-2">תיאור השיעור</h2>
      <p className="text-gray-300 bg-white/5 p-4 rounded-xl">
        {lesson.description || 'לא הוזן תיאור לשיעור זה.'}
      </p>
    </div>
  );
}