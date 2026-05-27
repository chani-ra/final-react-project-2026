import { useState } from "react";

export const useRegister = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingPath, setIsLoadingPath] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    gender: "",
    age: "",
    parentOrChild: "",
    englishLevel: "",
    favoriteHobbies: [],
    expectations: [],
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const nextStep = () => {
    if (currentStep === 6) {
      setIsLoadingPath(true);

      setTimeout(() => {
        setIsLoadingPath(false);
        setCurrentStep(7);
      }, 1800);

      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFields = (fields) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const toggleArrayValue = (fieldName, value) => {
    setFormData((prev) => {
      const currentList = prev[fieldName] || [];
      const exists = currentList.includes(value);

      return {
        ...prev,
        [fieldName]: exists
          ? currentList.filter((item) => item !== value)
          : [...currentList, value],
      };
    });
  };

  return {
    currentStep,
    formData,
    isLoadingPath,
    nextStep,
    prevStep,
    updateFields,
    toggleArrayValue,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
};