"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReverification } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
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
import { getErrorMessage } from "./utils";

const passwordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "The passwords don't match.",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

interface PasswordSectionProps {
  user: ClerkUser;
}

export function PasswordSection({ user }: PasswordSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePassword = useReverification(
    (params: {
      currentPassword?: string;
      newPassword: string;
      signOutOfOtherSessions?: boolean;
    }) => user.updatePassword(params)
  );

  const {
    formState: { errors, isSubmitting },
    clearErrors,
    reset,
    setError,
  } = form;

  const currentPassword = form.watch("currentPassword");
  const newPassword = form.watch("newPassword");
  const confirmPassword = form.watch("confirmPassword");

  const toggleForm = () => {
    if (showForm) {
      reset();
    }

    clearErrors();
    setShowForm((visible) => !visible);
  };

  const onSubmit = async (values: PasswordValues) => {
    const hadPassword = user.passwordEnabled;

    if (hadPassword && !values.currentPassword.trim()) {
      setError("currentPassword", {
        type: "manual",
        message: "Enter your current password.",
      });
      return;
    }

    clearErrors("root");

    try {
      await updatePassword({
        ...(hadPassword ? { currentPassword: values.currentPassword } : {}),
        newPassword: values.newPassword,
        signOutOfOtherSessions: true,
      });
      await user.reload();
      reset();
      setShowForm(false);
      toast.success(hadPassword ? "Password updated" : "Password added");
    } catch (error) {
      setError("root", {
        type: "server",
        message: getErrorMessage(error, "We couldn't update your password."),
      });
    }
  };

  return (
    <div className="py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Password</p>
          <p className="text-sm text-muted-foreground">
            {user.passwordEnabled
              ? "Your account has a password set."
              : "Add a password to sign in without GitHub."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleForm}
          disabled={isSubmitting}
        >
          {showForm
            ? "Cancel"
            : user.passwordEnabled
              ? "Change password"
              : "Set password"}
        </Button>
      </div>

      {showForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 max-w-sm space-y-3"
          >
            {user.passwordEnabled && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="current-password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Use at least 8 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errors.root?.message && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errors.root.message}
              </p>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={
                isSubmitting ||
                !newPassword ||
                !confirmPassword ||
                (user.passwordEnabled && !currentPassword.trim())
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : user.passwordEnabled ? (
                "Update password"
              ) : (
                "Set password"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
