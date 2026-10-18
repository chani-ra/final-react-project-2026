import useMessageNotice from "../../../components/ui/useMessageNotice.js";
import React, { useState } from "react";
import { generateQuizWithAI } from "../../../services/aiService";
import { createQuiz } from "../../../services/quizService";

import SmartContentFields from "../components/SmartContentFields";

import {
  HeaderLines,
} from "../components/ui/TeacherInfoBlocks";


import { getCleanOptions } from "./quizBuilder.utils";
import {
  TeacherQuizHeader,
  InstructionBox,
  QuizDetailsSection,
  QuizSettingsSection,
  PublishSection,
} from "./QuizFormSections";
import {
  ActionButtons,
  QuizSideSummary,
} from "./QuizSummaryAndActions";
import {
  QuestionEditorList,
} from "./QuizQuestionEditor";

const emptyQuestion = {
  question: "",
  questionType: "multiple-choice",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  points: 1,
  difficulty: "easy",
};

export default function TeacherQuizBuilder() {
  const [publishMode, setPublishMode] = useState("draft");

  const [form, setForm] = useState({
    title: "",
    topic: "",
    description: "",
    category: "general",
    englishLevel: "beginner",
    quizType: "mixed",
    minAge: 6,
    maxAge: 18,
    questionCount: 5,
    duration: 30,
    passingScore: 70,
  });

  const [hobbies, setHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayValue = (fieldOrValue, valueOrList, maybeSetList) => {
    // תמיכה בקריאה הישנה אם נשארה איפשהו:
    // toggleArrayValue(value, list, setList)
    if (Array.isArray(valueOrList) && typeof maybeSetList === "function") {
      const value = fieldOrValue;
      const list = valueOrList;
      const setList = maybeSetList;

      if (list.includes(value)) {
        setList(list.filter((item) => item !== value));
        return;
      }

      setList([...list, value]);
      return;
    }

    // הקריאה החדשה מ-SmartContentFields:
    // toggleArrayValue("hobbies", value)
    const field = fieldOrValue;
    const value = valueOrList;

    if (field === "hobbies") {
      setHobbies((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }

    if (field === "expectations") {
      setExpectations((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const resetForm = () => {
    setPublishMode("draft");

    setForm({
      title: "",
      topic: "",
      description: "",
      category: "general",
      englishLevel: "beginner",
      quizType: "mixed",
      minAge: 6,
      maxAge: 18,
      questionCount: 5,
      duration: 30,
      passingScore: 70,
    });

    setHobbies([]);
    setExpectations([]);
    setQuestions([]);
  };

  const validateBaseForm = () => {
    if (!form.title.trim()) return "נא למלא כותרת בוחן.";
    if (!form.topic.trim()) return "נא למלא נושא לימוד.";

    if (Number(form.minAge) > Number(form.maxAge)) {
      return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי.";
    }

    if (Number(form.questionCount) < 1) {
      return "מספר שאלות חייב להיות לפחות 1.";
    }

    return "";
  };

  const validateQuestionsBeforeSave = () => {
    if (!questions.length) {
      return "צריך ליצור או להוסיף שאלות לפני שמירת הבוחן.";
    }

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      const cleanOptions = getCleanOptions(question.options);

      if (!question.question.trim()) {
        return `שאלה ${index + 1}: חסר טקסט שאלה.`;
      }

      if (cleanOptions.length < 2) {
        return `שאלה ${index + 1}: צריך לפחות שתי אפשרויות תשובה.`;
      }

      if (!question.correctAnswer.trim()) {
        return `שאלה ${index + 1}: צריך לבחור תשובה נכונה.`;
      }

      if (!cleanOptions.includes(question.correctAnswer)) {
        return `שאלה ${index + 1}: התשובה הנכונה חייבת להיות אחת מהאפשרויות.`;
      }
    }

    return "";
  };

  const normalizeAIQuestions = (aiQuestions) => {
    if (!Array.isArray(aiQuestions)) return [];

    return aiQuestions.map((question) => {
      const options = getCleanOptions(question.options);

      const finalOptions =
        options.length >= 2
          ? options
          : ["Option A", "Option B", "Option C", "Option D"];

      const correctAnswer =
        question.correctAnswer && finalOptions.includes(question.correctAnswer)
          ? question.correctAnswer
          : finalOptions[0];

      return {
        question: question.question || "",
        questionType: "multiple-choice",
        options: finalOptions,
        correctAnswer,
        explanation: question.explanation || "",
        points: Number(question.points) || 1,
        difficulty:
          form.englishLevel === "beginner"
            ? "easy"
            : form.englishLevel === "advanced"
            ? "hard"
            : "medium",
      };
    });
  };

  const handleGenerateQuestions = async () => {
    const validationError = validateBaseForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setGenerating(true);
      setMessage({ type: "", text: "" });
      setQuestions([]);

      const aiQuestions = await generateQuizWithAI({
        topic: form.topic.trim(),
        difficulty: form.englishLevel,
        questionCount: Number(form.questionCount) || 5,
      });

      const normalizedQuestions = normalizeAIQuestions(aiQuestions);

      if (!normalizedQuestions.length) {
        setMessage({
          type: "error",
          text: "ה־AI לא החזיר שאלות תקינות. נסי שוב עם נושא ברור יותר.",
        });
        return;
      }

      setQuestions(normalizedQuestions);

      setMessage({
        type: "success",
        text: "השאלות נוצרו בהצלחה. אפשר לערוך אותן ואז לשמור את הבוחן.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    const validationError = validateBaseForm() || validateQuestionsBeforeSave();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const cleanQuestions = questions.map((question) => ({
        ...question,
        question: question.question.trim(),
        options: getCleanOptions(question.options),
        correctAnswer: question.correctAnswer.trim(),
        explanation: question.explanation.trim(),
        points: Number(question.points) || 1,
      }));

      await createQuiz({
        title: form.title.trim(),
        description: form.description.trim(),
        courseId: null,

        englishLevel: form.englishLevel,
        quizType: form.quizType,
        questions: cleanQuestions,

        duration: Number(form.duration) || 30,
        passingScore: Number(form.passingScore) || 70,

        isActive: true,
        isPublic: publishMode === "published",

        category: form.category,
        targetAges: {
          min: Number(form.minAge) || 6,
          max: Number(form.maxAge) || 120,
        },
        hobbies,
        expectations,

        generatedByAI: true,
      });

      setMessage({
        type: "success",
        text:
          publishMode === "published"
            ? "הבוחן פורסם בהצלחה ויוכל להשתלב במסלולים אישיים."
            : "הבוחן נשמר כטיוטה.",
      });

      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        ...emptyQuestion,
        difficulty:
          form.englishLevel === "beginner"
            ? "easy"
            : form.englishLevel === "advanced"
            ? "hard"
            : "medium",
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const nextOptions = [...(question.options || [])];
        const oldOption = nextOptions[optionIndex];

        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === oldOption
              ? value
              : question.correctAnswer,
        };
      })
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: [...(question.options || []), ""],
            }
          : question
      )
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const removedOption = question.options?.[optionIndex];
        const nextOptions = (question.options || []).filter(
          (_, currentIndex) => currentIndex !== optionIndex
        );

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === removedOption
              ? ""
              : question.correctAnswer,
        };
      })
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) =>
      prev.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <TeacherQuizHeader
            questionCount={questions.length}
            publishMode={publishMode}
          />


          <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <InstructionBox />

              <div className="space-y-7">
                <QuizDetailsSection form={form} handleChange={handleChange} />

                <SmartContentFields
                  category={form.category}
                  level={form.englishLevel}
                  minAge={form.minAge}
                  maxAge={form.maxAge}
                  hobbies={hobbies}
                  expectations={expectations}
                  onChange={handleChange}
                  onToggleArrayValue={toggleArrayValue}
                  levelFieldName="englishLevel"
                  minAgeFieldName="minAge"
                  maxAgeFieldName="maxAge"
                />

                <QuizSettingsSection form={form} handleChange={handleChange} />

                <PublishSection
                  publishMode={publishMode}
                  setPublishMode={setPublishMode}
                />

                <ActionButtons
                  generating={generating}
                  saving={saving}
                  questionsCount={questions.length}
                  onGenerate={handleGenerateQuestions}
                  onSave={handleSaveQuiz}
                  onAddQuestion={addQuestion}
                  publishMode={publishMode}
                />
              </div>
            </section>

            <QuizSideSummary
              form={form}
              questions={questions}
              hobbies={hobbies}
              expectations={expectations}
              publishMode={publishMode}
            />
          </div>
        </div>
      </section>

      {questions.length > 0 && (
        <QuestionEditorList
          questions={questions}
          onUpdateQuestion={updateQuestion}
          onUpdateOption={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onRemoveQuestion={removeQuestion}
        />
      )}
    </main>
  );
}
