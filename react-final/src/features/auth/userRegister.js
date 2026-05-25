import { useState } from 'react';

export const useRegister = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // כאן נשמור את כל מה שהילד ממלא
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    level: '',     // רמת אנגלית: מתחיל, בינוני, מתקדם
    interests: []  // מה הוא אוהב: שירים, משחקים, סרטים
  });

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  return {
    currentStep,
    formData,
    nextStep,
    prevStep,
    updateFields,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
};