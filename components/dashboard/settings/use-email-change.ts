"use client";

import { useReducer } from "react";
import { useReverification } from "@clerk/nextjs";
import { toast } from "sonner";

import type { ClerkEmailAddress, ClerkUser } from "./types";
import { getErrorMessage } from "./utils";

type EmailChangeState =
  | { step: "idle" }
  | {
      step: "input";
      error: string | null;
      loading: boolean;
    }
  | {
      step: "verify";
      email: string;
      pendingEmail: ClerkEmailAddress;
      error: string | null;
      loading: boolean;
    };

type EmailChangeAction =
  | { type: "start" }
  | { type: "set-loading"; value: boolean }
  | { type: "set-error"; value: string | null }
  | { type: "verify"; email: string; pendingEmail: ClerkEmailAddress }
  | { type: "reset" };

const initialState: EmailChangeState = { step: "idle" };

function emailChangeReducer(
  state: EmailChangeState,
  action: EmailChangeAction
): EmailChangeState {
  switch (action.type) {
    case "start":
      return { step: "input", error: null, loading: false };
    case "set-loading":
      return state.step === "idle"
        ? state
        : { ...state, loading: action.value };
    case "set-error":
      return state.step === "idle"
        ? state
        : { ...state, error: action.value };
    case "verify":
      return {
        step: "verify",
        email: action.email,
        pendingEmail: action.pendingEmail,
        error: null,
        loading: false,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export function useEmailChange(user: ClerkUser) {
  const [state, dispatch] = useReducer(emailChangeReducer, initialState);

  const createEmailAddress = useReverification((email: string) =>
    user.createEmailAddress({ email })
  );

  const updatePrimaryEmail = useReverification((emailAddressId: string) =>
    user.update({ primaryEmailAddressId: emailAddressId })
  );

  const start = () => dispatch({ type: "start" });

  const cancel = async (destroyPending = false) => {
    if (destroyPending && state.step === "verify") {
      await state.pendingEmail.destroy().catch(() => undefined);
    }

    dispatch({ type: "reset" });
  };

  const sendCode = async (email: string) => {
    if (state.step !== "input") {
      return;
    }

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      dispatch({ type: "set-error", value: "Enter an email address." });
      return;
    }

    if (trimmedEmail === user.primaryEmailAddress?.emailAddress) {
      dispatch({
        type: "set-error",
        value: "That's already your primary email address.",
      });
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      const emailAddress = await createEmailAddress(trimmedEmail);

      if (!emailAddress) {
        throw new Error("We couldn't add that email address.");
      }

      try {
        await emailAddress.prepareVerification({ strategy: "email_code" });
      } catch (error) {
        await emailAddress.destroy().catch(() => undefined);
        throw error;
      }

      dispatch({
        type: "verify",
        email: trimmedEmail,
        pendingEmail: emailAddress,
      });
      toast.success("Check your email for a verification code.");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(error, "We couldn't add that email address."),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const verifyCode = async (code: string) => {
    if (state.step !== "verify") {
      return;
    }

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      dispatch({
        type: "set-error",
        value: "Enter the verification code.",
      });
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      const verifiedEmail = await state.pendingEmail.attemptVerification({
        code: trimmedCode,
      });

      if (verifiedEmail.verification.status !== "verified") {
        dispatch({
          type: "set-error",
          value: "That code didn't work. Try again.",
        });
        return;
      }

      const previousPrimaryEmail = user.primaryEmailAddress;

      await updatePrimaryEmail(state.pendingEmail.id);

      if (
        previousPrimaryEmail &&
        previousPrimaryEmail.id !== state.pendingEmail.id
      ) {
        await previousPrimaryEmail.destroy().catch(() => undefined);
      }

      await user.reload();
      dispatch({ type: "reset" });
      toast.success("Email address updated");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(
          error,
          "We couldn't verify that email address."
        ),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const resendCode = async () => {
    if (state.step !== "verify") {
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      await state.pendingEmail.prepareVerification({ strategy: "email_code" });
      toast.success("A new verification code is on its way.");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(
          error,
          "We couldn't resend the verification code."
        ),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  return {
    state,
    start,
    cancel,
    sendCode,
    verifyCode,
    resendCode,
  };
}
