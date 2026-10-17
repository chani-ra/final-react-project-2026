import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createExercise,
  generateExerciseWithAI,
} from "../../../services/exerciseService";
import {
  buildAIExerciseRequest,
  buildExercisePayload,
  normalizeAIExercise,
  validateExerciseForm,
} from "./exerciseBuilderModel.js";

export function useTeacherExerciseBuilder() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("manual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [questionDrafts, setQuestionDrafts] = useState([]);
  const [aiCount, setAiCount] = useState(4);
  const [aiFormat, setAiFormat] = useState("auto");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    type: "practice",
    category: "vocabulary",
    level: "beginner",
    targetAgeMin: 8,
    targetAgeMax: 18,
    hobbies: [],
    expectations: [],
    materials: "",
    isPublic: false,
    aiPrompt: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const currentList = prev[field] || [];
      const exists = currentList.includes(value);

      return {
        ...prev,
        [field]: exists
          ? currentList.filter((item) => item !== value)
          : [...currentList, value],
      };
    });
  };

  const handleGenerateWithAI = async () => {
    if (!form.aiPrompt.trim() && !form.title.trim()) {
      setMessage({
        type: "error",
        text: "כתבי נושא או בקשה ל־AI כדי ליצור תרגיל.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setMessage({ type: "", text: "" });

      const aiData = buildAIExerciseRequest(form, aiCount, aiFormat);

      const data = await generateExerciseWithAI(aiData);
      const normalizedExercise = normalizeAIExercise(data, form);

      setForm((prev) => ({
        ...prev,
        title: normalizedExercise.title,
        description: normalizedExercise.description,
        instructions: normalizedExercise.instructions,
      }));

      setQuestionDrafts(normalizedExercise.questions);
      setMode("manual");

      setMessage({
        type: "success",
        text: "ה־AI יצר טיוטת תרגיל. בדקי את ההוראות, ערכי לפי הצורך ואז שמרי.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveExercise = async () => {
    // ENGLISHWISE_NO_EMPTY_AI_EXERCISE
    if (form.aiPrompt.trim() && !questionDrafts.length) {
      setMessage({
        type: "error",
        text: "אי אפשר לשמור: לא נוצרו שאלות. צרי שוב בעזרת AI.",
      });
      return;
    }
    const validationError = validateExerciseForm(form, questionDrafts);

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setIsSaving(true);
      setMessage({ type: "", text: "" });

      const payload = buildExercisePayload(form, questionDrafts);

      await createExercise(payload);

      setMessage({
        type: "success",
        text: "התרגיל נשמר בהצלחה.",
      });

      setTimeout(() => {
        navigate("/teacher/library");
      }, 900);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    navigate,
    mode,
    setMode,
    isGenerating,
    isSaving,
    questionDrafts,
    setQuestionDrafts,
    aiCount,
    setAiCount,
    aiFormat,
    setAiFormat,
    message,
    form,
    updateField,
    toggleArrayValue,
    handleGenerateWithAI,
    handleSaveExercise,
  };
}
