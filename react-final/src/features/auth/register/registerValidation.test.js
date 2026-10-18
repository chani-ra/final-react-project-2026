import test from "node:test";
import assert from "node:assert/strict";
import { validateRegisterStep } from "./registerValidation.js";

const valid = {
  username: "Chani",
  gender: "female",
  age: "15",
  parentOrChild: "child",
  englishLevel: "beginner",
  favoriteHobbies: ["books"],
  expectations: ["vocabulary"],
  email: "user@example.com",
  phone: "0501234567",
  password: "abcdef",
  confirmPassword: "abcdef",
};

test("all registration steps accept valid data", () => {
  for (let step = 1; step <= 7; step++) {
    assert.deepEqual(validateRegisterStep(step, valid), {});
  }
});

test("final step reports each invalid field", () => {
  const errors = validateRegisterStep(7, {
    ...valid,
    email: "bad",
    phone: "",
    password: "123",
    confirmPassword: "different",
  });

  assert.deepEqual(
    Object.keys(errors),
    ["email", "phone", "password", "confirmPassword"]
  );
});

test("name, hobbies and goals are required", () => {
  assert.ok(
    validateRegisterStep(1, { ...valid, username: "A" }).username
  );

  assert.ok(
    validateRegisterStep(6, {
      ...valid,
      favoriteHobbies: [],
    }).favoriteHobbies
  );

  assert.ok(
    validateRegisterStep(6, {
      ...valid,
      expectations: [],
    }).expectations
  );
});
