import type { useUser } from "@clerk/nextjs";

export type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

export type ClerkEmailAddress = Awaited<
  ReturnType<ClerkUser["createEmailAddress"]>
>;

export type ClerkTotp = Awaited<ReturnType<ClerkUser["createTOTP"]>>;
