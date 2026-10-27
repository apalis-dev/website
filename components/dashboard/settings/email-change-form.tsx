"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ClerkUser } from "./types";
import { useEmailChange } from "./use-email-change";

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address.")
    .pipe(z.email("Enter a valid email address.")),
});

const codeSchema = z.object({
  code: z.string().trim().min(1, "Enter the verification code."),
});

type EmailValues = z.infer<typeof emailSchema>;
type CodeValues = z.infer<typeof codeSchema>;

interface EmailChangeFormProps {
  user: ClerkUser;
}

export function EmailChangeForm({ user }: EmailChangeFormProps) {
  const { state, start, cancel, sendCode, verifyCode, resendCode } =
    useEmailChange(user);

  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });

  const { reset: resetEmailForm } = emailForm;
  const { reset: resetCodeForm } = codeForm;

  useEffect(() => {
    if (state.step === "idle") {
      resetEmailForm({ email: "" });
      resetCodeForm({ code: "" });
    }
  }, [resetCodeForm, resetEmailForm, state.step]);

  const loading = state.step === "idle" ? false : state.loading;
  const error = state.step === "idle" ? null : state.error;

  return (
    <div className="grid gap-2 py-3 sm:max-w-sm">
      {state.step === "idle" && (
        <>
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="settings-email">Email</Label>
            <Button type="button" variant="ghost" size="sm" onClick={start}>
              Change
            </Button>
          </div>
          <Input
            id="settings-email"
            type="email"
            value={user.primaryEmailAddress?.emailAddress ?? ""}
            disabled
          />
        </>
      )}

      {state.step === "input" && (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(({ email }) => sendCode(email))}
            className="space-y-2"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="new@example.com"
                      autoComplete="email"
                      autoFocus
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send code"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void cancel()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {state.step === "verify" && (
        <Form {...codeForm}>
          <form
            onSubmit={codeForm.handleSubmit(({ code }) => verifyCode(code))}
            className="space-y-2"
          >
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormDescription>
                    Enter the code sent to{" "}
                    <span className="font-medium text-foreground">
                      {state.email}
                    </span>
                    .
                  </FormDescription>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="size-3.5 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify email"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void resendCode()}
                disabled={loading}
              >
                Resend
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void cancel(true)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
