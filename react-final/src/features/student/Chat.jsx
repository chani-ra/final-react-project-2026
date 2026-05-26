import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function Chat() {
  const { user } = useSelector((state) => state.auth);
  
  // מצב (State) לשמירת רשימת ההודעות
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: `היי ${user?.name || 'שם'}! אני בולט, המורה האישי שלך לאנגלית. 🤖\nעל מה תרצה שנדבר היום? רוצה לתרגל שיחת היכרות או אולי לעבור על כללי דקדוק?`, 
      sender: 'ai', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // רפרנס כדי לגלול למטה אוטומטית כשיש הודעה חדשה
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. הוספת הודעת המשתמש
    const newUserMsg = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // 2. סימולציה של תשובת AI מתעכבת (כאן בעתיד יתחבר ה-API האמיתי)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: 'מצוין! כרגע זו רק סימולציה כדי לראות שהעיצוב עובד. בהמשך נחבר לכאן מודל בינה מלאכותית אמיתי שידע לתקן את האנגלית שלך בזמן אמת. תמשיך לכתוב לי כדי לראות איך הצ\'אט נגלל.',
        sender: 'ai',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl" dir="rtl">
      
      {/* כותרת הצ'אט העליונה */}
      <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg border border-indigo-400">🤖</div>
        <div>
          <h2 className="text-xl font-bold">בולט AI</h2>
          <p className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            מחובר ומוכן לתרגול
          </p>
        </div>
      </div>

      {/* אזור ההודעות (עם גלילה) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl relative shadow-md ${
              msg.sender === 'user' 
                ? 'bg-yellow-400 text-slate-900 rounded-tr-none' 
                : 'bg-slate-800 text-white rounded-tl-none border border-white/10'
            }`}>
              <p className="font-medium text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className={`text-[11px] mt-2 block font-bold ${msg.sender === 'user' ? 'text-slate-700' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        
        {/* אנימציית "מקליד..." */}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-slate-800 text-white p-5 rounded-2xl rounded-tl-none border border-white/10 flex gap-2 items-center shadow-md">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* אזור הקלדת ההודעה בתחתית */}
      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="הקלד כאן את ההודעה שלך באנגלית או בעברית..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition-all text-sm md:text-base"
            dir="auto"
            autoComplete="off"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
          >
            <span className="hidden sm:inline">שלח</span>
            <span className="text-xl">✈️</span>
          </button>
        </form>
      </div>
      
    </div>
  );
}