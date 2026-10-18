import test from "node:test";
import assert from "node:assert/strict";
import { getRecipientsCounts, getRecipientOptions, getRecipientCount, validateAdminMessage } from "./adminMessagesModel.js";
const users = [{ id: "1", username: "A", role: "student" }, { id: "2", role: "teacher" }, { id: "3", role: "admin" }, { id: "4", role: "user" }];
test("admin audience counts and individual choices", () => {
  const counts = getRecipientsCounts(users);
  assert.deepEqual(counts, { all: 4, students: 2, teachers: 1, admins: 1 });
  assert.equal(getRecipientOptions(users).length, 4);
  assert.equal(getRecipientCount({ targetType: "students" }, counts), 2);
  assert.equal(getRecipientCount({ targetType: "single", targetUser: "1" }, counts), 1);
});
test("admin message requires content and recipients", () => {
  const form = { title: "Hello", body: "Hi", targetType: "all", targetUser: "" };
  assert.equal(validateAdminMessage(form, 4), "");
  assert.match(validateAdminMessage({ ...form, body: " " }, 4), /תוכן/);
  assert.match(validateAdminMessage({ ...form, targetType: "single" }, 0), /בחרי משתמש/);
  assert.match(validateAdminMessage(form, 0), /נמענים/);
});
