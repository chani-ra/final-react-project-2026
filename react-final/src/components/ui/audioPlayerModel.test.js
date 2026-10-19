import test from "node:test";
import assert from "node:assert/strict";
import { clampPlaybackPosition, formatPlaybackTime } from "./audioPlayerModel.js";

test("player time remains readable for missing and long tracks", () => {
  assert.equal(formatPlaybackTime(NaN), "0:00");
  assert.equal(formatPlaybackTime(62.9), "1:02");
  assert.equal(formatPlaybackTime(3661), "61:01");
});

test("player progress never exceeds the track duration", () => {
  assert.equal(clampPlaybackPosition(90, 60), 60);
  assert.equal(clampPlaybackPosition(-2, 60), 0);
  assert.equal(clampPlaybackPosition(20, NaN), 0);
});
