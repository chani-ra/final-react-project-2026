import test from "node:test";
import assert from "node:assert/strict";
import { resolveActiveSong } from "./songsModel.js";

test("song selection handles an initially empty course", () => {
  assert.equal(resolveActiveSong([], null), null);
  assert.equal(resolveActiveSong(undefined, null), null);
});

test("newly fetched songs automatically offer their first track", () => {
  const tracks = [{ _id: "first" }, { _id: "second" }];
  assert.equal(resolveActiveSong(tracks, null), tracks[0]);
  assert.equal(resolveActiveSong(tracks, "second"), tracks[1]);
});

test("selection falls back when a removed song is no longer available", () => {
  const tracks = [{ _id: "remaining" }];
  assert.equal(resolveActiveSong(tracks, "deleted"), tracks[0]);
});
