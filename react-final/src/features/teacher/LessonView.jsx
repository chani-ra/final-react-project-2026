import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function LessonView() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת השיעור", err);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (!lesson) return <div className="text-white">טוען שיעור...</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold">{lesson.title}</h1>
      <p>{lesson.description}</p>
      {/* כאן יבוא הנגן וידאו בהמשך */}
    </div>
  );
}