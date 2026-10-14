import test from "node:test";
import assert from "node:assert/strict";
import {
  getEmptyEditForm, getLevelLabel, getQuizTypeLabel,
} from "./libraryUtils.js";

test("edit form defaults remain unchanged", () => {
  const form = getEmptyEditForm();
  assert.equal(form.title, "");
  assert.equal(form.isPublic, false);
  assert.deepEqual(form.questions, []);
  assert.notStrictEqual(getEmptyEditForm().questions, form.questions);
});

test("library labels retain Hebrew presentation", () => {
  assert.equal(getLevelLabel("beginner"), "מתחילים");
  assert.equal(getLevelLabel("advanced"), "מתקדמים");
  assert.equal(getQuizTypeLabel("grammar"), "דקדוק");
  assert.equal(getQuizTypeLabel("mixed"), "מעורב");
  assert.equal(getQuizTypeLabel(undefined), "לא צוין");
});
