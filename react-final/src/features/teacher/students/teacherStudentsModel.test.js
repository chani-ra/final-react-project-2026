import test from "node:test";
import assert from "node:assert/strict";
import { formatStudentActivity, normalizeTeacherStudents } from "./teacherStudentsModel.js";

test("no activity is never misrepresented as recent activity", () => {
  assert.equal(formatStudentActivity(null), "טרם נרשמה פעילות");
  assert.equal(formatStudentActivity("invalid"), "לא ידוע");
});

test("teacher students view normalizes progress without altering source data", () => {
  const source = [{ id: "1", progress: 120, lastActivityAt: null }];
  const rows = normalizeTeacherStudents(source);
  assert.equal(rows[0].progress, 100);
  assert.equal(rows[0].lastActive, "טרם נרשמה פעילות");
  assert.equal(source[0].progress, 120);
  assert.deepEqual(normalizeTeacherStudents(null), []);
});
