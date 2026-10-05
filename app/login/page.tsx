import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginForm } from "@/components/dashboard/login-form";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard/apps");
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Avatar className="size-12">
            <AvatarImage src="/images/logo.svg" alt="Apalis" />
            <AvatarFallback className="text-base font-medium">
              CN
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-medium">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Apalis account.
            </p>
          </div>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}