
import test from "node:test";
import assert from "node:assert/strict";

import {
  getCleanOptions,
  getLevelLabel,
  getCategoryLabel,
  getQuizTypeLabel,
} from "./quizBuilder.utils.js";

test("option normalization removes empty options", () => {
  assert.deepEqual(
    getCleanOptions([" A ", "", " B "]),
    ["A", "B"]
  );

  assert.deepEqual(getCleanOptions(null), []);
});

test("labels retain existing behavior", () => {
  assert.equal(getLevelLabel("beginner"), "מתחילים");
  assert.equal(getCategoryLabel("grammar"), "דקדוק");
  assert.equal(getQuizTypeLabel("mixed"), "מעורב");
});
