"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4">
      <HandleSSOCallback
        navigateToApp={({ session, decorateUrl }) => {
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
        }}
        navigateToSignIn={() => router.push("/login")}
        navigateToSignUp={() => router.push("/sign-up")}
      />
      <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
    </div>
  );
}
