"use client";

import { useReducer } from "react";
import { useReverification } from "@clerk/nextjs";
import { toast } from "sonner";

import type { ClerkTotp, ClerkUser } from "./types";
import { getErrorMessage } from "./utils";

type TwoFactorState =
  | { step: "idle"; loading: boolean; error: string | null }
  | { step: "scan"; loading: boolean; error: string | null; totp: ClerkTotp }
  | { step: "verify"; loading: boolean; error: string | null; totp: ClerkTotp }
  | {
      step: "backup";
      loading: boolean;
      error: string | null;
      backupCodes: string[];
    };

type TwoFactorAction =
  | { type: "set-loading"; value: boolean }
  | { type: "set-error"; value: string | null }
  | { type: "scan"; totp: ClerkTotp }
  | { type: "verify" }
  | { type: "backup"; codes: string[] }
  | { type: "set-backup-codes"; codes: string[] }
  | { type: "reset" };

const initialState: TwoFactorState = {
  step: "idle",
  loading: false,
  error: null,
};

function twoFactorReducer(
  state: TwoFactorState,
  action: TwoFactorAction
): TwoFactorState {
  switch (action.type) {
    case "set-loading":
      return { ...state, loading: action.value };
    case "set-error":
      return { ...state, error: action.value };
    case "scan":
      return {
        step: "scan",
        loading: false,
        error: null,
        totp: action.totp,
      };
    case "verify":
      return state.step === "scan"
        ? {
            step: "verify",
            loading: false,
            error: null,
            totp: state.totp,
          }
        : state;
    case "backup":
      return state.step === "verify"
        ? {
            step: "backup",
            loading: false,
            error: null,
            backupCodes: action.codes,
          }
        : state;
    case "set-backup-codes":
      return state.step === "backup"
        ? { ...state, backupCodes: action.codes }
        : state;
    case "reset":
      return initialState;
    default:
      return state;
  }
}

export function useTwoFactor(user: ClerkUser) {
  const [state, dispatch] = useReducer(twoFactorReducer, initialState);

  const createTOTP = useReverification(() => user.createTOTP());
  const createBackupCode = useReverification(() => user.createBackupCode());

  const disableTwoFactor = useReverification(async () => {
    const response = await fetch("/api/account/2fa/disable", {
      method: "POST",
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);

      throw new Error(
        payload?.error ?? "We couldn't disable two-factor authentication."
      );
    }

    return response.json();
  });

  const startSetup = async () => {
    if (state.step !== "idle") {
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      const totp = await createTOTP();

      if (!totp) {
        throw new Error("We couldn't start two-factor setup.");
      }

      dispatch({ type: "scan", totp });
    } catch (error) {
      const message = getErrorMessage(
        error,
        "We couldn't start two-factor setup."
      );

      dispatch({
        type: "set-error",
        value: /not enabled/i.test(message)
          ? "Authenticator app sign-in isn't enabled in Clerk yet. Enable it in the Clerk Dashboard under User & authentication."
          : message,
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const continueToVerify = () => {
    if (state.step !== "scan") {
      return;
    }

    dispatch({ type: "verify" });
  };

  const verifyCode = async (code: string) => {
    if (state.step !== "verify") {
      return;
    }

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      dispatch({
        type: "set-error",
        value: "Enter the code from your authenticator app.",
      });
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      await user.verifyTOTP({ code: trimmedCode });
      await user.reload();

      let codes = state.totp.backupCodes ?? [];
      let backupError: string | null = null;

      if (codes.length === 0) {
        try {
          const backupCode = await createBackupCode();
          codes = backupCode?.codes ?? [];
        } catch (error) {
          backupError = getErrorMessage(
            error,
            "Two-factor authentication is enabled, but we couldn't generate backup codes."
          );
        }
      }

      dispatch({ type: "backup", codes });

      if (backupError) {
        dispatch({ type: "set-error", value: backupError });
      }

      toast.success("Two-factor authentication enabled");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(error, "We couldn't verify that code."),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const regenerateBackupCodes = async () => {
    if (state.step !== "backup") {
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      const backupCode = await createBackupCode();
      const codes = backupCode?.codes ?? [];

      dispatch({ type: "set-backup-codes", codes });

      if (codes.length === 0) {
        throw new Error("We couldn't generate backup codes.");
      }

      toast.success("New backup codes generated");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(error, "We couldn't generate backup codes."),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const disable = async () => {
    if (state.step !== "idle") {
      return;
    }

    dispatch({ type: "set-loading", value: true });
    dispatch({ type: "set-error", value: null });

    try {
      await disableTwoFactor();
      await user.reload();
      dispatch({ type: "reset" });
      toast.success("Two-factor authentication disabled");
    } catch (error) {
      dispatch({
        type: "set-error",
        value: getErrorMessage(
          error,
          "We couldn't disable two-factor authentication."
        ),
      });
    } finally {
      dispatch({ type: "set-loading", value: false });
    }
  };

  const reset = () => dispatch({ type: "reset" });

  return {
    state,
    startSetup,
    continueToVerify,
    verifyCode,
    regenerateBackupCodes,
    disable,
    reset,
  };
}
