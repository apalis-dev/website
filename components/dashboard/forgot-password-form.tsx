"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "email" | "code" | "password";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const busy = loading || fetchStatus === "fetching";

  const finishReset = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          router.push("/dashboard/apps");
          return;
        }

        const url = decorateUrl("/dashboard/apps");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const onSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const { error: createError } = await signIn.create({
        identifier: email,
      });

      if (createError) {
        setFormError(
          getErrorMessage(createError, "We couldn't find that account.")
        );
        return;
      }

      const { error: sendError } =
        await signIn.resetPasswordEmailCode.sendCode();

      if (sendError) {
        setFormError(
          getErrorMessage(sendError, "We couldn't send a reset code.")
        );
        return;
      }

      setStep("code");
      toast.success("Check your email for a reset code.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.resetPasswordEmailCode.verifyCode({
        code,
      });

      if (error) {
        setFormError(getErrorMessage(error, "That code didn't work. Try again."));
        return;
      }

      if (signIn.status === "needs_new_password") {
        setStep("password");
        return;
      }

      setFormError("We couldn't verify that code. Please try again.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      setFormError("Use at least 8 characters.");
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.resetPasswordEmailCode.submitPassword({
        password,
        signOutOfOtherSessions: true,
      });

      if (error) {
        setFormError(
          getErrorMessage(error, "We couldn't update your password.")
        );
        return;
      }

      if (signIn.status === "complete") {
        await finishReset();
        return;
      }

      setFormError(
        "Your password was updated, but we couldn't finish signing you in. Please sign in again."
      );
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.resetPasswordEmailCode.sendCode();
      if (error) {
        setFormError(getErrorMessage(error, "We couldn't resend the code."));
        return;
      }
      toast.success("A new reset code is on its way.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onStartOver = () => {
    signIn.reset();
    setStep("email");
    setCode("");
    setPassword("");
    setFormError(null);
  };

  return (
    <Card size="sm">
      <CardHeader className="sr-only">
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Reset your password with an email code.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {step === "email" && (
          <form onSubmit={onSendCode} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoFocus
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy || !email.trim()}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Sending code…
                </>
              ) : (
                "Send reset code"
              )}
            </Button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={onVerifyCode} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-code">Verification code</Label>
              <Input
                id="reset-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                maxLength={6}
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Sent to {email}
              </p>
            </div>

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy || !code.trim()}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Verify code"
              )}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button
                type="button"
                onClick={onResendCode}
                disabled={busy}
                className="transition-colors hover:text-foreground disabled:opacity-50"
              >
                Resend code
              </button>
              <button
                type="button"
                onClick={onStartOver}
                className="transition-colors hover:text-foreground"
              >
                Start over
              </button>
            </div>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={onResetPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoFocus
              />
            </div>

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Updating password…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
