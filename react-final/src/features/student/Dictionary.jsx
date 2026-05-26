import React, { useState } from 'react';

export default function Dictionary() {
  // נתוני דמו למילון האישי
  const [words, setWords] = useState([
    { id: 1, word: 'Accomplish', translation: 'להשיג, להשלים', definition: 'To achieve or complete successfully', mastered: false },
    { id: 2, word: 'Consequence', translation: 'השלכה, תוצאה', definition: 'A result or effect of an action or condition', mastered: true },
    { id: 3, word: 'Persistent', translation: 'מתמיד, עקשן', definition: 'Continuing firmly in a course of action despite difficulty', mastered: false },
    { id: 4, word: 'Fluency', translation: 'רהיטות', definition: 'The ability to speak or write a language easily and accurately', mastered: true },
  ]);

  const [newWord, setNewWord] = useState('');
  const [newTranslation, setNewTranslation] = useState('');

  // פונקציה להוספת מילה חדשה למילון
  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWord.trim() || !newTranslation.trim()) return;

    const wordToAdd = {
      id: Date.now(),
      word: newWord,
      translation: newTranslation,
      definition: 'מילה שהוספה על ידי המשתמש',
      mastered: false
    };

    setWords([wordToAdd, ...words]);
    setNewWord('');
    setNewTranslation('');
  };

  // פונקציה לשינוי סטטוס "הכרת המילה"
  const toggleMastered = (id) => {
    setWords(words.map(w => w.id === id ? { ...w, mastered: !w.mastered } : w));
  };

  return (
    <div className="space-y-8" dir="rtl">
      
      {/* כותרת הדף */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h1 className="text-3xl font-bold tracking-tight">📓 המילון האישי שלי</h1>
        <p className="text-gray-400 mt-2">אסוף מילים חדשות, תרגל אותן ועקוב אחר אוצר המילים שלך.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* טופס הוספת מילה חדשה */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 h-fit">
          <h3 className="text-xl font-bold mb-4">➕ הוסף מילה חדשה</h3>
          <form onSubmit={handleAddWord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">המילה באנגלית</label>
              <input 
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="לדוגמה: Challenge"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 text-left"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">התרגום לעברית</label>
              <input 
                type="text"
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
                placeholder="לדוגמה: אתגר"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
            >
              שמור במילון
            </button>
          </form>
        </div>

        {/* רשימת המילים */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-2">
            רשימת המילים שלי ({words.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {words.map(w => (
              <div 
                key={w.id} 
                className={`border rounded-2xl p-5 transition-all flex flex-col justify-between
                  ${w.mastered 
                    ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-2xl font-bold text-yellow-400 tracking-wide" dir="ltr">{w.word}</h4>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      w.mastered 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {w.mastered ? 'יודע' : 'בתרגול'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-white mb-2">{w.translation}</p>
                  <p className="text-sm text-gray-400 italic font-light" dir="ltr">{w.definition}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                  <button 
                    onClick={() => toggleMastered(w.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all
                      ${w.mastered 
                        ? 'bg-white/5 text-gray-400 hover:bg-white/10' 
                        : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20'}`}
                  >
                    {w.mastered ? 'סמן כ-"בתרגול"' : 'אני מכיר את המילה! ✓'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}