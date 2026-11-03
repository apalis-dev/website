import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ForgotPasswordForm } from "@/components/dashboard/forgot-password-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard/apps");
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar className="size-12">
            <AvatarImage src="/images/logo.svg" alt="Apalis" />
            <AvatarFallback className="text-base font-medium">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-medium">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ll email you a code to get back into your account.
            </p>
          </div>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
