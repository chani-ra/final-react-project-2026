import { useEffect, useMemo, useState } from "react";
import useMessageNotice from "../../../components/ui/useMessageNotice";
import { getDictionaryHelper } from "../../../services/aiService";
import { addDictionaryWord, deleteDictionaryWord, getMyDictionaryWords, toggleDictionaryWordMastered } from "../../../services/dictionaryService";
import { getDictionaryStats, filterDictionaryWords } from "./dictionaryModel.js";

export default function useDictionary() {
  const [words, setWords] = useState([]);

  const [form, setForm] = useState({
    word: "",
    translation: "",
    definition: "",
    example: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  useEffect(() => {
    let active = true;
    getMyDictionaryWords()
      .then((data) => {
        if (active) setWords(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (active) setMessage({ type: "error", text: error.toString() });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => getDictionaryStats(words), [words]);
  const filteredWords = useMemo(() => filterDictionaryWords(words, searchQuery, activeFilter), [words, searchQuery, activeFilter]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTranslate = async () => {
    if (!form.word.trim()) {
      setMessage({
        type: "error",
        text: "כתבי קודם מילה או ביטוי באנגלית לתרגום.",
      });
      return;
    }

    try {
      setTranslating(true);
      setMessage({ type: "", text: "" });

      const result = await getDictionaryHelper(form.word.trim());

      setForm((prev) => ({
        ...prev,
        word: result.correctedWord || prev.word,
        translation: result.translation || "",
        definition: result.definition || "",
        example: result.example || "",
      }));

      if (result.wasCorrected) {
        setMessage({
          type: "success",
          text: `מצאתי תיקון קטן: ${result.originalInput} → ${result.correctedWord}.`,
        });
      } else {
        setMessage({
          type: "success",
          text: "המילה נבדקה ותורגמה בהצלחה.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setTranslating(false);
    }
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();

    if (!form.word.trim()) {
      setMessage({ type: "error", text: "חובה להזין מילה באנגלית." });
      return;
    }

    if (!form.translation.trim()) {
      setMessage({ type: "error", text: "חובה להזין תרגום לעברית." });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const savedWord = await addDictionaryWord({
        word: form.word.trim(),
        translation: form.translation.trim(),
        definition: form.definition.trim(),
        example: form.example.trim(),
      });

      setWords((prev) => [savedWord, ...prev]);

      setForm({
        word: "",
        translation: "",
        definition: "",
        example: "",
      });

      setMessage({
        type: "success",
        text: "המילה נשמרה במילון האישי.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMastered = async (wordId) => {
    try {
      setActionLoadingId(wordId);

      const updatedWord = await toggleDictionaryWordMastered(wordId);

      setWords((prev) =>
        prev.map((word) => (word._id === wordId ? updatedWord : word))
      );
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDeleteWord = async (wordId) => {
    try {
      setActionLoadingId(wordId);

      await deleteDictionaryWord(wordId);

      setWords((prev) => prev.filter((word) => word._id !== wordId));

      setMessage({
        type: "success",
        text: "המילה נמחקה מהמילון.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return { form, searchQuery, setSearchQuery, activeFilter, setActiveFilter, loading, translating, saving, actionLoadingId, updateField, handleTranslate, handleSaveWord, handleToggleMastered, handleDeleteWord, stats, filteredWords };
}
