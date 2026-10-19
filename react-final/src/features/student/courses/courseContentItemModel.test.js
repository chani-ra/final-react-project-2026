import test from "node:test";
import assert from "node:assert/strict";
import { getItemType, getOpenButtonText, getShortDescription } from "./courseContentItemModel.js";

const tabs = ["lessons", "songs", "exercises", "quizzes"];

test("each content tab keeps its original item type", () => {
  assert.deepEqual(tabs.map(getItemType), ["lesson", "song", "exercise", "quiz"]);
  assert.equal(getItemType("unknown"), "lesson");
});

test("each content tab retains the original action label", () => {
  assert.deepEqual(tabs.map(getOpenButtonText), ["צפייה", "השמעה", "התחל", "התחל"]);
  assert.equal(getOpenButtonText("unknown"), "פתח");
});

test("content descriptions retain per-type fallbacks", () => {
  assert.equal(getShortDescription("lessons", { description: "Grammar" }), "Grammar");
  assert.equal(getShortDescription("songs", { theme: "Listening" }), "Listening");
  assert.equal(getShortDescription("exercises", { title: "Task" }), "תרגול אישי.");
  assert.equal(getShortDescription("quizzes", {}), "בדיקת הבנה.");
});

test("empty or unfamiliar items use the existing descriptions", () => {
  assert.equal(getShortDescription("lessons", {}), "שיעור מתוך המסלול.");
  assert.equal(getShortDescription("songs", {}), "תרגול האזנה.");
  assert.equal(getShortDescription("unknown", { description: "Custom" }), "Custom");
  assert.equal(getShortDescription("unknown", {}), "פריט מתוך הקורס.");
});
