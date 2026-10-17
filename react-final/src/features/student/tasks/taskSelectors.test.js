import test from "node:test";
import assert from "node:assert/strict";
import { getTaskStats, getVisibleTasks, groupTasks, getTaskProgress, getLegacyPlanGroupKey } from "./taskSelectors.js";

const tasks = [
  { _id: "a", status: "pending", rewardXP: 10, source: "teacher" },
  { _id: "b", status: "completed", rewardXP: 100, source: "teacher" },
  { _id: "c", status: "review", rewardXP: 50, source: "teacher" },
  { _id: "d", status: "pending", rewardXP: 5, source: "ai_coach", planGroupId: "p1", planTitle: "My Plan" },
  { _id: "e", status: "pending", rewardXP: 20, source: "ai_coach", planGroupId: "p1" },
  { _id: "f", status: "pending", rewardXP: 0, source: "ai_coach", planGroupId: "p2" },
];

test("stats and XP only count pending reward", () => {
  assert.deepEqual(getTaskStats(tasks), {
    pending: 4, review: 1, completed: 1, total: 6, availableXP: 35,
  });
});

test("active tab isolates the relevant status", () => {
  assert.deepEqual(getVisibleTasks(tasks, "review").map((t) => t._id), ["c"]);
  assert.deepEqual(getVisibleTasks(tasks, "completed").map((t) => t._id), ["b"]);
});

test("AI plan tasks group without changing display order", () => {
  const grouped = groupTasks(getVisibleTasks(tasks, "pending"));
  assert.deepEqual(grouped.map((item) => [item.kind, item.key]), [
    ["task", "a"], ["plan", "p1"], ["plan", "p2"],
  ]);
  assert.deepEqual(grouped[1].tasks.map((t) => t._id), ["d", "e"]);
  assert.equal(grouped[1].title, "My Plan");
});

test("legacy coach tasks without planGroupId use five-second buckets", () => {
  const a = { _id: "1", source: "ai_coach", coachPlanFocus: "grammar", createdAt: "2026-10-18T10:00:01.000Z" };
  const b = { ...a, _id: "2", createdAt: "2026-10-18T10:00:04.000Z" };
  const c = { ...a, _id: "3", createdAt: "2026-10-18T10:00:06.000Z" };
  const result = groupTasks([a, b, c]);
  assert.deepEqual(result.map((x) => x.tasks.map((t) => t._id)), [["1", "2"], ["3"]]);
  assert.equal(getLegacyPlanGroupKey({ coachPlanFocus: "grammar", createdAt: "not a date" }), "legacy-grammar");
  assert.equal(getLegacyPlanGroupKey({}), "");
});

test("non-plan tasks and ungrouped coach tasks remain individual", () => {
  const result = groupTasks([
    { _id: "t", source: "teacher", planGroupId: "p1" },
    { _id: "a", source: "ai_coach" },
  ]);
  assert.deepEqual(result.map((item) => [item.kind, item.key]), [["task", "t"], ["task", "a"]]);
});

test("task completion progress uses all tasks and handles empty state", () => {
  assert.equal(getTaskProgress(tasks, getTaskStats(tasks)), 17);
  assert.equal(getTaskProgress([], getTaskStats([])), 0);
});

test("selectors do not mutate task data", () => {
  const before = JSON.stringify(tasks);
  getTaskStats(tasks);
  groupTasks(getVisibleTasks(tasks, "pending"));
  assert.equal(JSON.stringify(tasks), before);
});
