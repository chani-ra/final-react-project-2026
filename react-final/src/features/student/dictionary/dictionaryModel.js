export function getDictionaryStats(words) {
  const mastered = words.filter(word => word.mastered).length;
  return { total: words.length, mastered, practicing: words.length - mastered };
}

export function filterDictionaryWords(words, searchQuery, activeFilter) {
  const search = searchQuery.toLowerCase().trim();
  return words.filter(word => {
    const matchesSearch = !search || word.word?.toLowerCase().includes(search) || word.translation?.toLowerCase().includes(search);
    const matchesFilter = activeFilter === "all" || (activeFilter === "mastered" && word.mastered) || (activeFilter === "practice" && !word.mastered);
    return matchesSearch && matchesFilter;
  });
}
