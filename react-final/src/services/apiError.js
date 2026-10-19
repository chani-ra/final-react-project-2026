/** A stable application-facing error returned by our API services. */
export class ApiError extends Error {
  constructor(message, { status = null, code = "REQUEST_FAILED", cause } = {}) {
    super(message, { cause });
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  // Preserve friendly messages in existing UI callers using error.toString().
  toString() {
    return this.message;
  }
}

const safeMessage = (value) =>
  typeof value === "string" && value.trim() && value.length <= 300 ? value.trim() : null;

export function isRequestCanceled(error) {
  return error?.code === "ERR_CANCELED" || error?.name === "CanceledError";
}

/**
 * Normalize transport and server errors while preserving the original cause.
 * No global dialog is triggered here: the UI decides whether to show a notice,
 * inline validation feedback, or a retry action.
 */
export function toApiError(error, fallbackMessage = "לא הצלחנו להשלים את הפעולה. נסי שוב.") {
  if (error instanceof ApiError || isRequestCanceled(error)) return error;

  const fallback = safeMessage(fallbackMessage) || "לא הצלחנו להשלים את הפעולה. נסי שוב.";
  const status = Number.isInteger(error?.response?.status) ? error.response.status : null;
  const serverMessage = safeMessage(error?.response?.data?.message);
  let message;
  let code = "REQUEST_FAILED";

  if (status === 401) {
    code = "UNAUTHORIZED";
    message = "ההתחברות פגה או אינה תקינה. התחברי מחדש.";
  } else if (status === 403) {
    code = "FORBIDDEN";
    message = "אין לך הרשאה לבצע את הפעולה.";
  } else if (status === 404) {
    code = "NOT_FOUND";
    message = serverMessage || fallback;
  } else if (status === 409) {
    code = "CONFLICT";
    message = serverMessage || fallback;
  } else if (status === 429) {
    code = "RATE_LIMITED";
    message = serverMessage || "הגעת למגבלת השימוש כרגע. נסי שוב מאוחר יותר.";
  } else if (status >= 500) {
    code = "SERVER_ERROR";
    message = status === 503
      ? "השירות אינו זמין כרגע. נסי שוב מאוחר יותר."
      : "השירות נתקל בתקלה זמנית. נסי שוב בעוד מעט.";
  } else if (status !== null) {
    code = "HTTP_ERROR";
    message = serverMessage || fallback;
  } else if (error?.code === "ECONNABORTED") {
    code = "TIMEOUT";
    message = "הבקשה נמשכה זמן רב מדי. בדקי את החיבור ונסי שוב.";
  } else if (error?.isAxiosError || error?.request) {
    code = "NETWORK";
    message = "לא הצלחנו להתחבר לשרת. בדקי את החיבור ונסי שוב.";
  } else {
    message = safeMessage(error?.message) || safeMessage(error) || fallback;
  }

  return new ApiError(message, { status, code, cause: error });
}
