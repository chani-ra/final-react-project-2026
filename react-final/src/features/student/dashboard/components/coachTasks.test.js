import test from "node:test";
import assert from "node:assert/strict";
import { buildCoachTasks, saveCoachPlanTasks } from "./coachTasks.js";

test("coach tasks have stable source metadata and ordered labels", () => {
  const payload = buildCoachTasks({ focus: "Grammar", steps: ["A", "B"] });
  assert.equal(payload.planTitle, "Grammar");
  assert.equal(payload.coachPlanFocus, "Grammar");
  assert.deepEqual(payload.tasks.map((task) => task.title), ["שלב 1", "שלב 2"]);
  assert.ok(payload.tasks.every((task) => task.source === "ai_coach" && task.coachPlanFocus === "Grammar"));
});

test("coach saving triggers exactly one API call and returns its result", async () => {
  const calls = [];
  const result = await saveCoachPlanTasks(async (payload) => { calls.push(payload); return "saved"; }, { focus: "Listening", steps: ["listen"] });
  assert.equal(result, "saved");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].tasks.length, 1);
});

test("coach saving propagates API failures", async () => {
  await assert.rejects(saveCoachPlanTasks(async () => { throw new Error("API unavailable"); }, { steps: ["write"] }), /API unavailable/);
});
