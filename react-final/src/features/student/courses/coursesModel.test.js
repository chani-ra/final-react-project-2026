import test from "node:test";
import assert from "node:assert/strict";
import { getCourseContentStats, getCourseTotalItems, getCourseLevel, getLevelLabel, getCategoryLabel } from "./coursesModel.js";

test("course totals count each type without altering input", () => {
  const course = { lessons: [1, 2], exercises: [3], quizzes: [4, 5], songs: [] };
  assert.deepEqual(getCourseContentStats(course), { lessons: 2, exercises: 1, quizzes: 2, songs: 0 });
  assert.equal(getCourseTotalItems(course), 5);
  assert.deepEqual(getCourseContentStats({}), { lessons: 0, exercises: 0, quizzes: 0, songs: 0 });
});

test("course level and translated labels use existing fallbacks", () => {
  assert.equal(getCourseLevel({ difficulty: "advanced" }), "advanced");
  assert.equal(getLevelLabel("intermediate"), "ביניים");
  assert.equal(getLevelLabel(""), "אישי");
  assert.equal(getCategoryLabel("grammar"), "דקדוק");
  assert.equal(getCategoryLabel(""), "כללי");
});
