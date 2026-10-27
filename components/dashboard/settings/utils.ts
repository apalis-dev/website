import { isReverificationCancelledError } from "@clerk/nextjs/errors";

export function getErrorMessage(error: unknown, fallback: string) {
  if (isReverificationCancelledError(error)) {
    return "Verification was cancelled.";
  }

  if (error && typeof error === "object") {
    if ("errors" in error && Array.isArray(error.errors)) {
      const firstError = error.errors[0];

      if (
        firstError &&
        typeof firstError === "object" &&
        "message" in firstError &&
        typeof firstError.message === "string"
      ) {
        return firstError.message;
      }
    }

    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return fallback;
}
