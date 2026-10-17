import { useCallback, useEffect, useState } from "react";
import { createAILesson, getLearningCatalog, getLearningProviders, getMyLearningHistory } from "../../../services/learningService";
import { initialLearningSelection, learningRequest, subcategoriesOf } from "./learningStudioModel.js";

export function useLearningStudio() {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [provider, setProvider] = useState("gemini");
  const [prompt, setPrompt] = useState("");
  const [lesson, setLesson] = useState(null);
  const [history, setHistory] = useState({ items: [], page: 1, pages: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const loadHistory = useCallback(async (page = 1) => {
    setHistoryLoading(true);
    try { setHistory(await getMyLearningHistory(page)); }
    catch (err) { setError(err.message); }
    finally { setHistoryLoading(false); }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [catalog, engines, recent] = await Promise.all([getLearningCatalog(), getLearningProviders(), getMyLearningHistory()]);
        if (!active) return;
        setCategories(catalog);
        setProviders(engines);
        setHistory(recent);
        const selection = initialLearningSelection(catalog);
        setCategoryId(selection.categoryId);
        setSubcategoryId(selection.subcategoryId);
        if (!engines.some((engine) => engine.id === "gemini" && engine.available)) {
          setProvider(engines.find((engine) => engine.available)?.id || "gemini");
        }
      } catch (err) { if (active) setError(err.message); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  const changeCategory = (nextId) => {
    setCategoryId(nextId);
    setSubcategoryId(subcategoriesOf(categories, nextId)[0]?._id || "");
  };

  const createLesson = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const request = learningRequest({ categoryId, subcategoryId, prompt, provider });
      setSaving(true);
      const item = await createAILesson(request);
      setLesson(item);
      setActiveTab("create");
      await loadHistory(1);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return {
    categories, providers, categoryId, subcategoryId, provider, prompt, lesson, history,
    loading, saving, historyLoading, error, activeTab, setActiveTab,
    setProvider, setPrompt, setLesson, changeCategory, setSubcategoryId, createLesson, loadHistory,
    subcategories: subcategoriesOf(categories, categoryId),
  };
}
