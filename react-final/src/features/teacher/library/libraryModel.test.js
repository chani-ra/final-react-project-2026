import test from "node:test";
import assert from "node:assert/strict";
import { getLibraryView, getEditForm, buildUpdatePayload } from "./libraryModel.js";

test("counts and tabs accurately describe all four content types", () => {
  const lesson = { _id: "1", isPublic: true };
  const song = { _id: "2", isPublic: false };
  const exercise = { _id: "3", isPublic: true };
  const quiz = { _id: "4", isPublic: false };
  const result = getLibraryView({
    lessons: [lesson], songs: [song], exercises: [exercise], quizzes: [quiz],
  }, "songs");
  assert.deepEqual(result.tabs.map((tab) => tab.count), [1, 1, 1, 1]);
  assert.equal(result.publishedCount, 2);
  assert.equal(result.draftCount, 2);
  assert.equal(result.totalCount, 4);
  assert.equal(result.activeType, "song");
  assert.deepEqual(result.itemsToShow, [song]);
});

test("quiz form copies questions/options so editing cannot mutate original", () => {
  const original = {
    title: "Quiz", isPublic: true,
    questions: [{ question: "What?", options: ["A", "B"], points: 2 }],
  };
  const form = getEditForm(original, "quiz");
  form.questions[0].options.push("C");
  assert.deepEqual(original.questions[0].options, ["A", "B"]);
  assert.equal(form.questions[0].points, 2);
  assert.equal(form.quizType, "mixed");
});

test("update payloads preserve exact fields for each API", () => {
  const form = {
    title: "Example", topic: "food", theme: "music", description: "desc",
    instructions: "answer", category: "vocabulary", level: "beginner",
    englishLevel: "advanced", quizType: "mixed", duration: "20",
    passingScore: "80", questions: [{ question: "Hello?" }], isPublic: true,
    shouldNotSend: "secret",
  };
  assert.deepEqual(Object.keys(buildUpdatePayload("lesson", form)), [
    "title", "topic", "description", "category", "level",
  ]);
  assert.deepEqual(Object.keys(buildUpdatePayload("song", form)), [
    "title", "theme", "category", "level",
  ]);
  assert.deepEqual(Object.keys(buildUpdatePayload("exercise", form)), [
    "title", "description", "instructions", "category", "level", "isPublic",
  ]);
  const quiz = buildUpdatePayload("quiz", form);
  assert.equal(quiz.duration, 20);
  assert.equal(quiz.passingScore, 80);
  assert.deepEqual(quiz.questions, form.questions);
  assert.equal("shouldNotSend" in quiz, false);
  assert.throws(() => buildUpdatePayload("unknown", form), /לא נתמך/);
});
