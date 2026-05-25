import React from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { useRegister } from './userRegister';

// --- רכיבי השלבים ---

const StepName = ({ value, update }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-2xl font-bold text-white text-center">איך קוראים לך? 👋</h2>
    <input autoFocus type="text" value={value} onChange={e => update({ name: e.target.value })} placeholder="הקלד את השם שלך כאן" className="p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none text-center text-lg" />
  </div>
);

const StepGender = ({ value, update, userName }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-2xl font-bold text-white text-center">שמחים להכיר, <span className="text-yellow-400">{userName}</span>! אתה בן או בת?</h2>
    <div className="grid grid-cols-2 gap-4">
      <button type="button" onClick={() => update({ gender: 'boy' })} className={`p-6 rounded-2xl text-xl font-bold transition-all flex flex-col items-center gap-2 ${value === 'boy' ? 'bg-blue-500 text-white scale-105 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}><span className="text-3xl">👦</span> בן</button>
      <button type="button" onClick={() => update({ gender: 'girl' })} className={`p-6 rounded-2xl text-xl font-bold transition-all flex flex-col items-center gap-2 ${value === 'girl' ? 'bg-pink-500 text-white scale-105 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}><span className="text-3xl">👧</span> בת</button>
    </div>
  </div>
);

const StepAge = ({ value, update, userName, isGirl }) => {
  const ages = ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16+'];
  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">{isGirl ? 'בת כמה את' : 'בן כמה אתה'}, <span className="text-yellow-400">{userName}</span>? 🎉</h2>
      <div className="flex flex-wrap justify-center gap-3 max-h-[180px] overflow-y-auto p-2">
        {ages.map(age => (
          <button type="button" key={age} onClick={() => update({ age })} className={`w-14 h-14 rounded-full font-bold text-lg flex items-center justify-center transition-all shadow-md ${value === age ? 'bg-yellow-400 text-slate-900 scale-110' : 'bg-white/10 text-white hover:bg-white/20'}`}>{age}</button>
        ))}
      </div>
    </div>
  );
};

const StepLevel = ({ value, update, userName, isGirl }) => {
  const levels = [
    { id: 'beginner', title: isGirl ? 'מתחילה 🎯' : 'מתחיל 🎯', desc: 'אני מכיר רק אותיות ומילים בסיסיות' },
    { id: 'intermediate', title: isGirl ? 'בינונית 🚀' : 'בינוני 🚀', desc: 'אני מסוגל לקרוא ולהבין משפטים פשוטים' },
    { id: 'advanced', title: isGirl ? 'מתקדמת 👑' : 'מתקדם 👑', desc: 'אני מדבר ומבין אנגלית כמעט שוטף' }
  ];
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">מה רמת האנגלית שלך, <span className="text-yellow-400">{userName}</span>?</h2>
      <div className="flex flex-col gap-3">
        {levels.map(lvl => (
          <button type="button" key={lvl.id} onClick={() => update({ level: lvl.id })} className={`p-4 rounded-xl text-right transition-all border-2 ${value === lvl.id ? 'bg-yellow-400 text-slate-900 border-yellow-400 shadow-lg' : 'bg-white/5 text-white border-transparent hover:bg-white/10'}`}>
            <div className="font-bold text-lg">{lvl.title}</div>
            <div className={`text-sm ${value === lvl.id ? 'text-slate-800' : 'text-gray-300'}`}>{lvl.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const StepInterests = ({ selectedList, toggleInterest, userName, isGirl }) => {
 const items = [
  { id: 'songs', label: '🎶 שירים ומוזיקה' }, 
  { id: 'dance', label: '💃 ריקוד' }, // החלפנו את חיות בריקוד
  { id: 'games', label: '🎮 משחקי מחשב' },
  { id: 'movies', label: '🎬 סרטים וסדרות' }, 
  { id: 'stories', label: '📚 סיפורים מעניינים' },
  { id: 'sports', label: '⚽ ספורט ומשחקים' }
];
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">מה {isGirl ? 'את הכי אוהבת' : 'אתה הכי אוהב'}, <span className="text-yellow-400">{userName}</span>?</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <button type="button" key={item.id} onClick={() => toggleInterest(item.id)} className={`p-3 rounded-xl font-semibold text-center transition-all ${selectedList.includes(item.id) ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-950 scale-105' : 'bg-white/5 text-white hover:bg-white/10'}`}>{item.label}</button>
        ))}
      </div>
    </div>
  );
};

const StepContact = ({ value, update }) => {
  const countries = ['ישראל', 'ארצות הברית', 'אנגליה', 'צרפת', 'קנדה', 'אחר'];
  const israelCities = ['ירושלים', 'בני ברק', 'תל אביב', 'חיפה', 'אשדוד', 'אחר'];
  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <input type="email" value={value.email} onChange={e => update({ email: e.target.value })} placeholder="אימייל" className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none" />
      <input type="tel" value={value.phone} onChange={e => update({ phone: e.target.value })} placeholder="מספר טלפון" className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none" />
      <select value={value.country} onChange={e => update({ country: e.target.value, city: '' })} className="p-3 rounded-xl bg-white/10 text-white focus:border-yellow-400 border-2 border-transparent outline-none appearance-none">
        <option value="" disabled className="text-black">בחר מדינה</option>
        {countries.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
      </select>
      {value.country === 'ישראל' && (
        <select value={value.city} onChange={e => update({ city: e.target.value })} className="p-3 rounded-xl bg-white/10 text-white focus:border-yellow-400 border-2 border-transparent outline-none appearance-none animate-fadeIn">
          <option value="" disabled className="text-black">בחר עיר</option>
          {israelCities.map(city => <option key={city} value={city} className="text-black">{city}</option>)}
        </select>
      )}
    </div>
  );
};

// --- הקומפוננטה הראשית ---

export default function Register() {
  const totalSteps = 6; 
  const dispatch = useDispatch(); 
  const { currentStep, formData, isLoadingPath, nextStep, prevStep, updateFields, toggleInterest, isFirstStep, isLastStep } = useRegister(totalSteps);

  const progressPercent = (currentStep / totalSteps) * 100;
  const isGirl = formData.gender === 'girl';

  const canContinue = () => {
    if (currentStep === 1 && !formData.name.trim()) return false;
    if (currentStep === 2 && !formData.gender) return false;
    if (currentStep === 3 && !formData.age) return false;
    if (currentStep === 4 && !formData.level) return false;
    if (currentStep === 6) {
      if (!formData.email || !formData.phone || !formData.country) return false;
      if (formData.country === 'ישראל' && !formData.city) return false;
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); 
    if (!canContinue()) return; 

    if (isLastStep) {
      dispatch(registerUser(formData));
      alert('הכל נשמר! עכשיו עוברים למסך הבית.'); 
    } else {
      nextStep();
    }
  };

  if (isLoadingPath) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-900 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="text-6xl animate-spin">⚙️</div>
          <h2 className="text-3xl font-bold text-white text-center">מכינים לך את המסלול המושלם...</h2>
          <p className="text-yellow-400 text-lg">מתאימים לך שירים ומשחקים 🎮🎶</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-900 flex flex-col items-center justify-center p-4" dir="rtl">
      <form onSubmit={handleFormSubmit} className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6">
        
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="min-h-[260px] flex flex-col justify-center">
          {currentStep === 1 && <StepName value={formData.name} update={updateFields} />}
          {currentStep === 2 && <StepGender value={formData.gender} update={updateFields} userName={formData.name} />}
          {currentStep === 3 && <StepAge value={formData.age} update={updateFields} userName={formData.name} isGirl={isGirl} />}
          {currentStep === 4 && <StepLevel value={formData.level} update={updateFields} userName={formData.name} isGirl={isGirl} />}
          {currentStep === 5 && <StepInterests selectedList={formData.interests} toggleInterest={toggleInterest} userName={formData.name} isGirl={isGirl} />}
          {currentStep === 6 && (
            <div className="animate-fadeIn">
              <h2 className="text-yellow-400 font-bold text-xl text-center mb-4">המסלול שלך מוכן! 🎉</h2>
              <p className="text-white text-center mb-6 text-sm">כדי שנוכל לשמור אותו, נצטרך כמה פרטים אחרונים:</p>
              <StepContact value={formData} update={updateFields} />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 gap-4">
          {!isFirstStep && (
            <button type="button" onClick={prevStep} className="text-white font-semibold hover:underline px-4 py-2">חזור</button>
          )}
          <button 
            type="submit" 
            disabled={!canContinue()}
            className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all text-center ${
              canContinue() ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 cursor-pointer' : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentStep === 5 ? 'הכן לי מסלול! ✨' : isLastStep ? 'שמור וסיים 🚀' : 'המשך'}
          </button>
        </div>
      </form>
    </div>
  );
}