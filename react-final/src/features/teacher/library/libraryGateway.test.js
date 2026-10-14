import test from "node:test";
import assert from "node:assert/strict";
import { createLibraryGateway } from "./libraryGateway.js";

function mockGateway() {
  const calls = [];
  const api = {};
  for (const type of ["Lesson", "Song", "Exercise", "Quiz"]) {
    api[`delete${type}`] = async (id) => calls.push(["delete", type, id]);
    api[`update${type}`] = async (id, payload) => {
      calls.push(["update", type, id, payload]);
      return { [type.toLowerCase()]: { title: "saved" } };
    };
  }
  api.getTeacherLessons = async (id) => { calls.push(["load", "lesson", id]); return [{ _id: "l" }]; };
  api.getTeacherSongs = async (id) => { calls.push(["load", "song", id]); return []; };
  api.getTeacherExercises = async (id) => { calls.push(["load", "exercise", id]); return [{ _id: "e" }]; };
  api.getTeacherQuizzes = async (...args) => { calls.push(["load", "quiz", ...args]); return []; };
  for (const type of ["Lesson", "Song", "Quiz"]) {
    api[`update${type}PublishStatus`] = async (id, isPublic) => {
      calls.push(["publish", type, id, isPublic]);
      return { [type.toLowerCase()]: { isPublic } };
    };
  }
  return { gateway: createLibraryGateway(api), calls };
}

test("loadAll uses correct four existing API endpoints", async () => {
  const { gateway, calls } = mockGateway();
  const result = await gateway.loadAll("teacher-id");
  assert.deepEqual(Object.keys(result), ["lessons", "songs", "exercises", "quizzes"]);
  assert.equal(result.lessons[0]._id, "l");
  assert.equal(result.exercises[0]._id, "e");
  assert.deepEqual(calls, [
    ["load", "lesson", "teacher-id"],
    ["load", "song", "teacher-id"],
    ["load", "exercise", "teacher-id"],
    ["load", "quiz"],
  ]);
});

test("delete/edit target the requested content type and response", async () => {
  const { gateway, calls } = mockGateway();
  await gateway.remove("song", "s1");
  const saved = await gateway.save("quiz", "q1", { title: "A" });
  assert.deepEqual(saved, { title: "saved" });
  assert.deepEqual(calls, [
    ["delete", "Song", "s1"],
    ["update", "Quiz", "q1", { title: "A" }],
  ]);
});

test("exercise publishing uses updateExercise payload, unlike other content", async () => {
  const { gateway, calls } = mockGateway();
  await gateway.publish("lesson", "l1", true);
  assert.equal(await gateway.publish("exercise", "e1", false), false);
  await gateway.publish("quiz", "q1", true);
  assert.deepEqual(calls, [
    ["publish", "Lesson", "l1", true],
    ["update", "Exercise", "e1", { isPublic: false }],
    ["publish", "Quiz", "q1", true],
  ]);
});

test("unexpected content type fails before invoking a service", async () => {
  const { gateway, calls } = mockGateway();
  await assert.rejects(() => gateway.remove("other", "id"), /לא נתמך/);
  assert.equal(calls.length, 0);
});
