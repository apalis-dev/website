"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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

import type { ClerkUser } from "./types";
import { useTwoFactor } from "./use-two-factor";

const codeSchema = z.object({
  code: z.string().trim().min(1, "Enter the code from your authenticator app."),
});

type CodeValues = z.infer<typeof codeSchema>;

interface TwoFactorSectionProps {
  user: ClerkUser;
}

export function TwoFactorSection({ user }: TwoFactorSectionProps) {
  const {
    state,
    startSetup,
    continueToVerify,
    verifyCode,
    regenerateBackupCodes,
    disable,
    reset,
  } = useTwoFactor(user);

  const codeForm = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });
  const { reset: resetCodeForm } = codeForm;

  useEffect(() => {
    if (state.step !== "verify") {
      resetCodeForm({ code: "" });
    }
  }, [resetCodeForm, state.step]);

  const loading = state.loading;
  const error = state.error;
  const twoFactorEnabled = user.twoFactorEnabled || user.backupCodeEnabled;

  const copyBackupCodes = async () => {
    if (state.step !== "backup") {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.backupCodes.join("\n"));
      toast.success("Backup codes copied");
    } catch {
      toast.error("We couldn't copy the backup codes.");
    }
  };

  return (
    <div className="py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Two-factor authentication</p>
          <p className="text-sm text-muted-foreground">
            {user.totpEnabled
              ? "An authenticator app is enabled."
              : user.backupCodeEnabled
                ? "Backup codes are enabled."
                : "Add an extra layer of security to your account."}
          </p>
        </div>

        {state.step === "idle" &&
          (twoFactorEnabled ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void disable()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Disabling…
                </>
              ) : (
                "Disable"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void startSetup()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Starting…
                </>
              ) : (
                "Enable 2FA"
              )}
            </Button>
          ))}
      </div>

      {state.step === "scan" && (
        <div className="mt-4 rounded-lg border p-4">
          <p className="font-medium">Scan this code</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use an authenticator app such as 1Password, Authy, or Google
            Authenticator.
          </p>

          {state.totp.uri && (
            <div className="mt-4 w-fit rounded-md bg-white p-3">
              <QRCodeSVG
                value={state.totp.uri}
                size={160}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          )}

          {state.totp.secret && (
            <p className="mt-3 text-xs text-muted-foreground">
              Can&apos;t scan it? Enter this key instead:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                {state.totp.secret}
              </code>
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={continueToVerify}>
              Continue
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {state.step === "verify" && (
        <Form {...codeForm}>
          <form
            onSubmit={codeForm.handleSubmit(({ code }) => verifyCode(code))}
            className="mt-4 max-w-sm space-y-3 rounded-lg border p-4"
          >
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormDescription>
                    Enter the 6-digit code from your authenticator app.
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
                  "Verify and enable"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reset}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {state.step === "backup" && (
        <div className="mt-4 rounded-lg border p-4">
          <p className="font-medium">Save your backup codes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Each code can be used once if you lose access to your authenticator
            app. Store them somewhere safe.
          </p>

          {state.backupCodes.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-md bg-muted/40 p-3 font-mono text-xs sm:max-w-sm">
              {state.backupCodes.map((code) => (
                <span key={code}>{code}</span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-destructive">
              Backup codes weren&apos;t generated.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {state.backupCodes.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void copyBackupCodes()}
              >
                Copy codes
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void regenerateBackupCodes()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate new codes"
              )}
            </Button>
            <Button type="button" size="sm" onClick={reset}>
              Done
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
