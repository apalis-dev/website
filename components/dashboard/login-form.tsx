"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { GitHubIcon } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

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

export function LoginForm() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "verify">("credentials");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const busy = loading || fetchStatus === "fetching";

  const finishSignIn = async () => {
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

  const startVerification = async () => {
    const emailCodeFactor = signIn.supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code"
    );

    if (!emailCodeFactor) {
      setFormError(
        "This account needs a verification method that isn't available here. Please contact support."
      );
      return false;
    }

    const { error } = await signIn.mfa.sendEmailCode();
    if (error) {
      setFormError(
        getErrorMessage(error, "We couldn't send a verification code.")
      );
      return false;
    }

    setStep("verify");
    toast.success("Check your email for a verification code.");
    return true;
  };

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.password({
        emailAddress: values.email,
        password: values.password,
      });

      if (error) {
        setFormError(getErrorMessage(error, "Invalid email or password."));
        return;
      }

      if (signIn.status === "complete") {
        setEmail(values.email);
        await finishSignIn();
        return;
      }

      if (signIn.status === "needs_client_trust") {
        setEmail(values.email);
        await startVerification();
        return;
      }

      if (signIn.status === "needs_second_factor") {
        setEmail(values.email);
        await startVerification();
        return;
      }

      if (signIn.status === "needs_new_password") {
        setFormError(
          "Your password needs to be reset before you can sign in. Use the forgot password link below."
        );
        return;
      }

      setFormError("Sign-in could not be completed. Please try again.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        setFormError(getErrorMessage(error, "That code didn't work. Try again."));
        return;
      }

      if (signIn.status === "complete") {
        await finishSignIn();
        return;
      }

      setFormError("Verification could not be completed. Please try again.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.mfa.sendEmailCode();
      if (error) {
        setFormError(getErrorMessage(error, "We couldn't resend the code."));
        return;
      }

      toast.success("A new verification code is on its way.");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onStartOver = () => {
    signIn.reset();
    form.reset();
    setCode("");
    setEmail("");
    setFormError(null);
    setStep("credentials");
  };

  const handleGithub = async () => {
    setGithubLoading(true);
    setFormError(null);

    try {
      const { error } = await signIn.sso({
        strategy: "oauth_github",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/dashboard/apps",
      });

      if (error) {
        setFormError(getErrorMessage(error, "GitHub sign-in failed."));
        setGithubLoading(false);
      }
    } catch {
      setFormError("GitHub sign-in failed.");
      setGithubLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <Card size="sm">
        <CardHeader className="sr-only">
          <CardTitle>Verify your account</CardTitle>
          <CardDescription>Enter the code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="space-y-1 text-center">
            <h2 className="text-base font-medium">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a verification code to{" "}
              <span className="font-medium text-foreground">{email}</span>.
            </p>
          </div>

          <form onSubmit={onVerify} className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="login-code" className="text-sm font-medium">
                Verification code
              </label>
              <Input
                id="login-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                maxLength={6}
                autoFocus
              />
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
                "Verify and sign in"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <button
              type="button"
              onClick={onResend}
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm">
      <CardHeader className="sr-only">
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials.</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGithub}
            disabled={busy || githubLoading}
          >
            {githubLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <GitHubIcon className="size-4" />
            )}
            Continue with GitHub
          </Button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={busy}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
