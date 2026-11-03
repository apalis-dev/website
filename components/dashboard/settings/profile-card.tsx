"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

import { EmailChangeForm } from "./email-change-form";
import type { ClerkUser } from "./types";
import { getErrorMessage } from "./utils";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileCardProps {
  user: ClerkUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.fullName ?? "" },
  });

  const {
    formState: { isSubmitting },
    reset,
    setError,
  } = form;

  useEffect(() => {
    reset({ name: user.fullName ?? "" });
  }, [reset, user.fullName]);

  const onSubmit = async ({ name }: ProfileValues) => {
    const [firstName, ...lastNameParts] = name.split(/\s+/);

    try {
      await user.update({
        firstName,
        lastName: lastNameParts.join(" "),
      });
      await user.reload();
      toast.success("Profile updated");
    } catch (error) {
      setError("name", {
        type: "server",
        message: getErrorMessage(error, "We couldn't save your profile."),
      });
    }
  };

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="profile-name-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="py-3 sm:max-w-sm">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <EmailChangeForm user={user} />

        <div className="flex items-center justify-between py-4">
          <span className="text-muted-foreground">Save changes</span>
          <Button
            type="submit"
            form="profile-name-form"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
