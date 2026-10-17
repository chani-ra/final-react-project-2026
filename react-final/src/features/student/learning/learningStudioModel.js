export function subcategoriesOf(categories, categoryId) {
  return categories.find((category) => category._id === categoryId)?.subcategories || [];
}

export function initialLearningSelection(categories) {
  const firstCategory = categories[0];
  return { categoryId: firstCategory?._id || "", subcategoryId: firstCategory?.subcategories?.[0]?._id || "" };
}

export function learningRequest({ categoryId, subcategoryId, prompt, provider }) {
  const trimmed = prompt.trim();
  if (!categoryId || !subcategoryId) throw new Error("בחרי תחום לימוד ותת־נושא");
  if (trimmed.length < 5 || trimmed.length > 800) throw new Error("כתבי בקשה באורך 5 עד 800 תווים");
  if (!["gemini", "openai"].includes(provider)) throw new Error("בחרי מנוע AI תקין");
  return { categoryId, subcategoryId, prompt: trimmed, provider };
}
