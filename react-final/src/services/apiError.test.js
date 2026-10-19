import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, isRequestCanceled, toApiError } from "./apiError.js";

test("validation errors keep safe actionable server messages", () => {
  const original = { response: { status: 422, data: { message: "יש למלא כותרת" } } };
  const err = toApiError(original, "ברירת מחדל");
  assert.ok(err instanceof Error);
  assert.equal(err.message, "יש למלא כותרת");
  assert.equal(err.status, 422);
  assert.equal(err.code, "HTTP_ERROR");
  assert.equal(err.cause, original);
  assert.equal(err.toString(), "יש למלא כותרת");
});

test("authentication and authorization have distinct error codes", () => {
  const unauthorized = toApiError({ response: { status: 401 } });
  const forbidden = toApiError({ response: { status: 403 } });
  assert.equal(unauthorized.code, "UNAUTHORIZED");
  assert.equal(forbidden.code, "FORBIDDEN");
  assert.notEqual(unauthorized.message, forbidden.message);
});

test("rate limit has an actionable message and retains backend quota notice", () => {
  const err = toApiError({ response: { status: 429, data: { message: "מכסת AI יומית נוצלה" } } });
  assert.equal(err.code, "RATE_LIMITED");
  assert.match(err.message, /מכסת AI/);
});

test("server errors do not expose raw internal error messages", () => {
  const original = { response: { status: 500, data: { message: "secret_key=xxx internal stack" } } };
  const err = toApiError(original);
  assert.equal(err.code, "SERVER_ERROR");
  assert.doesNotMatch(err.message, /secret_key/);
  assert.equal(err.cause, original);
});

test("connection failures and timeouts have separate codes", () => {
  const network = toApiError({ isAxiosError: true, request: {} });
  const timeout = toApiError({ code: "ECONNABORTED", isAxiosError: true });
  assert.equal(network.code, "NETWORK");
  assert.equal(timeout.code, "TIMEOUT");
});

test("cancelled requests are not converted into user-facing errors", () => {
  const canceled = { code: "ERR_CANCELED", name: "CanceledError" };
  assert.equal(isRequestCanceled(canceled), true);
  assert.equal(toApiError(canceled), canceled);
});

test("local validation errors retain their own wording", () => {
  const err = toApiError(new Error("חסר מזהה קורס"));
  assert.ok(err instanceof ApiError);
  assert.equal(err.message, "חסר מזהה קורס");
});

test("normalizing twice retains the original normalized error", () => {
  const err = toApiError({ response: { status: 503 } });
  assert.equal(toApiError(err), err);
});
