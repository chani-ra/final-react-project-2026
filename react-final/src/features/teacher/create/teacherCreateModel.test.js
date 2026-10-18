import test from "node:test";
import assert from "node:assert/strict";
import { buildTeacherCreatePayload, validateTeacherCreate } from "./teacherCreateModel.js";

const defaults = { title: " Lesson ", topic: " Grammar ", description: " Description ", contentType: "video", category: "grammar", level: "beginner", minAge: 6, maxAge: 18, hobbies: ["reading"], expectations: [], publishMode: "draft", file: new Blob(["sample"], { type: "video/mp4" }), duration: "180", composer: "Known", lyricist: "Known" };

test("teacher create enforces required fields and consistent age range", () => {
  assert.equal(validateTeacherCreate(defaults), "");
  assert.equal(validateTeacherCreate({ ...defaults, file: null }), "נא לבחור קובץ.");
  assert.match(validateTeacherCreate({ ...defaults, minAge: 19 }), /גיל מינימלי/);
  assert.match(validateTeacherCreate({ ...defaults, contentType: "audio", composer: " " }), /מלחין/);
});

test("video and audio payloads preserve upload field names", () => {
  const video = buildTeacherCreatePayload(defaults);
  assert.equal(video.get("title"), "Lesson");
  assert.equal(video.get("topic"), "Grammar");
  assert.equal(video.get("isPublic"), "false");
  assert.equal(video.get("icon"), "lesson");
  assert.ok(video.has("video"));
  assert.equal(video.has("audioFile"), false);

  const audio = buildTeacherCreatePayload({ ...defaults, contentType: "audio", publishMode: "published" });
  assert.equal(audio.get("icon"), "song");
  assert.equal(audio.get("isPublic"), "true");
  assert.equal(audio.get("duration"), "180");
  assert.equal(audio.get("targetAge"), "6-18");
  assert.ok(audio.has("audioFile"));
  assert.equal(audio.has("video"), false);
});
