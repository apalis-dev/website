"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
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

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
});

type SignUpValues = z.infer<typeof signUpSchema>;

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

export function SignUpForm() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [step, setStep] = useState<"credentials" | "verify">("credentials");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const busy = loading || fetchStatus === "fetching";

  const finishSignUp = async () => {
    await signUp.finalize({
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

  const startEmailVerification = async () => {
    const { error } = await signUp.verifications.sendEmailCode();

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

  const onSubmit = async (values: SignUpValues) => {
    setLoading(true);
    setFormError(null);

    const [firstName, ...lastNameParts] = values.name.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ") || undefined;

    try {
      const { error } = await signUp.password({
        emailAddress: values.email,
        password: values.password,
        firstName,
        lastName,
      });

      if (error) {
        setFormError(getErrorMessage(error, "We couldn't create your account."));
        return;
      }

      if (signUp.status === "complete") {
        setEmail(values.email);
        await finishSignUp();
        return;
      }

      if (signUp.isTransferable) {
        setFormError(
          "An account with this email already exists. Try signing in instead."
        );
        return;
      }

      if (signUp.status === "missing_requirements") {
        if (signUp.unverifiedFields?.includes("email_address")) {
          setEmail(values.email);
          await startEmailVerification();
          return;
        }

        if (signUp.missingFields.length > 0) {
          setFormError(
            `We still need a few details: ${signUp.missingFields.join(", ")}.`
          );
          return;
        }
      }

      setFormError("Sign-up could not be completed. Please try again.");
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
      const { error } = await signUp.verifications.verifyEmailCode({ code });

      if (error) {
        setFormError(getErrorMessage(error, "That code didn't work. Try again."));
        return;
      }

      if (signUp.status === "complete") {
        await finishSignUp();
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
      const { error } = await signUp.verifications.sendEmailCode();
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
    signUp.reset();
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
      const { error } = await signUp.sso({
        strategy: "oauth_github",
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: "/dashboard/apps",
      });

      if (error) {
        setFormError(getErrorMessage(error, "GitHub sign-up failed."));
        setGithubLoading(false);
      }
    } catch {
      setFormError("GitHub sign-up failed.");
      setGithubLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <Card size="sm">
        <CardHeader className="sr-only">
          <CardTitle>Verify your email</CardTitle>
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
              <label htmlFor="sign-up-code" className="text-sm font-medium">
                Verification code
              </label>
              <Input
                id="sign-up-code"
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
                "Verify email"
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
        <CardTitle>Create account</CardTitle>
        <CardDescription>Enter your details.</CardDescription>
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      placeholder="Jane Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>

        {/* Required for sign-up flows if legacy bot protection is enabled. */}
        <div id="clerk-captcha" />
      </CardContent>
    </Card>
  );
}
