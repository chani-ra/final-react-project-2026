import React, { useState } from 'react';
import { createLesson, uploadSong } from '../../services/teacherService';

export default function TeacherCreate() {
  const [contentType, setContentType] = useState('video'); // 'video' או 'audio'
  const [selectedIcon, setSelectedIcon] = useState('🧠');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null); // הקובץ האמיתי לשליחה
  const [fileName, setFileName] = useState('');
  
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconsList = ['🧠', '💬', '🎵', '📚', '🚀', '📝', '🎧', '🗣️'];

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async () => {
    if (!title || !file) {
      setMessage({ type: 'error', text: 'נא למלא כותרת ולבחור קובץ' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('topic', topic);
    formData.append('icon', selectedIcon);
    
    // שליחת הקובץ בשם שהשרת מצפה לו (video לשיעור, audioFile לשיר)
    formData.append(contentType === 'video' ? 'video' : 'audioFile', file);

    try {
      if (contentType === 'video') {
        await createLesson(formData);
      } else {
        await uploadSong(formData);
      }
      setMessage({ type: 'success', text: 'התוכן עלה בהצלחה לשרת! 🚀' });
      setTitle(''); setTopic(''); setFile(null); setFileName('');
    } catch (error) {
      setMessage({ type: 'error', text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-white">✨ יצירת והעלאת תוכן לשרת</h1>
        <p className="text-gray-400 mt-1">מלאי את פרטי השיעור/השיר בהתאם להגדרות מסד הנתונים.</p>
      </div>

      {/* הודעות משוב */}
      {message.text && (
        <div className={`p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* בחירת סוג */}
      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
        <button onClick={() => { setContentType('video'); setFileName(''); setFile(null); }} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'video' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🎬 שיעור וידאו</button>
        <button onClick={() => { setContentType('audio'); setFileName(''); setFile(null); }} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${contentType === 'audio' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>🎵 שיר אודיו</button>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">כותרת ה{contentType === 'video' ? 'שיעור' : 'שיר'}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm" placeholder="לדוגמה: Present Simple Rules" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">נושא הלימוד</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm" placeholder="לדוגמה: Grammar" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">בחר אייקון מייצג:</label>
          <div className="flex gap-3 flex-wrap">
            {iconsList.map(icon => (
              <button key={icon} type="button" onClick={() => setSelectedIcon(icon)} className={`w-12 h-12 text-xl rounded-xl flex items-center justify-center transition-all border ${selectedIcon === icon ? 'bg-yellow-500 border-yellow-400 text-black scale-110' : 'bg-slate-900 border-white/10 text-white'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">קובץ מדיה</label>
          <div 
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${isDragging ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/25 bg-slate-900/50'}`}
          >
            <input type="file" accept={contentType === 'video' ? 'video/*' : 'audio/*'} onChange={handleFileChange} className="absolute opacity-0 cursor-pointer w-full h-full inset-0" />
            <span className="text-4xl mb-3 block">{contentType === 'video' ? '📹' : '🎧'}</span>
            <p className="text-gray-300 font-bold text-sm">{fileName ? `✅ קובץ נבחר: ${fileName}` : 'גררי לכאן או לחצי לבחירה'}</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all ${contentType === 'video' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {isLoading ? 'מעלה לשרת...' : 'שמור והעלה קובץ לשרת 🚀'}
        </button>
      </div>
    </div>
  );
}