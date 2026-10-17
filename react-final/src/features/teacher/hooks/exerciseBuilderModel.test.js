import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAIExerciseRequest,
  buildExercisePayload,
  normalizeAIExercise,
  validateExerciseForm,
} from "./exerciseBuilderModel.js";

const makeForm = () => ({
  title: "  Past Simple  ",
  description: "  A practice lesson  ",
  instructions: "  Answer in English  ",
  type: "practice",
  category: "grammar",
  level: "beginner",
  targetAgeMin: 8,
  targetAgeMax: 18,
  hobbies: ["music"],
  expectations: ["improve grammar"],
  materials: " video link \n  worksheet  \n",
  isPublic: false,
  aiPrompt: "  Generate a quiz  ",
});

test("AI request retains profile, format and question count", () => {
  const request = buildAIExerciseRequest(makeForm(), 4, "open");
  assert.equal(request.questionCount, 4);
  assert.equal(request.questionFormat, "open");
  assert.equal(request.level, "beginner");
  assert.deepEqual(request.targetAges, { min: 8, max: 18 });
  assert.deepEqual(request.hobbies, ["music"]);
});

test("AI request uses the title if the prompt is empty", () => {
  const request = buildAIExerciseRequest({ ...makeForm(), aiPrompt: "" }, 2, "auto");
  assert.equal(request.prompt, "  Past Simple  ");
});

test("AI draft returns both editable questions and original mode", () => {
  const generated = normalizeAIExercise({ data: {
    title: "Generated exercise", format: "open",
    questions: [{ sentence: "What happened?", correctAnswer: "I went home", hint: "Use past tense" }],
  } }, makeForm());
  assert.equal(generated.questions[0].prompt, "What happened?");
  assert.equal(generated.questions[0].mode, "flexible");
  assert.equal(generated.questions[0].explanation, "Use past tense");
});

test("AI malformed questions are rejected", () => {
  assert.throws(() => normalizeAIExercise({ questions: [] }, makeForm()), /לא החזיר/);
  assert.throws(() => normalizeAIExercise({ questions: [{ question: "?" }] }, makeForm()), /חסרה שאלה/);
});

test("form validation retains required fields and prevents unsaved AI questions", () => {
  assert.match(validateExerciseForm({ ...makeForm(), title: "" }, []), /כותרת/);
  assert.match(validateExerciseForm(makeForm(), []), /ליצור שאלות/);
  assert.match(validateExerciseForm({ ...makeForm(), targetAgeMin: 19 }, [{ prompt: "Q", answer: "A" }]), /גיל/);
  assert.equal(validateExerciseForm(makeForm(), [{ prompt: "Q", answer: "A" }]), "");
});

test("save payload retains metadata and matches answerKey to questions", () => {
  const payload = buildExercisePayload(makeForm(), [
    { prompt: "  Q1  ", answer: "  A1  ", explanation: "hint", mode: "flexible" },
  ]);
  assert.equal(payload.title, "Past Simple");
  assert.equal(payload.createdByAI, true);
  assert.deepEqual(payload.questions, ["Q1"]);
  assert.deepEqual(payload.answerKey, [{ answer: "A1", explanation: "hint", mode: "flexible" }]);
  assert.deepEqual(JSON.parse(payload.materials), ["video link", "worksheet"]);
  assert.deepEqual(JSON.parse(payload.hobbies), ["music"]);
});

test("manual exercises omit optional question and answer keys", () => {
  const payload = buildExercisePayload({ ...makeForm(), aiPrompt: "" }, []);
  assert.equal("questions" in payload, false);
  assert.equal("answerKey" in payload, false);
  assert.equal(payload.createdByAI, false);
});
