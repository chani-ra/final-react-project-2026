import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeAdminSongs, getPreferredSongId, getAdminSongStats, markWeeklySong,
} from "./adminSongsModel.js";

const songs = [
  { _id: "a", isPublic: false, isWeeklySong: false },
  { _id: "b", isPublic: true, isWeeklySong: true },
  { _id: "c", isPublic: true, isWeeklySong: false },
];

test("admin songs normalize unexpected responses without fabricated data", () => {
  assert.deepEqual(normalizeAdminSongs(undefined), []);
  assert.deepEqual(normalizeAdminSongs({ songs }), []);
  assert.equal(normalizeAdminSongs(songs), songs);
});

test("admin songs prefer the weekly song and handle an empty list", () => {
  assert.equal(getPreferredSongId(songs), "b");
  assert.equal(getPreferredSongId(songs.filter((song) => !song.isWeeklySong)), "a");
  assert.equal(getPreferredSongId([]), "");
});

test("admin song counters reflect visibility and weekly status", () => {
  assert.deepEqual(getAdminSongStats(songs), {
    total: 3, publicSongs: 2, draftSongs: 1, weeklySongs: 1,
  });
});

test("updating the weekly song preserves previous objects and publishes the selected song", () => {
  const updated = markWeeklySong(songs, "a", "2026-10-19T12:00:00.000Z");
  assert.notEqual(updated, songs);
  assert.equal(songs[0].isPublic, false);
  assert.equal(songs[1].isWeeklySong, true);
  assert.deepEqual(updated.map((song) => song.isWeeklySong), [true, false, false]);
  assert.deepEqual(updated.map((song) => song.isPublic), [true, true, true]);
  assert.equal(updated[0].weeklySelectedAt, "2026-10-19T12:00:00.000Z");
  assert.equal(updated[1].weeklySelectedAt, null);
});
