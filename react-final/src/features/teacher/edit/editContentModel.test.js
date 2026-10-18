import test from "node:test";
import assert from "node:assert/strict";
import { updateEditField, updateEditQuestion, updateEditOption, removeEditQuestion, getModalTitle } from "./editContentModel.js";

const sample = () => ({ title: "Quiz", questions: [
  { question: "Q1", options: ["One", "Two"], correctAnswer: "Two" },
  { question: "Q2", options: ["A", "B"], correctAnswer: "A" },
] });

test("editing questions and fields never mutates the original form", () => {
  const form = sample();
  assert.equal(updateEditField(form, "title", "New").title, "New");
  const updated = updateEditQuestion(form, 0, "question", "Changed");
  assert.equal(updated.questions[0].question, "Changed");
  assert.equal(form.questions[0].question, "Q1");
  assert.strictEqual(updated.questions[1], form.questions[1]);
});

test("changing an option follows the correct answer only when needed", () => {
  const form = sample();
  const updated = updateEditOption(form, 0, 1, "Second");
  assert.equal(updated.questions[0].correctAnswer, "Second");
  assert.deepEqual(form.questions[0].options, ["One", "Two"]);
  assert.equal(updateEditOption(form, 0, 0, "First").questions[0].correctAnswer, "Two");
});

test("removing question preserves remaining question and metadata", () => {
  const form = sample();
  const updated = removeEditQuestion(form, 0);
  assert.deepEqual(updated.questions, [form.questions[1]]);
  assert.equal(updated.title, "Quiz");
  assert.equal(form.questions.length, 2);
  assert.equal(getModalTitle("quiz"), "עריכת בוחן");
});
