import { useState } from 'react';

export const useRegister = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingPath, setIsLoadingPath] = useState(false); // האם אנחנו במסך הטעינה האמצעי?
  
  const [formData, setFormData] = useState({
    name: '', gender: '', age: '', level: '', interests: [],
    email: '', phone: '', country: '', city: ''
  });

  const nextStep = () => {
    // אם אנחנו מסיימים את החלק הכיף (שלב 5), נפעיל טעינה!
    if (currentStep === 5) {
      setIsLoadingPath(true);
      
      // מחכים 3 שניות, סוגרים את הטעינה ועוברים לשלב 6
      setTimeout(() => {
        setIsLoadingPath(false);
        setCurrentStep(6);
      }, 3000);
      
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const updateFields = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const isExist = prev.interests.includes(interest);
      const newInterests = isExist 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  return {
    currentStep,
    formData,
    isLoadingPath, // אנחנו מוציאים את זה החוצה כדי שהעיצוב ישתמש בזה
    nextStep,
    prevStep,
    updateFields,
    toggleInterest,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
};