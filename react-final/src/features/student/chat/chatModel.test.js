import test from "node:test";
import assert from "node:assert/strict";
import { buildConversationTitle, buildWelcomeMessage, formatTime, getLevelLabel } from "./chatModel.js";

test("chat titles trim spaces and truncate to existing 38-character limit", () => {
  assert.equal(buildConversationTitle("  Hello   World  "), "Hello World");
  assert.equal(buildConversationTitle("a".repeat(45)), "a".repeat(38) + "...");
});

test("welcome messages retain user label and local-only greeting", () => {
  const greeting = buildWelcomeMessage({ username: "Test student" });
  assert.equal(greeting.sender, "ai");
  assert.match(greeting.text, /Test student/);
  assert.equal(greeting.id, "welcome-message");
});

test("chat level and missing timestamps preserve defaults", () => {
  assert.equal(getLevelLabel("advanced"), "מתקדמים");
  assert.equal(getLevelLabel("beginner"), "מתחילים");
  assert.match(formatTime(), /\d/);
});
