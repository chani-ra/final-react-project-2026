import assert from "node:assert/strict";
import test from "node:test";
import { calculateCoachProgress, getCoachStepsForKey, readSavedCoachSteps } from "./coachProgressModel.js";

function fakeStorage(values = {}) {
  return { getItem: (key) => values[key] ?? null };
}

test("coach progress restores saved steps for a plan", () => {
  assert.deepEqual(readSavedCoachSteps(fakeStorage({ a: "[0,2]" }), "a"), [0, 2]);
});

test("coach progress ignores malformed or unrelated stored values", () => {
  assert.deepEqual(readSavedCoachSteps(fakeStorage({ a: "broken" }), "a"), []);
  assert.deepEqual(readSavedCoachSteps(fakeStorage({ a: "{}" }), "a"), []);
  assert.deepEqual(readSavedCoachSteps(fakeStorage({ a: '[1,"x",3]' }), "a"), [1, 3]);
  assert.deepEqual(readSavedCoachSteps(null, "a"), []);
});

test("coach progress for another plan does not reuse the previous plan's steps", () => {
  const current = { key: "user-plan-a", steps: [0] };
  const storage = fakeStorage({ "user-plan-b": "[1,2]" });
  assert.deepEqual(getCoachStepsForKey(current, "user-plan-a", storage), [0]);
  assert.deepEqual(getCoachStepsForKey(current, "user-plan-b", storage), [1, 2]);
});

test("coach progress percentage ignores duplicate, invalid, and out-of-range steps", () => {
  assert.equal(calculateCoachProgress([0, 0, 2, 99, -1, "1"], 3), 67);
  assert.equal(calculateCoachProgress([0, 1], 2), 100);
  assert.equal(calculateCoachProgress([], 0), 0);
  assert.equal(calculateCoachProgress(null, 3), 0);
});
