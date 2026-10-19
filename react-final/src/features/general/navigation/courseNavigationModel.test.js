import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCourseTab, courseTabFromSearch, courseTabPath, resolveCourseReturn } from "./courseNavigationModel.js";

test("a course tab survives refresh and invalid tabs fall back to lessons", () => {
  assert.equal(courseTabFromSearch("?tab=songs"), "songs");
  assert.equal(courseTabFromSearch("?tab=quizzes"), "quizzes");
  assert.equal(courseTabFromSearch("?tab=not-real"), "lessons");
});

test("back destinations preserve their exact course category", () => {
  for (const tab of ["lessons", "songs", "exercises", "quizzes"]) {
    const destination = resolveCourseReturn({ state: { courseReturn: { courseId: "abc123", tab } } }, "lessons");
    assert.equal(destination.path, `/course/abc123?tab=${tab}`);
  }
});

test("direct item URL falls back to query courseId and correct tab", () => {
  assert.equal(resolveCourseReturn({ search: "?courseId=abc123" }, "quizzes").path, "/course/abc123?tab=quizzes");
  assert.equal(resolveCourseReturn({ search: "" }, "lessons").path, null);
});

test("return target is a canonical internal path, not an arbitrary redirect", () => {
  assert.equal(courseTabPath("../other", "not-real"), "/course/..%2Fother?tab=lessons");
  assert.equal(courseTabPath("", "songs"), null);
  assert.equal(normalizeCourseTab("songs"), "songs");
});
