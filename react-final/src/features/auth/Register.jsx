import React from 'react';
import { useRegister } from './userRegister';

// תת-קומפוננטה לשלב של השם
const StepName = ({ value, update }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-2xl font-bold text-white text-center">איך קוראים לך?</h2>
    <input 
      type="text" 
      value={value} 
      onChange={e => update({ name: e.target.value })}
      placeholder="הקלד את השם שלך כאן" 
      className="p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none text-center text-lg"
    />
  </div>
);

// תת-קומפוננטה לשלב של הגיל
const StepAge = ({ value, update }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-2xl font-bold text-white text-center">בן כמה אתה?</h2>
    <div className="grid grid-cols-2 gap-3">
      {['6-9', '10-12', '13-15', '16+'].map(ageRange => (
        <button
          key={ageRange}
          onClick={() => update({ age: ageRange })}
          className={`p-4 rounded-xl font-bold transition-all ${value === ageRange ? 'bg-yellow-400 text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          {ageRange}
        </button>
      ))}
    </div>
  </div>
);

export default function Register() {
  const totalSteps = 4; // סך הכל 4 שלבים בהרשמה
  const { currentStep, formData, nextStep, prevStep, updateFields, isFirstStep, isLastStep } = useRegister(totalSteps);

  // חישוב אחוז ההתקדמות של סרגל ההרשמה
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-900 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6">
        
        {/* סרגל התקדמות מלמעלה */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* הצגת השלב הנוכחי לפי המספר שלו */}
        <div className="min-h-[200px] flex flex-col justify-center">
          {currentStep === 1 && <StepName value={formData.name} update={updateFields} />}
          {currentStep === 2 && <StepAge value={formData.age} update={updateFields} />}
          {currentStep > 2 && <div className="text-white text-center font-bold">השלבים הבאים (רמה ותחומי עניין) ייבנו מיד!</div>}
        </div>

        {/* כפתורי הניווט למטה */}
        <div className="flex justify-between items-center mt-4 gap-4">
          {!isFirstStep && (
            <button onClick={prevStep} className="text-white font-semibold hover:underline px-4 py-2">
              חזור
            </button>
          )}
          <button 
            onClick={nextStep} 
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-yellow-400/20 transition-all text-center"
          >
            {isLastStep ? 'סיום והרשמה' : 'המשך'}
          </button>
        </div>

      </div>
    </div>
  );
}