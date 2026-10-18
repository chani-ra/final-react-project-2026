import test from "node:test";
import assert from "node:assert/strict";
import { getDictionaryStats, filterDictionaryWords } from "./dictionaryModel.js";

const words = [
  { word: "Hello", translation: "שלום", mastered: true },
  { word: "Apple", translation: "תפוח", mastered: false },
  { word: "Help", translation: "עזרה", mastered: false },
];

test("dictionary statistics reflect mastered words", () => {
  assert.deepEqual(getDictionaryStats(words), { total: 3, mastered: 1, practicing: 2 });
});

test("dictionary search and mastery filters combine without mutating words", () => {
  assert.deepEqual(filterDictionaryWords(words, "he", "all").map(w => w.word), ["Hello", "Help"]);
  assert.deepEqual(filterDictionaryWords(words, "", "practice").map(w => w.word), ["Apple", "Help"]);
  assert.deepEqual(filterDictionaryWords(words, "שלום", "mastered").map(w => w.word), ["Hello"]);
  assert.equal(words.length, 3);
});
