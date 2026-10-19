import test from "node:test";
import assert from "node:assert/strict";
import { audioReturnTarget } from "./audioReturnModel.js";

test("course audio always returns to its songs tab", () => {
  assert.deepEqual(audioReturnTarget({ courseId: "course 1" }), {
    path: "/course/course%201?tab=songs",
    label: "חזרה לשירים",
  });
});

test("weekly audio returns to dashboard and arbitrary destinations are ignored", () => {
  assert.deepEqual(audioReturnTarget({ returnPath: "/dashboard" }), {
    path: "/dashboard",
    label: "חזרה לדשבורד",
  });
  assert.equal(audioReturnTarget({ returnPath: "https://invalid.example" }), null);
});
